# Ban and timeout

The [CLEARCHAT](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command contains information about users being banned or given a timeout.

Messages with fewer than 2 parameters are a real `CLEARCHAT` event where the chatroom was emptied. Messages with 3 parameters and a `banDuration` are only a temporary ban, and otherwise a permanent one.

```javascript
twitch.chat.extend('CLEARCHAT', function (msg) {
    let command;

    if (msg.params.length < 2) {
        command = 'clear';
    } else if (msg.tags.banDuration === null) {
        command = 'ban';
    } else  {
        command = 'timeout';
    }

    return { command };
});

twitch.chat.on('clear', function (msg, channel) {
    console.log(`Chat in ${channel} has been cleared by a moderator!`);
});

twitch.chat.on('ban', function (msg, channel, user) {
    const { banReason } = msg.tags;

    console.log(`${user} has been banned from ${channel}.`);
    console.log(`Reason: "${banReason}" permanently.`);
});

twitch.chat.on('timeout', function (msg, channel, user) {
    const { banReason, banDuration } = msg.tags;

    console.log(`${user} has been given a timeout from ${channel}.`);
    console.log(`Reason: "${banReason}" for ${banDuration} seconds.`);
});
```
