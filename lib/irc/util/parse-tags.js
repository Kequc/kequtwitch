const parseEmotes = require('./parse-emotes.js');

function parseBadges (value) {
    if (typeof value !== 'string') return value;
    return value.split(',');
}

function parseEmoteSets (value) {
    return value;
}

function parseGeneric (value) {
    if (!isNaN(value)) {
        return parseInt(value, 10);
    }
    return value
        .replace(/\\s/g, ' ')
        .replace(/\\:/g, ':')
        .replace(/\\[n|r]/g, '');
}

function tagValue (key, value) {
    if (!value) return null;

    switch (key) {
    case 'badges': return parseBadges(value);
    case 'emotes': return parseEmotes(value);
    case 'emote-sets': return parseEmoteSets(value);
    default: return parseGeneric(value);
    }
}

function camelCase (str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '-') {
            result.push(str[i + 1].toUpperCase());
            i++;
        } else {
            result.push(str[i]);
        }
    }
    return result.join('');
}

function parseTags (raw) {
    const result = {};

    if (raw) {
        const parts = raw.substring(1).split(';');

        for (const part of parts) {
            if (!part) continue;
            const [key, value] = part.split('=');
            result[camelCase(key)] = tagValue(key, value);
        }
    }

    return result;
}

module.exports = { parseEmoteSets, parseGeneric, tagValue, parseTags };
