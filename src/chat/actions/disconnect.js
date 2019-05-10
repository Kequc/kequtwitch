const STATUS = require('../connection-status.js');

async function disconnect (chat) {
    chat.status = STATUS.DISCONNECTED;

    await new Promise((resolve, reject) => {
        if (!chat.client) resolve();

        chat.twitch.logger.info('Disconnecting...');
        chat.client.close();

        function onClose () {
            removeListeners();
            resolve();
        }

        function removeListeners () {
            chat.client.off('close', onClose);
        }

        function addListeners () {
            chat.client.on('close', onClose);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, chat.timeout);
        addListeners();
    });
}

module.exports = disconnect;
