const querystring = require('querystring');

class Webhook {
    constructor (webhooks, path, data = {}) {
        this.webhooks = webhooks;
        this.path = path;
        this.data = data;
        this.isActive = false;
    }

    get topic () {
        return this.path + '?' + querystring.stringify(this.data);
    }

    async subscribe (leaseSeconds = 864000) {
        if (this.isActive) {
            await this.unsubscribe();
        }

        const result = await this.webhooks.request('subscribe', this.topic, leaseSeconds);
        this.isActive = true;

        return result;
    }

    async unsubscribe () {
        if (!this.isActive) return;

        const result = await this.webhooks.request('unsubscribe', this.topic);
        this.isActive = false;

        return result;
    }
}

module.exports = Webhook;
