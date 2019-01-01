function serverStuff (irc, msg) {
    switch (msg.command) {
    case 'PING':
        irc.write(`PONG :${msg.params[0]}`);
        break;
    case 'RECONNECT':
        // TODO
        break;
    }
}

function deepFreeze (data) {
    if (typeof data !== 'object') return;

    for (const value of Object.values(data)) {
        deepFreeze(value);
    }

    Object.freeze(data);
}

function handleMsg (irc, msg) {
    const command = msg.command || 'UNKNOWN';

    Object.freeze(msg);
    Object.freeze(msg.tags);
    Object.freeze(msg.prefix);
    Object.freeze(msg.params);

    if (irc.inferences[command]) {
        Object.assign(msg.inferred, irc.inferences[command](msg));
    }

    deepFreeze(msg.inferred);

    irc.emit('message', msg);
    irc.emit(command, msg);

    if (typeof msg.inferred.command === 'string') {
        irc.emit(msg.inferred.command, msg);
    }

    serverStuff(irc, msg);
}

module.exports = handleMsg;
