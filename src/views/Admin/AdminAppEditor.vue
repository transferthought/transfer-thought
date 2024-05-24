<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <v-row>
                    <v-col cols="10">
                        {{ app.name }}
                    </v-col>
                    <v-col cols="2">
                        <AppSettings />
                    </v-col>
                </v-row>
            </template>
            <template slot="Center">
                <portal-target name="toolbar-center" />
            </template>

            <template slot="Right">
                <!-- <v-btn
                    class="font-weight-600 text-h3 text-typo text-capitalize py-1 px-8 mx-2"
                    depressed
                    color="white"
                    @click="launchPublishedSite"
                >
                    Preview
                </v-btn> -->
                <v-btn
                    id="publish-button"
                    class="font-weight-600 text-capitalize py-1 px-8 mx-2"
                    depressed
                    color="primary lighten-1"
                    :loading="app.publishing"
                    @click="publish"
                >
                    Publish
                    <v-icon right dark>
                        mdi-cloud-upload
                    </v-icon>
                </v-btn>
            </template>
        </AdminToolBar>
        <v-main>
            <v-container fluid class="pa-0 fill-height">
                <ObjectiveEditor ref="editor" :app-id="app.appId" />

                <v-dialog v-model="showPublishDialog" persistent width="800">
                    <v-card v-if="app.publishing" color="primary" dark>
                        <v-card-text>
                            Publishing...
                            <v-progress-linear indeterminate color="white" class="mb-0" />
                        </v-card-text>
                    </v-card>
                    <v-card v-else>
                        <v-toolbar color="primary" dark flat class="text-h2 font-weight-600 mb-0 text-capitalize">
                            {{ app.name }}
                        </v-toolbar>
                        <v-tabs v-model="shareTab">
                            <v-tab v-for="item in items" :key="item">
                                {{ item }}
                            </v-tab>
                        </v-tabs>
                        <v-tabs-items v-model="shareTab">
                            <v-tab-item>
                                <v-card flat>
                                    <v-card-text>
                                        <v-list-item>
                                            <v-list-item-content @click="launchPublishedSite">
                                                <v-list-item-title>
                                                    {{ publishedUrl }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn icon @click="copyValue(publishedUrl)">
                                                    <v-icon>
                                                        mdi-content-copy
                                                    </v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item>
                                <v-card flat>
                                    <v-card-text>
                                        <label class="label-color font-weight-600 mb-2 d-block">
                                            Iframe
                                        </label>

                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{ embedCode }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn icon @click="copyValue(embedCode)">
                                                    <v-icon>
                                                        mdi-content-copy
                                                    </v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <label class="label-color font-weight-600 mb-2 d-block ">SCORM</label>
                                        <v-list-item v-if="userData.plan === 'pilot'">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    SCORM is not eligible on the pilot tier
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn
                                                    class="font-weight-600 text-typo text-capitalize"
                                                    depressed
                                                    @click="
                                                        $router.push({
                                                            name: 'Account',
                                                        })
                                                    "
                                                >
                                                    View Subscription
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-list-item v-else>
                                            <v-list-item-action>
                                                <v-btn class="font-weight-600 text-h3 text-typo text-capitalize" depressed @click="generateScormPacakge">
                                                    Download
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item eager>
                                <v-card flat>
                                    <v-card-text>
                                        <v-row align="center" justify="center">
                                            <v-col cols="3">
                                                <canvas id="canvas" />
                                                <p class="ml-4">
                                                    Right click to download
                                                </p>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text @click="closePublishDialog">
                                Close
                            </v-btn>
                            <v-btn depressed color="primary" @click="launchPublishedSite">
                                View
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <SnackMessages />
            </v-container>
        </v-main>
    </fragment>
</template>
<script>
import { mapState } from 'vuex';
import SnackMessages from '@/components/editor/SnackMessages.vue';

import AdminToolBar from '@/components/AdminToolBar.vue';
import ObjectiveEditor from '@/components/lms/Admin/Editors/ObjectiveEditor.vue';
import AppSettings from '@/components/AppSettings.vue';
import * as QRCode from 'qrcode';
import { saveAs } from 'file-saver';

import JSZip from 'jszip';

export default {
    name: 'AdminAppEditor',
    components: {
        AdminToolBar,
        SnackMessages,
        ObjectiveEditor,
        AppSettings,
    },
    mixins: [],
    data() {
        return {
            showPublishDialog: false,
            loaded: false,
            shareTab: null,
            items: ['Link', 'Embed', 'QR Code'],
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
            app: (state) => state.apps,
        }),
        embedCode() {
            const src = this.publishedUrl;
            return `<iframe src=${src}></iframe>`;
        },
        publishedUrl() {
            return this.$store.getters['apps/publishedUrl'];
        },
    },
    watch: {
        shareTab() {
            if (this.shareTab === 2) {
                this.$nextTick(() => {
                    const canvas = document.getElementById('canvas');
                    QRCode.toCanvas(canvas, this.publishedUrl);
                });
            }
        },
    },
    async mounted() {
        if (this.$route.params.appId) {
            await this.$store.dispatch('apps/fetchApp', {
                appId: this.$route.params.appId,
                type: 'master',
            });
            this.loaded = true;
        }
    },
    methods: {
        async publish() {
            this.showPublishDialog = true;
            this.$refs.editor.publish();
        },
        launchPublishedSite() {
            window.open(this.publishedUrl);
        },
        copyValue(value) {
            navigator.clipboard.writeText(value);
            this.$store.commit('apps/snackMessage', {
                message: 'Link Copied',
                color: 'success',
            });
        },
        closePublishDialog() {
            this.showPublishDialog = false;
            this.$nextTick(() => {
                this.shareTab = null;
            });
        },
        async generateScormPacakge() {
            const response = await fetch('https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/SCORM/TT_SCORM_WRAPPER.zip');
            let zip = await response.blob();
            zip = await JSZip.loadAsync(zip);
            zip.file('TT_data.js', `var TT = {}; TT.src = "${this.publishedUrl}";`);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${this.app.name}_SCORM.zip`);
        },
    },
};
</script>

<style scoped></style>
