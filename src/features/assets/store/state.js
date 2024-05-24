export default {
    // resource data
    idAttribute: 'id',
    queries: {
        list: 'ownerAssetsByUpdatedAt',
        single: 'getAsset',
        filter: { tag: { eq: 'unknown' } },
    },
    mutations: {
        create: 'createAsset',
        update: 'updateAsset',
        delete: 'deleteAsset',
    },
    subscriptions: {
        onUpdate: 'onUpdateAsset',
    },
    defaults: {
        name: 'New Asset',
        tag: 'unknown',
        fileType: '',
        key: '',
    },
    // other data
    uploading: [],
    currentParentId: null,
};
