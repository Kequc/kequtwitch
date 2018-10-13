const Twitch = require('./main.js');

const twitch = new Twitch('6cif3751lfrrccedcn9omldu5t5dhp', { irc: { channels: ['#ryukahr'] } });

twitch.irc.connect();

twitch.irc.on('twitch-unknown', (msg) => {
    console.log(msg);
});

