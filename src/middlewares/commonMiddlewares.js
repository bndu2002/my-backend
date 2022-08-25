


const mid1= function ( req, res, next){
 // let header = req.header.isFreeAppUser 
 let log = false 
  if(log == true ){
    next()
  }else{res.send({status : false ,msg :"request is missing a mandatory header" })}
 
}

module.exports.mid1 = mid1