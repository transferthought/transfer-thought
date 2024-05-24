import { mapState, mapActions } from 'vuex';
import Scene from '@/components/Scene.vue';
import SnackMessages from '@/components/editor/SnackMessages.vue';

export default {
    components: {
        Scene,
        SnackMessages,
    },
    data() {
        return {
            scene: null,
            savingConfig: false,
            openEmbed: false,
            showAssetSelector: false,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),
        embedCode() {
            const currentUrl = new URL(window.location);
            const src = `${currentUrl.origin}/embed/${this.app.appid}`;
            return `<iframe src=${src}></iframe>`;
        },
        cssVars() {
            return {
                '--scene-editor-height': this.app.isBottomPanelOpen ? 'calc(100vh - 48px - 600px)' : 'calc(100vh - 48px)',
            };
        },
        publishedUrl() {
            return this.$store.getters['apps/publishedUrl'];
        },
    },
    methods: {
        // MAP STORES
        ...mapActions('apps', {
            publishApp: 'publishApp',
            updateName: 'updateName',
        }),
        ...mapActions('state', {
            update: 'updateState',
        }),

        handleAppNameChange(newName) {
            this.$store.commit('apps/updateName', newName);
        },

        // DROPDOWN
        launchPublishedSite() {
            window.open(`/embed/${this.app.appId}`);
        },
        getTakeUrl() {
            const currentUrl = new URL(window.location);
            return `${currentUrl.origin}/take/${this.app.appId}`;
        },
        launchTakeSite() {
            window.open(`/take/${this.app.appId}`);
        },
        copyPublishedUrl() {
            const el = document.createElement('textarea');
            el.value = this.publishedUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$store.commit('apps/snackMessage', 'Link copied to clipboard');
        },
        // ASSETS

        // Editor Helpers
        async getScreenshot() {
            if (this.app && this.app.scene) {
                const screenshot = document.querySelector('a-scene').components.screenshot.getCanvas('perspective');
                return new Promise((resolve) => {
                    screenshot.toBlob(async (blob) => {
                        resolve(blob);
                    }, 'image/jpeg');
                });
            }
            return null;
        },
        async saveConfig() {
            // if user is not logged in, prompt login
            if (!this.user) {
                this.showAuthForm = true;
                return;
            }
            this.savingConfig = true;
            const screenshotBlob = await this.getScreenshot();
            const thumbnailUrl = screenshotBlob ? await this.$store.dispatch('apps/createThumbnailUrl', screenshotBlob) : null;
            await this.$store.dispatch('apps/updateApp', { type: 'master', thumbnailUrl });
            this.savingConfig = false;
        },
    },
};
