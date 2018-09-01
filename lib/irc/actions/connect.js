const net = require('net');
const STATUS = require('../util/connection-status');
const handleMsg = require('../util/handle-msg');
const { parseMsg } = require('../util/parse-msg');

function splitIntoLines (data) {
    return data.split(/[\r\n]+/).map(part => part.trim()).filter(part => !!part);
}

async function connect (irc) {
    irc.status = STATUS.CONNECTING;

    await new Promise((resolve, reject) => {
        irc.twitch.logger.info('Connecting...');
        irc.client = net.connect(irc.port, irc.host);
        irc.client.setEncoding('utf8');

        function onConnect () {
            irc.twitch.logger.log('!', 'CONNECTED');
            irc.status = STATUS.CONNECTED;
            resolve();
        }

        function onData (data) {
            splitIntoLines(data).forEach((line) => {
                irc.twitch.logger.log('>', line);
                handleMsg(irc, parseMsg(line));
            });
        }

        function onError (err) {
            irc.twitch.logger.error(`Error occurred on irc connection: ${err.message}`);
            irc.emit('error', err);
        }

        function onEnd () {
            removeListeners();
            irc.twitch.logger.log('!', 'DISCONNECTED');
            irc.status = STATUS.DISCONNECTED;
        }

        function removeListeners () {
            irc.client.off('connect', onConnect);
            irc.client.off('data', onData);
            irc.client.off('error', onError);
            irc.client.off('end', onEnd);
        }

        function addListeners () {
            irc.client.on('connect', onConnect);
            irc.client.on('data', onData);
            irc.client.on('error', onError);
            irc.client.on('end', onEnd);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, irc.timeout);
        addListeners();
    });
}

module.exports = connect;
