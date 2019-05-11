# Mod and unmod

The [MODE](https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership) Twitch command delivers a slightly cryptic payload. We can expect `'+o'` as a middle parameter to mean `'mod'` and `'-o'` to mean `'unmod'`.

```javascript
twitch.chat.inference('MODE', function (msg, channel, key, user) {
    const commands = { '+o': 'mod', '-o': 'unmod' };

    return {
        command: commands[key],
        params: [channel, user]
    };
});

twitch.chat.on('mod', function (msg, channel, user) {
    console.log(`${user} is a mod in ${channel}!`);
});

twitch.chat.on('unmod', function (msg, channel, user) {
    console.log(`${user} is no longer a mod in ${channel}!`);
});
```
