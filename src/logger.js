const basic = {
    debug (...params) {
        console.debug(...params);
    },
    info (...params) {
        const first = params.shift();
        console.info(`[ ${first} ]`, ...params);
    },
    error (...params) {
        console.error('Error:', ...params);
    }
};

const empty = {
    debug () {},
    info () {},
    error () {}
};

function validate (logger) {
    if (typeof logger !== 'object') {
        throw new Error('Logger must be an object');
    }

    for (const key of ['debug', 'info', 'error']) {
        if (typeof logger[key] !== 'function') {
            throw new Error(`Logger missing required method: ${key}`);
        }
    }
}

module.exports = { basic, empty, validate };
