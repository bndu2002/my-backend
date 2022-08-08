const express = require('express');
const abc = require('../introduction/intro');
const van =require('../logger/logger.js');
const sha = require('../util/helper.js');
const bnd = require('../validator/formatter.js')
const lodashCall = require('lodash')
const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
    console.log(van.welcome())
    console.log(`${sha.printDate()} ${sha.printMonth()} ${sha.getBatchInfo()}`)
    console.log(bnd.ran.trim())
    console.log(bnd.ran.toUpperCase())
    console.log(bnd.ran.toLowerCase())
    const arr = ["jan","feb","mar","apr","may","june","july","aug","sep","oct","nov","dec"]
    const call = lodashCall.chunk(arr,3) 
    console.log(call)
    const num = [1,3,5,7,9,11,13,15,17,19]
    const numbers = lodashCall.tail(num)
    console.log(numbers)
    const one =[1,2,2]
    const two = [3,4,5]
    const three =[3,7,8]
    const four = [9,10,11]
    const five =[10,6,0]
    
    const merge = lodashCall.union(one , two ,three ,four , five)
    console.log(merge)
    const create = [["save","soil"],["cauvery","calling"],["green","hands"]]
    const createPairs = lodashCall.fromPairs(create)
    console.log(createPairs)

        abc.printName() 

    res.send('My second ever api!')
});


router.get('/test-you', function(req, res){
    res.send('This is the second routes implementation')
})

router.get('/give-me-students-data',function(req, res){

})
module.exports = router;
// adding this comment for no reason