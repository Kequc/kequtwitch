# Inferences

All `msg` objects have a `inferred` object.

It is up to you to populate it with any additional information you need out of messages by defining inferences. You can have one inference for every Twitch command, they are defined in the instantiation options or dynamically using the `inference` method. All inference methods are syncronous, can only be defined once, and should return an object.

The object you return becomes `inferred` on the `msg` object. By default if you don't specify an inference or return an object then `inferred` is empty.

## Special parameters

A special parameter called `command`, if you wish to use it, will emit the message again using the name that you want.

A special parameter called `params` overrides params that will be emitted along with the message.

```javascript
twitch.chat.inference('JOIN', function (msg) {
    return {
        command: 'socks-and-jelly',
        params: ['hello', msg.prefix.user],
        userBackwards: msg.prefix.user.split('').reverse().join('')
    };
});

// Message events are received without additional parameters
twitch.chat.on('message', function (msg, myString, myUser) {
    // msg.inferred ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'kequc'],
    //     userBackwards: 'cuqek'
    // }
    // myString ~= undefined
    // myUser ~= undefined
});

twitch.chat.on('JOIN', function (msg, myString, myUser) {
    // msg.inferred ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'kequc'],
    //     userBackwards: 'cuqek'
    // }
    // myString ~= 'hello'
    // myUser ~= 'kequc'
});

twitch.chat.on('socks-and-jelly', function (msg, myString, myUser) {
    // msg.inferred ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'kequc'],
    //     userBackwards: 'cuqek'
    // }
    // myString ~= 'hello'
    // myUser ~= 'kequc'
});
```
