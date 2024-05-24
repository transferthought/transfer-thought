<template>
    <v-card fill-height class="assets-viewer">
        <v-toolbar dark color="primary">
            <v-btn icon dark @click="$emit('close')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ titleDisplay }}</v-toolbar-title>
            <v-spacer />
        </v-toolbar>
        <v-card-text class="pa-0" style="height: 70vh">
            <v-row no-gutters class="fill-height">
                <v-col cols="12" class="fill-height">
                    <v-row no-gutters class="fill-height">
                        <v-col cols="3" class="hidden-sm-and-down">
                            <v-list nav dense>
                                <v-list>
                                    <v-list-item-group v-model="selectedAssetViewIndex">
                                        <v-list-item :id="`asset-view-${assetView.id}`" v-for="(assetView, index) in visibleAssetViews" :key="index" link>
                                            <v-list-item-icon>
                                                <v-icon>
                                                    {{ assetView.icon }}
                                                </v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-title>
                                                {{ assetView.display }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                                <v-divider />
                                <v-list>
                                    <v-list-item>
                                        <AssetsUploader @open-my-assets="onOpenMyAssets" />
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
                                :multiple="multiple"
                                :options="options"
                                :selected-asset-view="selectedAssetView.id"
                                @selection-change="handleSelectedAssetsChanged"
                            />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider />
        <v-card-actions class="background lighten-1 text-center">
            <v-spacer />
            <v-btn
                id="select-asset-button"
                color="primary"
                :disabled="selectedAssets.length === 0"
                :loading="loadingSelection"
                class="font-weight-600 text-capitalize py-1 ml-3"
                @click="handleSelection"
            >
                {{ selectAssetsDisplay }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import AssetsUploader from '@/features/assets/AssetsUploader.vue';
import AssetViewContainer from '@/features/assets/views/AssetViewContainer.vue';

export default {
    name: 'AssetsViewer',
    components: {
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
            default: () => ['EXPLORE', 'MY_ASSET_VIEW', 'TRANSFER_THOUGHT_ASSETS', 'LINK_TO_ASSET'],
        },
    },
    data() {
        return {
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
        onOpenMyAssets(selectAssets) {
            const myAssetViewIndex = this.visibleAssetViews.findIndex((assetView) => {
                return assetView.id === 'MY_ASSET_VIEW';
            });
            if (myAssetViewIndex > -1) {
                this.selectedAssetViewIndex = myAssetViewIndex;
                this.$refs.CurrentAssetView.updatedSelectedAssets(selectAssets);
            }
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
    },
};
</script>
<style scoped>
.assets-container {
    overflow: auto;
}
</style>
