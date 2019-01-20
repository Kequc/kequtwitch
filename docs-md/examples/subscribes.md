# Subscribes

The [USERNOTICE](https://dev.twitch.tv/docs/irc/commands/#usernotice-twitch-commands) Twitch command contains a `msg-id` tag which can be quite useful for reporting about new subscriptions. There are lots of tags so checking out the docs is recommended.

```javascript
twitch.irc.inference('USERNOTICE', function (msg) {
    if (msg.tags.msgId === 'sub' || msg.tags.msgId === 'resub') {
        return { command: 'sub' };
    }
    if (msg.tags.msgId === 'subgift' || msg.tags.msgId === 'anonsubgift') {
        return { command: 'subgift' };
    }
});

twitch.irc.on('sub', function (msg) {
    const displayName = msg.tags.displayName;
    const months = msg.tags.msgParamMonths;
    const [channel, message] = msg.params;

    console.log(`${displayName} has subbed for ${months} months to ${channel}!`);
});

twitch.irc.on('subgift', function (msg) {
    const from = msg.tags.displayName || 'Anonymous';
    const to = msg.tags.msgParamRecipientDisplayName;
    const [channel, message] = msg.params;

    console.log(`${from} has gifted a sub for ${to} to ${channel}!`);
});
```
