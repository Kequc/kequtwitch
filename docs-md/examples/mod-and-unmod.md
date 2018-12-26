# Mod and unmod

The [MODE](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command delivers a slightly cryptic payload. We can expect `'+o'` as a middle parameter to mean `'mod'` and `'-o'` to mean `'unmod'`.

```javascript
twitch.irc.infer('mode', function mode (msg) {
    const key = msg.params[1];
    const types = { '+o': 'mod', '-o': 'unmod' };

    return {
        type: types[key]
    };
});

twitch.irc.on('mod', function onMod (msg) {
    const [channel, , user] = msg.params;

    console.log(`${user} is now modding ${channel}!`);
});

twitch.irc.on('unmod', function onUnmod (msg) {
    const [channel, , user] = msg.params;

    console.log(`${user} is no longer a mod on ${channel}!`);
});
```
