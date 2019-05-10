# Hosted

In order to know when we are being hosted by another channel we need to peek into the `PRIVMSG` command when it's delivered by `'jtv'` which is a Twitch mechanism that is arguably a little bit old.

In this example we need to parse the message to find out what is happening.

```javascript
twitch.chat.inference('PRIVMSG', function (msg) {
    if (msg.prefix.user !== 'jtv') {
        return;
    }

    // "ronni is now hosting you for 0 viewers."
    // "ronni is now auto-hosting you for 0 viewers."
    if (!msg.params[0].includes('hosting you')) {
        return;
    }

    const parts = msg.params[0].split(' ');

    const user = parts.shift();
    const viewers = parts.find(part => !isNaN(part));
    const autoHosting = parts.includes('auto-hosting');

    return {
        command: 'hosted',
        user,
        viewers: parseInt(viewers, 10) || 0,
        autoHosting
    };
});

twitch.chat.on('hosted', function (msg) {
    const { user, viewers, autoHosting } = msg.inferred;
    const hosting = autoHosting ? 'auto-hosting' : 'hosting';

    console.log(`${user} is now ${hosting} you for ${viewers} viewers!`);
});
```
