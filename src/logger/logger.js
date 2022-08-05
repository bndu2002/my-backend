//- welcome() -> prints ‘Welcome to my application. I am <name> and a part of FunctionUp Plutonium cohort.’ on console
const myName = "vandana shrama"

const print = function(){
    console.log(`welcome to my application . i am ${myName} and a part of functionup plutonium cohort.`)
}

module.exports.name = myName
module.exports.welcome = print

