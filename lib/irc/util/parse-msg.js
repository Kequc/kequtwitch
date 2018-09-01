const { parseTags } = require('./parse-tags');

function grabParameter (raw, start) {
    if (start === -1) return null;
    const end = raw.substring(start).search(/\s/);

    if (end > -1) {
        return raw.substring(start, start + end);
    } else {
        return raw.substring(start);
    }
}

function parsePrefix (raw) {
    if (!raw) {
        return { full: null, host: null, user: null };
    }

    const full = raw.substring(1);
    let host = full;
    let user = null;

    // ronni!ronni@ronni.tmi.twitch.tv
    if (/\.tmi\.twitch\.tv$/.test(full)) {
        host = full.substring(full.indexOf('@') + 1);
        user = host.split('.')[0];
    }

    return { full, host, user };
}

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
            result.push(param);
            i += param.length;
        }
    }

    return result;
}

function findPositionIndexes (raw) {
    let tags = raw.search(/(?:^|\s)@\S+/);
    let prefix = raw.search(/(?:^|\s):\S+/);
    let command = raw.search(/(?:^|\s)(?:[A-Z]{3,}|[0-9]{3})(?:\s|$)/);
    let params = -1;

    // Check if malformed
    if (command === -1) {
        return null;
    }

    // Remove leading whitespace
    if (tags > -1 && raw[tags] === ' ') tags++;
    if (prefix > -1 && raw[prefix] === ' ') prefix++;
    if (raw[command] === ' ') command++;

    // Params appear after command
    params = raw.substring(command).search(/\s\S/);
    if (params > -1) params += command + 1; // And remove leading whitespace

    // Tags come before command
    if (tags > command) tags = -1;
    // Params and prefix are not the same
    if (params === prefix) prefix = -1;

    return { tags, prefix, command, params };
}

function parseMsg (raw) {
    const indexes = findPositionIndexes(raw);
    if (!indexes) {
        return { raw, malformed: true };
    }

    const remaining = indexes.params > -1 ? raw.substring(indexes.params) : null;
    const msg = {
        raw,
        tags: parseTags(grabParameter(raw, indexes.tags)),
        prefix: parsePrefix(grabParameter(raw, indexes.prefix)),
        command: grabParameter(raw, indexes.command),
        params: parseParams(remaining)
    };

    return msg;
}

module.exports = { grabParameter, parsePrefix, parseTags, parseParams, findPositionIndexes, parseMsg };
