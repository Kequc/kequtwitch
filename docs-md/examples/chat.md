# Chat

The most common thing you might be interested in is what people are saying in the chatroom. The following is an overly complex example that delivers three separate events. First we ignore any messages from `'jtv'`, which is a legacy (or out of date) way Twitch delivers some status messages. In the `PRIVMSG` command it's generally information related to whether someone is hosting your channel.

Actions are chat messages prefixed with the string `ACTION /`, so while not necessary to deliver a different event, it's nice to be able to with the start of the message stripped off to where the user started typing.

Then we check if there are bits attached to the `msg`. Probably the implementation you really want is less complicated than this.

```javascript
twitch.irc.inference('PRIVMSG', function (msg) {
    if (msg.prefix.user === 'jtv') return;

    if (msg.params[1].indexOf('ACTION /') === 0) {
        // "ACTION /me is great!"
        const message = msg.params[1].substring(7);

        return {
            command: 'action'
            message
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
