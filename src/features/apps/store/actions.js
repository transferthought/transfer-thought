/* eslint-disable import/prefer-default-export */
import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

import Core from '@/tt-core';
import posthog from 'posthog-js';

import runMigrations from './migrations';

export const fetchApp = async ({ commit, dispatch, rootGetters, rootState }, payload) => {
    const { appId, type } = payload;

    commit('fetching', true);
    const {
        data: { getApp: app },
    } = await Client.Api.query({
        query: gql(Client.Queries.getApp),
        variables: { appId, type },
        fetchPolicy: 'no-cache',
    });

    commit('fetching', false);

    if (_.isString(app.config)) {
        app.config = JSON.parse(app.config);
    }
    if (_.isString(app.actions)) {
        app.actions = JSON.parse(app.actions);
    }
    if (_.isString(app.state)) {
        app.state = JSON.parse(app.state);
    }

    runMigrations(app);
    commit('state/init', app.state);
    commit('config/init', app.config);
    commit('actions/init', app.actions);
    commit('queryParams/init');
    commit('init', app);
    commit('setSingle', app);

    // TODO: right now only published apps should have sessions
    if (type === 'published') {
        try {
            const {
                data: { getUser: appOwnerData },
            } = await Client.Api.query({
                query: gql(Client.Queries.getUser),
                variables: { id: app.owner },
                fetchPolicy: 'no-cache',
            });
            commit('appOwnerData', appOwnerData);

            if (rootState.user.user) {
                await dispatch('sessions/fetchCurrentUserSessionByAppId', { appId }, { root: true });

                const { sessionDataFields } = app.state;
                const sessionId = rootGetters['sessions/getCurrentSessionIdForUser']();
                const session = rootState.sessions.byId[sessionId];
                _.forEach(sessionDataFields, (field) => {
                    const value = _.get(session.data, field.id);
                    dispatch('state/update', { selector: field.mapping, value });
                });
            }
        } catch (err) {
            console.error('Failed to fetch app owner data');
        }
    }
};

export const initApp = async ({ commit, dispatch, rootGetters, rootState }, payload) => {
    const { app } = payload;
    runMigrations(app);
    commit('state/init', app.state);
    commit('config/init', app.config);
    commit('actions/init', app.actions);
    commit('queryParams/init');
    commit('init', app);
};

export const createApp = async (context, payload) => {
    const { name, config, actions, state, thumbnailUrl } = payload;
    const {
        data: { createApp: app },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createApp),
        variables: {
            input: {
                appId: UUID(),
                name,
                type: 'master',
                thumbnailUrl,
                config: config || JSON.stringify(await Core.getDefaultConfig()),
                actions,
                state,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        },
    });
    posthog.capture('app.created', { id: app.appId, name: app.name });

    return app;
};

export const cloneApp = async (context, payload) => {
    const { appId, appendToName } = payload;
    const {
        data: { getApp: appToClone },
    } = await Client.Api.query({
        query: gql(Client.Queries.getApp),
        variables: { appId, type: 'master' },
    });

    if (appToClone) {
        const {
            data: { createApp: app },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations.createApp),
            variables: {
                input: {
                    appId: UUID(),
                    name: appendToName ? `${appToClone.name} ${appendToName}` : appToClone.name,
                    type: 'master',
                    config: appToClone.config,
                    actions: appToClone.actions,
                    state: appToClone.state,
                    thumbnailUrl: appToClone.thumbnailUrl,
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
            },
        });
        return app;
    }

    return null;
};

// generic helper
export const remix = async ({ dispatch }, { id, appendToName }) => {
    return await dispatch('cloneApp', { appId: id, appendToName });
};

export const incrementAppViews = async ({ state, commit }) => {
    if (state.unlimted || state.lifeTimeUnlimited) {
        return;
    }
    if (state.ownerData && (state.ownerData.unlimted || state.ownerData.lifeTimeUnlimited)) {
        return;
    }
    commit('incrementAppViews');

    await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateApp),
        variables: {
            input: {
                appId: state.appId,
                type: 'published',
                currentMonthViews: state.currentMonthViews,
                totalViews: state.totalViews,
            },
        },
    });

    await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateUser),
        variables: {
            input: {
                id: state.owner,
                currentMonthViews: state.ownerData.currentMonthViews,
                totalViews: state.ownerData.totalViews,
            },
        },
    });
    posthog.capture('app.viewed', { id: state.appId, name: state.name });
};

export const updateApp = async ({ state }, payload) => {
    const { type, thumbnailUrl } = payload;

    await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateApp),
        variables: {
            input: {
                appId: state.appId,
                name: state.name,
                type,
                thumbnailUrl,
                config: JSON.stringify(state.config.config),
                actions: JSON.stringify(state.actions.actions),
                state: JSON.stringify(state.state.state),
                updatedAt: new Date(),
            },
        },
    });
};

