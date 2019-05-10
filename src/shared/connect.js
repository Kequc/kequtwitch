const WebSocket = require('ws');

async function connect (parent, STATUS) {
    parent.status = STATUS.CONNECTING;

    await new Promise((resolve, reject) => {
        parent.client = new WebSocket(parent.address);

        let timeout = setTimeout(onTimeout, parent.timeout);

        function onOpen () {
            clearTimeout(timeout);
            parent.status = STATUS.CONNECTED;
            resolve();
        }

        function onMessage (data) {
            parent.onData(data);
        }

        function onError (err) {
            parent.emit('error', err);
        }

        function onClose () {
            removeListeners();
            parent.status = STATUS.DISCONNECTED;
        }

        function removeListeners () {
            parent.client.off('open', onOpen);
            parent.client.off('message', onMessage);
            parent.client.off('error', onError);
            parent.client.off('close', onClose);
        }

        function addListeners () {
            parent.client.on('open', onOpen);
            parent.client.on('message', onMessage);
            parent.client.on('error', onError);
            parent.client.on('close', onClose);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        addListeners();
    });
}

module.exports = connect;
