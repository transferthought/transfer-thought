import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import '@aws-amplify/ui-vue';
import VuetifyDraggableTreeview from 'vuetify-draggable-treeview';
import VuePdfApp from 'vue-pdf-app';
import 'vue-pdf-app/dist/icons/main.css';
import Fragment from 'vue-fragment';
import Vue2TouchEvents from 'vue2-touch-events';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import Client from '@/tt-api';
import '@/assets/scss/scenario_global.scss';
import '@/assets/scss/scenario_defaults.scss';
import Vuetify from '@/plugins/vuetify';

import { TiptapVuetifyPlugin } from 'tiptap-vuetify';
// don't forget to import CSS styles
import 'tiptap-vuetify/dist/main.css';

import VueTour from 'vue-tour';
import Text from '@/directives/text.vue';
import Size from '@/directives/size.vue';
import VueConfetti from 'vue-confetti';
import PortalVue from 'portal-vue';
import ShortKey from 'vue-shortkey';
import posthog from 'posthog-js';
import App from './App.vue';
import store from './store';
import router from './router';

require('vue-tour/dist/vue-tour.css');

posthog.init('phc_JEwP8JIe9yZj1cNLMBPOecRzhF61pBaZ02h4PA1W6DD', { api_host: 'https://app.posthog.com' });

const options = {
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: false,
        themes: {
            light: {
                primary: '#118ab2',
                error: '#ef476f',
                success: '#06d6a0',
                warning: '#ffd166',
                secondary: '#073b4c',
                accent: '#82B1FF',
                info: '#11cdef',
                background: '#FAFAFA',
            },
            dark: {
                // background: '#161822',
                // primary: '#4A61DD',
                // secondary: '#03DAC5',
                // accent: '#82B1FF',
                // error: '#FF5252',
                // info: '#2196F3',
                // success: '#4CAF50',
                // warning: '#FFC107',
            },
        },
        options: {
            customProperties: true,
        },
    },
};
const vuetify = new Vuetify({
    ...options,
});
const cache = new InMemoryCache({
    dataIdFromObject: (object) => {
        switch (object.__typename) {
            case 'foo':
                return object.key; // use `key` as the primary key
            case 'bar':
                return object.blah; // use `blah` as the priamry key
            default:
                return object.id || object._id; // fall back to `id` and `_id` for all other types
        }
    },
});
const appsyncProvider = new VueApollo({
    cache,
    defaultClient: Client.Api,
});

function render(h) {
    return h(App);
}

const apolloProvider = appsyncProvider;

Vue.use(VueApollo);
Vue.use(vuetify);
Vue.use(VuetifyDraggableTreeview);
Vue.use(Fragment.Plugin);
Vue.use(Vue2TouchEvents);
Vue.use(VueFilterDateFormat);
Vue.use(VueConfetti);
Vue.use(PortalVue);
Vue.use(VueTour);
Vue.use(ShortKey, { prevent: ['input', 'textarea'] });

// use this package's plugin
Vue.use(TiptapVuetifyPlugin, {
    // the next line is important! You need to provide the Vuetify Object to this place.
    vuetify, // same as "vuetify: vuetify"
    // optional, default to 'md' (default vuetify icons before v2.0.0)
    iconsGroup: 'md',
});

Vue.directive('tt-text', Text);
Vue.directive('tt-size', Size);

Vue.component('vue-pdf-app', VuePdfApp);

const appOptions = {
    App,
    router,
    store,
    render,
    apolloProvider,
    vuetify,
    VueTour,
};

window.TT = { ...appOptions, Client };

// eslint-disable-next-line no-undef
// FreshworksWidget('show', 'launcher');

export default appOptions;
