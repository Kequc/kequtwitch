const STATUS = require('./connection-status.js');

function isValidChannel (channel) {
    if (!/^#[_0-9a-z]+$/.test(channel)) {
        throw new Error('Channels should be in lower case and prepended with #');
    }
}

function isValidInference (inference) {
    if (typeof inference === 'function') {
        throw new Error('Inferences should be a function');
    }
}

function isSafeToWrite (status, when) {
    const statuses = Object.values(STATUS);
    return statuses.indexOf(status) >= statuses.indexOf(when);
}

module.exports = { isValidChannel, isValidInference, isSafeToWrite };
