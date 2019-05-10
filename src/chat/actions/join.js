const STATUS = require('../connection-status.js');

async function join (chat, channel) {
    await new Promise((resolve, reject) => {
        chat.send(`JOIN ${channel}`, STATUS.AUTHENTICATED);

        function onChannelJoin (msg) {
            if (msg.prefix.user === chat.twitch.login && msg.params[0] === channel) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            chat.on('JOIN', onChannelJoin);
        }

        function removeListeners () {
            chat.off('JOIN', onChannelJoin);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, chat.timeout);
        addListeners();
    });
}

module.exports = join;
