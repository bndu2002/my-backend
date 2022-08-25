


const mid0 = function(req,res,next){
  req['isfreeappuser'] = 
}

const mid1= function ( req, res, next){
  //const head = req.headers.isfreeappuser
  //console.log(head)
  if(req.headers.isfreeappuser){
    console.log("header is available")
    next()
  }else{
  res.send({status : false ,msg: "missing a mandatory header"})
  }
  
}
//const mid2 = 

module.exports.mid1 = mid1