import * as UUID from 'uuid/v4';
import _ from 'lodash';

const defaultActionName = 'NewAction';

const defaultActionDefinitions = {
    custom: {
        code: '// enter action code below',
        watch: false,
    },
    timeline: {
        ui: {
            currentTime: 0, totalTime: 20, scrollTime: 0, timeScale: 60,
        },
        layers: [],
    },
};

export const extend = ({ state }, payload) => {
    state.actions = _.extend({}, state.actions, payload.actions);
};
export const newAction = ({ commit, state }, type = 'custom') => {
    let name = defaultActionName;
    const actionsByName = _.keyBy(state.actions, (action) => action.name);
    let i = 0;
    while (actionsByName[name]) {
        i += 1;
        name = defaultActionName + i;
    }
    const action = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        name,
        type,
        ..._.cloneDeep(defaultActionDefinitions[type]),
    };
    commit('add', {
        action,
    });
    return action;
};
export const updateActionType = ({ commit }, payload) => {
    const { action, type } = payload;
    const partial = {
        type,
        ...defaultActionDefinitions[type],
    };
    commit('update', { id: action.id, partial });
};
export const updateAction = ({ commit }, payload) => {
    const { action, partial } = payload;
    commit('update', { id: action.id, partial });
};
export const deleteAction = ({ commit }, action) => {
    const { id } = action;
    commit('delete', id);
};
