async function disconnect (parent, STATUS) {
    const name = parent.constructor.name;

    parent.status = STATUS.DISCONNECTED;

    await new Promise((resolve, reject) => {
        if (!parent.client) resolve();

        parent.twitch.logger.debug(`${name} disconnecting...`);
        parent.client.close();

        function onClose () {
            removeListeners();
            parent.twitch.logger.debug(`${name} disconnected`);
            resolve();
        }

        function removeListeners () {
            parent.client.off('close', onClose);
        }

        function addListeners () {
            parent.client.on('close', onClose);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, parent.timeout);
        addListeners();
    });
}

module.exports = disconnect;