export const deleteApp = async (context, payload) => {
    const { appId, type } = payload;
    await Client.Api.mutate({
        mutation: gql(Client.Mutations.deleteApp),
        variables: {
            input: {
                appId,
                type,
            },
        },
    });
};

export const publishApp = async ({ commit, state }) => {
    // check if published app exists alreadt
    commit('publishing', true);
    const {
        data: { getApp: app },
    } = await Client.Api.query({
        query: gql(Client.Queries.getApp),
        variables: { appId: state.appId, type: 'published' },
        fetchPolicy: 'no-cache',
    });
    const input = {
        appId: state.appId,
        type: 'published',
        name: state.name,
        thumbnailUrl: state.thumbnailUrl,
        config: JSON.stringify(state.config.config),
        actions: JSON.stringify(state.actions.actions),
        state: JSON.stringify(state.state.state),
        updatedAt: new Date(),
    };
    if (app) {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations.updateApp),
            variables: {
                input,
            },
        });
        commit('publishing', false);
    } else {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations.createApp),
            variables: {
                input: {
                    ...input,
                    updatedAt: new Date(),
                },
            },
        });
        commit('publishing', false);
    }

    try {
        const publicPageId = '4a50a5c7-8963-4bd7-9304-1a17b162128c';
        const {
            data: { getPageApp: pageApp },
        } = await Client.Api.query({
            query: gql(Client.Queries.getPageApp),
            variables: { id: `${input.appId}|${publicPageId}` },
            fetchPolicy: 'no-cache',
        });

        if (!pageApp) {
            Client.Api.mutate({
                mutation: gql(Client.Mutations.createPageApp),
                variables: {
                    input: {
                        id: `${input.appId}|${publicPageId}`,
                        appId: input.appId,
                        pageId: publicPageId,
                        data: JSON.stringify({ status: 'pending' }),
                    },
                },
            });
        }
    } catch (err) {
        console.log(err);
    }
};

export const publishPageApp = async (context, { pageId, appId, data = {} }) => {
    // move this to pages?
    try {
        const {
            data: { getPageApp: pageApp },
        } = await Client.Api.query({
            query: gql(Client.Queries.getPageApp),
            variables: { id: `${appId}|${pageId}` },
            fetchPolicy: 'no-cache',
        });

        if (!pageApp) {
            await Client.Api.mutate({
                mutation: gql(Client.Mutations.createPageApp),
                variables: {
                    input: {
                        id: `${appId}|${pageId}`,
                        appId,
                        pageId,
                        data: JSON.stringify(data),
                    },
                },
            });
        }
    } catch (err) {
        console.log(err);
    }
};
export const removePageApp = async (context, { pageId, appId }) => {
    // move this to pages?
    try {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations.deletePageApp),
            variables: {
                input: {
                    id: `${appId}|${pageId}`,
                },
            },
        });
    } catch (err) {
        console.log(err);
    }
};

export const createThumbnailUrl = async (context, blob) => {
    try {
        const key = UUID();
        const name = 'Thumbnail';
        const fileType = 'image/jpeg';
        const {
            data: { createAsset: asset },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations.createAsset),
            variables: {
                input: {
                    name,
                    tag: 'thumbnail',
                    key,
                    fileType,
                },
            },
        });
        const fileKey = `${asset.id}.${asset.key}`;
        await Client.Storage.put(fileKey, blob, {
            contentType: fileType,
        });
        return Client.getAssetUrl(asset.id, asset.key);
    } catch (err) {
        Client.Logger.error(err);
        throw err;
    }
};

export const createPrefab = async (context, payload) => {
    const { name, config, actions, state } = payload;

    const {
        data: { createApp: app },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createApp),
        variables: {
            input: {
                appId: UUID(),
                name,
                type: 'prefab',
                config,
                actions,
                state,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        },
    });

    return app;
};

export const updateName = async ({ commit }, newName) => {
    commit('updateName', newName);
};

export const updateRedirectData = ({ commit, getters }, redirectData) => {
    const oldRedirectData = getters['redirectData'];
    if (oldRedirectData && redirectData) {
        const newPath = window.location.pathname.replace(`/${oldRedirectData.destination}`, `/${redirectData.destination}`);
        window.history.pushState({}, '', newPath);
    } else if (redirectData) {
        const resourcePath = getters['resourcePath'];
        const newPath = window.location.pathname.replace(`${resourcePath}`, `/${redirectData.destination}`);
        window.history.pushState({}, '', newPath);
    } else if (oldRedirectData) {
        const resourcePath = getters['resourcePath'];
        const newPath = window.location.pathname.replace(`/${oldRedirectData.destination}`, `${resourcePath}`);
        window.history.pushState({}, '', newPath);
    }
    commit('setRedirectData', redirectData);
};
