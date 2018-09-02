# IRC examples

This guide is here to give you a few code snippets to work with. Many demonstrate how you would mimic behaviour found in more user-friendly libraries like [tmi.js](http://www.tmijs.org/).

---
## Say

The [PRIVMSG](https://dev.twitch.tv/docs/irc/chat-rooms/#privmsg-twitch-chat-rooms) Twitch command is used to send and receive chat instructions. If we wanted to send the message `"Hi everyone!"` to the channel `#mrkequc` our IRC message would look like the following.

```
PRIVMSG #mrkequc :Hi everyone!
```

If this is something you're going to be doing you could add an extension to make the interaction easier.

```javascript
twitch.irc.say = (channel, message) => {
    twitch.irc.send(`PRIVMSG ${channel} :${message}`);
};

twitch.irc.say('#mrkequc', 'Hi everyone!');
```

---
## Learn about the msg object

A `msg` object represents a line of text delivered from the connected Twitch server.

It contains information in a hopefully convenient format for you to make use of, in whatever way that may be. Many are easy to understand and consistent such as the [JOIN](https://dev.twitch.tv/docs/irc/chat-rooms/#join-twitch-chat-rooms) Twitch command, however some can also be a little unusual. This library lets you do anything you want with all available message information. Examples of what raw messages look like can be found on the [Twitch IRC guide](https://dev.twitch.tv/docs/irc/guide/).

| param | description |
| - | - |
| `raw` | The full message in raw form |
| `tags` | Object containing all tags |
| `prefix` | Object containing prefix information |
| `prefix.full` | Full prefix (Ie. `'mrkequc!mrkequc@mrkequc.tmi.twitch.tv'`) |
| `prefix.host` | Host (Ie. `'mrkequc.tmi.twitch.tv'`) |
| `prefix.user` | User (Ie. `'mrkequc'`) |
| `command` | The Twitch command (Ie. `'PRIVMSG'`) |
| `params` | Array of parameters that follow the command (Ie. `['#mrkequc', 'Hi everyone!']`) |
| `inferred` | Object containing special inferred information (Ie. `{ viewers: 10 }`) |

---
## Learn about inferences

All `msg` objects have a `inferred` object.

It is up to you to populate it with any additional information you need out of messages by defining inferences. You can have one inference for every Twitch command, they are defined in the `Twitch` constructor or later on using the `infer` method. All inference methods are syncronous, can only be defined once, and should return an object.

A special parameter called `inferred.type`, if you wish to use it, will emit the message again using the name that you set.

```javascript
const twitch = new Twitch('your-oauth-token');

twitch.irc.infer('join', function inferJoin (msg) {
    const userBackwards = msg.prefix.user.split('').reverse().join('');

    return {
        type: 'socks',
        userBackwards
    };
});

twitch.irc.on('twitch-join', (msg) => {
    console.log(msg.inferred); // { type: 'socks', userBackwards: 'cuqek' }
});

twitch.irc.on('socks', (msg) => {
    console.log(msg.inferred); // { type: 'socks', userBackwards: 'cuqek' }
});
```

---
## Chat

A message someone else posted in chat looks more complicated. As stated this library parses the message for you, however you can extend the library to emit more familiar events with the following. Keeping in mind you can edit this however you want to suit your needs.

Granted the incredibly odd `'jtv'` 'hosting you' `PRIVMSG` Twitch command as seen below makes this all look very complicated, it is still in use by Twitch as of September 01, 2018. You could decide to ignore those messages it's entirely up to you.

The following example mimics behaviour found in the popular [tmi.js](http://www.tmijs.org/) library.

```javascript
twitch.irc.infer('privmsg', function inferPrivmsg (msg) {
    if (msg.prefix.user === 'jtv') {
        // "ronni is now hosting you for 0 viewers."
        const message = msg.params[0];

        if (!message.includes('hosting you')) {
            return;
        }

        const parts = message.split(' ');
        const user = parts.shift();
        const viewers = parts.find(part => !isNaN(part));
        const autoHosting = parts.includes('auto-hosting');

        return {
            type: 'hosted',
            user,
            viewers: parseInt(viewers, 10) || 0,
            autoHosting
        };
    }

    if (msg.params[1].indexOf('ACTION /') === 0) {
        // "ACTION /me is great!"
        const message = msg.params[1].substring(7);

        return {
            type: 'action'
            message
        };
    }

    return {
        type: (msg.tags.bits || 0) > 0 ? 'cheer' : 'chat'
    };
});

twitch.irc.on('hosted', function onHosted (msg) {
    const { user, viewers } = msg.inferred;
    console.log(`${user} is now hosting you for ${viewers} viewers!`);
});

twitch.irc.on('action', function onAction (msg) {
    const { displayName } = msg.tags;
    const { message } = msg.inferred;
    console.log(`${displayName} in ${channel} actioned "${message}"!`);
});

twitch.irc.on('cheer', function onCheer (msg) {
    const { displayName, bits } = msg.tags;
    const [ channel, message ] = msg.params;
    console.log(`${displayName} in ${channel} cheered ${bits} and said "${message}"!`);
});

twitch.irc.on('chat', function onChat (msg) {
    const { displayName } = msg.tags;
    const [ channel, message ] = msg.params;
    console.log(`${displayName} in ${channel} said "${message}"!`);
});
```

---
## Emotesets

Emitting emotesets whenever they are updated can be a relatively simple thing to set up. We might use this if we were parsing messages to use emoticons and always want to keep them up to date.

Add an extension that watches for a change and fetches the new emotes.

```javascript
let last;

async function checkEmoteSets (msg) {
    const emotesets = msg.tags.emoteSets;

    // Look for new emotesets
    if (typeof emotesets !== 'string') return;
    if (last === emotesets) return;

    // Emotesets have changed
    last = emotesets;

    // Fetch
    const result = await twitch.api.request('/chat/emoticon_images', {
        data: { emotesets },
        kraken: true
    });

    // Emit result
    twitch.irc.emit('emotesets', result);
}

twitch.irc.on('twitch-userstate', checkEmoteSets);
twitch.irc.on('twitch-globaluserstate', checkEmoteSets);

twitch.irc.on('emotesets', function onEmotesets (emotesets) {
    // Updated emotes arrived!
});
```

---
## Mod and unmod

The [MODE](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command delivers a slightly cryptic payload. Twitch still uses these `'jtv'` events as of September 1, 2018. You may choose to extend the library separating this data into different events.

```javascript
twitch.irc.infer('mode', function inferMode (msg) {
    const key = msg.params[1];
    const types = { '+o': 'mod', '-o': 'unmod' };

    return {
        type: types[key]
    };
});

twitch.irc.on('mod', function onMod (msg) {
    const [ channel, , user ] = msg.params;
    console.log(`${user} is now modding ${channel}!`);
});

twitch.irc.on('unmod', function onUnmod (msg) {
    const [ channel, , user ] = msg.params;
    console.log(`${user} is no longer a mod on ${channel}!`);
});
```

---
## Ban and timeout

The [CLEARCHAT](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command often contains information about users being banned or given a timeout.

```javascript
twitch.irc.infer('clearchat', function inferClearchat (msg) {
    let type;

    if (msg.params.length < 2) {
        type = 'clearchat';
    } else if (msg.tags.banDuration === null) {
        type = 'ban';
    } else  {
        type = 'timeout';
    }

    return { type };
});

twitch.irc.on('clearchat', (msg) => {
    const [ channel ] = msg.params;
    console.log(`Chat in ${channel} has been cleared by a moderator!`);
});

twitch.irc.on('ban', (msg) => {
    const [ channel, user ] = msg.params;
    const { banReason } = msg.tags;
    console.log(`${user} has been banned from ${channel}. Reason: ${banReason}`);
});

twitch.irc.on('timeout', (msg) => {
    const [ channel, user ] = msg.params;
    const { banReason, banDuration } = msg.tags;
    console.log(`${user} has been given a timeout from ${channel} for ${banDuration} seconds. Reason: ${banReason}`);
});
```

---
## Host and unhost

The [HOSTTARGET](https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands) Twitch command includes differently formatted parameters depending on whether you start hosting a channel or stop hosting one. So it can be helpful to split this up into separate events.

```javascript
twitch.irc.infer('hosttarget', function inferHosttarget (msg) {
    let type;
    let viewers;

    if (msg.params[1][0] === '-') {
        // "- 10"
        type = 'unhost';
        viewers = msg.params[1].replace('- ', '');
    } else {
        type = 'host';
        viewers = msg.params[2];
    }

    return {
        type,
        viewers: parseInt(viewers, 10) || 0;
    };
});

twitch.irc.on('host', (msg) => {
    const [ channel ] = msg.params;
    const { viewers } = msg.inferred;
    console.log(`Hosting ${viewers} viewers from ${channel}!`);
});

twitch.irc.on('unhost', (msg) => {
    const { viewers } = msg.inferred;
    console.log(`Stopped hosting ${viewers} viewers!`);
});
```
