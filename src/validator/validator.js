const isValidMail = (/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/);

const isValidName = (/^[a-zA-Z, ]*$/)

//const isValidCollege = (/(?<=,)[\w\s]*(College|University|Institute)[^,\d]*(?=,|\d)/)

const isValidRequestBody = (value) => {
    return Object.keys(value).length > 0
}

const isPresent = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false//.trim() :remove spaces, should not mistake empty space as value
    return true
}

const isValidLink = (/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif))$/i)

const isValidNumber = (/^\+91\d{10}$/)

module.exports = {isValidMail , isValidName , isValidRequestBody , isPresent , isValidLink ,isValidNumber}