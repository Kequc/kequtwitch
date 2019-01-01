const EventEmitter = require('events');
const authenticate = require('./irc/actions/authenticate.js');
const connect = require('./irc/actions/connect.js');
const join = require('./irc/actions/join.js');
const part = require('./irc/actions/part.js');
const STATUS = require('./irc/connection-status.js');
const logger = require('./irc/logger.js');
const Reader = require('./irc/reader.js');
const { isValidChannel, isValidInference, isSafeToWrite } = require('./irc/util.js');

function validateChannels (channels) {
    if (!Array.isArray(channels)) {
        throw new Error('Channels must be an array');
    }

    channels.forEach(isValidChannel);
}

function validateInferences (inferences) {
    if (typeof inferences !== 'object') {
        throw new Error('Inferences must be an object');
    }

    Object.values(inferences).forEach(isValidInference);
}

function validateLogger (logger) {
    if (typeof logger !== 'object') {
        throw new Error('Logger must be an object');
    }

    for (const key of ['log', 'info', 'error']) {
        if (typeof logger[key] !== 'function') {
            throw new Error(`Logger missing required method: ${key}`);
        }
    }
}

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

        if (opt.logger === false) {
            this.logger = logger.empty;
        } else {
            this.logger = opt.logger || logger.basic;
        }

        validateChannels(this.channels);
        validateInferences(this.inferences);
        validateLogger(this.logger);

        this.reader = new Reader(this);
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

    inference (command, callback) {
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
        this.logger.log('<', message);
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
        isValidChannel(channel);

        if (this.channels.includes(channel)) {
            throw new Error(`Already joined ${channel}`);
        }

        this.channels.push(channel);
        await join(this, channel);
    }

    async part (channel) {
        isValidChannel(channel);

        if (!this.channels.includes(channel)) {
            throw new Error(`Not joined ${channel}`);
        }

        this.channels.splice(this.channels.indexOf(channel), 1);
        await part(this, channel);
    }
}

module.exports = Irc;
