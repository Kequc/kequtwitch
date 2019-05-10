const STATUS = require('../connection-status.js');

async function part (chat, channel) {
    await new Promise((resolve, reject) => {
        chat.send(`PART ${channel}`, STATUS.AUTHENTICATED);

        function onChannelPart (msg) {
            if (msg.prefix.user === chat.twitch.login && msg.channel === channel) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            chat.on('PART', onChannelPart);
        }

        function removeListeners () {
            chat.off('PART', onChannelPart);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, chat.timeout);
        addListeners();
    });
}

module.exports = part;
