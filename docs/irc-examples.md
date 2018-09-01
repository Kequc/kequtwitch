# IRC examples

This is a guide here to give you a few code snippets to work with. Many demonstrate how you would mimic behaviour found in more user-friendly libraries like [tmi.js](http://www.tmijs.org/).

---
## Format of a msg object

A `msg` object represents a line of text delivered from the connected Twitch server.

It contains information in a hopefully convenient format for you to make use of, in whatever way that may be. Many are easy to understand and consistent such as the [JOIN](https://dev.twitch.tv/docs/irc/chat-rooms/#join-twitch-chat-rooms) Twitch command, however some can also be a little unusual. This library lets you do anything you want with all available message information. Examples of what raw messages look like can be found on the [Twitch IRC guide](https://dev.twitch.tv/docs/irc/guide/).

| param | description |
| - | - |
| `raw` | The full message in raw form |
| `tags` | Object containing all tags |
| `prefix` | Object containing prefix information |
| `prefix.full` | Full prefix. (Ie: `'mrkequc!mrkequc@mrkequc.tmi.twitch.tv'`) |
| `prefix.host` | Host. (Ie: `'mrkequc.tmi.twitch.tv'`) |
| `prefix.user` | User. (Ie: `'mrkequc'`) |
| `command` | The Twitch command. (Ie. `'PRIVMSG'`) |
| `params` | Array of parameters that follow the command. (Ie. `['#mrkequc', 'Hi everyone!']`) |

---
## Chat

The [PRIVMSG](https://dev.twitch.tv/docs/irc/chat-rooms/#privmsg-twitch-chat-rooms) Twitch command is used to send and receive chat interactions. If we wanted to send the message `"Hi everyone!"` to the channel `#mrkequc` our IRC message would look like the following.
```
PRIVMSG #mrkequc :Hi everyone!
```

If this is something you're going to be doing you could add an extension.
```javascript
twitch.irc.say = (channel, message) => {
    twitch.irc.send(`PRIVMSG ${channel} :${message}`);
};

twitch.irc.say('#mrkequc', 'Hi everyone!');
```

A message someone else posted in chat looks more complicated. As stated this library parses the message for you, however you can extend the library to emit more familiar events with the following. Keeping in mind you can edit this however you want to suit your needs.

Granted the incredibly odd `'jtv'` 'hosting you' `PRIVMSG` Twitch command as seen below makes this all look very complicated, it is still in use by Twitch as of September 01, 2018. You could decide to ignore those messages it's entirely up to you.

The following example mimics behaviour found in the popular [tmi.js](http://www.tmijs.org/) library.
```javascript
twitch.irc.on('twitch-privmsg', (msg) => {
    if (msg.prefix.user === 'jtv') {
        if (msg.params[0].includes('hosting you')) {
            // "ronni is now hosting you for 0 viewers."
            const txt = msg.params[0];
            const user = txt.split(' ')[0];
            msg.inferred = {
                user,
                viewers: parseInt(txt.match(/\d+/), 10) || 0,
                autohost: txt.substring(user.length).includes('auto')
            };
            // Emit hosted
            twitch.irc.emit('hosted', msg);
        }
    } else if (/^ACTION \//.test(msg.params[1])) {
        // "ACTION /me is great!"
        const txt = msg.params[1];
        const message = txt.replace('ACTION ', '');
        msg.inferred = {
            action: message.split(' ')[0],
            message
        };
        // Emit action
        twitch.irc.emit('action', msg);
    } else {
        if ((msg.tags.bits || 0) > 0) {
            // Emit cheer
            twitch.irc.emit('cheer', msg);
        }
        // Emit chat
        twitch.irc.emit('chat', msg);
    }
});

twitch.irc.on('chat', (msg) => {
    const { displayName } = msg.tags;
    const [ channel, message ] = msg.params;
    console.log(`${displayName} in ${channel} said "${message}"!`);
});

twitch.irc.on('cheer', (msg) => {
    const { displayName, bits } = msg.tags;
    const [ channel, message ] = msg.params;
    console.log(`${displayName} in ${channel} cheered ${bits} and said "${message}"!`);
});

twitch.irc.on('action', (msg) => {
    const { displayName } = msg.tags;
    const { message } = msg.inferred;
    console.log(`${displayName} in ${channel} actioned "${message}"!`);
});

twitch.irc.on('hosted', (msg) => {
    const { user, viewers } = msg.inferred;
    console.log(`${user} is now hosting you for ${viewers} viewers!`);
});
```

---
## Emotesets

Emitting emotesets whenever they are updated can be a relatively simple thing to set up. We might use this if we were parsing messages to use emoticons and always want to keep them up to date.

Add an extension that watches for a change and fetches the new emotes.
```javascript
let last;

async function checkEmotesets (msg) {
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

twitch.irc.on('twitch-userstate', checkEmotesets);
twitch.irc.on('twitch-globaluserstate', checkEmotesets);

twitch.irc.on('emotesets', (emotesets) => {
    // Updated emotes arrived!
});
```

---
## Mod and unmod

The [MODE](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command delivers a slightly cryptic payload. Twitch still uses these `'jtv'` events as of September 1, 2018. You may choose to extend the library separating this data into different events.
```javascript
twitch.irc.on('twitch-mode', (msg) => {
    // This would be strange
    if (msg.prefix.host !== 'jtv') return;

    if (msg.params[1] === '-o') {
        // Emit unmod
        irc.emit('unmod', msg);
    } else if (msg.params[1] === '+o') {
        // Emit mod
        irc.emit('mod', msg);
    }
});

twitch.irc.on('mod', (msg) => {
    const [ channel, , user ] = msg.params;
    console.log(`${user} is now modding ${channel}!`);
});

twitch.irc.on('unmod', (msg) => {
    const [ channel, , user ] = msg.params;
    console.log(`${user} is no longer a mod on ${channel}!`);
});
```

---
## Ban and timeout

The [CLEARCHAT](https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands) Twitch command often contains information about users being banned or given a timeout.
```javascript
twitch.irc.on('twitch-clearchat', (msg) => {
    if (msg.params.length < 2) {
        // Emit clearchat
        twitch.irc.emit('clearchat', msg);
    } else if (msg.tags['ban-duration'] === null) {
        // Emit ban
        twitch.irc.emit('ban', msg);
    } else {
        // Emit timeout
        twitch.irc.emit('timeout', msg);
    }
});

twitch.irc.on('timeout', (msg) => {
    const [ channel, user ] = msg.params;
    const { banReason, banDuration } = msg.tags;
    console.log(`${user} has been given a timeout from ${channel} for ${banDuration} seconds. Reason: ${banReason}`);
});

twitch.irc.on('ban', (msg) => {
    const [ channel, user ] = msg.params;
    const { banReason } = msg.tags;
    console.log(`${user} has been banned from ${channel}. Reason: ${banReason}`);
});

twitch.irc.on('clearchat', (msg) => {
    const [ channel ] = msg.params;
    console.log(`Chat in ${channel} has been cleared by a moderator.`);
});
```

---
## Host and unhost

The [HOSTTARGET](https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands) Twitch command includes differently formatted parameters depending on whether you start hosting a channel or stop hosting one. So it can be helpful to split this up into separate events.
```javascript
twitch.irc.on('twitch-hosttarget', (msg) => {
    if (msg.params[1][0] === '-') {
        // "- 10"
        msg.inferred = {
            viewers: parseInt(msg.params[1].replace('- ', ''), 10) || 0;
        };
        // Emit unhost
        twitch.irc.emit('unhost', msg);
    } else {
        const count = ;
        msg.inferred = {
            viewers: parseInt(msg.params[2], 10) || 0;
        };
        // Emit host
        twitch.irc.emit('host', msg);
    }
});

twitch.irc.on('host', (msg) => {
    const [ channel ] = msg.params;
    const { viewers } = msg.inferred;
    console.log(`Hosting ${channel} with ${viewers} viewers!`);
});

twitch.irc.on('unhost', (msg) => {
    const { viewers } = msg.inferred;
    console.log(`Stopped hosting with ${viewers} viewers!`);
});
```
