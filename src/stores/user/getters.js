/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export const permissions = (state) => {
    return state.permissions[state.data.plan];
};

export const hasAccess = (state, getters) => (settingSelector) => {
    const permissions = getters['permissions'];
    return _.includes(permissions, settingSelector);
};
