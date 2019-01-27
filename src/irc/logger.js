module.exports = { basic, empty };

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
