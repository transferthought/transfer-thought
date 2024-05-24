import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

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
                component: () => import(/* webpackChunkName: "Admin" */ '@/views/AdminHome.vue'),
            },
            {
                path: 'edit/:appId',
                name: 'editor',
                component: () => import(/* webpackChunkName: "Admin" */ '@/features/apps/views/AdvancedEdit.vue'),
            },
            {
                path: 'app/:appId',
                name: 'adminapp',
                beforeEnter: requiresAuth,
                component: () => import(/* webpackChunkName: "Admin" */ '@/views/AdminApp.vue'),
                children: [
                    {
                        path: 'dashboard',
                        component: () => import(/* webpackChunkName: "Admin" */ '@/views/AdminDashboard.vue'),
                    },
                ],
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
        path: '/channels',
        name: 'channels',
        component: () => import(/* webpackChunkName: "channels" */ '@/views/Channels.vue'),
    },
    {
        path: '/channels/:channelId',
        name: 'channel',
        component: () => import(/* webpackChunkName: "channel" */ '@/views/Channel.vue'),
    },
    {
        path: '/site',
        name: 'site',
        component: () => import(/* webpackChunkName: "site" */ '@/views/WhiteLabel.vue'),
    },
    {
        path: '/editor',
        name: 'new',
        component: () => import(/* webpackChunkName: "Admin" */ '@/features/apps/views/AdvancedEdit.vue'),
    },
    {
        path: '/assets',
        name: 'assets',
        component: () => import(/* webpackChunkName: "site" */ '@/views/Assets.vue'),
    },
    {
        path: '/realityshare/:appId',
        name: 'take',
        component: () => import(/* webpackChunkName: "realityshare" */ '@/views/RealityShare.vue'),
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
