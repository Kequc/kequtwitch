const Irc = require('./twitch/irc.js');
const Api = require('./twitch/api.js');

class Twitch {
    constructor (token, opt = {}) {
        this.token = token.replace('oauth:', '').trim();

        this.clientId = undefined;
        this.login = undefined;
        this.userId = undefined;
        this.isValidating = false;
        this.validatedAt = undefined;

        this.waiting = [];

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
        this.api.logger.info('Validating...');

        const result = await this.api.request(this.validatePath, {
            url: this.validateUrl,
            skipValidation: true,
            kraken: true
        });

        this.clientId = result.clientId;
        this.login = result.login;
        this.userId = result.userId;
        this.isValidating = false;
        this.validatedAt = Date.now();

        while (this.waiting.length){
            this.waiting.shift().call();
        }
    }
}

module.exports = Twitch;
