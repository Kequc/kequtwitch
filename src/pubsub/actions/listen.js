// TODO: Fixme this isn't done

async function listen (pubsub, topic) {
    await new Promise((resolve, reject) => {
        function onListening (msg) {
            if (msg.prefix.user === pubsub.twitch.login && msg.params[0] === topic) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            pubsub.on('JOIN', onListening);
        }

        function removeListeners () {
            pubsub.off('JOIN', onListening);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, pubsub.timeout);
        addListeners();
    });
}

module.exports = listen;
