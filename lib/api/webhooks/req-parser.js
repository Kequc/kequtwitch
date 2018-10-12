const crypto = require('crypto');

const VALID_MODES = ['denied', 'subscribe', 'unsubscribe'];

function buildResponse (code, body) {
    return {
        code,
        body,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    };
}

function parseBody (body) {
    try {
        return JSON.parse(body).data;
    } catch (err) {
        return null;
    }
}

function getTopic (topic, baseUrl) {
    return topic ? topic.replace(baseUrl, '') : null;
}

function parseGet (webhooks, query = {}) {
    const topic = getTopic(query['hub.topic'], webhooks.api.helixUrl);
    const mode = query['hub.mode'];

    if (!topic || !mode) return buildResponse(400, 'Bad request');
    if (!VALID_MODES.includes(mode)) return buildResponse(403, 'Forbidden');

    webhooks.emit(mode, { topic, hub: query.hub });

    return buildResponse(200, query['hub.challenge'] || 'ok');
}

function parsePost (webhooks, body, headers = {}, query = {}) {
    if (!query.topic) return buildResponse(400, 'Bad request');
    if (!headers['x-hub-signature']) return buildResponse(403, 'Forbidden');

    const signature = headers['x-hub-signature'].split('=')[1];
    const expected = crypto.createHmac('sha256', webhooks.secret).update(body).digest('hex');

    if (expected !== signature) return buildResponse(202, 'Accepted');

    const message = parseBody(body);
    const topic = getTopic(query.topic, webhooks.api.helixUrl);

    if (message) {
        webhooks.emit('message', {
            topic,
            hub: query.hub,
            message,
            headers
        });

        return buildResponse(204);
    }

    webhooks.emit('error', {
        topic,
        hub: query.hub,
        message: 'Unable to parse webhook notification',
        body,
        headers
    });

    return buildResponse(202, 'Malformed JSON');
}

function reqParser (webhooks, method, body, headers, query) {
    switch (method.toLowerCase()) {
    case 'get': return parseGet(webhooks, query);
    case 'post': return parsePost(webhooks, body, headers, query);
    default: return buildResponse(405, 'Method not allowed');
    }
}

module.exports = reqParser;
