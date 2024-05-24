import _ from 'lodash';
import SimpleNodeService from './simple-node-service';

class EnvironmentsService extends SimpleNodeService {
    constructor() {
        super();
        this.stateSelector = 'environmentsConfig';
    }

    getEnvironments() {
        return this.getData();
    }

    createNewEnvironment(environmentData = {}) {
        const newEnvironment = {
            id: this.generateId(),
            name: 'New Environment',
            data: _.defaults({}, environmentData),
        };
        return newEnvironment;
    }
}

export default new EnvironmentsService();
