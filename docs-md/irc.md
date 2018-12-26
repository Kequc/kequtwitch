# IRC

Twitch uses IRC for the chatroom on the side of livestreams. This IRC implementation can be used to listen to the chat, and even interact with it.

---
## IRC options

```javascript
const irc = {
    channels: [],
    interfaces: {},
    port: 6667,
    host: 'irc.chat.twitch.tv',
    timeout: 7000
};

const twitch = new Twitch('your-oauth-token', { irc });
```

| parameter | description |
| - | - |
| `channels` | Array of channels you want to join (Default: `[]`) |
| `inferences` | Object of inferences you want to use (Default: `{}`) |
| `port` | IRC port (Default: `6667`) |
| `host` | IRC host (Default: `'irc.chat.twitch.tv'`) |
| `timeout` | Timeout for connection join, etc. (Default: `7000`) |

---
## Connect join and part

When connecting to IRC the channels you set on instantiation are joined automatically however you may also dynamically join and part from channels if you choose.

```javascript
await twitch.irc.connect();
// irc is now connected

await twitch.irc.join('#my-channel');
// #my-channel is now joined

await twitch.irc.part('#my-channel');
// #my-channel is now parted
```

---
## Events

While connected to IRC, every line is parsed into an object and then emitted via node `EventEmitter` on the `irc` instance. Event names are the Twitch command in lowercase prepended with `twitch-`, otherwise `twitch-unknown`. In addition all messages emit the `message` event.

There are also connection status events.

```javascript
twitch.irc.on('message', function onMessage (msg) {
    // msg received from irc
});
```

| event | description |
| - | - |
| `disconnected` | IRC has disconnected |
| `connecting` | IRC is connecting |
| `connected` | IRC is connected |
| `authenticated` | IRC has successfully authenticated |
| `ready` | The above and IRC has re-joined channels |
| `message` | Message |
| `twitch-<command>` | Message |
| `error` | An error has occurred |

Examples of listening to and making use of IRC events can be found on the [IRC examples page](docs-md/examples).

---
## Send

To write a message safely into IRC use the `send` method. The first parameter is what you want to write, the second parameter is the minimum connection status it needs to wait for (Default: `'ready'`).

Useful in case the chat is reconnecting.

```javascript
twitch.irc.send('PRIVMSG #channel :Hello everyone!');
```

---
## Write

To write a message directly into IRC without any protection use the `write` method.

```javascript
twitch.irc.write('PRIVMSG #channel :No idea if this message will show up');
```

---
## Say extension

If you are going to be posting messages in the chat often it might be helpful to extend the `irc` instance with a `say` command.

```javascript
twitch.irc.say = (channel, message) => {
    twitch.irc.send(`PRIVMSG ${channel} :${message}`);
};

twitch.irc.say('#channel', 'Hello everyone!');
```
