const STATUS = require('../util/connection-status');

async function part (irc, channel) {
    await new Promise((resolve, reject) => {
        irc.send(`PART ${channel}`, STATUS.AUTHENTICATED);

        function onChannelPart (msg) {
            if (msg.prefix.user === irc.twitch.login && msg.params[0] === channel) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            irc.on('twitch-part', onChannelPart);
        }

        function removeListeners () {
            irc.off('twitch-part', onChannelPart);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, irc.timeout);
        addListeners();
    });
}

module.exports = part;
