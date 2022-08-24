const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const middle = require('./middlewares/commonMiddlewares')
// const getTime = require('mongoose-timestamp')
// const getIp = require('mongoose-ip-address')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://vandana:7CJBNDDwPorDTTrX@cluster0.crrs6th.mongodb.net/vandana-db", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use (
    function (req, res, next) {
        console.log ("inside GLOBAL MW");
        next();
  }
  );

  //this is my code 
  app.use(middle.firstMid)
    
 

app.use('/', route);




app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
