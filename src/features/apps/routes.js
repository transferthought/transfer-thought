import { requiresAuth } from '@/utils/auth';

export const List = {
    path: '/apps',
    name: 'AppsList',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | App List' },
    component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/List.vue'),
};

export const View = {
    path: '/apps/:appId',
    name: 'AppViewer',
    meta: { title: 'Transfer Thought | Page', redirectable: true },
    component: () => import(/* webpackChunkName: "AppViewer" */ '@/features/apps/views/View.vue'),
};

export const Edit = {
    path: '/apps/:appId/edit',
    name: 'AppEditor',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Editing App', redirectable: true },
    component: () => import(/* webpackChunkName: "AppEditor" */ '@/features/apps/views/Edit.vue'),
};

export const Advanced = {
    path: '/apps/:appId/edit/advanced',
    name: 'AppEditorAdvanced',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Editing App', redirectable: true },
    component: () => import(/* webpackChunkName: "AppEditor" */ '@/features/apps/views/AdvancedEdit.vue'),
};

export default [List, View, Edit, Advanced];
