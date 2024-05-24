import Vue from 'vue';
import VueRouter from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import StudioNavBar from '@/components/StudioNavBar.vue';
import store from './store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Inveo',
        components: {
            // NavBar,
            default: () => import(/* webpackChunkName: "about" */ '@/views/Inveo.vue'),
        },
    },
    {
        path: '/home',
        name: 'Home',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
        },
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: () => import(/* webpackChunkName: "signin" */ '@/views/Auth/SignIn.vue'),
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import(/* webpackChunkName: "signup" */ '@/views/Auth/SignUp.vue'),
    },
    {
        path: '/trending',
        name: 'Trending',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "trending" */ '@/views/Trending.vue'),
        },
    },
    {
        path: '/studio',
        components: {
            StudioNavBar,
            default: () => import(/* webpackChunkName: "dashboard" */ '@/views/Studio/Index.vue'),
        },
        children: [
            {
                path: '/',
                name: 'Dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Studio/Dashboard.vue'),
            },
            {
                path: 'videos',
                name: 'Video',
                component: () => import(/* webpackChunkName: "video" */ '@/views/Studio/Video.vue'),
            },
            {
                path: 'details/:id',
                name: 'Detail',
                component: () => import(/* webpackChunkName: "video" */ '@/views/Studio/Details.vue'),
            },
        ],
    },
    {
        path: '/channels/:id',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "dashboard" */ '@/views/Channel/Index.vue'),
        },
        children: [
            {
                path: '/',
                name: 'ChannelHome',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Channel/Home.vue'),
            },
        ],
    },
    {
        path: '/watch/:title',
        name: 'Watch',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "video" */ '@/views/Watch.vue'),
        },
    },
    {
        path: '/generate/:title',
        name: 'Generate',
        components: {
            default: () => import(/* webpackChunkName: "video" */ '@/views/Generate.vue'),
        },
    },
    {
        path: '/history',
        name: 'History',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "video" */ '@/views/History.vue'),
        },
    },
    {
        path: '/search',
        name: 'Search',
        components: {
            NavBar,
            default: () => import(/* webpackChunkName: "video" */ '@/views/Search.vue'),
        },
    },
    {
        path: '/embed/:appId',
        name: 'embed',
        component: () => import(/* webpackChunkName: "embed" */ '@/views/TwinLabEmbed.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {
    await store.dispatch('user/initialize');
    next();
});

export default router;
