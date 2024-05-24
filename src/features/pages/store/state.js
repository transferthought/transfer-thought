export default {
    idAttribute: 'id',
    sortKeyAttribute: 'type',
    queries: {
        list: 'ownerPagesByUpdatedAt',
        single: 'getPage',
        filter: { type: { eq: 'master' } },
    },
    mutations: {
        create: 'createPage',
        update: 'updatePage',
        delete: 'deletePage',
    },
    defaults: {
        title: 'Untitled',
        data: {
            type: 'basic',
            description: 'New Page Description...',
            logoSrc: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/tt-logo.png',
            primaryColor: 'blue',
            coverSrc: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
            coverYOffset: 50,
            appListTitle: 'Course List',
        },
        apps: [],
    },
};
