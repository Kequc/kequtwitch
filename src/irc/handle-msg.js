function handleMsg (irc, msg) {
    if (irc.inferences[msg.command]) {
        Object.assign(msg.inferred, irc.inferences[msg.command](msg));
    }

    deepFreeze(msg);

    const params = msg.inferred.params || msg.params;

    irc.emit('message', msg);
    irc.emit(msg.command, msg, ...params);
    if (typeof msg.inferred.command === 'string') {
        irc.emit(msg.inferred.command, msg, ...params);
    }

    serverStuff(irc, msg);
}

function deepFreeze (data) {
    if (!(data instanceof Object)) return;
    Object.values(data).forEach(deepFreeze);
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
