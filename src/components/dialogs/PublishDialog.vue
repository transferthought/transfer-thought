<template>
    <v-dialog :value="isDialogShowing" persistent width="1000">
        <v-card v-if="pageStatus === 'PUBLISHING'" color="primary" dark>
            <v-card-text class="text-h4">
                Publishing...
                <v-progress-linear indeterminate color="white" class="mb-0" />
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">{{ title }}</v-toolbar>
            <v-tabs v-model="currentTab">
                <v-tab v-for="item in visibleTabs" :key="item.value">
                    {{ item.display }}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab" class="tabs-container">
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <RedirectEditor :resourceType="resourceType" :resourceId="resourceId" />
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
                                        class="font-weight-600 text-capitalize"
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
                                    <v-btn class="font-weight-600 text-h5 text-typo text-capitalize" depressed @click="generateScormPacakge">
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
                <v-tab-item eager>
                    <PublishToPage :resource="resource" />
                </v-tab-item>
            </v-tabs-items>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="close" class="text-capitalize py-1 px-2">
                    Close
                </v-btn>
                <v-btn depressed color="primary" @click="openPublishedUrl" class="font-weight-600 text-capitalize py-1 px-2">
                    View
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import * as QRCode from 'qrcode';
import { mapState } from 'vuex';
import RedirectEditor from '@/components/RedirectEditor.vue';
import UpgradeAccountTooltip from '../UpgradeAccountTooltip.vue';
import PublishToPage from '../../features/apps/components/PublishToPage.vue';

export default {
    name: 'PublishDialog',
    components: { RedirectEditor, UpgradeAccountTooltip, PublishToPage },
    props: {
        resourceType: String,
        resourceId: String,
        only: {
            type: Array,
            default() {
                return ['link', 'embed', 'qr-code', 'landing-page'];
            },
        },
    },
    data() {
        return {
            isDialogShowing: false,
            currentTab: null,
            tabs: {
                link: { value: 'link', display: 'Link' },
                embed: { value: 'embed', display: 'Embed' },
                'qr-code': { value: 'qr-code', display: 'QR Code' },
                'landing-page': { value: 'landing-page', display: 'Publish to Landing Page' },
            },
        };
    },
    watch: {
        currentTab() {
            if (this.currentTab === 2) {
                this.$nextTick(() => {
                    const canvas = document.getElementById('canvas');
                    QRCode.toCanvas(canvas, this.publishedUrl);
                });
            }
        },
    },
    computed: {
        ...mapState({
            userData: (state) => state.user.data,
        }),
        visibleTabs() {
            return this.only.map((tabValue) => {
                return this.tabs[tabValue];
            });
        },
        resource() {
            return this.$store.getters[`${this.resourceType}/byId`](this.resourceId);
        },
        title() {
            return this.$store.getters[`${this.resourceType}/title`](this.resourceId);
        },
        publishedUrl() {
            return this.$store.getters[`${this.resourceType}/publishedUrl`](this.resourceId);
        },
        pageStatus() {
            return this.$store.getters[`${this.resourceType}/singleStatus`];
        },
        embedCode() {
            return `<div style="padding-bottom:56.25%; position:relative; display:block; width: 100%">
                    <iframe
                        width="100%"
                        height="100%"
                        src="${this.publishedUrl}"
                        frameborder="0"
                        allowtransparency="true"
                        style="position:absolute; top:0; left: 0"
                    ></iframe>
                </div>`;
        },
    },
    methods: {
        show() {
            this.isDialogShowing = true;
        },
        close() {
            this.isDialogShowing = false;
        },
        openPublishedUrl() {
            window.open(this.publishedUrl, this.resourceId).focus();
        },
        copyValue(value) {
            navigator.clipboard.writeText(value);
            this.$store.commit('apps/snackMessage', {
                message: 'Link Copied',
                color: 'success',
            });
        },
        async generateScormPacakge() {
            const response = await fetch('https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/SCORM/TT_SCORM_WRAPPER.zip');
            let zip = await response.blob();
            zip = await JSZip.loadAsync(zip);
            zip.file('TT_data.js', `var TT = {}; TT.src = "${this.publishedUrl}";`);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${this.title}_SCORM.zip`);
        },
    },
};
</script>

<style scoped>
.tabs-container {
    max-height: 70vh;
    overflow-y: scroll;
}
</style>
