const urlModel = require("../models/urlModel");
const shortId = require('shortid');
const { isPresent, isValidUrl } = require('../validator/validator');
const redis = require("redis");
const { promisify } = require("util");


//Connect to redis : in memory data store or database we are using for cache
const redisClient = redis.createClient(
    18427,
    "redis-18427.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("hAQL16ypUmdfadtiFMu4XPl2EVFtGUie", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

//promisification of callback func + binding it with our redis account/connection
// if not bind : "Cannot read property 'internal_send_command' of undefined" 
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);//return true if not promisified





const shortURL = async function (req, res) {
    try {
        let { longUrl, urlCode, shortUrl } = req.body
        let baseUrl = "http://localhost:3000"

        if (!isPresent(longUrl)) return res.status(400).send({ status: false, message: "long URL is mandatory" });

        if (!isValidUrl(longUrl)) return res.status(400).send({ status: false, message: "long URL is invalid" });

        if (!isPresent(urlCode) || !isPresent(shortUrl)) {
            req.body.urlCode = shortId.generate().toLowerCase();
            req.body.shortUrl = baseUrl + "/" + req.body.urlCode;
        }

        let cachedURL = await GET_ASYNC(`${longUrl}`)

        console.log(cachedURL)

        if (cachedURL) {
            return res.status(400).send({ status: false, message: "longURL already shortened (from cache)", data: (JSON.parse(cachedURL)) })
        } else {
            let findURL = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })
            if (!findURL) {

                let url = await urlModel.create(req.body)

                let createURL = {
                    urlCode: url.urlCode,
                    longUrl: url.longUrl,
                    shortUrl: url.shortUrl
                }

                return res.status(201).send({ status: true, message: "successfully shortend", data: createURL })
            }

            SET_ASYNC(`${longUrl}`, JSON.stringify(findURL.shortUrl))
            return res.status(400).send({ status: false, message: "longurl already exists (from db)", data: findURL })
        }

        //caching data : storing data that is frequently asked + requires low latency + wanna perform high level computation , in a temporary database (here redis)
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

        console.log(".....", cachedURL)
        if (cachedURL) {
            console.log("hiii")
            return res.redirect(cachedURL)
        } else {
            let findUrlCode = await urlModel.findOne({ urlCode: urlCode });
            if (!findUrlCode) return res.status(404).send({ status: false, message: "Url Code Does Not Exist" });
            await SET_ASYNC(`${urlCode}`, JSON.stringify(findUrlCode))
            return res.redirect(findUrlCode.longUrl)//saptrishi mentor
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { shortURL, redirectURL }


