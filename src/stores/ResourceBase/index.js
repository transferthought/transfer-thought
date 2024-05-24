import * as _actions from './actions';
import * as _getters from './getters';
import _mutations from './mutations';
import _state from './state';

class ResourceBase {
    constructor({ state = {}, actions = {}, mutations = {}, getters = {} }) {
        this.namespaced = true;
        this.state = () => {
            return {
                ..._state,
                ...state,
            };
        };
        this.actions = {
            ..._actions,
            ...actions,
        };

        this.mutations = { ..._mutations, ...mutations };
        this.getters = { ..._getters, ...getters };
    }
}

export default ResourceBase;
