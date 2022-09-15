const isValidMail = (/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/);

const isValidName = (/^[a-zA-Z ]*$/)

const isValidRequestBody = (value) => {
    return Object.keys(value).length > 0
}

const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.length === 0) return false
    return true
}

const isValidLink = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

const isValidNumber = (/^\+91\d{10}$/)

module.exports = {isValidMail , isValidName , isValidRequestBody , isValid , isValidLink ,isValidNumber}