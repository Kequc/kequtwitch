const tinyreq = require('tinyreq');
const buildReq = require('./api/build-req.js');
const convertKeys = require('./api/convert-keys.js');

class Api {
    constructor (twitch, opt = {}) {
        this.twitch = twitch;

        this.helixUrl = opt.helixUrl || 'https://api.twitch.tv/helix';
        this.krakenUrl = opt.krakenUrl || 'https://api.twitch.tv/kraken';
    }

    async request (path, opt = {}, retries = 0) {
        if (!opt.skipValidation) {
            await this.twitch.isValidated();
        }

        const req = buildReq(this, path, opt);

        try {
            const res = await tinyreq(req);
            const result = JSON.parse(res || '{}');

            if (result.status && result.message) {
                const err = new Error(result.message);
                err.status = result.status;
                throw err;
            }

            return convertKeys(result);
        } catch (err) {
            if (retries < (opt.maxRetries || 2)) {
                return await this.request(path, opt, retries + 1);
            } else {
                this.twitch.logger.error(`Unable to resolve request ${req.method}: ${req.url}`);
                throw err;
            }
        }
    }
}

module.exports = Api;
