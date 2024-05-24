import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import appRoutes from '@/features/apps/routes';
import pageRoutes from '@/features/pages/routes';
import assetRoutes from '@/features/assets/routes';
import checkoutRoutes from '@/features/checkout/routes';

import { requiresAuth, checkAuth } from '@/utils/auth';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'AdminHome',
        beforeEnter: requiresAuth,
        meta: { title: 'Transfer Thought | App List' },
        component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/List.vue'),
    },
    ...appRoutes,
    ...pageRoutes,
    ...assetRoutes,
    ...checkoutRoutes,
    // RESOURCE GENERL
    {
        path: '/:resourceType/:resourceId/remix',
        name: 'Remix',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "remix" */ '@/views/Remix.vue'),
    },
    // OLD APP ROUTES
    {
        path: '/edit/:appId',
        name: 'AppEditorOld',
        beforeEnter: requiresAuth,
        meta: { title: 'Transfer Thought | Editing App' },
        component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/Edit.vue'),
    },
    {
        path: '/edit/:appId/advanced',
        name: 'EditorAdvanced',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/AdvancedEdit.vue'),
    },
    {
        path: '/take/:appId',
        name: 'take',
        component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/View.vue'),
    },
    {
        path: '/json-tester',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "JSONTester" */ '@/views/JSONTester.vue'),
    },
    // OTHER Routes
    {
        path: '/take/:appId/network',
        name: 'networkedtake',
        component: () => import(/* webpackChunkName: "AppsList" */ '@/features/apps/views/View.vue'),
    },

    {
        path: '/networkedtake/:appId',
        name: 'networkedtake',
        component: () => import(/* webpackChunkName: "networkedtake" */ '@/views/NetworkedTake.vue'),
    },
    {
        path: '/account',
        name: 'Account',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "Account" */ '@/views/Account.vue'),
    },
    {
        path: '/auth',
        name: 'auth',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth.vue'),
    },
    {
        path: '/signup',
        name: 'signup',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "signup" */ '@/views/SignUp.vue'),
    },
    {
        path: '/signin',
        name: 'signin',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "signin" */ '@/views/SignIn.vue'),
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "signin" */ '@/views/ResetPassword.vue'),
    },
    {
        path: '/set-password',
        name: 'set-password',
        beforeEnter: checkAuth,
        component: () => import(/* webpackChunkName: "signin" */ '@/views/SetPassword.vue'),
    },
    {
        path: '/go',
        name: 'go',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "go" */ '@/views/Go.vue'),
    },
    {
        path: '/assets',
        name: 'assets',
        beforeEnter: requiresAuth,
        component: () => import(/* webpackChunkName: "site" */ '@/views/Assets.vue'),
    },
    {
        path: '/fire-triangle',
        name: 'fire-triangle',
        component: () => import(/* webpackChunkName: "embed" */ '@/views/FireTriangle.vue'),
    },
    {
        path: '/imagine',
        name: 'imagine',
        component: () => import(/* webpackChunkName: "embed" */ '@/views/Imagine.vue'),
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "embed" */ '@/views/NotFound.vue'),
    },
    {
        path: '/:destination',
        component: () => import(/* webpackChunkName: "FriendlyURL" */ '@/views/FriendlyURL.vue'),
    },
    {
        path: '/:destination/edit',
        component: () => import(/* webpackChunkName: "FriendlyURL" */ '@/views/FriendlyURL.vue'),
    },
    {
        path: '/:destination/edit/advanced',
        component: () => import(/* webpackChunkName: "FriendlyURL" */ '@/views/FriendlyURL.vue'),
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
const DEFAULT_TITLE = 'Transfer Thought';

router.afterEach((to, from) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
    if (to.meta.redirectable) {
        const source = to.path
            .split('/')
            .splice(0, 3) // take the first 3 elements: ['', resourceType, resourceId]
            .join('/');
        store.dispatch('redirect/fetchRedirectData', { source });
    }
});

export default router;
