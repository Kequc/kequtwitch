const Irc = require('./irc/index.js');
const Api = require('./api/index.js');
const logger = require('./logger.js');

class Twitch {
    constructor (token, opt = {}) {
        this.token = token.replace('oauth:', '').trim();

        this.clientId = undefined;
        this.login = undefined;
        this.userId = undefined;
        this.isValidating = false;
        this.validatedAt = undefined;

        this.waiting = [];
        this.logger = opt.logger || logger;

        this.validateUrl = opt.validateUrl || 'https://id.twitch.tv/oauth2';
        this.validatePath = opt.validatePath || '/validate';

        this.irc = new Irc(this, opt.irc || {});
        this.api = new Api(this, opt.api || {});
    }

    async isValidated () {
        if (this.isValidating) {
            await new Promise((resolve) => { this.waiting.push(resolve); });
            return;
        }
        if (this.validatedAt && this.validatedAt > (Date.now() - 3600000)) {
            return;
        }

        await this.validate();
    }

    async validate () {
        this.isValidating = true;
        this.logger.info('Validating...');

        const result = await this.api.request(this.validatePath, {
            url: this.validateUrl,
            skipValidation: true,
            kraken: true
        });

        this.clientId = result.client_id;
        this.login = result.login;
        this.userId = result.user_id;
        this.isValidating = false;
        this.validatedAt = Date.now();

        while (this.waiting.length){
            this.waiting.shift().call();
        }
    }
}

module.exports = Twitch;
