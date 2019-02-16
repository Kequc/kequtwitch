# Inferences

All `msg` objects have a `inferred` object.

It is up to you to populate it with any additional information you need out of messages by defining inferences. You can have one inference for every Twitch command, they are defined in the instantiation options or dynamically using the `inference` method. All inference methods are syncronous, can only be defined once, and should return an object.

The object you return becomes `inferred` on the `msg` object. By default if you don't specify an inference or return an object then `inferred` is empty.

## Inferred command

A special parameter called `command`, if you wish to use it, will emit the message again using the name that you want.

```javascript
twitch.irc.inference('JOIN', function (msg) {
    return {
        command: 'socks-and-jelly',
        userBackwards: msg.prefix.user.split('').reverse().join('')
    };
});

twitch.irc.on('JOIN', function (msg) {
    // msg.inferred ~= { command: 'socks-and-jelly', userBackwards: 'cuqek' }
});

twitch.irc.on('socks-and-jelly', function (msg) {
    // msg.inferred ~= { command: 'socks-and-jelly', userBackwards: 'cuqek' }
});
```
