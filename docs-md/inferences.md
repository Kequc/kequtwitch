# Inferences

All `msg` objects have a `inferred` object.

It is up to you to populate it with any additional information you need out of messages by defining inferences. You can have one inference for every Twitch command, they are defined in the instantiation options or dynamically using the `infer` method. All inference methods are syncronous, can only be defined once, and should return an object.

The object you return becomes `inferred` on the `msg` object. By default if you don't specify an inference or return an object then `inferred` is empty.

---
## Inferred type

A special parameter called `inferred.type`, if you wish to use it, will emit the message again using the name that you want.

```javascript
twitch.irc.infer('join', function join (msg) {
    return {
        type: 'socks-and-jelly',
        userBackwards: msg.prefix.user.split('').reverse().join('')
    };
});

twitch.irc.on('twitch-join', (msg) => {
    // msg.inferred ~= { type: 'socks-and-jelly', userBackwards: 'cuqek' }
});

twitch.irc.on('socks-and-jelly', (msg) => {
    // msg.inferred ~= { type: 'socks-and-jelly', userBackwards: 'cuqek' }
});
```
