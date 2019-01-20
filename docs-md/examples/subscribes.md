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

    console.log(`${displayName} has subbed for ${months} months to ${channel} and said: "${message}"!`);
});

twitch.irc.on('subgift', function (msg) {
    const displayName = msg.tags.displayName || 'Anonymous';
    const recipientDisplayName = msg.tags.msgParamRecipientDisplayName;
    const [channel, message] = msg.params;

    console.log(`${displayName} has gifted a sub for ${recipientDisplayName} to ${channel} and said: "${message}"!`);
});
```