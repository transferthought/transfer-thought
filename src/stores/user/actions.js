import Client from '@/tt-api';
import gql from 'graphql-tag';
import posthog from 'posthog-js';

const { Auth, Logger } = Client;

export const initialize = async ({ commit, dispatch }) => {
    try {
        const authUser = await Auth.currentAuthenticatedUser();
        const userData = await dispatch('getUserData', { authUser });
        commit('setUser', { authUser, userData });
        posthog.identify(authUser.attributes.email, { email: authUser.attributes.email });
        posthog.capture('user.signin');
        // eslint-disable-next-line no-undef
        // FreshworksWidget('identify', 'ticketForm', { email: authUser.attributes.email });
    } catch (err) {
        Logger.error(err);
    }
};

export const getUserData = async ({ dispatch }, payload) => {
    const { authUser } = payload;
    try {
        const {
            data: { getUser: userData },
        } = await Client.Api.query({
            query: gql(Client.Queries.getUser),
            variables: { id: authUser.username },
            fetchPolicy: 'no-cache',
        });

        if (userData) {
            return userData;
        }

        return await dispatch('createDefaultUser', payload);
    } catch (err) {
        Logger.error(err);
    }
    return {};
};

export const createDefaultUser = async ({ dispatch }, payload) => {
    const { authUser } = payload;
    const {
        data: { createUser: newUserData },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createUser),
        variables: {
            input: {
                id: authUser.username,
                plan: 'pilot',
                autoShowTour: true,
                currentMonthViews: 0,
                totalViews: 0,
                totalAllottedViews: 10,
                unlimted: false,
                unlimtedLifetime: false,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        },
    });
    posthog.capture('user.created');
    // await dispatch('createDefaultApps');

    return newUserData;
};

export const createDefaultApps = async ({ dispatch }) => {
    // Fire Safety
    await dispatch('apps/cloneApp', { appId: 'b88151e2-98af-44dd-966e-71602bb4be8f' }, { root: true });
    // Table Saw
    await dispatch('apps/cloneApp', { appId: '2684be4b-40ad-4eb5-9cf7-6e2766b75e85' }, { root: true });
    // Fork Lift
    await dispatch('apps/cloneApp', { appId: '49e31bc0-502c-40ba-aeee-328d55e5c938' }, { root: true });
    // Loader
    await dispatch('apps/cloneApp', { appId: '8e727173-3197-43b1-9264-33bc8fd15761' }, { root: true });
};

export const updateUserPlan = async ({ commit, state }, payload) => {
    const { plan } = payload;
    try {
        const {
            data: { updateUser: userData },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations.updateUser),
            variables: {
                input: {
                    id: state.user.username,
                    plan,
                    updatedAt: new Date(),
                },
            },
        });
        commit('updateUserPlan', userData.plan);
    } catch (err) {
        Logger.error(err);
    }
};
export const updateUserData = async ({ commit, state }, payload) => {
    const { key, value } = payload;
    try {
        const {
            data: { updateUser: userData },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations.updateUser),
            variables: {
                input: {
                    id: state.user.username,
                    [key]: value,
                    updatedAt: new Date(),
                },
            },
        });
        commit('updateUserData', { key, value });
    } catch (err) {
        Logger.error(err);
    }
};

export const signOut = async ({ commit }) => {
    await Auth.signOut();
    posthog.reset();
    commit('setUser', { authUser: null });
};
