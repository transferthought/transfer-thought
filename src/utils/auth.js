import store from '@/apps/tt-360-editor/store';

export const requiresAuth = (to, from, next) => {
    console.log('to', to);
    if (store.state.user.user) {
        next();
    } else if (to.meta.noAuthRedirectPath) {
        next(`${to.meta.noAuthRedirectPath}?redirect=${to.path}`);
    } else {
        next(`/signin?redirect=${to.path}`);
    }
};

export const checkAuth = (to, from, next) => {
    if (store.state.user.user) {
        next('/');
    } else {
        next();
    }
};
