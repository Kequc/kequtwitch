const net = require('net');
const appendData = require('../append-data.js');
const STATUS = require('../connection-status.js');

async function connect (irc) {
    irc.status = STATUS.CONNECTING;

    await new Promise((resolve, reject) => {
        irc.twitch.logger.info('Connecting...');
        irc.client = net.connect(irc.port, irc.host);
        irc.client.setEncoding('utf8');

        let timeout = setTimeout(onTimeout, irc.timeout);

        function onConnect () {
            clearTimeout(timeout);
            irc.twitch.logger.debug('!', 'CONNECTED');
            irc.status = STATUS.CONNECTED;
            resolve();
        }

        function onData (data) {
            appendData(irc, data);
        }

        function onError (err) {
            irc.twitch.logger.error(`Error occurred on irc connection: ${err.message}`);
            irc.emit('error', err);
        }

        function onEnd () {
            removeListeners();
            irc.twitch.logger.debug('!', 'DISCONNECTED');
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

        addListeners();
    });
}

module.exports = connect;
