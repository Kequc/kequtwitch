const parseBadges = require('./parse-tags/parse-badges.js');
const parseEmoteSets = require('./parse-tags/parse-emote-sets.js');
const parseEmotes = require('./parse-tags/parse-emotes.js');
const parseGeneric = require('./parse-tags/parse-generic.js');

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

function tagValue (key, value) {
    if (!value) return null;

    switch (key) {
    case 'badges': return parseBadges(value);
    case 'emotes': return parseEmotes(value);
    case 'emote-sets': return parseEmoteSets(value);
    default: return parseGeneric(value);
    }
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

module.exports = parseTags;
