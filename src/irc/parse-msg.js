module.exports = parseMsg;

const findPositionIndexes = require('./parse-msg/find-position-indexes.js');
const grabParameter = require('./parse-msg/grab-parameter.js');
const parseParams = require('./parse-msg/parse-params.js');
const parsePrefix = require('./parse-msg/parse-prefix.js');
const parseTags = require('./parse-msg/parse-tags.js');

function parseMsg (raw) {
    const indexes = findPositionIndexes(raw);
    if (!indexes) {
        return {
            raw,
            malformed: true,
            tags: {},
            prefix: {},
            params: [],
            channel: null,
            message: null,
            inferred: {}
        };
    }

    const msg = {
        raw,
        tags: parseTags(grabParameter(raw, indexes.tags)),
        prefix: parsePrefix(grabParameter(raw, indexes.prefix)),
        command: grabParameter(raw, indexes.command),
        params: parseParams(indexes.params > -1 ? raw.substring(indexes.params) : null),
        inferred: {}
    };

    msg.channel = inferChannel(raw, msg.params);
    msg.message = inferMessage(raw, msg.params);

    return msg;
}

function inferChannel (raw, params) {
    for (let i = 0; i < params.length; i++) {
        if (i == params.length - 1 && isMessage(raw, params[i])) continue;
        if (params[i][0] === '#') return params[i];
    }
    return null;
}

function inferMessage (raw, params) {
    const message = params[params.length - 1];
    return (message && isMessage(raw, message)) ? message : null;
}

function isMessage (raw, message) {
    return raw.trimEnd().endsWith(':' + message);
}
