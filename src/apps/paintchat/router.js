import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'PaintChatHome',
        component: () => import(/* webpackChunkName: "paintchat" */ '@/views/PaintChatHome.vue'),
    },
    {
        path: '/:roomId',
        name: 'PaintChat',
        component: () => import(/* webpackChunkName: "paintchat" */ '@/views/PaintChat.vue'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
