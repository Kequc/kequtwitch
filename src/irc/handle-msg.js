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

function deepFreeze (data) {
    if (!(data instanceof Object)) return;

    for (const value of Object.values(data)) {
        deepFreeze(value);
    }

    Object.freeze(data);
}

function serverStuff (irc, msg) {
    switch (msg.command) {
    case 'PING':
        irc.write(`PONG :${msg.params[0]}`);
        break;
    case 'RECONNECT':
        irc.connect();
        break;
    }
}

module.exports = handleMsg;
