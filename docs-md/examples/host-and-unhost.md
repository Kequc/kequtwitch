# Host and unhost

The [HOSTTARGET](https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands) Twitch command includes differently formatted parameters depending on whether you start hosting a channel or stop hosting one. So it can be helpful to split this up into separate events.

```javascript
twitch.chat.extend('HOSTTARGET', function (msg) {
    let command;
    let viewers;

    if (msg.params[1].startsWith('- ')) {
        // "- 10"
        command = 'unhost';
        viewers = msg.params[1].replace('- ', '');
    } else {
        command = 'host';
        viewers = msg.params[2];
    }

    return {
        command,
        params: [msg.channel, parseInt(viewers, 10) || 0]
    };
});

twitch.chat.on('host', function (msg, channel, viewers) {
    console.log(`Hosting ${channel} with ${viewers} viewers!`);
});

twitch.chat.on('unhost', function (msg, channel, viewers) {
    console.log(`Stopped hosting ${channel} with ${viewers} viewers!`);
});
```
