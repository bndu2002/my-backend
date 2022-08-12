const express = require("express");
const myHelper = require("../util/helper");
const underscore = require("underscore");
const ldoash = require("lodash");
const { add } = require("lodash");

const router = express.Router();

router.get("/test-me", function (req, res) {
  myHelper.printDate();
  myHelper.getCurrentMonth();
  myHelper.getCohortData();
  let firstElement = underscore.first(["Sabiha", "Akash", "Pritesh"]);
  console.log(
    "The first element received from underscope function is " + firstElement
  );
  res.send("My first ever api!");
});

router.get("/movies/:indexNumber", function (req, res) {
  const movies = [
    "Rang de basanti",
    "The shining",
    "Lord of the rings",
    "Batman begins",
  ];
  console.log(req.params.indexNumber);
  let movieIndex = req.params.indexNumber;
  //check index value. less than 0 or greater than array (length - 1) are not valid
  if (movieIndex < 0 || movieIndex >= movies.length) {
    //if the index is invalid send an error message
    return res.send("The index value is not correct, Please check the it");
  }

  //if the index was valid send the movie at that index in response
  let requiredMovie = movies[movieIndex];
  res.send(requiredMovie);
});

router.get("/shoes", function (req, res) {
  let queryParams = req.query;
  let brand = queryParams.brand;
  res.send("dummy response");
});

// uses query params
router.get("/candidates", function (req, res) {
  console.log(
    "Query paramters for this request are " + JSON.stringify(req.query)
  );
  let gender = req.query.gender;
  let state = req.query.state;
  let district = req.query.district;
  console.log("State is " + state);
  console.log("Gender is " + gender);
  console.log("District is " + district);
  let candidates = ["Akash", "Suman"];
  res.send(candidates);
});

// use path param
router.get("/candidates/:canidatesName", function (req, res) {
  console.log("The request objects is " + JSON.stringify(req.params));
  console.log("Candidates name is " + req.params.canidatesName);
  res.send("Done");
});

router.get("/films", function (req, res) {
  const films = [
    {
      id: 1,
      name: "The Shining",
    },
    {
      id: 2,
      name: "Incendies",
    },
    {
      id: 3,
      name: "Rang de Basanti",
    },
    {
      id: 4,
      name: "Finding Nemo",
    },
  ];
  //send players the films
  res.send(films);
});

router.get("/films/:filmId", function (req, res) {
  const films = [
    {
      id: 1,
      name: "The Shining",
    },
    {
      id: 2,
      name: "Incendies",
    },
    {
      id: 3,
      name: "Rang De Basanti",
    },
    {
      id: 4,
      name: "Finding Nemo",
    },
  ];

  let filmId = req.params.filmId;

  //iterate all the films
  //search for a film whose id matches with the id recevied in request
  for (let i = 0; i < films.length; i++) {
    let film = films[i];
    if (film.id == filmId) {
      //if there is a match return the response from here
      return res.send(film);
    }
  }

  //if there is no match give an error response
  res.send("The film id doesn't match any movie");
});

router.get("/sol1", function (req, res) {
  let array = [1, 2, 3, 4, 6, 7, 8];

  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum = sum + array[i];
  }
  let n = array.length + 1;
  let findSum = (n * (n + 1)) / 2;
  let findNum = JSON.stringify(findSum - sum);

  res.send(findNum);
  //  1 + 2 + 3 + 4+ 6 = 16
  //  1+2+3+4+5+6 = 21
  //  21-16 = 5
});

router.get("/sol2", function (req, res) {
  let array = [33, 34, 35, 37, 38];
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let n = array.length + 1;
  findSum = [(n * (33 + 38)) / 2];
  let final = JSON.stringify(findSum - sum);
  res.send(final);
});

router.post("/first-post", function (req, res) {
  console.log(req.body.user);
  res.send("look");
});

