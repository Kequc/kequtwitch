const EventEmitter = require('events');
const reqParser = require('./req-parser.js');
const Webhook = require('./webhook.js');

class Webhooks extends EventEmitter {
    constructor (api, opt) {
        super();

        this.api = api;
        this.subscriptions = [];

        this.path = opt.path || '/webhooks/hub';
        this.callbackUrl = opt.callbackUrl;
        this.secret = opt.secret;

        if (!this.callbackUrl) {
            throw new Error('Webhook callbackUrl must be defined');
        }
        if (!this.secret) {
            throw new Error('Webhook secret must be defined');
        }
    }

    build (path, opt = {}) {
        const webhook = new Webhook(this, path, opt);
        this.subscriptions.push(webhook);

        return webhook;
    }

    async unsubscribeAll () {
        await Promise.all(this.subscriptions.map(webhook => webhook.unsubscribe()));
    }

    async request (mode, topic, leaseSeconds) {
        const data = {
            'hub.mode': mode,
            'hub.topic': this.api.helixUrl + topic,
            'hub.callback': this.callbackUrl,
            'hub.lease_seconds': leaseSeconds
        };
        const result = await this.api.request(this.path, { data, method: 'POST' });

        return result;
    }

    parseRequest (method, body, headers, query) {
        return reqParser(this, method, body, headers, query);
    }

    parseGet (query) {
        this.parseRequest('GET', {}, {}, query);
    }

    parsePost (body, headers, query) {
        this.parseRequest('POST', body, headers, query);
    }
}

module.exports = Webhooks;
