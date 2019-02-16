const EventEmitter = require('events');
const authenticate = require('./irc/actions/authenticate.js');
const connect = require('./irc/actions/connect.js');
const disconnect = require('./irc/actions/disconnect.js');
const join = require('./irc/actions/join.js');
const part = require('./irc/actions/part.js');
const STATUS = require('./irc/connection-status.js');
const { isSafeToWrite, validateChannel, validateChannels, validateInference, validateInferences } = require('./irc/util.js');

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

        validateChannels(this.channels);
        validateInferences(this.inferences);

        this.data = '';
    }

    async connect () {
        if (this.status !== STATUS.DISCONNECTED) {
            await this.disconnect();
        }

        await this.twitch.isValidated();
        await connect(this);
        await authenticate(this);
        await Promise.all(this.channels.map(channel => join(this, channel)));

        this.status = STATUS.READY;
    }

    async disconnect () {
        await this.twitch.isValidated();
        await disconnect(this);
    }

    inference (command, callback) {
        if (this.inferences[command]) {
            throw new Error(`Inference already exists: ${command}`);
        }

        validateInference(callback);
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
        this.twitch.logger.debug('<', message);
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
        validateChannel(channel);

        if (this.channels.includes(channel)) {
            throw new Error(`Already joined ${channel}`);
        }

        this.channels.push(channel);
        await join(this, channel);
    }

    async part (channel) {
        validateChannel(channel);

        if (!this.channels.includes(channel)) {
            throw new Error(`Not joined ${channel}`);
        }

        this.channels.splice(this.channels.indexOf(channel), 1);
        await part(this, channel);
    }
}

module.exports = Irc;
