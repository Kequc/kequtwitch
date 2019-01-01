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
}

module.exports = { basic, empty };
