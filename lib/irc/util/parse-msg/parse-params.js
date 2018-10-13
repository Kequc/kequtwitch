const grabParameter = require('./grab-parameter.js');

function parseParams (raw) {
    const result = [];

    if (raw) {
        let i = 0;

        while (i < raw.length) {
            if (raw[i] === ' ') {
                i++;
                continue;
            }
            if (raw[i] === ':') {
                // Grab everything past this point
                result.push(raw.substring(i + 1).trimEnd());
                break;
            }

            const param = grabParameter(raw, i);
            i += param.length;
            result.push(param);
        }
    }

    return result;
}

module.exports = parseParams;
