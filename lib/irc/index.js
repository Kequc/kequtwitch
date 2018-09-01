const EventEmitter = require('events');
const authenticate = require('./actions/authenticate');
const join = require('./actions/join');
const part = require('./actions/part');
const connect = require('./util/connect');
const STATUS = require('./util/connection-status');

function isValidChannel (channel) {
    if (!/^#[0-9a-z]+$/.test(channel)) {
        throw new Error('Channels should be in lower case and prepended with #');
    }
}

function isSafeToWrite (status, when) {
    const statuses = Object.values(STATUS);
    return statuses.indexOf(status) >= statuses.indexOf(when);
}

class Irc extends EventEmitter {
    constructor (twitch, opt = {}) {
        super();

        this.twitch = twitch;
        this._status = STATUS.DISCONNECTED;

        this.channels = opt.channels || [];
        this.port = opt.port || 6667;
        this.host = opt.host || 'irc.chat.twitch.tv';
        this.timeout = opt.timeout || 7000;

        this.channels.forEach(isValidChannel);
    }

    async connect () {
        if (this.status !== STATUS.DISCONNECTED) {
            throw new Error('Already connected');
        }

        await this.twitch.isValidated();
        await connect(this);
        await authenticate(this);
        await Promise.all(this.channels.map(channel => join(this, channel)));

        this.status = STATUS.READY;
    }

    send (message, when = STATUS.READY) {
        if (isSafeToWrite(this.status, when)) {
            this.write(message);
        } else {
            this.irc.once(when, () => { this.write(message); });
        }
    }

    write (message) {
        this.twitch.logger.log('<', message);
        this.client.write(`${message}\r\n`);
    }

    get status () {
        return this._status;
    }

    set status (status) {
        if (!Object.values(STATUS).includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        if (this._status === status) return;

        this._status = status;
        this.emit(status);
    }

    async join (channel) {
        if (this.channels.includes(channel)) {
            throw new Error(`Already joined ${channel}`);
        }

        isValidChannel(channel);
        this.channels.push(channel);
        await join(this, channel);
    }

    async part (channel) {
        if (!this.channels.includes(channel)) {
            throw new Error(`Not joined ${channel}`);
        }

        isValidChannel(channel);
        this.channels.splice(this.channels.indexOf(channel), 1);
        await part(this, channel);
    }
}

module.exports = Irc;
