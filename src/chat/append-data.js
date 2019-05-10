const handleMsg = require('./handle-msg.js');
const parseMsg = require('./parse-msg.js');

function appendData (chat, data) {
    chat.data += data;

    if (data.endsWith('\r\n')) {
        // twitch is done talking
        parseData(chat);
    }
}

function parseData (chat) {
    const lines = splitIntoLines(chat.data);
    chat.data = '';

    for (const line of lines) {
        chat.twitch.logger.debug('>', line);
        handleMsg(chat, parseMsg(line));
    }
}

function splitIntoLines (data) {
    return data.split('\r\n').map(part => part.trim()).filter(part => !!part);
}

module.exports = appendData;
