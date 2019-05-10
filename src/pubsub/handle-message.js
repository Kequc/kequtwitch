const STATUS = require('./connection-status.js');

function handleMessage (pubsub, data) {
    if (!(data instanceof Object)) return;

    if (data.type === 'RECONNECT') {
        setTimeout(() => {
            if (pubsub.status === STATUS.CONNECTED) {
                pubsub.connect();
            }
        }, 3000);
    } else if (data.type === 'PONG') {
        pubsub._isAlive = true;
    }
}

module.exports = handleMessage;
