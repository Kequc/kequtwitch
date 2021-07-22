# Api

Intended to make interaction with Twitch http endpoints as easy as possible, making available both Helix and Kraken api's.

## Options

```javascript
const api = {
    helixUrl: 'https://api.twitch.tv/helix',
    krakenUrl: 'https://api.twitch.tv/kraken'
};

const twitch = new Twitch('your-oauth-token', { api });
```

| parameter | description |
| - | - |
| `helixUrl` | Url for the Helix api (Default: `'https://api.twitch.tv/helix'`) |
| `krakenUrl` | Url for the Kraken api (Default: `'https://api.twitch.tv/kraken'`) |

## Helix and kraken

The `helix` and `kraken` methods are explicit convenience methods which alias the `request` method.

```javascript
const response = await twitch.api.helix('/users/follows', {
    data: { toId }
});

const response = await twitch.api.kraken('/chat/emoticon_images', {
    data: { emotesets }
});
```

## Request

The `request` method takes `path` as a first parameter, an options object, and returns a promise.

Keys are returned in `camelCase`, for example if you are trying to access a value named `from_id` it can be found at `response.fromId`. Similarly attributes are defined in `camelCase`, if you are trying to set a data attribute named `{ to_id }` you might use `{ toId }`.

```javascript
const response = await twitch.api.request('/users/follows', {
    data: { toId }
});

const response = await twitch.api.request('/chat/emoticon_images', {
    data: { emotesets },
    kraken: true
});
```

| param | description |
| - | - |
| `skipValidation` | Skip waiting for validation not recommended (Default: `false`) |
| `url` | Url of the api (Default: ``https://api.twitch.tv/helix`` or ``https://api.twitch.tv/kraken``) |
| `kraken` | Request is made to the "Kraken" api instead of "Helix" (Default: `false`) |
| `method` | Request method (Default: `'GET'`) |
| `data` | Object containing post data or search parameters (Default: `{}`) |
| `headers` | Object containing additional headers (Default: `{}`) |
| `maxRetries` | Number of times to retry failed attempts (Default: `2`) |

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
