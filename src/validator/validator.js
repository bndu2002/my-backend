const isPresent = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false//.trim() :remove spaces, should not mistake empty space as value
    return true
}

function isValidUrl(string) {
    const pattern = (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm);
    return pattern.test(string);
}


module.exports = { isPresent , isValidUrl}