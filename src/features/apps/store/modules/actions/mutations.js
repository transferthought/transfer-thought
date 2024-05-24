/* eslint-disable no-param-reassign */

import _ from 'lodash';

export default {
    init(state, actions) {
        _.forOwn(actions, (action) => {
            if (_.isUndefined(action.type)) {
                action.type = 'custom';
            }
        });
        state.actions = actions;
    },

    add(state, payload) {
        const { action } = payload;
        state.actions = { ...state.actions, [action.id]: action };
    },

    update(state, payload) {
        const { id, partial } = payload;
        const action = state.actions[id];
        _.forEach(partial, (value, key) => {
            action[key] = value;
        });
    },

    delete(state, id) {
        state.actions = _.pickBy(state.actions, (action) => action.id !== id);
    },
};
