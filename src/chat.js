const EventEmitter = require('events');
const authenticate = require('./chat/actions/authenticate.js');
const join = require('./chat/actions/join.js');
const part = require('./chat/actions/part.js');
const appendData = require('./chat/append-data.js');
const STATUS = require('./chat/connection-status.js');
const { isSafeToSend, validateChannel, validateChannels, validateExtension, validateExtensions } = require('./chat/util.js');
const connect = require('./shared/connect.js');
const disconnect = require('./shared/disconnect.js');

class Chat extends EventEmitter {
    constructor (twitch, opt = {}) {
        super();

        this.twitch = twitch;
        this._status = STATUS.DISCONNECTED;
        this._data = '';

        this.channels = opt.channels || [];
        this.extensions = opt.extensions || {};
        this.address = opt.address || 'wss://irc-ws.chat.twitch.tv:443';
        this.timeout = opt.timeout || 7000;

        validateChannels(this.channels);
        validateExtensions(this.extensions);

        this.on('connected', () => { this.twitch.logger.info('Chat connected'); });
        this.on('disconnected', () => { this.twitch.logger.info('Chat disconnected'); });
        this.on('error', (err) => { this.twitch.logger.error(err); });
    }

    onData (data) {
        appendData(this, data);
    }

    async connect () {
        if (this.status !== STATUS.DISCONNECTED) {
            await this.disconnect();
        }

        await this.twitch.isValidated();

        this.twitch.logger.info('Chat connecting...');

        await connect(this, STATUS);
        await authenticate(this);
        await Promise.all(this.channels.map(channel => join(this, channel)));

        this.status = STATUS.READY;
    }

    async disconnect () {
        await this.twitch.isValidated();

        this.twitch.logger.info('Chat disconnecting...');

        await disconnect(this, STATUS);

        this.data = '';
    }

    extend (command, callback) {
        if (this.extensions[command]) {
            throw new Error(`Extension already exists: ${command}`);
        }

        validateExtension(callback);
        this.extensions[command] = callback;
    }

    say (channel, message) {
        this.send(`PRIVMSG ${channel} :${message}`);
    }

    send (message, when = STATUS.READY) {
        if (isSafeToSend(this.status, when)) {
            this.sendUnsafe(message);
        } else {
            this.chat.once(when, () => { this.sendUnsafe(message); });
        }
    }

    sendUnsafe (message) {
        this.twitch.logger.debug('<', message);
        this.client.send(`${message}\r\n`);
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

    async join (channel) {
        validateChannel(channel);

        if (this.channels.includes(channel)) {
            throw new Error(`Already joined ${channel}`);
        }

        this.channels.push(channel);

        if (this.status !== STATUS.DISCONNECTED) {
            await join(this, channel);
        }
    }

    async part (channel) {
        validateChannel(channel);

        if (!this.channels.includes(channel)) {
            throw new Error(`Not joined ${channel}`);
        }

        this.channels.splice(this.channels.indexOf(channel), 1);

        if (this.status !== STATUS.DISCONNECTED) {
            await part(this, channel);
        }
    }
}

module.exports = Chat;
