const querystring = require('querystring');

function chooseUrl (api, opt) {
    if (opt.url) return opt.url;
    if (opt.kraken) return api.krakenUrl;
    return api.helixUrl;
}

function buildHeaders (api, opt) {
    const headers = {
        Authorization: `${opt.kraken ? 'OAuth' : 'Bearer'} ${api.twitch.token}`,
        'Content-Type': 'application/json'
    };
    if (!opt.skipValidation) {
        headers['Client-Id'] = api.twitch.clientId;
    }
    return Object.assign(headers, opt.headers);
}

function parseValue (api, value) {
    switch (value) {
    case '$clientId': return api.twitch.clientId;
    case '$login': return api.twitch.login;
    case '$userId': return api.twitch.userId;
    default: return value;
    }
}

function snakecase (key) {
    return key.replace( /([A-Z])/g, '_$1').toLowerCase();
}

function buildData (api, data) {
    if (typeof data !== 'object') {
        return parseValue(api, data);
    }

    const result = {};

    for (const key of Object.keys(data)) {
        result[snakecase(key)] = buildData(api, data[key]);
    }

    return result;
}

function buildReq (api, path, opt) {
    const req = {
        url: chooseUrl(api, opt) + path,
        method: opt.method || 'GET',
        data: buildData(api, opt.data),
        headers: buildHeaders(api, opt)
    };

    if (req.data && !['POST', 'PUT'].includes(req.method)) {
        req.url += '?' + querystring.stringify(req.data);
        req.data = undefined;
    }
    if (req.data) {
        req.data = JSON.stringify(req.data);
    }

    return req;
}

module.exports = buildReq;
