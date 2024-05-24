/* eslint-disable import/prefer-default-export */
import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

export const parseSingle = async ({ state }, item) => {
    let parsedItem = { ...item };
    if (_.isString(item.data)) {
        parsedItem.data = JSON.parse(item.data);
    }

    if (item.apps && item.apps.items) {
        parsedItem.apps = _(item.apps.items)
            .uniqBy('appId')
            .map((app) => {
                return {
                    ...app,
                    data: app.data ? JSON.parse(app.data) : {},
                };
            })
            .filter((app) => {
                if (app?.data?.status) {
                    return app.data.status === 'approved';
                }
                return true;
            })
            .sort((a, b) => {
                const orderA = a?.data?.order;
                const orderB = b?.data?.order;

                const hasOrderA = orderA !== undefined;
                const hasOrderB = orderB !== undefined;

                if (hasOrderA && hasOrderB) {
                    // Both items have 'order', compare them
                    return orderA - orderB;
                } else if (hasOrderA) {
                    // Only item a has 'order', so b should come after a
                    return -1;
                } else if (hasOrderB) {
                    // Only item b has 'order', so a should come after b
                    return 1;
                } else {
                    // Neither item has 'order', sort by app updated at
                    return 0;
                }
            })
            .value();
    } else {
        parsedItem.apps = [];
    }

    // add any defaults that are missing
    parsedItem = _.defaultsDeep(parsedItem, state.defaults);
    return parsedItem;
};

export const update = async ({ state, dispatch, commit, getters }, { newItem }) => {
    commit('setSingleStatus', 'UPDATING');

    const page = getters['byId'](newItem.id);
    console.log('PAGE and New Page', page, newItem);
    const title = newItem.title || page.title;
    const data = _.extend({}, page.data, newItem.data);
    const input = {
        id: page.id,
        type: 'master',
        title,
        data: JSON.stringify(data),
        updatedAt: new Date(),
    };

    const removedPageApps = _.differenceBy(page.apps, newItem.apps, 'appId');
    const addedPageApps = _.differenceBy(newItem.apps, page.apps, 'appId');
    const updatedPageApps = _.intersectionBy(page.apps, newItem.apps, 'appId');

    const deletePageAppsPromises = _.map(removedPageApps, (removedPageApp) => {
        return Client.Api.mutate({
            mutation: gql(Client.Mutations.deletePageApp),
            variables: {
                input: {
                    id: removedPageApp.id,
                },
            },
        });
    });

    const addedPageAppsPromises = _.map(addedPageApps, (addedPageApp) => {
        return Client.Api.mutate({
            mutation: gql(Client.Mutations.createPageApp),
            variables: {
                input: {
                    id: `${addedPageApp.appId}|${page.id}`,
                    appId: addedPageApp.appId,
                    pageId: page.id,
                    data: JSON.stringify({ ...addedPageApp.data, status: 'approved' }),
                },
            },
        });
    });

    // maybe add a check here if we need less api calls
    const updateAppsPromises = _.map(updatedPageApps, (existingPageApp) => {
        const newPageApp = _.find(newItem.apps, ['appId', existingPageApp.appId]);
        const newData = _.extend(existingPageApp.data, newPageApp.data);
        return Client.Api.mutate({
            mutation: gql(Client.Mutations.updatePageApp),
            variables: {
                input: {
                    id: `${existingPageApp.appId}|${page.id}`,
                    data: JSON.stringify(newData),
                },
            },
        });
    });

    await Promise.all([...deletePageAppsPromises, ...addedPageAppsPromises, ...updateAppsPromises]);
    const {
        data: { updatePage },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.updatePage),
        variables: {
            input,
        },
    });
    const parsedSingle = await dispatch('parseSingle', updatePage);
    commit('setSingle', parsedSingle);
    commit('setSingleStatus', 'SUCCESS');
};

export const clone = async ({ state, dispatch, commit, getters }, newItem) => {
    // create page
    const newPage = await dispatch('create', newItem);
    // copy apps from old page to new pages
    const pageToClone = await dispatch('fetchById', { id: newItem.id, type: newItem.type });
    const addedPageAppsPromises = _.map(pageToClone.apps, (addedPageApp) => {
        Client.Api.mutate({
            mutation: gql(Client.Mutations.createPageApp),
            variables: {
                input: {
                    id: `${addedPageApp.appId}|${newPage.id}`,
                    appId: addedPageApp.appId,
                    pageId: newPage.id,
                    data: JSON.stringify({ status: 'approved' }),
                },
            },
        });
    });

    await Promise.all(addedPageAppsPromises);

    return newPage;
};
