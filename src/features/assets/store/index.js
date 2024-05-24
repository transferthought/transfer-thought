import ResourceBase from '../../../stores/ResourceBase';
import state from './state';
import * as actions from './actions';
import mutations from './mutations';
import * as getters from './getters';
export default new ResourceBase({ state, actions, mutations, getters });
