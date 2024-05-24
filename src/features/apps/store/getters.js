/* eslint-disable import/prefer-default-export */
// pulls hydrated step list from app.state.steps
export const getSteps = () => {};

export const title = (state) => () => {
    return state.name;
};

export const id = (state) => state.appId;

export const metadata = () => {
    return {
        idKey: 'appId',
        editorRouteName: 'AppEditor',
        resourcePathRoot: '/apps',
    };
};

// TODO: when pulling out resources, convert this to be states rather than boolean
export const publishStatus = (state) => {
    if (state.publishing) {
        return 'PUBLISHING';
    }
    return 'IDLE';
};

// export const editUrl = (state) => {
//     const currentUrl = new URL(window.location);

//     if (state.redirectData) {
//         return `${currentUrl.origin}/edit/${state.redirectData.destination}`;
//     }
//     return `${currentUrl.origin}/edit/${state.appId}`;
// };

// export const publishedUrl = (state) => {
//     const currentUrl = new URL(window.location);

//     if (state.redirectData) {
//         return `${currentUrl.origin}/take/${state.redirectData.destination}`;
//     }
//     return `${currentUrl.origin}/take/${state.appId}`;
// };

export const editUrl = (state) => {
    const currentUrl = new URL(window.location);
    const redirectData = rootGetters['redirect/redirectData'];

    if (redirectData) {
        return `${currentUrl.origin}/${redirectData.destination}/edit`;
    }
    return `${currentUrl.origin}/apps/${state.appId}/edit`;
};

export const publishedUrl = (state, getters, rootState, rootGetters) => () => {
    const currentUrl = new URL(window.location);
    const redirectData = rootGetters['redirect/redirectData'];

    if (redirectData) {
        return `${currentUrl.origin}/${redirectData.destination}`;
    }
    return `${currentUrl.origin}/apps/${state.appId}`;
};

export const appList = (state) => state.appsList;
export const appListStatus = (state) => state.appsListStatus;
