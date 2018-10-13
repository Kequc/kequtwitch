let isSilent = false;

module.exports.setIsSilent = (_isSilent) => {
    isSilent = _isSilent;
};

module.exports.debug = (...params) => {
    if (isSilent) return;
    console.debug(...params);
};

module.exports.log = (...params) => {
    if (isSilent) return;
    console.log(...params);
};

module.exports.info = (...params) => {
    if (isSilent) return;
    const first = params.shift();
    console.info(`[ ${first} ]`, ...params);
};

module.exports.warn = (...params) => {
    if (isSilent) return;
    console.warn('Warning:', ...params);
};

module.exports.error = (...params) => {
    if (isSilent) return;
    console.error('Error:', ...params);
};
