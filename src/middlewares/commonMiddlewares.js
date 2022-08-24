const moment = require('moment')
const currentIp = require('mongoose-ip-address')
const timestampsPlugin = require('mongoose-timestamp')
let currentTime = require('mongoose-timestamp')


const mid1= function ( req, res, next) {
    req.falana= "hi there. i am adding something new to the req object"
    console.log("Hi I am a middleware named Mid1")
    next()
}

const mid2= function ( req, res, next) {
    console.log("Hi I am a middleware named Mid2")
    next()
}

const mid3= function ( req, res, next) {
    console.log("Hi I am a middleware named Mid3")
    next()
}

const mid4= function ( req, res, next) {
    console.log("Hi I am a middleware named Mid4")
    next()
}

const firstMid = function(req,res,next){
    let date = moment()
    console.log(date.format('YY-MM-DD,HH:mm:ss'))
    //req.connection.remoteAddress , contains the ip address of the client
    let address = req.connection.remoteAddress
    console.log(address)
    console.log("/test-me")
    next()
}

    


module.exports.mid1= mid1
module.exports.mid2= mid2
module.exports.mid3= mid3
module.exports.mid4= mid4
module.exports.firstMid= firstMid

