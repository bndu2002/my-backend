const urlModel = require("../models/urlModel");
const shortId = require('shortid');
const validURL = require('valid-url');
const { isPresent } = require('../validator/validator');
const redis = require("redis");

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

        if (!validURL.isUri(longUrl)) return res.status(400).send({ status: false, message: "long URL is invalid" });
        
        let options = {
            method : "get",
            url : longUrl
        };

        let result = await axios(options)
        
        let data = result.data
        if(!data)return res.send("not working long url")
        
        if (!isPresent(urlCode) || !isPresent(shortUrl)) {
            req.body.urlCode = shortId.generate().toLowerCase();
            req.body.shortUrl = baseUrl + "/" + req.body.urlCode;
        }

        let findURL = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })


        if (!findURL) {

            let url = await urlModel.create(req.body)

            let createURL = {
                longUrl: url.longUrl,
                shortUrl: url.shortUrl,
                urlCode: url.urlCode
            }
            await  SET_ASYNC(`${longUrl}`, JSON.stringify(url));
            return res.status(201).send({ status: true, message: "successfully shortend", data: createURL })

        }

       

        //409 : conflict with db
        return res.status(409).send({ status: true, message: "long URL already exists", data: findURL })

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

        if (cachedURL) {
            return res.redirect(cachedURL)
        } else {
            return res.status(404).send({ status: false, message: "urlCode does not exist" })
        }
   
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { shortURL, redirectURL }


