# Subscribes

The [USERNOTICE](https://dev.twitch.tv/docs/irc/commands/#usernotice-twitch-commands) Twitch command contains a `msg-id` tag which can be quite useful for reporting about new subscriptions.

```javascript
twitch.chat.inference('USERNOTICE', function (msg) {
    if (['sub', 'resub'].includes(msg.tags.msgId)) {
        return { command: 'sub' };
    }
    if (['subgift', 'anonsubgift'].includes(msg.tags.msgId)) {
        return { command: 'subgift' };
    }
});

twitch.chat.on('sub', function (msg, channel, message) {
    const displayName = msg.tags.displayName;
    const months = msg.tags.msgParamMonths;

    console.log(`${displayName} has subbed for ${months} months to ${channel} and said: "${message}"!`);
});

twitch.chat.on('subgift', function (msg, channel, message) {
    const displayName = msg.tags.displayName || 'Anonymous';
    const recipientDisplayName = msg.tags.msgParamRecipientDisplayName;

    console.log(`${displayName} has gifted a sub for ${recipientDisplayName} to ${channel} and said: "${message}"!`);
});
```
