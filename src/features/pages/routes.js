import { requiresAuth } from '@/utils/auth';

export const List = {
    path: '/pages',
    name: 'PagesList',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Page List' },
    component: () => import(/* webpackChunkName: "PagesList" */ '@/features/pages/views/List.vue'),
};

export const View = {
    path: '/pages/:pageId',
    name: 'PageViewer',
    meta: { title: 'Transfer Thought | Page', redirectable: true },
    component: () => import(/* webpackChunkName: "PagesHome" */ '@/features/pages/views/View.vue'),
};

export const Edit = {
    path: '/pages/:pageId/edit',
    name: 'PageEditor',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Editing Page', redirectable: true },
    component: () => import(/* webpackChunkName: "PagesHome" */ '@/features/pages/views/Edit.vue'),
};

export default [List, View, Edit];
