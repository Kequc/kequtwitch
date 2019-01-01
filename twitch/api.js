const tinyreq = require('tinyreq');
const buildReq = require('./api/build-req.js');
const logger = require('./api/logger.js');

function validateLogger (logger) {
    if (typeof logger !== 'object') {
        throw new Error('Logger must be an object');
    }

    for (const key of ['debug', 'error']) {
        if (typeof logger[key] !== 'function') {
            throw new Error(`Logger missing required method: ${key}`);
        }
    }
}

class Api {
    constructor (twitch, opt) {
        this.twitch = twitch;

        this.helixUrl = opt.helixUrl || 'https://api.twitch.tv/helix';
        this.krakenUrl = opt.krakenUrl || 'https://api.twitch.tv/kraken';

        if (opt.logger === false) {
            this.logger = logger.empty;
        } else {
            this.logger = opt.logger || logger.basic;
        }

        validateLogger(this.logger);
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

            return result;
        } catch (err) {
            if (retries < (opt.maxRetries || 2)) {
                return await this.request(path, opt, retries + 1);
            } else {
                this.logger.error(`Unable to resolve request ${req.method}: ${req.url}`);
                throw err;
            }
        }
    }
}

module.exports = Api;
