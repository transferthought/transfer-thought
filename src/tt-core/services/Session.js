import _ from 'lodash';

class Session {
    constructor() {
        this.createdAt = new Date();
        this.metadata = _.pick(navigator, ['platform', 'userAgent', 'appVersion', 'vendor']);
        this.logs = [];
    }

    log(name, data = {}) {
        const logMetaData = {
            name,
            timestamp: Date.now(),
        };
        this.logs.push(_.defaults(data, logMetaData));
    }

    toJson() {
        return {
            createdAt: this.createdAt,
            metadata: this.metadata,
            logs: this.logs.map((log) => JSON.stringify(log)),
        };
    }
}

export default Session;
