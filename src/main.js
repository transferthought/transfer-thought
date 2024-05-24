import Vue from 'vue';

function requestDevice() {
    return new Promise((upperResolve) => {
        upperResolve({
            supportsSession: new Promise((lowerResolve) => {
                lowerResolve({
                    immersive: true,
                    exclusive: true,
                });
            }),
        });
    });
}

if (navigator.xr && !navigator.xr.requestDevice) {
    navigator.xr.requestDevice = requestDevice;
}

const appHeight = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
};
window.addEventListener('resize', appHeight);
appHeight();

Vue.config.productionTip = false;

const DEFAULT_APP = 'tt-360-editor';
const APPS = {
    'www.inveo.ai': 'twinlab',
    'inveo.ai': 'twinlab',
    'patientlibrary.transferthought.com': 'patientlibrary',
    'twinlab.transferthought.com': 'twinlab',
    'staging.transferthought.com': 'tt-app',
    'app.transferthought.com': 'tt-app',
    'staging-convey.transferthought.com': 'tt-360-editor',
    'convey.transferthought.com': 'tt-360-editor',
    'staging-360editor.transferthought.com': 'tt-360-editor',
    '360editor.transferthought.com': 'tt-360-editor',
    'staging-scenario.transferthought.com': 'tt-360-editor',
    'scenario.transferthought.com': 'tt-360-editor',
    'staging-lev360.transferthought.com': 'lev-360-editor',
    'lev360.transferthought.com': 'lev-360-editor',
    'timeboxmeetup.com': 'timebox',
    'staging.timeboxmeetup.com': 'timebox',
    'd11c7kkhmtue8o.cloudfront.net': 'paintchat',
    'staging.dobmi2qe8augj.amplifyapp.com': 'tt-app',
    'master.dobmi2qe8augj.amplifyapp.com': 'tt-app',
};

function getAppName() {
    const domain = window.location.hostname;
    return APPS[domain] ? APPS[domain] : DEFAULT_APP;
}

async function initVueApp() {
    // eslint-disable-next-line prefer-template
    const options = await import(/* webpackChunkName: "MainApp" */ '@/apps/' + getAppName());
    Vue.prototype.$store = options.default.store;
    Vue.$store = options.default.store;
    new Vue(options.default).$mount('#app');
}

initVueApp();
