# Logger

You can specify a custom logger with the methods `debug`, `info`, and `error`. In general `debug` will output chat/api communication, `info` contains status information, `error` only when something unexpected happens.

```javascript
const logger = {
    debug (...params) {
        console.debug(...params);
    },
    info (...params) {
        const first = params.shift();
        console.info(`[ ${first} ]`, ...params);
    },
    error (...params) {
        console.error('Error:', ...params);
    }
};

const twitch = new Twitch('your-oauth-token', { logger });
```

## Disable

To disable the logger use false `{ logger: false }`.

```javascript
const twitch = new Twitch('your-oauth-token', { logger: false });
```
