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

You are now setup to use the library. Please view the sidebar on the right if you are on [the website](https://kequtwitch.kequc.com) or [Github](https://github.com/Kequc/kequtwitch/tree/master/md) for further documentation.
