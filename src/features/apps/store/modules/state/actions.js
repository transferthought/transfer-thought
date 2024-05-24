import _ from 'lodash';

export const update = ({ commit }, payload) => {
    commit('update', payload);
};
export const remove = ({ commit }, payload) => {
    commit('remove', payload);
};
export const insert = ({ state, commit }, payload) => {
    const { selector, value } = payload;
    const currentValue = _.get(state.state, selector, []);
    if (_.isArray(currentValue)) {
        commit('update', { selector, value: [...currentValue, value] });
    }
};
export const extend = ({ state }, payload) => {
    state.state = _.extend({}, state.state, payload.state);
};
