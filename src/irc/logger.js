module.exports = { basic, empty, validate };

const basic = {
    log (...params) {
        console.log(...params);
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
    log () {},
    info () {},
    error () {}
}

function validate (logger) {
    if (typeof logger !== 'object') {
        throw new Error('Logger must be an object');
    }

    for (const key of ['log', 'info', 'error']) {
        if (typeof logger[key] !== 'function') {
            throw new Error(`Logger missing required method: ${key}`);
        }
    }
}
