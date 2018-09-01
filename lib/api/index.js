const tinyreq = require('tinyreq');
const querystring = require('querystring');
const { buildReq } = require('./util/build-req');

class Api {
    constructor (twitch, opt) {
        this.twitch = twitch;

        this.helixUrl = opt.helixUrl || 'https://api.twitch.tv/helix';
        this.krakenUrl = opt.KrakenUrl || 'https://api.twitch.tv/kraken';
        this.webhooksPath = opt.webhooksPath || '/webhooks/hub';
    }

    async request (path, opt = {}, retries = 0) {
        if (!opt.skipValidation) {
            await this.twitch.isValidated();
        }

        const req = buildReq(this, path, opt);

        try {
            const res = await tinyreq(req);
            const result = JSON.parse(res);

            if (result.status && result.message) {
                const err = new Error(result.message);
                err.status = result.status;
                throw err;
            }

            return result;
        } catch (err) {
            if (retries < (opt.maxRetries || 2)) {
                return await this.request(path, opt, retries + 1);
            } else {
                this.twitch.logger.error(`Unable to resolve request ${req.method}: ${req.url}`);
                throw err;
            }
        }
    }

    async webhook (path, callbackUrl, opt = {}) {
        const hub = {
            mode: opt.mode || 'subscribe',
            topic: this.helixUrl + path + '?' + querystring.stringify(opt.data),
            callback: callbackUrl,
            lease_seconds: opt.leaseSeconds
        };

        const result = await this.request(this.webhooksPath, { data: { hub }, method: 'POST' });
        return result;
    }
}

module.exports = Api;
