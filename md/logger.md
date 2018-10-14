# Logger

You can specify a custom logger with the methods `log`, `info`, `warn`, and `error`. Alternatively, to only enable specific logs they can be specified as an array `{ logger: ['warn', 'error'] }`. To disable the logger completely pass false `{ logger: false }`

In general, `log` will output irc communication, `info` contains status information, `warn` when there was a problem, `error` only when something unexpected happens.

```javascript
const logger = {
    log (...params) {
        console.log(...params);
    },
    info (...params) {
        console.info(...params);
    },
    warn (...params) {
        console.warn(...params);
    },
    error (...params) {
        console.error(...params);
    }
};

const twitch = new Twitch('your-oauth-token', { logger });
```
