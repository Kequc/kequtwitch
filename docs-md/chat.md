# Chat

This websockets implementation can be used to listen to the chatroom on the side of livestreams, and even interact with it.

## Options

```javascript
const chat = {
    channels: [],
    inferences: {},
    address: 'wss://irc-ws.chat.twitch.tv:443',
    timeout: 7000
};

const twitch = new Twitch('your-oauth-token', { chat });
```

| parameter | description |
| - | - |
| `channels` | Array of channels you want to join (Default: `[]`) |
| `inferences` | Object of inferences you want to use (Default: `{}`) |
| `address` | Websocket address (Default: `wss://irc-ws.chat.twitch.tv:443`) |
| `timeout` | Timeout for connection join, etc. (Default: `7000`) |

## Connect join part and disconnect

If you are connected already the `connect` method will disconnect then reconnect. When connecting to chat the channels you set on instantiation are joined automatically however you may also dynamically join and part from channels if you choose.

```javascript
await twitch.chat.connect();
// chat is now connected

await twitch.chat.join('#mychannel');
// #mychannel is now joined

await twitch.chat.part('#mychannel');
// #mychannel is now parted

await twitch.chat.disconnect();
// chat is now disconnected
```

## Events

While connected to chat, every line is parsed into an object and then emitted via node `EventEmitter` on the `chat` instance. Event names are the Twitch command, otherwise `UNKNOWN`. In addition all messages emit the `message` event.

There are also connection status events.

```javascript
twitch.chat.on('message', function (msg) {
    // msg received from chat
});
```

| event | description |
| - | - |
| `disconnected` | Chat has disconnected |
| `connecting` | Chat is connecting |
| `connected` | Chat is connected |
| `authenticated` | Chat has successfully authenticated |
| `ready` | The above and chat has re-joined channels |
| `message` | Message |
| `COMMAND` | Message |
| `error` | An error has occurred |

Examples of listening to and making use of chat events can be found on the [examples](docs-md/examples) page.

## Send

To write a message safely into chat use the `send` method. The first parameter is what you want to write, the second parameter is the minimum connection status it needs to wait for (Default: `'ready'`).

Useful in case the chat is reconnecting.

```javascript
twitch.chat.send('PRIVMSG #channel :Hello everyone!');
```

## Send unsafe

To write a message directly into chat without any protection use the `sendUnsafe` method.

```javascript
twitch.chat.sendUnsafe('PRIVMSG #channel :No idea if this message will show up');
```

## [Say] extension

If you are going to be posting messages in the chat often it might be helpful to extend the `chat` instance with a `say` command.

```javascript
function say (channel, message) {
    twitch.chat.send(`PRIVMSG ${channel} :${message}`);
}

twitch.chat.say = say;
twitch.chat.say('#channel', 'Hello everyone!');
```
