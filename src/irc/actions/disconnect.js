module.exports = disconnect;

const STATUS = require('../connection-status.js');

async function disconnect (irc) {
    irc.status = STATUS.DISCONNECTED;

    await new Promise((resolve, reject) => {
        if (!irc.client) resolve();

        irc.logger.info('Disconnecting...');
        irc.client.end();

        function onClose () {
            if (irc.client) irc.client.destroy();
            removeListeners();
            resolve();
        }

        function removeListeners () {
            irc.client.off('close', onClose);
        }

        function addListeners () {
            irc.client.on('close', onClose);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, irc.timeout);
        addListeners();
    });
}
