/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

// Most of these are "Resource" methods

export const metadata = () => {
    return {
        idKey: 'id',
        titleKey: 'name',
        editorRouteName: 'AssetEditor',
    };
};

export const list = (state) => {
    const mappedList = _.map(state.entityIds, (id) => {
        return state.entitiesById[id];
    });
    return mappedList;
};

export const assetListStatus = (state) => state.assetListStatus;

export const byId = (state) => (id) => {
    return state.entitiesById[id];
};

export const breadcrumbs = (state) => {
    // based on current id, return an array of breadcrumbs [{id: null, name: 'Root'}]
    let breadcrumbs = [];
    let parentId = state.currentParentId;
    while (parentId !== null) {
        const parent = state.entitiesById[parentId];
        breadcrumbs.unshift({ id: parent.id, name: parent.name });
        parentId = parent.parentId;
    }
    breadcrumbs.unshift({ id: null, name: 'Root' });
    console.log('breadcrumbs', breadcrumbs);
    return breadcrumbs;
};

export const folders = (state, getters) => {
    const userFolders = getters.list.filter((item) => {
        return item.isFolder;
    });
    return [{ id: null, name: 'Root' }, ...userFolders];
};

export const childAssets = (state, getters) => (parentId) => {
    return getters.list.filter((item) => {
        return item.parentId === parentId;
    });
};
