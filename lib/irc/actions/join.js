const STATUS = require('../util/connection-status');

async function join (irc, channel) {
    await new Promise((resolve, reject) => {
        irc.send(`JOIN ${channel}`, STATUS.AUTHENTICATED);

        function onChannelJoin (msg) {
            if (msg.prefix.user === irc.twitch.login && msg.params[0] === channel) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            irc.on('twitch-join', onChannelJoin);
        }

        function removeListeners () {
            irc.off('twitch-join', onChannelJoin);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, irc.timeout);
        addListeners();
    });
}

module.exports = join;
