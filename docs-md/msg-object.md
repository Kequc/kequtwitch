# Msg object

A `msg` object represents a line of text delivered from the connected Twitch server. It is formatted to be easier to use than a raw line of text from IRC would normally be. But it's still a generic format.

Many are easy to understand and consistent such as the [JOIN](https://dev.twitch.tv/docs/irc/chat-rooms/#join-twitch-chat-rooms) Twitch command, some can also be a little bit more difficult. This library lets you do anything you want with all available message information. Examples of what raw messages look like can be found on the [Twitch IRC guide](https://dev.twitch.tv/docs/irc/guide/).

| param | description |
| - | - |
| `raw` | The full message in raw form |
| `tags` | Object containing all tags |
| `prefix` | Object containing prefix information |
| `prefix.full` | Full prefix (Ie. `'ronni!ronni@ronni.tmi.twitch.tv'`) |
| `prefix.host` | Host (Ie. `'ronni.tmi.twitch.tv'`) |
| `prefix.user` | User (Ie. `'ronni'`) |
| `command` | The Twitch command (Ie. `'PRIVMSG'`) |
| `params` | Array of parameters that follow the command (Ie. `['#mrkequc', 'Hi everyone!']`) |
| `channel` | Taken from `params` if detected or `null` (Ie. `'#mrkequc'`) |
| `message` | Taken from `params` if detected or `null` (Ie. `'Hi everyone!'`) |
| `inferred` | Object containing special inferred information (Ie. `{}`) |

## Tags

Tags are converted into an object with keys that are in camelCase. If you are looking for a tag named `'display-name'` for example it can be found in the msg object at `msg.tags.displayName`. When the value is a number it is converted into a number otherwise all tags resolve a string.

A few of the tags returned have special rendering.

#### badges

Badges are split by `','` so that they are an array, for example `['subscriber/0', 'premium/1']`.

#### emotes

Emotes denote where in the message an emote was used and is rendered as an array containing objects with `id`, `start`, `end`, and `length` attributes. For example `[{ id: 25, start: 27, end: 31, length: 4 }]`

#### emoteSets

Emote sets are split by `','` and turned into numbers for example `[0]`.

## Params

The first parameter is commonly the channel, therefore very often when you want to know what channel the command is related to you could use `msg.params[0]`. This isn't true for all commands but is good general rule to keep in mind.

A `msg.channel` attribute is available, if what looks like a channel is found in `msg.params` and it isn't the message. A `msg.message` attribute is available, if the last parameter in `msg.params` uses the `:` long form notation.

Furthermore params are emitted as the remaining parameters of events in the format `(msg, ...params)` so they are easy access in event handlers.
