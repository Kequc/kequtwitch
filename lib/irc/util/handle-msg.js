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

function handleMsg (irc, msg) {
    const command = (msg.command || 'unknown').toLowerCase();

    irc.emit('message', msg);
    irc.emit(`twitch-${command}`, msg);

    serverStuff(irc, msg);
}

module.exports = handleMsg;
