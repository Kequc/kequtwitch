# User info

When reading data from chat most messages contain everything you might need such as their display name. But if you want more information about users you might want to request that data from the [/users](https://dev.twitch.tv/docs/api/reference/#get-users) url, and if you are using that data often you will want to cache it.

The following is an example of something simple.

```javascript
const users = {};

async function getUser (login) {
    if (!users[login]) {
        const result = await twitch.api.request('/users', {
            data: { login }
        });

        users[login] = result.data[0];
    }

    return users[login];
}

const user = await getUser('kequc');
```
