# IRC

Twitch uses IRC for the chatroom you see on the side of livestreams, and it coordinates with the livestream to deliver events. The IRC implementation can be used to listen to the chat, and even interact with it.

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

When connecting to irc your channels are joined automatically however you may also dynamically join and part from channels.

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

While connected to IRC, every line is parsed into an object and then emitted via node `EventEmitter` on the `irc` instance. Event names are the Twitch command in lowercase prepended with `twitch-` if found, otherwise `twitch-unknown`. In addition all messages emit the `message` event.

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

Examples of listening to and making use of IRC events can be found on the [IRC examples page](md/irc-examples.md).
