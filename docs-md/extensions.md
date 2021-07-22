# Extensions

All `msg` objects have a `extended` object.

It is up to you to populate it with any additional information you need out of messages by defining extensions. You can add extensions for every (uppercase) Twitch command, they are defined in the instantiation options or dynamically using the `extend` method. All extension methods are syncronous, and should return an object, otherwise they don't do anything.

The object you return becomes `extended` on the `msg` object. By default if you don't specify an extension or don't return an object then `extended` is empty.

## Special parameters

A special parameter called `command`, if you wish to use it, will emit the message again using the name that you want. A special parameter called `params` overrides params that will be emitted along with the message.

```javascript
twitch.chat.extend('JOIN', function (msg) {
    return {
        command: 'socks-and-jelly',
        params: ['hello', msg.prefix.user],
        userBackwards: msg.prefix.user.split('').reverse().join('')
    };
});

// Message event is generic and without params
twitch.chat.on('message', function (msg, ...params) {
    // msg.extended = {}
    // msg.params = ['#channel']
    // params = []
});

// Command events have default msg params
twitch.chat.on('JOIN', function (msg, ...params) {
    // msg.extended = {}
    // msg.params = ['#channel']
    // params = ['#channel']
});

// Custom events have custom params (if specified otherwise default params)
twitch.chat.on('socks-and-jelly', function (msg, ...params) {
    // msg.extended = {
    //     command: 'socks-and-jelly',
    //     params: ['hello', 'ronni'],
    //     userBackwards: 'innor'
    // }
    // msg.params = ['#channel']
    // params = ['hello', 'ronni]
});
```

## Instantiation

During initialization extensions can be added directly to the constructor.

```javascript
const chat = {
    extensions: {
        JOIN: [myExtension1, myExtension2], // where each extension is a function
        PRIVMSG: [myExtension3]
    }
};

const twitch = new Twitch('your-oauth-token', { chat });
```
