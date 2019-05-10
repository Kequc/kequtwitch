// WORK IN PROGRESS
// Not for actual use or anything until further notice

const EventEmitter = require('events');
const listen = require('./pubsub/actions/listen.js');
const unlisten = require('./pubsub/actions/unlisten.js');
const STATUS = require('./pubsub/connection-status.js');
const handleMessage = require('./pubsub/handle-message.js');
const { validateTopic, validateTopics, validateHeartrate } = require('./pubsub/util.js');
const connect = require('./shared/connect.js');
const disconnect = require('./shared/disconnect.js');

class Pubsub extends EventEmitter {
    constructor (twitch, opt = {}) {
        super();

        this.twitch = twitch;
        this._status = STATUS.DISCONNECTED;
        this._heart = undefined;
        this._isAlive = false;

        this.topics = opt.topics || [];
        this.address = opt.address || 'wss://pubsub-edge.twitch.tv';
        this.timeout = opt.timeout || 7000;
        this.heartrate = opt.heartrate || 60000;

        validateTopics(this.topics);
        validateHeartrate(this.heartrate);

        this.on('connected', () => { this.twitch.logger.info('Pubsub connected'); });
        this.on('disconnected', () => { this.twitch.logger.info('Pubsub disconnected'); });
        this.on('error', (err) => { this.twitch.logger.error(err); });
    }

    onData (data) {
        let json;

        try {
            json = JSON.parse(data);
        } catch (err) {
            this.twitch.logger.error(err);
        }

        handleMessage(this, json);
    }

    async connect () {
        if (this.status !== STATUS.DISCONNECTED) {
            await this.disconnect();
        }

        await this.twitch.isValidated();

        this.twitch.logger.info('Pubsub connecting...');

        await connect(this, STATUS);

        this._heart = setInterval(() => { this.ping(); }, this.heartrate);

        await Promise.all(this.topics.map(subscription => listen(this, subscription)));

        this.status = STATUS.READY;
    }

    ping () {
        if (this.status === STATUS.CONNECTED) {
            setTimeout(() => {
                if (!this._isAlive && this.status === STATUS.CONNECTED) {
                    // reconnect
                    this.connect();
                }
            }, 10000);
            this._isAlive = false;
            this.client.send('{"type":"PING"}');
        }
    }

    async disconnect () {
        await this.twitch.isValidated();

        this.twitch.logger.info('Pubsub disconnecting...');

        await disconnect(this, STATUS);
        clearInterval(this._heart);
    }

    get status () {
        return this._status;
    }

    set status (status) {
        if (this._status !== status) {
            this._status = status;
            this.emit(status);
        }
    }

    async listen (topic) {
        validateTopic(topic);

        if (this.topics.includes(topic)) {
            throw new Error(`Already listening ${topic}`);
        }

        this.topics.push(topic);

        if (this.status !== STATUS.DISCONNECTED) {
            await listen(this, topic);
        }
    }

    async unlisten (topic) {
        validateTopic(topic);

        if (!this.topics.includes(topic)) {
            throw new Error(`Not listening ${topic}`);
        }

        this.topics.splice(this.topics.indexOf(topic), 1);

        if (this.status !== STATUS.DISCONNECTED) {
            await unlisten(this, topic);
        }
    }
}

module.exports = Pubsub;
