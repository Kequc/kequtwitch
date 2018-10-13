const handleMsg = require('./handle-msg.js');
const parseMsg = require('./parse-msg.js');

function splitIntoLines (data) {
    return data.split('\r\n').map(part => part.trim()).filter(part => !!part);
}

class Reader {
    constructor (irc) {
        this.irc = irc;
        this.data = '';
    }

    push (data) {
        this.data += data;

        if (this.data.endsWith('\r\n')) {
            // twitch is done talking
            this.process();
        }
    }

    process () {
        const lines = this.data;
        this.data = '';

        splitIntoLines(lines).forEach((line) => {
            this.irc.twitch.logger.log('>', line);
            handleMsg(this.irc, parseMsg(line));
        });
    }
}

module.exports = Reader;
