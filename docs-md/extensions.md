# Extensions

All `msg` objects have a `extended` object.

It is up to you to populate it with any additional information you need out of messages by defining extensions. You can have one extension for every Twitch command, they are defined in the instantiation options or dynamically using the `extend` method. All extension methods are syncronous, can only be defined once, and should return an object.

The object you return becomes `extended` on the `msg` object. By default if you don't specify an extension or don't return an object then `extended` is empty.

## Special parameters

A special parameter called `command`, if you wish to use it, will emit the message again using the name that you want.

A special parameter called `params` overrides params that will be emitted along with the message.

```javascript
twitch.chat.extend('JOIN', function (msg) {
    return {
        command: 'socks-and-jelly',
        params: ['hello', msg.prefix.user],
        userBackwards: msg.prefix.user.split('').reverse().join('')
    };
});

// Message events are received without parameters
twitch.chat.on('message', function (msg) {
    // msg.extended ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'ronni'],
    //     userBackwards: 'innor'
    // }
    // msg.params ~= ['#channel']
});

// Command events have default parameters
twitch.chat.on('JOIN', function (msg, param1) {
    // msg.extended ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'ronni'],
    //     userBackwards: 'innor'
    // }
    // msg.params ~= ['#channel']
    // param1 ~= '#channel'
});

// Custom events have custom parameters
twitch.chat.on('socks-and-jelly', function (msg, param1, param2) {
    // msg.extended ~= {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'ronni'],
    //     userBackwards: 'innor'
    // }
    // msg.params ~= ['#channel']
    // param1 ~= 'hello'
    // param2 ~= 'ronni'
});
```
