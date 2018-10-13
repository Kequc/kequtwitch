class Logger {
    constructor (show) {
        this.show = show || Logger.methods;
    }

    debug (...params) {
        if (!this.show.includes('debug')) return;
        console.debug(...params);
    }

    log (...params) {
        if (!this.show.includes('log')) return;
        console.log(...params);
    }

    info (...params) {
        if (!this.show.includes('info')) return;
        const first = params.shift();
        console.info(`[ ${first} ]`, ...params);
    }

    warn (...params) {
        if (!this.show.includes('warn')) return;
        console.warn('Warning:', ...params);
    }

    error (...params) {
        if (!this.show.includes('error')) return;
        console.error('Error:', ...params);
    }
}

Logger.methods = ['debug', 'log', 'info', 'warn', 'error'];

module.exports = Logger;
