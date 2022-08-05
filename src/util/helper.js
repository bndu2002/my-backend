
const date = function () {
    const today = new Date()
  return  today.getUTCDate()
}

const month = function(){
    const month = new Date ()
    return month.getUTCMonth()+1
}



const info = function(){
    console.log("my batch name is Plutonium today is day 5 of week 3 , today we learned about node-js modules..")
}

module.exports.printDate = date
module.exports.printMonth = month
module.exports.getBatchInfo = info 
