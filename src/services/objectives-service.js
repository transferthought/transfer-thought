import _ from 'lodash';
import SimpleNodeService from './simple-node-service';
import EnvironmentsService from './environments-service';

// TODO: this is a little hard coded to assume everything is max one layer deep
// objective is the top layer and everything else is a child.
// we should maybe make this a little more flexable later if needed
class ObjectivesService extends SimpleNodeService {
    constructor() {
        super();
        this.stateSelector = 'checklistConfig';
    }

    createNewObjective(newObjectiveData = {}) {
        const name = newObjectiveData.name || 'New...';
        let environmentId = newObjectiveData.environmentId || null;
        const rotation = newObjectiveData.rotation || { x: 0, y: 0, z: 0 };

        if (!environmentId) {
            const environments = EnvironmentsService.getEnvironments();
            const environmentIds = _.keys(environments);
            // use the last created environmnet as default, maybe we can do better
            const defaultEnvironmentId = _.last(environmentIds);
            if (defaultEnvironmentId) {
                environmentId = defaultEnvironmentId;
            } else {
                const newEnvironment = EnvironmentsService.createNewEnvironment();
                environmentId = newEnvironment.id;
            }
        }

        const newObjective = {
            id: this.generateId(),
            parentId: null,
            name,
            type: 'instructional',
            data: {
                environmentId,
                rotation,
                zoom: 1,
                transcript: '',
                transcriptAudioUrl: '',
                imageUrl: '',
                hotspots: [],
                options: [],
            },
        };
        return newObjective;
    }
}

export default new ObjectivesService();
