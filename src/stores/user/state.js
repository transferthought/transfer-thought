export default () => ({
    user: null,
    data: {},
    permissions: {
        pilot: [],
        pro: ['apps.canRemoveRemix', 'apps.canSetPrivate'],
        enterprise: ['apps.canRemoveRemix', 'apps.canSetPrivate'],
    },
});
