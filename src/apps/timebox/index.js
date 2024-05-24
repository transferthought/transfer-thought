import Vue from 'vue';
import VueApollo from 'vue-apollo';
import Client from '@/tt-api';
import Vuetify from '@/plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

const appsyncProvider = new VueApollo({
    defaultClient: Client.Api,
});

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#3da9fc',
                secondary: '#90b4ce',
                accent: '#ef4565',
                error: '#b71c1c',
            },
        },
    },
});

function render(h) {
    return h(App);
}

const apolloProvider = appsyncProvider;

Vue.use(VueApollo);
Vue.use(vuetify);

const appOptions = {
    App,
    router,
    store,
    render,
    apolloProvider,
    vuetify,
};

window.TT = { ...appOptions };

export default appOptions;
