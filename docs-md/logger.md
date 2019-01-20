# Logger

You can specify a custom logger with the methods `log`, `info`, and `error` for IRC. Additionally with the methods `debug`, `info`, and `error` for API. To disable the logger use false `{ logger: false }`

In general `log` will output irc communication, `info` contains status information, `error` only when something unexpected happens.

```javascript
const options = {
    irc: {
        logger: {
            log (...params) {
                console.log(...params);
            },
            info (...params) {
                const first = params.shift();
                console.info(`[ ${first} ]`, ...params);
            },
            error (...params) {
                console.error('Error:', ...params);
            }
        }
    },
    api: {
        logger: {
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
        }
    }
};

const twitch = new Twitch('your-oauth-token', options);
```
