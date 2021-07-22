function handleMsg (chat, msg) {
    deepFreeze(msg);
    chat.emit('message', msg);
    chat.emit(msg.command, msg, ...msg.params);

    if (chat.extensions[msg.command]) {
        for (const extension of chat.extensions[msg.command]) {
            const extended = extension(msg, ...msg.params);
            if (typeof extended.command === 'string') {
                const clone = Object.assign({}, msg, { extended });
                deepFreeze(clone);
                chat.emit(extended.command, clone, ...getParams(msg));
            }
        }
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
