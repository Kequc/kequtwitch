# Talk

The most common thing you might be interested in is what people are saying in the chatroom. The following is an overly complex example that delivers three separate events. First we ignore any messages from `'jtv'`, which is a legacy (or out of date) way Twitch delivers some status messages. In the [PRIVMSG](https://dev.twitch.tv/docs/irc/chat-rooms/#privmsg-twitch-chat-rooms) command it's generally information related to whether someone is hosting your channel.

Actions are chat messages prefixed with `/me` which are delivered to chat in the format `ACTION`, wrapped with some special characters, so while not necessary to deliver a different event it's nice to be able to do so with the message stripped off to what the user really typed.

Then we check if there are bits attached to the `msg`. Probably the implementation you really want is less complicated than this.

```javascript
twitch.chat.extend('PRIVMSG', function (msg, channel, message) {
    if (msg.prefix.user === 'jtv') return;

    // "/me is great!" #=> "ACTION is great!"
    const parts = message.match(/^\u0001ACTION (.+)\u0001$/);

    if (parts !== null) {
        // We have extracted message content and are sending it in place
        // of default params
        return {
            command: 'action',
            params: [channel, parts[1]] // "is great!"
        };
    }

    return { command: 'talk' };
});

twitch.chat.extend('PRIVMSG', function (msg) {
    if (msg.prefix.user === 'jtv') return;

    if ((msg.tags.bits || 0) > 0) {
        return { command: 'cheer' };
    }
}

twitch.chat.on('action', function (msg, channel, action) {
    const { displayName } = msg.tags;

    console.log(`*${displayName} ${action}* in ${channel}!`);
});

twitch.chat.on('cheer', function (msg, channel, message) {
    const { displayName, bits } = msg.tags;

    console.log(`${displayName} in ${channel} cheered ${bits}!`);
    console.log(message);
});

twitch.chat.on('talk', function (msg, channel, message) {
    const { displayName } = msg.tags;

    console.log(`${displayName} in ${channel} said "${message}"!`);
});
```
