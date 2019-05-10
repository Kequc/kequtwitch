# Mod and unmod

The [MODE](https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership) Twitch command delivers a slightly cryptic payload. We can expect `'+o'` as a middle parameter to mean `'mod'` and `'-o'` to mean `'unmod'`.

```javascript
twitch.irc.inference('MODE', function (msg) {
    const key = msg.params[1];
    const commands = { '+o': 'mod', '-o': 'unmod' };

    return {
        command: commands[key],
        params: [msg.channel, msg.params[2]]
    };
});

twitch.irc.on('mod', function (msg, channel, user) {
    console.log(`${user} is now modding ${channel}!`);
});

twitch.irc.on('unmod', function (msg, channel, user) {
    console.log(`${user} is no longer a mod on ${channel}!`);
});
```
