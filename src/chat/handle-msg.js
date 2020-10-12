function handleMsg (chat, msg) {
    if (chat.extensions[msg.command]) {
        Object.assign(msg.extended, chat.extensions[msg.command](msg, ...msg.params));
    }

    deepFreeze(msg);

    chat.emit('message', msg);
    chat.emit(msg.command, msg, ...msg.params);

    if (typeof msg.extended.command === 'string') {
        const params = getParams(msg);
        chat.emit(msg.extended.command, msg, ...params);
    }

    serverStuff(chat, msg);
}

function deepFreeze (data) {
    if (!(data instanceof Object)) return;
    Object.values(data).forEach(deepFreeze);
    Object.freeze(data);
}

function getParams (msg) {
    if (Array.isArray(msg.extended.params)) {
        return msg.extended.params;
    }
    return msg.params;
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
