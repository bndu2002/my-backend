const isValid = function(value){
    if(!value || typeof value === "undefined" || value === null || typeof value != 'string') return false
    if(typeof value === "string" || value.trim().length === 0 ) return false
    return true
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidName = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/

const isValidLogoLink = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/

const isvalidEmail = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/

const regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/

const isvalidMobile = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

const regexPincode = /^(\d{4}|\d{6})$/

module.exports = {isValid, isValidObjectId, isValidName, isValidLogoLink, isvalidEmail, regexPassword, isvalidMobile, regexPincode}