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
            inferred: {}
        };
    }

    const remaining = indexes.params > -1 ? raw.substring(indexes.params) : null;
    const msg = {
        raw,
        tags: parseTags(grabParameter(raw, indexes.tags)),
        prefix: parsePrefix(grabParameter(raw, indexes.prefix)),
        command: grabParameter(raw, indexes.command),
        params: parseParams(remaining),
        inferred: {}
    };

    return msg;
}

module.exports = parseMsg;
