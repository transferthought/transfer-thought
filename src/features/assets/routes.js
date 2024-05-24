import { requiresAuth } from '@/utils/auth';

export const MyAssets = {
    path: '/assets',
    name: 'MyAssets',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | My Assets' },
    component: () => import(/* webpackChunkName: "MyAssets" */ '@/features/assets/MyAssets.vue'),
};

export default [MyAssets];
