function emoteSets (value) {
    return value;
}

function generic (value) {
    if (!isNaN(value)) {
        return parseInt(value, 10);
    }
    return value.replace(/\\s/g, ' ').replace(/\\n/g, '');
}

function tagValue (key, value) {
    if (!value) return null;

    switch (key) {
    case 'emote-sets': return emoteSets(value);
    default: return generic(value);
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

module.exports = { emoteSets, generic, tagValue, parseTags };
