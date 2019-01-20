# Home

---
## Installation

This library is available on NPM. Make sure you have [Node](https://nodejs.org/en/) installed and create a new project, then install the `kequtwitch` module.

```
npm install --save kequtwitch
```

---
## Usage

In your project require `kequtwitch` at the top.

```javascript
const Twitch = require('kequtwitch');
```

Create an instance of `kequtwitch` passing a valid [OAuth token](http://twitchapps.com/tmi/) as the first parameter.

```javascript
const twitch = new Twitch('your-oauth-token');
```

You are now setup to use the library. If you are on [the website](https://kequtwitch.kequc.com) please view the sidebar on the right or use [Github](docs-md) for further documentation.

---
## Quick start

The easiest way to see the library working is to login to a chatroom. A streamer's channel is their username prepended with `#` in lowercase.

```javascript
const Twitch = require('kequtwitch');
const twitch = new Twitch('your-oauth-token');

(async function init () {
    await twitch.irc.connect();
    await twitch.irc.join('#channel');
})();
```

Then you can watch the chat activity in your console.
