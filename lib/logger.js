module.exports.debug = (...params) => {
    console.debug(...params);
};

module.exports.log = (...params) => {
    console.log(...params);
};

module.exports.info = (...params) => {
    const first = params.shift();
    console.info(`[ ${first} ]`, ...params);
};

module.exports.warn = (...params) => {
    console.warn('Warning:', ...params);
};

module.exports.error = (...params) => {
    console.error('Error:', ...params);
};
