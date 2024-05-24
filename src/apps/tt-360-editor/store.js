import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/stores/user';
import sessions from '@/stores/sessions';
import courses from '@/stores/courses';
import assets from '@/features/assets/store';
import redirect from '@/stores/redirect';
import apps from '@/features/apps/store';
import pages from '@/features/pages/store';
import steps, { plugins } from '@/stores/steps';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        sessions,
        app,
        apps,
        courses,
        assets,
        steps,
        pages,
        redirect,
    },
    plugins: [...plugins],
});
