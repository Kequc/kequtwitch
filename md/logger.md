# Logger

You can specify a custom logger with the methods `log`, `info`, `warn`, and `error`. Alternatively, to only enable specific logs they can be set using an array `{ logger: ['warn', 'error'] }`. To disable the logger use false `{ logger: false }`

In general, `log` will output irc communication, `info` contains status information, `warn` when there was a problem, `error` only when something unexpected happens.

```javascript
const logger = {
    log (...params) {
        console.log(...params);
    },
    info (...params) {
        const first = params.shift();
        console.info(`[ ${first} ]`, ...params);
    },
    warn (...params) {
        console.warn('Warning:', ...params);
    },
    error (...params) {
        console.error('Error:', ...params);
    }
};

const twitch = new Twitch('your-oauth-token', { logger });
```
