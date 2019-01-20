function camelcase(key) {
    return key.replace(/_\w/g, m => m[1].toUpperCase());
}

function convertKeys (raw) {
    if (Array.isArray(raw)) return raw.map(convertKeys);
    if (!(raw instanceof Object)) return raw;

    const result = {};

    for (const key of Object.keys(raw)) {
        result[camelcase(key)] = convertKeys(raw[key]);
    }

    return result;
}

module.exports = convertKeys;
