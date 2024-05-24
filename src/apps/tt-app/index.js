import Vue from 'vue';
import VueApollo from 'vue-apollo';
// import '@aws-amplify/ui-vue';
import VuetifyDraggableTreeview from 'vuetify-draggable-treeview';
import Fragment from 'vue-fragment';
import Vue2TouchEvents from 'vue2-touch-events';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import Client from '@/tt-api';
import Vuetify from '@/plugins/vuetify';
import Text from '@/directives/text.vue';
import Size from '@/directives/size.vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import PortalVue from 'portal-vue';
import App from './App.vue';
import store from './store';
import router from './router';

import '@/assets/scss/style.scss';

Sentry.init({
    Vue,
    dsn: 'https://e72753c3e35747f383025dbdf30702ec@o831879.ingest.sentry.io/5812673',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const options = {
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: true,
        themes: {
            dark: {
                background: '#161822',
                primary: '#4A61DD',
                secondary: '#fff',
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

const appsyncProvider = new VueApollo({
    defaultClient: Client.Api,
    defaultOptions: {
        fetchPolicy: 'no-cache',
    },
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
Vue.use(PortalVue);

Vue.directive('tt-text', Text);
Vue.directive('tt-size', Size);

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
