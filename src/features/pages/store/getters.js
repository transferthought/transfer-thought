/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

// Most of these are "Resource" methods

export const metadata = () => {
    return {
        idKey: 'id',
        titleKey: 'title',
        editorRouteName: 'PageEditor',
    };
};

export const list = (state) => {
    const mappedList = _.map(state.entityIds, (id) => {
        return state.entitiesById[id];
    });
    return mappedList;
};

export const byId = (state) => (id) => {
    return state.entitiesById[id];
};

export const title = (state) => (id) => {
    const item = state.entitiesById[id];
    return item.title;
};
// TODO: flip this so that redirect is a passthrough?
// Getters Required For Publishable
export const editUrl = (state, getters, rootState, rootGetters) => (id) => {
    const currentUrl = new URL(window.location);
    const redirectData = rootGetters['redirect/redirectData'];

    if (redirectData) {
        return `${currentUrl.origin}/${redirectData.destination}/edit`;
    }
    return `${currentUrl.origin}/pages/${id}/edit`;
};

export const publishedUrl = (state, getters, rootState, rootGetters) => (id) => {
    const currentUrl = new URL(window.location);
    const redirectData = rootGetters['redirect/redirectData'];

    if (redirectData) {
        return `${currentUrl.origin}/${redirectData.destination}`;
    }

    return `${currentUrl.origin}/pages/${id}`;
};
