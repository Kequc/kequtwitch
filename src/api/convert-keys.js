module.exports = convertKeys;

function convertKeys (raw) {
    if (!(raw instanceof Object)) return raw;
    if (Array.isArray(raw)) return raw.map(convertKeys);

    const result = {};

    for (const key of Object.keys(raw)) {
        result[camelcase(key)] = convertKeys(raw[key]);
    }

    return result;
}

function camelcase (key) {
    return key.replace(/_\w/g, m => m[1].toUpperCase());
}
