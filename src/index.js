const express=require('express')
const mongoose=require('mongoose')
const route=require('./routes/route')

const app=express()

app.use(express.json())

mongoose.connect('mongodb+srv://vandana:7CJBNDDwPorDTTrX@cluster0.crrs6th.mongodb.net/group59Database',{
    useNewUrlParser:true
})
    .then(()=>{console.log('mongoDb is connected')})
    .catch((err)=>{console.log(err)})

app.use('/',route)

app.use(function(req,res){
    return res.status(400).send({status:false,msg:'Invalid Url'})
})

app.listen(3000,function(){
    console.log('Express app is connected '+ 3000)
})