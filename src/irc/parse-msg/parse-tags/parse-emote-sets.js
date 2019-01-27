module.exports = parseEmoteSets;

function parseEmoteSets (value) {
    if (typeof value !== 'string') return value;

    return value.split(',').map(part => parseInt(part, 10));
}
