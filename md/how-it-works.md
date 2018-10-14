# How it works

Twitch uses IRC for chat interaction and HTTP endpoints.

---
## Validation

Validation is handled automatically but is key to the inner working of the library.

When you connect to IRC or use the HTTP endpoints, the token you provided as a parameter in the ["Usage" section](../readme.md) is validated on Twitch servers. Validation is repeated passively once an hour when needed as per the [Twitch documentation](https://dev.twitch.tv/docs/authentication/#validating-requests), you don't have to do anything.

This validation step gives us a few additional parameters which become available on our instance making it easy to interact with services.

```javascript
twitch.token; // token that was provided during instantiation
twitch.validatedAt; // time the token was validated
twitch.clientId; // your client id
twitch.login; // your username
twitch.userId; // your user id
```

If you want you can trigger validatation manually.

```javascript
await twitch.validate();
// user information has been populated

await twitch.isValidated();
// user information populated within the last hour
```
