function handleMsg (chat, msg) {
    if (chat.inferences[msg.command]) {
        Object.assign(msg.inferred, chat.inferences[msg.command](msg, ...msg.params));
    }

    deepFreeze(msg);

    const params = getParams(msg);

    chat.emit('message', msg);
    chat.emit(msg.command, msg, ...params);

    if (typeof msg.inferred.command === 'string') {
        chat.emit(msg.inferred.command, msg, ...params);
    }

    serverStuff(chat, msg);
}

function getParams (msg) {
    if (Array.isArray(msg.inferred.params)) {
        return msg.inferred.params;
    }
    return msg.params;
}

function deepFreeze (data) {
    if (!(data instanceof Object)) return;
    Object.values(data).forEach(deepFreeze);
    Object.freeze(data);
}

function serverStuff (chat, msg) {
    switch (msg.command) {
    case 'PING':
        chat.sendUnsafe(`PONG :${msg.params[0]}`);
        break;
    case 'RECONNECT':
        chat.connect();
        break;
    }
}

module.exports = handleMsg;
