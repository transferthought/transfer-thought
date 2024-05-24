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
import App from './App.vue';
import store from './store';
import router from './router';

const options = {
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        dark: true,
        themes: {
            light: {
                background: '#FAFAFA',
            },
            dark: {
                background: '#161822',
                primary: '#4A61DD',
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

const appsyncProvider = new VueApollo({
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
