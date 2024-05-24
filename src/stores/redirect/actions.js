import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';

export const fetchRedirectData = async ({ state, dispatch, getters, rootState }, { source }) => {
    // check for redirect based on source
    const {
        data: { getRedirect: redirectData },
    } = await Client.Api.query({
        query: gql(Client.Queries.getRedirect),
        variables: { source },
        fetchPolicy: 'no-cache',
    });

    dispatch('setRedirectData', { redirectData });
};

export const createRedirect = async ({ state, dispatch, getters, rootState }, payload) => {
    const { source, destination } = payload;
    const {
        data: { createRedirect: redirectData },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createRedirect),
        variables: {
            input: {
                source,
                destination,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        },
    });
    dispatch(`setRedirectData`, { redirectData });
    return redirectData;
};

export const updateRedirect = async ({ state, dispatch, getters, rootState }, payload) => {
    const { source, destination, resourceType } = payload;
    const {
        data: { updateRedirect: redirectData },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.updateRedirect),
        variables: {
            input: {
                source,
                destination,
                updatedAt: new Date(),
            },
        },
    });
    dispatch(`setRedirectData`, { redirectData });
};

export const deleteRedirect = async ({ state, dispatch, getters, rootState }, payload) => {
    const { source, resourceType } = payload;
    await Client.Api.mutate({
        mutation: gql(Client.Mutations.deleteRedirect),
        variables: {
            input: {
                source,
            },
        },
    });
    dispatch(`setRedirectData`, { redirectData: null });
};

export const setRedirectData = ({ commit, getters }, { redirectData }) => {
    const oldRedirectData = getters['redirectData'];
    if (oldRedirectData && redirectData) {
        const newPath = window.location.pathname.replace(`/${oldRedirectData.destination}`, `/${redirectData.destination}`);
        window.history.pushState({}, '', newPath);
    } else if (redirectData) {
        const newPath = window.location.pathname.replace(`${redirectData.source}`, `/${redirectData.destination}`);
        window.history.pushState({}, '', newPath);
    } else if (oldRedirectData) {
        const newPath = window.location.pathname.replace(`/${oldRedirectData.destination}`, `${oldRedirectData.source}`);
        window.history.pushState({}, '', newPath);
    }
    commit('setRedirectData', redirectData);
};
