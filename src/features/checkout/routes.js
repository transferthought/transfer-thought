import { requiresAuth } from '@/utils/auth';

export const Checkout = {
    path: '/checkout',
    name: 'Checkout',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Checkout' },
    component: () => import(/* webpackChunkName: "Checkout" */ '@/features/checkout/views/Checkout.vue'),
};

export const Success = {
    path: '/checkout/success',
    name: 'CheckoutSuccess',
    meta: { title: 'Transfer Thought | Checkout Success', redirectable: true },
    component: () => import(/* webpackChunkName: "Checkout" */ '@/features/checkout/views/Success.vue'),
};

export const Cancel = {
    path: '/checkout/cancel',
    name: 'CheckoutCancel',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | Checkout Cancel', redirectable: true },
    component: () => import(/* webpackChunkName: "Checkout" */ '@/features/checkout/views/Cancel.vue'),
};

export const AppSumo = {
    path: '/appsumo',
    name: 'AppSumo',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | AppSumo', noAuthRedirectPath: '/signup' },
    component: () => import(/* webpackChunkName: "Checkout" */ '@/features/checkout/views/AppSumo.vue'),
};
export const AppSumoWithCode = {
    path: '/appsumo/:code',
    name: 'AppSumo',
    beforeEnter: requiresAuth,
    meta: { title: 'Transfer Thought | AppSumo', noAuthRedirectPath: '/signup' },
    component: () => import(/* webpackChunkName: "Checkout" */ '@/features/checkout/views/AppSumo.vue'),
};

export default [Checkout, Success, Cancel, AppSumo];
