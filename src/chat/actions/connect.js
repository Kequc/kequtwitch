const WebSocket = require('ws');
const appendData = require('../append-data.js');
const STATUS = require('../connection-status.js');

async function connect (chat) {
    chat.status = STATUS.CONNECTING;

    await new Promise((resolve, reject) => {
        chat.twitch.logger.info('Connecting...');
        chat.client = new WebSocket(chat.address);

        let timeout = setTimeout(onTimeout, chat.timeout);

        function onOpen () {
            clearTimeout(timeout);
            chat.twitch.logger.debug('!', 'CONNECTED');
            chat.status = STATUS.CONNECTED;
            resolve();
        }

        function onMessage (data) {
            appendData(chat, data);
        }

        function onError (err) {
            chat.twitch.logger.error(`Error occurred on chat connection: ${err.message}`);
            chat.emit('error', err);
        }

        function onClose () {
            removeListeners();
            chat.twitch.logger.debug('!', 'DISCONNECTED');
            chat.status = STATUS.DISCONNECTED;
        }

        function removeListeners () {
            chat.client.off('open', onOpen);
            chat.client.off('message', onMessage);
            chat.client.off('error', onError);
            chat.client.off('close', onClose);
        }

        function addListeners () {
            chat.client.on('open', onOpen);
            chat.client.on('message', onMessage);
            chat.client.on('error', onError);
            chat.client.on('close', onClose);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        addListeners();
    });
}

module.exports = connect;
