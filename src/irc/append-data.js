const handleMsg = require('./handle-msg.js');
const parseMsg = require('./parse-msg.js');

function appendData (irc, data) {
    irc.data += data;

    if (data.endsWith('\r\n')) {
        // twitch is done talking
        parseData(irc);
    }
}

function parseData (irc) {
    const lines = splitIntoLines(irc.data);
    irc.data = '';

    for (const line of lines) {
        irc.twitch.logger.debug('>', line);
        handleMsg(irc, parseMsg(line));
    }
}

function splitIntoLines (data) {
    return data.split('\r\n').map(part => part.trim()).filter(part => !!part);
}

module.exports = appendData;
