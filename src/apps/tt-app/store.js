import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/stores/user';
import apps from '@/features/apps/store';
import assets from '@/features/assets/store';
import sessions from '@/stores/sessions';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        apps,
        assets,
        sessions,
    },
});
