import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'VideoConferenceHome',
        component: () => import(/* webpackChunkName: "timebox" */ '@/views/VideoConferenceHome.vue'),
    },
    {
        path: '/:roomId',
        name: 'VideoConference',
        component: () => import(/* webpackChunkName: "timebox" */ '@/views/VideoConference.vue'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
