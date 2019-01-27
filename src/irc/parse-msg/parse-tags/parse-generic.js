module.exports = parseGeneric;

function parseGeneric (value) {
    if (!isNaN(value)) {
        return parseInt(value, 10);
    }
    return value
        .replace(/\\s/g, ' ')
        .replace(/\\:/g, ':')
        .replace(/\\[n|r]/g, '');
}
