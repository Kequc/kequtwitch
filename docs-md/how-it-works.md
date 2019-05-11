# How it works

Twitch uses websockets for chat interaction and offers several http endpoints.

## Validation

When you connect to websockets or use any http endpoint, the token you provided as a parameter in the "Usage" section is validated on Twitch servers. Validation occurs passively once an hour when needed as per the [Twitch documentation](https://dev.twitch.tv/docs/authentication/#validating-requests), you don't have to do anything.

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
// user information was populated within the last hour or now is
```
