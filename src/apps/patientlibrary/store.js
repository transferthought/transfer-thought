import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/stores/user';
import apps from '@/features/apps/store';
import sessions from '@/stores/sessions';
import courses from '@/stores/courses';
import assets from '@/features/assets/store';
import steps, { plugins } from '@/stores/steps';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        sessions,
        apps,
        courses,
        assets,
        steps,
    },
    plugins: [...plugins],
});
