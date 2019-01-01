const STATUS = require('../connection-status.js');

const AUTH_FAILED_MESSAGES = [
    'Login unsuccessful',
    'Login authentication failed',
    'Error logging in',
    'Improperly formatted auth'
];

async function authenticate (irc) {
    await new Promise((resolve, reject) => {
        irc.write('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        irc.write(`PASS oauth:${irc.twitch.token}`);
        irc.write(`NICK ${irc.twitch.login}`);

        function onAuthenticated () {
            removeListeners();
            irc.status = STATUS.AUTHENTICATED;
            resolve();
        }

        function onNotice (msg) {
            for (const param of msg.params) {
                if (AUTH_FAILED_MESSAGES.includes(param)) {
                    removeListeners();
                    reject(new Error(msg.params[1]));
                    return;
                }
            }
        }

        function addListeners () {
            irc.on('372', onAuthenticated);
            irc.on('NOTICE', onNotice);
        }

        function removeListeners () {
            irc.off('372', onAuthenticated);
            irc.off('NOTICE', onNotice);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, irc.timeout);
        addListeners();
    });
}

module.exports = authenticate;
