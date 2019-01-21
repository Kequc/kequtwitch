# Chat

The most common thing you might be interested in is what people are saying in the chatroom. The following is an overly complex example that delivers three separate events. First we ignore any messages from `'jtv'`, which is a legacy (or out of date) way Twitch delivers some status messages. In the [PRIVMSG](https://dev.twitch.tv/docs/irc/chat-rooms/#privmsg-twitch-chat-rooms) command it's generally information related to whether someone is hosting your channel.

Actions are chat messages prefixed with `/me` which are delivered in IRC in the format `ACTION`, wrapped with some special characters, so while not necessary to deliver a different event it's nice to be able to do so with the message stripped off to what the user really typed.

Then we check if there are bits attached to the `msg`. Probably the implementation you really want is less complicated than this.

```javascript
twitch.irc.inference('PRIVMSG', function (msg) {
    if (msg.prefix.user === 'jtv') return;

    // "/me is great!" #=> "ACTION is great!"
    const parts = msg.params[1].match(/^\u0001ACTION (.+)\u0001$/);

    if (parts !== null) {
        return {
            command: 'action',
            message: parts[1] // "is great!"
        };
    }

    return {
        command: (msg.tags.bits || 0) > 0 ? 'cheer' : 'chat'
    };
});

twitch.irc.on('action', function (msg) {
    const displayName = msg.tags.displayName;
    const channel = msg.params[0];
    const message = msg.inferred.message;

    console.log(`${displayName} in ${channel} actioned "${message}"!`);
});

twitch.irc.on('cheer', function (msg) {
    const displayName = msg.tags.displayName;
    const bits = msg.tags.bits;
    const [channel, message] = msg.params;

    console.log(`${displayName} in ${channel} cheered ${bits} and said "${message}"!`);
});

twitch.irc.on('chat', function (msg) {
    const displayName = msg.tags.displayName;
    const [channel, message] = msg.params;

    console.log(`${displayName} in ${channel} said "${message}"!`);
});
```
