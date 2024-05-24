import _ from 'lodash';

export default {
    init(state, config) {
        state.config = config;
        state.cachedConfig = null;
    },

    cache(state) {
        state.cachedConfig = _.cloneDeep(state.config);
    },

    reset(state) {
        state.config = _.cloneDeep(state.cachedConfig);
        state.cachedConfig = null;
    },

    update(state, payload) {
        const { id, partial } = payload;
        _.extend(state.config[id], partial);
    },

    add(state, payload) {
        const { item } = payload;
        state.config = { ...state.config, [item.id]: item };
    },

    delete(state, payload) {
        const { id } = payload;
        state.config = _.omit(state.config, id);
    },
};
