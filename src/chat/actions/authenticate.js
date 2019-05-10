const STATUS = require('../connection-status.js');

const AUTH_FAILED_MESSAGES = [
    'Login unsuccessful',
    'Login authentication failed',
    'Error logging in',
    'Improperly formatted auth'
];

async function authenticate (chat) {
    await new Promise((resolve, reject) => {
        chat.sendUnsafe('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        chat.sendUnsafe(`PASS oauth:${chat.twitch.token}`);
        chat.sendUnsafe(`NICK ${chat.twitch.login}`);

        function onAuthenticated () {
            removeListeners();
            chat.status = STATUS.AUTHENTICATED;
            resolve();
        }

        function onNotice (msg) {
            if (AUTH_FAILED_MESSAGES.includes(msg.message)) {
                removeListeners();
                reject(new Error(msg.message));
                return;
            }
        }

        function addListeners () {
            chat.on('372', onAuthenticated);
            chat.on('NOTICE', onNotice);
        }

        function removeListeners () {
            chat.off('372', onAuthenticated);
            chat.off('NOTICE', onNotice);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, chat.timeout);
        addListeners();
    });
}

module.exports = authenticate;
