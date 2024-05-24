import * as storeActions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import state from './state';

export default {
    namespaced: true,
    actions: storeActions,
    getters,
    mutations,
    state,
};
