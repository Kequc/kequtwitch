const EventEmitter = require('events');
const authenticate = require('./actions/authenticate');
const connect = require('./actions/connect');
const join = require('./actions/join');
const part = require('./actions/part');
const STATUS = require('./util/connection-status');
const { isValidChannel, isValidInference, isSafeToWrite } = require('./util/helpers');

class Irc extends EventEmitter {
    constructor (twitch, opt = {}) {
        super();

        this.twitch = twitch;
        this._status = STATUS.DISCONNECTED;

        this.channels = opt.channels || [];
        this.inferences = opt.inferences || {};
        this.port = opt.port || 6667;
        this.host = opt.host || 'irc.chat.twitch.tv';
        this.timeout = opt.timeout || 7000;

        if (!Array.isArray(this.channels)) {
            throw new Error('Channels must be an array');
        }
        this.channels.forEach(isValidChannel);

        if (typeof this.inferences === 'object') {
            throw new Error('Inferences must be an object');
        }
        Object.values(this.inferences).forEach(isValidInference);
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

    infer (command, callback) {
        if (this.inferences[command]) {
            throw new Error(`Inference already exists: ${command}`);
        }

        isValidInference(callback);
        this.inferences[command] = callback;
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