let players = [
  {
    name: "manish",
    dob: "1/1/1995",
    gender: "male",
    city: "jalandhar",
    sports: ["swimming"],
    
      bookingNumber: 1,
       sportId: 123 ,
       centerId: 321,
      type: "private",
      slot: 16286598000000,
      bookedOn: 31/08/2021,
      bookedFor: 01/09/2021 ,
     },
  
  {
    name: "rama",
    dob: "26/3/1994",
    gender: "male",
    city: "kangra",
    sports: ["cricket"],
    bookingNumber: 2,
    sportId: 456 ,
    centerId: 654,
   type: "private",
   slot: 17286598000000,
   bookedOn: 31/08/2021,
   bookedFor: 01/09/2021 ,
  },
  {
    name: "neha",
    dob: "1/1/1997",
    gender: "female",
    city: "bihar",
    sports: ["football"],
    bookingNumber: 3,
    sportId: 789 ,
    centerId: 987,
   type: "private",
   slot: 18286598000000,
   bookedOn: 31/08/2021,
   bookedFor: 01/09/2021 ,
  },
];

router.post("/players", function (req, res) {
  let playersInBody = req.body;

 // let isNameRepeated = false

  // for(let i = 0 ; i < players.length ; i ++){
  //     if(players[i].name === playersInBody.name){
  //         isNameRepeated = true;
  //         break;
  //     }
  // }
  // if(isNameRepeated){
  //     res.send("already exists")
  // }else{
  //      players.push(playersInBody)
  //     res.send(players)
  //       }


  // TRIED TO DO IT WITHOUT FLAG ------> worked partially
  // for (let i = 0; i < players.length; i++) {
  //   if (players[i].name == playersInBody.name) {
  //     res.send("already exists");

  //   } 
  // }
  //  {
  //   players.push(playersInBody);
  //   res.send(players);
  //  }


  //TRIED TO DO IT WITHOUT FLAG ------> worked partially
   for (let i = 0; i < players.length; i++) {
    if (players[i].name == playersInBody.name) {
      res.send("already exists");

    } else{
        players.push(playersInBody);
        res.send(players);
       }
  }
   

  // console.log(hanyu)
  res.send(players)
});

router.get("/getName/:name/:age/:likes",function(req , res){
    let allNames = req.params
    //console.log(allNames)
    res.send("hello")
    console.log(allNames)

})

router.get("/getName",function(req , res){
  let allNames = req.query.degree
  //console.log(allNames)
  res.send("hello")
  console.log(allNames)

})

// did this using both query params and params  : pass
router.get("/get-query/:marks",function(req,res){
      let checkMarks = req.params.marks
        let result =  (checkMarks>=40 ? "pass" : "fail")
      //console.log(result)
      res.send(result)
})

router.post("/players/:playerName/bookings/:bookingId",function(req,res){
  let playerName = req.params.playerName
  let bookingId = req.params.bookingId
 
  
  for(let i=0;i<players.length;i++){
     if(players[i].name == playerName){
       
        res.send("good")
        break;
      
     }
     
  }
  res.send("bad")

  

 
console.log(playerName)


})


let people = [
  { name : "sk" , age : 10 , votingStatus : false},
  { name : "vs" , age : 30, votingStatus : false},
  { name : "rs" , age : 18 , votingStatus : false},
  { name : "ss" , age : 20 , votingStatus : false},
  { name : "yh" , age : 28 , votingStatus : false},
]
router.get("/vote",function(req,res){
  //when using req.query.age works else does not why???
  let votingAge = req.query.age
  //filtered eligble people and changed the voting status to true with another filter filtered those whose voting status is true.
    
 let filter = people.filter((elem)=>{return elem.age > votingAge ? elem.votingStatus = true   : "no match"}).filter((y)=> y.votingStatus == true)
  //let foreach = people.forEach((elem)=>{ elem.age > votingAge ? elem.votingStatus = true : "no match"}).filter((y)=> { return y === true})


  //  let fuu = people.filter(function(elem){ return elem.age > votingAge 
//  })
//  //console.log(foreach)
//   console.log(fuu)
   res.send({ dats : filter , status : true})

})
  
  



module.exports = router;
// adding this comment for no reason


