import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

// QUERIES
export const fetchSessionsForAppId = async ({ commit, rootState }, payload) => {
    const { appId } = payload;
    const {
        data: { sessionsByAppId },
    } = await Client.Api.query({
        query: gql(Client.Queries.sessionsByAppId),
        variables: { appId },
        fetchPolicy: 'no-cache',
    });
    const sessions = sessionsByAppId.items;
    commit('resetSessions', sessions);
    return sessions;
};
export const fetchUserSessionsForAppId = async ({ commit, rootState }, payload) => {
    const { appId } = payload;
    if (rootState.user.user && rootState.user.user.username) {
        const {
            data: { userSessionsByAppId },
        } = await Client.Api.query({
            query: gql(Client.Queries.userSessionsByAppId),
            variables: { owner: rootState.user.user.username, appId: { eq: appId } },
            fetchPolicy: 'no-cache',
        });
        const sessions = userSessionsByAppId.items;
        commit('resetSessions', sessions);
    }
};

export const fetchCurrentUserSessionByAppId = async ({ dispatch, getters }, payload) => {
    const { appId } = payload;
    await dispatch('fetchUserSessionsForAppId', { appId });
    const currentSessionId = getters.getCurrentSessionIdForUser();
    if (!currentSessionId) {
        await dispatch('createSession', { appId });
    }
};

export const createSession = async ({ commit }, payload) => {
    const { appId, data = {} } = payload;
    const {
        data: { createSession: session },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createSession),
        variables: {
            input: {
                id: UUID(),
                data: JSON.stringify(data),
                appId,
                updatedAt: new Date(),
                createdAt: new Date(),
                completedAt: null,
            },
        },
    });

    commit('addSession', session);
    return session;
};

export const updateSessionData = async ({ state, commit, rootState }, payload) => {
    const { sessionId } = payload;
    const currentSession = state.byId[sessionId];
    const appState = rootState.apps.state.state;
    const { sessionDataFields } = appState;
    _.forEach(sessionDataFields, (field) => {
        const value = _.get(appState, field.mapping);
        currentSession.data[field.id] = value;
    });
    const {
        data: { updateSession: session },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateSession),
        variables: {
            input: {
                id: sessionId,
                data: JSON.stringify(currentSession.data),
                updatedAt: new Date(),
            },
        },
    });

    commit('updateSession', session);
};

export const submitSession = async ({ commit }, payload) => {
    const { sessionId } = payload;
    const {
        data: { updateSession: session },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateSession),
        variables: {
            input: {
                id: sessionId,
                completedAt: new Date(),
            },
        },
    });

    commit('updateSession', session);
};
