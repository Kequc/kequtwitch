const Twitch = require('./main');

const webhooks = {
    secret: 'secret',
    callbackUrl: 'http://ptsv2.com/t/x25l6-1537758245/post'
};
const twitch = new Twitch('6cif3751lfrrccedcn9omldu5t5dhp', { api: { webhooks } });

const webhook = twitch.api.webhooks.build('/users/follows', { from_id: 1336 });
webhook.subscribe(5);
