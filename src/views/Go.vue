<template class="tt-go">
    <v-main fill-height>
        <Scene style="height:100%" embedded :vr-enabled="false" :ar-enabled="false" :app-id="app.appId" />

        <!-- <header class="site-header">
            <div class="logo-container">
                <img width="50" height="auto" src="https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/TT-head-logo.png" alt="TT Logo">
            </div>
        </header> -->

        <div class="site-header">
            <div class="logo-container">
                <div class="icons-wrapper">
                    <img
                        width="50"
                        height="auto"
                        src="https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/TT-head-logo.png"
                        alt="TT Logo"
                    />

                    <v-icon large id="icon" @click="showPublishOrSave">
                        mdi-publish
                    </v-icon>

                    <v-icon id="icon" large @click="clearLastImage">
                        mdi-undo
                    </v-icon>

                    <v-icon id="icon" large @click="showClearConfirmationDialog">
                        mdi-delete
                    </v-icon>

                    <!-- <v-icon id="icon" large 
                @click="" >
                mdi-gear
                </v-icon> -->
                </div>
            </div>
        </div>

        <v-dialog v-model="dialog" persistent>
            <v-card>
                <v-card-title>
                    <span class="text-h5">New 360 Photo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="name" label="Photo"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save" :loading="saving">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="clearAllConfirmationDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Are you sure you want to clear all photos?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="clear360Image">
                        Yes
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="clearAllConfirmationDialog = false">
                        No
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="publishOrSaveDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">
                    <span class="logo-wrapper">
                        <img
                            class="logo-img"
                            src="https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/TT-head-logo.png"
                            alt="TT Logo"
                        />
                        Transfer Thought
                    </span>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = true">
                    Save to My Uploads
                </v-btn>
                <v-btn color="blue darken-1" text @click="publish">
                    Publish
                </v-btn>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import { mergeProps } from 'vue';

import Scene from '@/components/Scene.vue';
import { mapState } from 'vuex';
import * as UUID from 'uuid/v4';

export default {
    name: 'Go',
    components: {
        Scene,
    },
    mixins: [],
    props: {},
    data() {
        return {
            dialog: false,
            name: 'TT GO PHOTO',
            saving: false,
            clearAllConfirmationDialog: false,
            publishOrSaveDialog: false,
            menuOpen: false,
            showPhoto: true,
            showBorder: false,
            showStretched: false,
            location: 'end',
            mobileClickCount: 0,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
    },
    async mounted() {
        // FreshworksWidget('hide', 'launcher');
        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });
        await this.$store.dispatch('apps/fetchApp', { appId: '7ba1e672-2113-42e0-87ad-b37082d2fdaf', type: 'published' });
    },
    methods: {
        mergeProps,
        dataURItoBlob(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        },

        async getScreenshot() {
            const sceneElement = document.querySelector('a-scene');
            const camera = document.getElementById('camera');
            if (camera) {
                const lookControls = camera.components['tt-look-controls'];
                if (lookControls) {
                    lookControls.setRotation(0, 0);
                }
            }

            sceneElement.setAttribute('screenshot', {
                width: 4096,
                height: 2048,
            });
            const screenshot = sceneElement.components.screenshot.getCanvas('equirectangular');
            return new Promise((resolve) => {
                screenshot.toBlob(async (blob) => {
                    resolve(blob);
                }, 'image/png');
            });
        },
        async save() {
            this.saving = true;
            const screenshotBlob = await this.getScreenshot();
            let newEqImage = await this.$store.dispatch('assets/createAsset', {
                file: screenshotBlob,
                name: this.name,
                fileType: 'image/jpeg',
                tag: 'unknown',
            });
            await this.$store.dispatch('apps/state/update', { selector: 'images', value: [] });

            this.name = 'TT GO PHOTO';
            this.saving = false;
            this.dialog = false;
            this.publishOrSaveDialog = false;
            return newEqImage;
        },
        clear360Image() {
            this.name = 'TT GO PHOTO';
            this.$store.commit('apps/state/update', { selector: 'images', value: [] });
            this.dialog = false;
            this.clearAllConfirmationDialog = false;
        },
        showClearConfirmationDialog() {
            this.clearAllConfirmationDialog = true;
        },
        showPublishOrSave() {
            this.publishOrSaveDialog = true;
        },
        async clearLastImage() {
            if (this.state.images.length > 0) {
                this.state.images.pop();
                this.$store.commit('apps/state/update', { selector: 'images', value: this.state.images });
                this.dialog = false;
                console.log('Last image cleared:', this.state.images);
            }
        },
        async saveEQ() {
            console.log(this.state);
            const imagesPromises = this.state.images.map(async (img) => {
                var blobData = this.dataURItoBlob(img.data);

                const src = await this.$store.dispatch('assets/createThumbnail', { file: blobData });
                return {
                    id: `TT_${UUID().replace(/-/g, '')}`,
                    tags,
                    title,
                    src,
                    position: img.position,
                    scale: { x: 40, y: 30, z: 1 },
                };
            });
            const mappedProps = await Promise.all(imagesPromises);
            //const mappedProps = await Promise.all(imagesPromises); - should deliver an object of props with ID as keys instead of an array
            const { default: app } = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/360Objective/app`);
            const environment = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                name: 'Environment',
                type: 'SET_ENVIRONMENT',
                data: {
                    rotation: { x: 0, y: 0, z: 0 },
                    entities: mappedProps,
                },
            };

            app.state.steps.push(environment);
            const newApp = {
                name: 'Transfer Thought Go',
                config: JSON.stringify(app.config),
                state: JSON.stringify(app.state),
                actions: JSON.stringify(app.actions),
            };

            const createdApp = await this.$store.dispatch('apps/createApp', newApp);
            return createdApp;
        },
        async createApp(newEqImageSrc) {
            console.log(this.state);
            const { default: app } = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/360Objective/app`);
            const environment = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                name: 'Environment',
                type: 'SET_ENVIRONMENT',
                data: {
                    src: newEqImageSrc,
                },
            };

            app.state.steps.push(environment);
            const newApp = {
                name: 'Transfer Thought Go',
                config: JSON.stringify(app.config),
                state: JSON.stringify(app.state),
                actions: JSON.stringify(app.actions),
            };

            const createdApp = await this.$store.dispatch('apps/createApp', newApp);
            return createdApp;
        },
        async publish() {
            const newEqSrc = await this.save();
            const app = await this.createApp(newEqSrc);
            //const app = await this.saveEQ();
            this.$store.commit('apps/setAppId', app.appId);
            const baseUrl = 'https://scenario.transferthought.com/edit/';
            const photoIdURL = `${baseUrl}${app.appId}`;
            await this.$store.dispatch('apps/publishApp');
            window.open(photoIdURL, '_blank');
            this.publishOrSaveDialog = false;
        },
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
    },
};
</script>

<style>
.page-container {
    position: relative !important;
}

.logo-container {
    display: flex !important;
    align-items: center !important;
    position: absolute !important;
    top: 0 !important;
    left: 10px !important;
    padding: 10;
}

.logo-container img {
    width: 30px !important;
    height: auto !important;
    opacity: 0.7 !important;
    margin-top: 10px;
    margin-left: 10px;
}
#icon {
    color: #70c8d7;
    opacity: 0.7;
}
.menu-bar {
    display: flex !important;
    align-items: center !important;
    padding: 10px !important;
    overflow: hidden !important;
}
.logo-wrapper {
    display: flex !important;
    align-items: center !important;
}

.logo-img {
    width: 20px !important;
    height: auto !important;
    margin-right: 10px !important;
}
.icons-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>
