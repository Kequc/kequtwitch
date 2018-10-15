# API

Intended to make interaction with Twitch HTTP endpoints as easy as possible, making available both Helix and Kraken API's.

---
## API options

```javascript
const api = {
    helixUrl: 'https://api.twitch.tv/helix',
    krakenUrl: 'https://api.twitch.tv/kraken'
};

const twitch = new Twitch('your-oauth-token', { api });
```

| parameter | description |
| - | - |
| `helixUrl` | URL for the Helix API (Default: `'https://api.twitch.tv/helix'`) |
| `krakenUrl` | URL for the Kraken API (Default: `'https://api.twitch.tv/kraken'`) |

---
## Request

The `request` method takes a `path` as a first parameter, an options object, and returns a promise.

```javascript
const response = await twitch.api.request('/users', {
    data: { id: 'user-id' }
});
```

| param | description |
| - | - |
| `skipValidation` | Skip waiting for validation not recommended (Default: `false`) |
| `url` | Url of the API (Default: ``https://api.twitch.tv/helix`` or ``https://api.twitch.tv/kraken``) |
| `kraken` | Request is made to the "Kraken" API instead of "Helix" (Default: `false`) |
| `method` | Request method (Default: `'GET'`) |
| `data` | Object containing post data or search parameters (Default: `{}`) |
| `headers` | Object containing additional headers (Default: `{}`) |
| `maxRetries` | Number of times to retry failed requests (Default: `2`) |

---
## Special values

There are special values which can be used to make use of information returned on the `kequtwitch` instance during validation. Setting any data value to one of these strings will use your corresponding information.

```javascript
const response = await twitch.api.request('/users', {
    data: { id: '$userId' }
});
```

| value | description |
| - | - |
| `$clientId` | Uses value found at `twitch.clientId` |
| `$login` | Uses value found at `twitch.login` |
| `$userId` | Uses value found at `twitch.userId` |
