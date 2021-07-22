const STATUS = require('./connection-status.js');

function isSafeToSend (status, when) {
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

function validateExtension (extension) {
    if (typeof extension !== 'function') {
        throw new Error('Extension must be a function');
    }
}

function validateExtensions (extensions) {
    if (!(extensions instanceof Object)) {
        throw new Error('Extensions must be an object');
    }

    for (const key of Object.keys(extensions)) {
        if (!Array.isArray(extensions[key])) {
            throw new Error(`Extension key "${key}" must resolve an array`);
        }

        extensions[key].forEach(validateExtension);
    }
}

module.exports = { isSafeToSend, validateChannel, validateChannels, validateExtension, validateExtensions };
