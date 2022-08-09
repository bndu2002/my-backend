const express = require('express');
const abc = require('../introduction/intro')
const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
    abc.printName()
    logger.welcome()

    res.send('My second ever api!')
});

router.get('/students', function (req, res){
    let students = ['Sabiha', 'Neha', 'Akash']
    res.send(students)
})

router.get('/student-details/:name', function(req, res){
    /*
    params is an attribute inside request that contains 
    dynamic values.
    This value comes from the request url in the form of an 
    object where key is the variable defined in code 
    and value is what is sent in the request
    */

    let requestParams = req.params

    // JSON strigify function helps to print an entire object
    // We can use any ways to print an object in Javascript, JSON stringify is one of them
    console.log("This is the request "+ JSON.stringify(requestParams))
    let studentName = requestParams.name
    console.log('Name of the student is ', studentName)
    
    res.send('dummy response')
})

router.get('/movies',function(req,res){
    let films = ["3 idiots","tare zameen pr","bajarangi 2"]
    res.send(films)
})


router.get('/movies/:num',function(req,res){
    let pictures = ["pk","ravan","timestory","double attack"]
    
    let indexNumber = req.params.num
    let pic = pictures[indexNumber]
    res.send(pic)
   


})

router.get('/films',function(req,res){
    let movName = [
        { id : 1 , name : "krish"},
        { id : 2 , name : "superman"},
        { id : 3 , name : "batman"},
        { id : 4 , name : "flying jatt"},

    ]
    res.send(movName)
})

 router.get('/films/:filmId',function(req,res){
    let movies = [
        { id : 1 , name : "krish"},
        { id : 2 , name : "superman"},
        { id : 3 , name : "batman"},
        { id : 4 , name : "flying jatt"},

    ]
    
    let contain = req.params.filmId

    for (let i = 0 ; i < movies.length ; i ++){
        const m =movies[i]
        if (m.id == contain){
            return res.send(m)
        }
    }
    res.send("movies does not exist")
   
   
    
    
   
   
 })

    
    


module.exports = router;