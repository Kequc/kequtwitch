// TODO: Fixme this isn't done

async function unlisten (pubsub, topic) {
    await new Promise((resolve, reject) => {
        function onUnlistening (msg) {
            if (msg.prefix.user === pubsub.twitch.login && msg.params[0] === topic) {
                removeListeners();
                resolve();
            }
        }

        function addListeners () {
            pubsub.on('JOIN', onUnlistening);
        }

        function removeListeners () {
            pubsub.off('JOIN', onUnlistening);
        }

        function onTimeout () {
            removeListeners();
            reject(new Error('Timeout'));
        }

        setTimeout(onTimeout, pubsub.timeout);
        addListeners();
    });
}

module.exports = unlisten;
