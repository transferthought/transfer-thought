import _ from 'lodash';
import DefaultActions, { DefaultActionsMap } from '@/components/editor/ActionDefinitions';

export const getActionById = (state) => (actionId) => {
    const customAction = state.actions[actionId];
    if (customAction) {
        return customAction;
    }

    return DefaultActionsMap[actionId];
};
// TODO: this can be dangerous as we do not have any means to ensure names are unique
export const getActionByName = (state) => (actionName) => _.find(_.values(state.actions), (action) => action.name === actionName);
export const actionsList = (state) => _(_.values(state.actions))
    .concat(DefaultActions)
    .value();
export const userActions = (state) => _.values(state.actions);
export const customActionsList = (state) => _.filter(_.values(state.actions), (action) => action.type === 'custom');
export const timelinesList = (state) => _.filter(_.values(state.actions), (action) => action.type === 'timeline');
