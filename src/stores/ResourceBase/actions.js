/* eslint-disable import/prefer-default-export */
import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

export const parseList = async ({ dispatch }, list) => {
    const parsedList = _(list)
        .orderBy('updatedAt', 'desc')
        .map(async (item) => {
            return await dispatch('parseSingle', item);
        })
        .value();
    return await Promise.all(parsedList);
};

export const parseSingle = async ({ state }, item) => {
    let parsedItem = { ...item };
    if (_.isString(item.data)) {
        parsedItem.data = JSON.parse(item.data);
    }
    // add any defaults that are missing
    parsedItem = _.defaultsDeep(parsedItem, state.defaults);
    return parsedItem;
};

export const serializeSingle = async ({ getters, state }, item) => {
    const currentItem = getters['byId'](item.id);
    let serializedItem = { ...item };

    serializedItem.title = item.title || currentItem.title;

    if (_.isObject(item.data)) {
        const data = _.extend({}, currentItem.data, item.data);
        serializedItem.data = JSON.stringify(data);
    }
    return serializedItem;
};

export const init = async ({ state, commit, dispatch, rootState }) => {
    try {
        if (state?.subscriptions && state.subscriptionStatus !== 'SUCCESS') {
            const observable = Client.Api.subscribe({
                query: gql(Client.Subscriptions[state.subscriptions.onUpdate]),
                variables: {
                    owner: rootState.user.user.username,
                },
            });

            observable.subscribe({
                next: async ({ data }) => {
                    const { [state.subscriptions.onUpdate]: item } = data;
                    const parsedSingle = await dispatch('parseSingle', item);
                    commit('setSingle', parsedSingle);
                },
                complete: console.log,
                error: console.log,
            });
            commit('setSubscriptionStatus', 'SUCCESS');
        }
    } catch (err) {
        console.error(err);
    }
};

export const fetchList = async ({ state, commit, dispatch, rootState }) => {
    if (state.listStatus === 'IDLE' || state.listStatus === 'FAILED') {
        commit('setListStatus', 'LOADING');
        try {
            const completeList = [];
            async function fetchNext(nextToken = null) {
                const {
                    data: { [state.queries.list]: result },
                } = await Client.Api.query({
                    query: gql(Client.Queries[state.queries.list]),
                    variables: {
                        nextToken,
                        owner: rootState.user.user.username,
                        sortDirection: 'DESC',
                        ...(state.queries.filter ? { filter: state.queries.filter } : {}),
                    },
                    fetchPolicy: 'no-cache',
                });

                const parsedList = await dispatch('parseList', result?.items || []);
                completeList.push(...parsedList);
                commit('setList', completeList);
                if (result.nextToken && completeList.length < 250) {
                    await fetchNext(result.nextToken);
                }
            }
            await fetchNext();

            commit('setListStatus', 'SUCCESS');
        } catch (err) {
            console.error(err);
            commit('setListStatus', 'FAILED');
        }
    } else {
        console.log('Cache Hit - ', state.queries.list);
    }
};

export const fetchById = async ({ state, dispatch, commit, getters }, { id, type }) => {
    commit('setSingleStatus', 'LOADING');
    try {
        const {
            data: { [state.queries.single]: item },
        } = await Client.Api.query({
            query: gql(Client.Queries[state.queries.single]),
            variables: { [state.idAttribute]: id, type },
            fetchPolicy: 'no-cache',
        });
        if (item) {
            const parsedSingle = await dispatch('parseSingle', item);
            commit('setSingle', parsedSingle);
            commit('setSingleStatus', 'SUCCESS');
            return parsedSingle;
        } else {
            commit('setSingleStatus', 'FAILED');
            throw err;
        }
    } catch (err) {
        commit('setSingleStatus', 'FAILED');
        throw err;
    }
};

export const create = async ({ commit, dispatch, state }, newItemSeed = {}) => {
    try {
        commit('setSingleStatus', 'CREATING');
        const newItem = _.defaultsDeep(newItemSeed, state.defaults);
        const { title, data } = newItem;

        const {
            data: { [state.mutations.create]: item },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations[state.mutations.create]),
            variables: {
                input: {
                    id: UUID(),
                    title,
                    type: 'master',
                    data: JSON.stringify(data),
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
            },
        });

        const parsedSingle = await dispatch('parseSingle', item);
        commit('create', parsedSingle);
        commit('setSingleStatus', 'SUCCESS');
        return item;
    } catch (err) {
        console.error(err);
        commit('setSingleStatus', 'FAILED');
        return null;
    }
};

export const update = async ({ state, dispatch, commit, getters }, { newItem }) => {
    commit('setSingleStatus', 'UPDATING');
    const serializeSingle = await dispatch('serializeSingle', newItem);
    const input = {
        ...serializeSingle,
        updatedAt: new Date(),
    };

    const {
        data: { [state.mutations.update]: updatedItem },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations[state.mutations.update]),
        variables: {
            input,
        },
    });

    const parsedSingle = await dispatch('parseSingle', updatedItem);
    commit('setSingle', parsedSingle);
    commit('setSingleStatus', 'SUCCESS');
};

export const publish = async ({ state, commit, getters }, { id }) => {
    commit('setSingleStatus', 'PUBLISHING');
    const item = getters['byId'](id);

    const input = {
        [state.idAttribute]: item[state.idAttribute],
        ...(state.sortKeyAttribute ? { [state.sortKeyAttribute]: item[state.sortKeyAttribute] } : {}),
        title: item.title,
        data: JSON.stringify(item.data),
        type: 'published',
        updatedAt: new Date(),
    };

    const {
        data: { [state.queries.single]: foundItem },
    } = await Client.Api.query({
        query: gql(Client.Queries[state.queries.single]),
        variables: { id: item.id, type: 'published' },
    });

    if (foundItem) {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations[state.mutations.update]),
            variables: {
                input,
            },
        });
    } else {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations[state.mutations.create]),
            variables: {
                input: {
                    ...input,
                    createdAt: new Date(),
                },
            },
        });
    }

    commit('setSingleStatus', 'SUCCESS');
};

export const destroy = async ({ state, commit }, payload) => {
    commit('setSingleStatus', 'DELETING');
    await Client.Api.mutate({
        mutation: gql(Client.Mutations[state.mutations.delete]),
        variables: {
            input: {
                [state.idAttribute]: payload[state.idAttribute],
                ...(state.sortKeyAttribute ? { [state.sortKeyAttribute]: payload[state.sortKeyAttribute] } : {}),
            },
        },
    });
    commit('destroy', payload[state.idAttribute]);
    commit('setSingleStatus', 'SUCCESS');
};
