<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <h5 class="text-h5">
                    My Assets
                </h5>
            </template>
        </AdminToolBar>
        <v-main>
            <v-row no-gutters class="fill-height">
                <v-col cols="12" class="fill-height">
                    <v-row no-gutters class="fill-height">
                        <v-col cols="0" md="3" class="hidden-sm-and-down">
                            <v-list nav dense>
                                <v-list>
                                    <v-list-item>
                                        <AssetsUploader ref="AssetsUploader" />
                                    </v-list-item>
                                </v-list>
                            </v-list>
                        </v-col>
                        <v-divider vertical />
                        <v-col class="assets-container fill-height" cols="12" md="9">
                            <v-overlay :value="loadingSelection">
                                <v-progress-circular indeterminate size="64" />
                            </v-overlay>
                            <AssetViewContainer
                                ref="CurrentAssetView"
                                :options="options"
                                :selected-asset-view="selectedAssetView.id"
                                @selection-change="handleSelectedAssetsChanged"
                            />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <v-speed-dial v-model="fab" bottom right fixed class="hidden-md-and-up">
                <template v-slot:activator>
                    <v-btn v-model="fab" color="primary darken-2" dark fab>
                        <v-icon v-if="fab">
                            mdi-close
                        </v-icon>
                        <v-icon v-else>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </template>

                <v-tooltip :value="true" left color="grey darken-4">
                    <template v-slot:activator>
                        <v-btn fab small color="primary darken-1" class="ml-10" @click="openFileSelect">
                            <v-icon>mdi-upload</v-icon>
                        </v-btn>
                    </template>
                    <span>Upload</span>
                </v-tooltip>
            </v-speed-dial>
        </v-main>
    </fragment>
</template>

<script>
import AdminToolBar from '@/components/AdminToolBar.vue';

import AssetsUploader from '@/features/assets/AssetsUploader.vue';
import AssetViewContainer from '@/features/assets/views/AssetViewContainer.vue';

export default {
    name: 'AssetsViewer',
    components: {
        AdminToolBar,
        AssetsUploader,
        AssetViewContainer,
    },
    props: {
        titleDisplay: {
            type: String,
            default: 'Select an asset',
        },
        selectDisplay: {
            type: String,
            default: null,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Object,
        },
        viewsToShow: {
            type: Array,
            default: () => ['MY_ASSET_VIEW'],
        },
    },
    data() {
        return {
            fab: false,
            selectedAssets: [],
            selectedAssetViewIndex: 0,
            loadingSelection: false,
            assetViews: {
                EXPLORE: { id: 'EXPLORE', icon: 'mdi-magnify', display: 'Google Search' },
                EXPLORE_EQ: { id: 'EXPLORE_EQ', icon: 'mdi-magnify', display: 'Flickr 360 Images' },
                DALL_EQ: { id: 'DALL_EQ', icon: 'mdi-image-auto-adjust', display: 'Dall-E 360 Images (BETA)' },
                BLOCKADE_EQ: { id: 'BLOCKADE_EQ', icon: 'mdi-image-auto-adjust', display: 'Blockade 360 Images (BETA)' },
                MY_ASSET_VIEW: {
                    id: 'MY_ASSET_VIEW',
                    icon: 'mdi-folder',
                    display: 'My Uploads',
                },
                TRANSFER_THOUGHT_ASSETS: {
                    id: 'TRANSFER_THOUGHT_ASSETS',
                    icon: 'mdi-folder-multiple-image',
                    display: 'Transfer Thought Media',
                },
                CUSTOM_ASSETS: {
                    id: 'CUSTOM_ASSETS',
                    icon: 'mdi-folder-multiple-image',
                    display: 'Transfer Thought Media',
                },
                TRANSCRIPT_VIEW: {
                    id: 'TRANSCRIPT_VIEW',
                    icon: 'mdi-folder-multiple-image',
                    display: 'Transcript',
                },
                LINK_TO_ASSET: {
                    id: 'LINK_TO_ASSET',
                    icon: 'mdi-link',
                    display: 'Link to assets',
                },
                AVATARS: {
                    id: 'AVATARS',
                    icon: 'mdi-account',
                    display: 'Character',
                },
            },
        };
    },
    computed: {
        visibleAssetViews() {
            return this.viewsToShow.map((viewId) => {
                return this.assetViews[viewId];
            });
        },
        selectedAssetView() {
            return this.visibleAssetViews[this.selectedAssetViewIndex];
        },
        selectAssetsDisplay() {
            if (this.selectedAssets.length < 2) {
                if (this.selectDisplay) {
                    return this.selectDisplay;
                }
                return 'Select';
            }
            if (this.selectDisplay) {
                return `${this.selectDisplay} (${this.selectedAssets.length})`;
            }
            return `Select (${this.selectedAssets.length})`;
        },
    },
    methods: {
        async handleSelectedAssetsChanged(selectedAssets) {
            this.selectedAssets = selectedAssets;
        },
        async handleSelection() {
            this.loadingSelection = true;
            try {
                const selectedAssetUrls = await this.$refs.CurrentAssetView.getSelectedAssetUrls();
                if (this.multiple) {
                    this.$emit('selected', selectedAssetUrls);
                } else {
                    this.$emit('selected', selectedAssetUrls[0]);
                }
                this.loadingSelection = false;
            } catch (err) {
                this.loadingSelection = false;
                this.$store.commit('apps/snackMessage', {
                    message: 'Selection Failed: Choose a different option',
                    color: 'error',
                });
            }
        },
        openFileSelect() {
            if (this.$refs.AssetsUploader) {
                this.$refs.AssetsUploader.openFileSelect();
            }
        },
    },
};
</script>
<style scoped>
.assets-container {
    overflow: auto;
}
</style>
