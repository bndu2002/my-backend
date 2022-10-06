const urlModel = require("../models/urlModel");
const shortId = require('shortid');
const validURL = require('valid-url');
const { isPresent } = require('../validator/validator');
const redis = require("redis");
const axios = require('axios')

const { promisify } = require("util");
const { json } = require("express");

//Connect to redis
const redisClient = redis.createClient(
    13190,
    "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);





const shortURL = async function (req, res) {
    try {
        let { longUrl, urlCode, shortUrl } = req.body
        let baseUrl = "http://localhost:3000"

        if (!isPresent(longUrl)) return res.status(400).send({ status: false, message: "long URL is mandatory" });

        function isValidUrl(string) {
            const pattern = (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm);
            return pattern.test(string);
        }

        if (!isValidUrl(longUrl)) return res.status(400).send({ status: false, message: "long URL is invalid" });





        if (!isPresent(urlCode) || !isPresent(shortUrl)) {
            req.body.urlCode = shortId.generate().toLowerCase();
            req.body.shortUrl = baseUrl + "/" + req.body.urlCode;
        }

        let findURL = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })
        let cachedURL = await GET_ASYNC(`${longUrl}`)

        console.log(cachedURL)

        if (cachedURL !== null ) {
          return res.status(409).send({ status: false, message: "long URL already exists", data: JSON.parse(cachedURL)})
        } else {
            await SET_ASYNC(`${longUrl}`, JSON.stringify(findURL));

        }

        if (!findURL) {

            let url = await urlModel.create(req.body)

            let createURL = {
                urlCode: url.urlCode,
                longUrl: url.longUrl,
                shortUrl: url.shortUrl

            }

            return res.status(201).send({ status: true, message: "successfully shortend", data: createURL })

        }



        //409 : conflict with db
        //return res.status(409).send({ status: true, message: "long URL already exists 2 ", data: findURL })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}



const redirectURL = async function (req, res) {
    try {

        let urlCode = req.params.urlCode

        //how to print this message ?
        if (!urlCode) return res.status(400).send({ status: false, message: "provide urlCode" });

        let cachedURL = await GET_ASYNC(`${urlCode}`)

        console.log(cachedURL)
        if (cachedURL) {
            return res.redirect(cachedURL)
        } else {
            let findUrlCode = await urlModel.findOne({ urlCode: urlCode });
            if (!findUrlCode) return res.status(404).send({ status: false, message: "Url Code Does Not Exist" });
            await SET_ASYNC(`${urlCode}`, JSON.stringify(findUrlCode))
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { shortURL, redirectURL }


