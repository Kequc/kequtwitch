# Host and unhost

The [HOSTTARGET](https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands) Twitch command includes differently formatted parameters depending on whether you start hosting a channel or stop hosting one. So it can be helpful to split this up into separate events.

```javascript
twitch.irc.inference('HOSTTARGET', function (msg) {
    let type;
    let viewers;

    if (msg.params[1][0] === '-') {
        // "- 10"
        type = 'unhost';
        viewers = msg.params[1].replace('- ', '');
    } else {
        type = 'host';
        viewers = msg.params[2];
    }

    return {
        type,
        viewers: parseInt(viewers, 10) || 0;
    };
});

twitch.irc.on('host', function (msg) {
    const channel = msg.params.channel;
    const viewers = msg.inferred.viewers;

    console.log(`Hosting ${channel} with ${viewers} viewers!`);
});

twitch.irc.on('unhost', function (msg) {
    const viewers = msg.inferred.viewers;

    console.log(`Stopped hosting with ${viewers} viewers!`);
});
```
