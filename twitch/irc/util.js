const STATUS = require('./connection-status.js');

function isSafeToWrite (status, when) {
    const statuses = Object.values(STATUS);
    return statuses.indexOf(status) >= statuses.indexOf(when);
}

function isValidChannel (channel) {
    if (!/^#[_0-9a-z]+$/.test(channel)) {
        throw new Error('Channels should be in lower case and prepended with #');
    }
}

function validateChannels (channels) {
    if (!Array.isArray(channels)) {
        throw new Error('Channels must be an array');
    }

    channels.forEach(isValidChannel);
}

function isValidInference (inference) {
    if (typeof inference !== 'function') {
        throw new Error('Inferences should be a function');
    }
}

function validateInferences (inferences) {
    if (typeof inferences !== 'object') {
        throw new Error('Inferences must be an object');
    }

    Object.values(inferences).forEach(isValidInference);
}

function validateLogger (logger) {
    if (typeof logger !== 'object') {
        throw new Error('Logger must be an object');
    }

    for (const key of ['log', 'info', 'error']) {
        if (typeof logger[key] !== 'function') {
            throw new Error(`Logger missing required method: ${key}`);
        }
    }
}

module.exports = { isSafeToWrite, isValidChannel, validateChannels, isValidInference, validateInferences, validateLogger };
