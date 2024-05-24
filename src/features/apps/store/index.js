import config from './modules/config';
import actions from './modules/actions';
import context from './modules/context';
import queryParams from './modules/query-params';
import appState from './modules/state/index';
import * as storeActions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import state from './state';

import ResourceBase from '../../../stores/ResourceBase';

export default {
    ...new ResourceBase({
        actions: storeActions,
        getters,
        mutations,
        state,
    }),
    modules: {
        config,
        state: appState,
        actions,
        context,
        queryParams,
    },
};
