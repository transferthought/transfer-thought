/* eslint-disable import/prefer-default-export */
import Client from '@/tt-api';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as UUID from 'uuid/v4';

const SIZE_LIMIT = 10 * 1000 * 1000; // 10 MB
const THUMBNAIL_PLACEHOLDER = 'http://placehold.jp/200x200.png';

async function getAssetThumbnail(asset) {
    // only use asset src as thumbnail if file is image type

    if (asset && _.includes(asset.fileType, 'image')) {
        if (asset.variations && asset.variations.thumbnail) {
            console.log(asset.variations.thumbnail, Client.getAssetUrl(asset.id, asset.variations.thumbnail));
            return Client.getAssetUrl(asset.id, asset.variations.thumbnail);
        }

        const srcSize = await getSrcSize(asset.src);
        if (srcSize < SIZE_LIMIT) {
            return asset.crossOriginSrc;
        }
    }
    return THUMBNAIL_PLACEHOLDER;
}
async function getSrcSize(src) {
    const result = await fetch(src, { method: 'HEAD' });
    const fileSize = parseInt(result.headers.get('content-length'), 10);
    return fileSize;
}

export const parseSingle = async ({ state }, item) => {
    let parsedItem = { ...item };

    // add any defaults that are missing
    parsedItem = _.defaultsDeep(parsedItem, state.defaults);
    parsedItem.src = Client.getAssetUrl(parsedItem.id, parsedItem.key);
    parsedItem.variations = parsedItem.variations && _.isString(parsedItem.variations) ? JSON.parse(parsedItem.variations) : {};
    parsedItem.crossOriginSrc = `${parsedItem.src}?crossorigin`;
    parsedItem.variationUrls = {};
    _.forEach(parsedItem.variations, (value, key) => {
        console.log(key, value);
        parsedItem.variationUrls[key] = Client.getAssetUrl(parsedItem.id, value);
    });

    parsedItem.parentId = parsedItem.parentId || null;
    console.log('asset', parsedItem);
    return parsedItem;
};

export const serializeSingle = async ({ getters, state }, item) => {
    const currentItem = getters['byId'](item.id);
    let serializedItem = { ...item };

    serializedItem.name = item.name || currentItem.name;
    serializedItem.tag = item.tag || currentItem.tag;

    return serializedItem;
};

export const create = async ({ commit, dispatch, state }, newItemSeed = {}) => {
    commit('setSingleStatus', 'CREATING');
    const newItem = _.defaultsDeep(newItemSeed, state.defaults);
    const { id, key, name, fileType, tag, file, parentId } = newItem;
    const fileKey = `${id}.${key}`;

    try {
        // create an upload entry
        commit('addUploadingItem', { id, name, parentId, status: 'UPLOADING', progressPercent: 0 });
        await Client.Storage.put(fileKey, file, {
            contentType: fileType,
            progressCallback(progress) {
                // update upload entry
                commit('updateUploadingItem', { id, name, parentId, status: 'UPLOADING', progressPercent: 100 * (progress.loaded / progress.total) });
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`, progress);
            },
        });
        // remove upload entry
        const {
            data: { [state.mutations.create]: item },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations[state.mutations.create]),
            variables: {
                input: {
                    id,
                    name,
                    key,
                    tag,
                    fileType,
                    ...(parentId ? { parentId } : {}),
                    updatedAt: new Date(),
                    createdAt: new Date(),
                },
            },
        });

        const parsedSingle = await dispatch('parseSingle', item);
        commit('create', parsedSingle);
        commit('setSingleStatus', 'SUCCESS');
        // fire this event when everythingis done
        commit('updateUploadingItem', { id, name, parentId, status: 'SUCCESS' });
        return item;
    } catch (err) {
        console.error(err);
        commit('updateUploadingItem', { id, name, status: 'FAILED' });
        commit('setSingleStatus', 'FAILED');
        return null;
    }
};

export const createFolder = async ({ commit, dispatch, state }, newItemSeed = {}) => {
    commit('setSingleStatus', 'CREATING');
    const newItem = _.defaultsDeep(newItemSeed, state.defaults);
    const { id, key, name, tag, parentId } = newItem;

    try {
        const {
            data: { [state.mutations.create]: item },
        } = await Client.Api.mutate({
            mutation: gql(Client.Mutations[state.mutations.create]),
            variables: {
                input: {
                    id,
                    name,
                    key,
                    tag,
                    fileType: 'folder',
                    ...(parentId ? { parentId } : {}),
                    isFolder: true,
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
        commit('updateUploadingItem', { id, name, status: 'FAILED' });
        commit('setSingleStatus', 'FAILED');
        return null;
    }
};

export const destroyFolder = async ({ commit, dispatch, state }, payload) => {
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

export const setCurrentParentId = async ({ commit }, { id }) => {
    commit('setCurrentParentId', id);
};

// SHOULD PROBABLY RECREATE THESE
export const createAsset = async ({ commit }, payload) => {
    const { file, name, fileType, tag } = payload;
    const key = UUID();
    commit('apps/snackMessage', 'Uploading Asset...', { root: true });
    const {
        data: { createAsset: asset },
    } = await Client.Api.mutate({
        mutation: gql(Client.Mutations.createAsset),
        variables: {
            input: {
                name,
                tag,
                key,
                fileType,
            },
        },
    });
    const fileKey = `${asset.id}.${asset.key}`;
    await Client.Storage.put(fileKey, file, {
        contentType: fileType,
    });
    commit('apps/snackMessage', { message: 'Asset Uploaded!', color: 'success' }, { root: true });
    return Client.getAssetUrl(asset.id, asset.key);
};

export const createThumbnail = async ({ dispatch }, payload) => {
    const { file } = payload;
    const name = 'Thumbnail';
    const fileType = 'image/jpeg';
    const tag = 'thumbnail';
    return dispatch('createAsset', {
        name,
        fileType,
        tag,
        file,
    });
};

export const createPDF = async ({ dispatch }, payload) => {
    const { file } = payload;
    const name = 'PDF';
    const fileType = 'application/pdf';
    const tag = 'pdf';
    return dispatch('createAsset', {
        name,
        fileType,
        tag,
        file,
    });
};

export const createRealityShareRecording = async (options, payload) => {
    const { blob, key } = payload;
    const fileKey = `comed/${key}`;
    const response = await Client.Storage.put(fileKey, blob, {
        contentType: 'video/webm',
    });
    return response;
};

export const deleteAsset = async (context, payload) => {
    const { id } = payload;
    await Client.Api.mutate({
        mutation: gql(Client.Mutations.deleteAsset),
        variables: {
            input: {
                id,
            },
        },
    });
};
