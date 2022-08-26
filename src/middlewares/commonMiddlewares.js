


// const mid0 = function(req,res,next){
//   req['isfreeappuser'] = 
// }

const mid1= function ( req, res, next){
  let appType = req.headers.isfreeappuser
  let isAppFree 
  if(!appType){
    return res.send({status : false ,msg: "missing a mandatory header"})
    }
  
    if(appType === 'false'){
      isAppFree = false
    }else{
      isAppFree = true
    }
  req.isUserAppFree = isAppFree
  console.log(isAppFree)
  next()

}

// const mid1= function ( req, res, next){
//   const header = req.headers.isfreeappuser
//   if(!header){
//     res.send({status : false ,msg: "missing a mandatory header"})
//   }else{
//     req.
//   }

// }


module.exports.mid1 = mid1