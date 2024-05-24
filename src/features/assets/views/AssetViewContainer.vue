<template>
    <component
        id="asset-container"
        class="pa-5"
        :is="selectedAssetView"
        ref="CurrentAssetView"
        :multiple="multiple"
        :options="options"
        @selection-change="$emit('selection-change', $event)"
    />
</template>

<script>
import MyAssetsView from './MyAssetsView.vue';
import TransferThoughtAssetView from './TransferThoughtAssetView.vue';
import ExploreAssets from './ExploreAssets.vue';
import ExploreFlickrAssets from './ExploreFlickrAssets.vue';
import DallE360View from './DallE360Assets.vue';
import BlockadeLabsView from './BlockadeLabsAssets.vue';
import LinkToAsset from './LinkToAsset.vue';
import CustomAssetView from './CustomAssetView.vue';
import TranscriptAsset from './TranscriptAsset.vue';

export default {
    name: 'AssetsViewer',
    components: {
        MY_ASSET_VIEW: MyAssetsView,
        CUSTOM_ASSETS: CustomAssetView,
        TRANSFER_THOUGHT_ASSETS: TransferThoughtAssetView,
        EXPLORE: ExploreAssets,
        EXPLORE_EQ: ExploreFlickrAssets,
        DALL_EQ: DallE360View,
        BLOCKADE_EQ: BlockadeLabsView,
        TRANSCRIPT_VIEW: TranscriptAsset,
        LINK_TO_ASSET: LinkToAsset,
    },
    props: {
        selectedAssetView: {
            type: String,
            default: 'EXPLORE',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        options: {
            type: Object,
        },
    },
    methods: {
        getSelectedAssetUrls() {
            return this.$refs.CurrentAssetView.getSelectedAssetUrls();
        },
        updatedSelectedAssets() {
            return this.$refs.CurrentAssetView.updatedSelectedAssets();
        },
    },
};
</script>
