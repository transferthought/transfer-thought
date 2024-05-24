import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

import { requiresAuth, checkAuth } from '@/utils/auth';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "Admin" */ '@/views/AdminContainer.vue'),
        children: [
            {
                path: '',
                name: 'adminhome',
                component: () => import(/* webpackChunkName: "Admin" */ '@/views/360AdminHome.vue'),
            },
            {
                path: 'edit/:appId',
                name: 'editor',
                component: () => import(/* webpackChunkName: "Admin" */ '@/views/360EditorLev.vue'),
            },
        ],
    },
    {
        path: '/embed/:appId',
        name: 'embed',
        component: () => import(/* webpackChunkName: "embed" */ '@/views/Run.vue'),
    },
    {
        path: '/auth',
        name: 'auth',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth.vue'),
    },
    {
        path: '/assets',
        name: 'assets',
        component: () => import(/* webpackChunkName: "site" */ '@/views/Assets.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach(async (to, from, next) => {
    await store.dispatch('user/initialize');
    next();
});

export default router;
