module.exports = { isSafeToWrite, validateChannel, validateChannels, validateInference, validateInferences };

const STATUS = require('./connection-status.js');

function isSafeToWrite (status, when) {
    const statuses = Object.values(STATUS);
    return statuses.indexOf(status) >= statuses.indexOf(when);
}

function validateChannel (channel) {
    if (!/^#[_0-9a-z]+$/.test(channel)) {
        throw new Error('Channels should be in lower case and prepended with #');
    }
}

function validateChannels (channels) {
    if (!Array.isArray(channels)) {
        throw new Error('Channels must be an array');
    }

    channels.forEach(validateChannel);
}

function validateInference (inference) {
    if (typeof inference !== 'function') {
        throw new Error('Inference should be a function');
    }
}

function validateInferences (inferences) {
    if (!(inferences instanceof Object)) {
        throw new Error('Inferences must be an object');
    }

    Object.values(inferences).forEach(validateInference);
}
