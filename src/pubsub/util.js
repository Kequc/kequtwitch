function validateTopic (topic) {
    if (typeof topic !== 'string') {
        throw new Error('Topic must be a sting');
    }
}

function validateTopics (topics) {
    if (!Array.isArray(topics)) {
        throw new Error('Topics must be an array');
    }

    Object.values(topics).forEach(validateTopic);
}

function validateHeartrate (heartrate) {
    if (typeof heartrate !== 'number' || heartrate < 10000 || heartrate > 300000) {
        throw new Error('Heartrate must be a number between 10000 and 300000');
    }
}

module.exports = { validateTopic, validateTopics, validateHeartrate };
