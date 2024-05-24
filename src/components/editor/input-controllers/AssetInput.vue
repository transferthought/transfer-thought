<template>
    <div>
        <label class="label-color font-weight-600 mb-2 d-block">
            {{ inputDefinition.label || inputDefinition.name }}
        </label>

        <AssetCard v-if="value" :src="value" :name="value" :thumbnail="value" @click="showAssetSelector = true" />
        <v-btn v-else depressed color="primary" class="text-h4 font-weight-600 mb-0 text-capitalize" large @click="showAssetSelector = true">
            {{ (inputDefinition.data && inputDefinition.data.select) || 'Select' }}
        </v-btn>
        <v-dialog v-model="showAssetSelector" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="showAssetSelector = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Assets</v-toolbar-title>
                    <v-spacer />
                </v-toolbar>
                <AssetViewer
                    class="asset-viewer-content"
                    :title-display="inputDefinition.data && inputDefinition.data.title"
                    :select-display="inputDefinition.data && inputDefinition.data.select"
                    :views-to-show="inputDefinition.data && inputDefinition.data.views"
                    :options="inputDefinition.data && inputDefinition.data.viewOptions"
                    @close="showAssetSelector = false"
                    @selected="updateValueWithSelectedAsset"
                ></AssetViewer>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import AssetViewer from '@/features/assets/AssetViewer.vue';
import BaseInput from './BaseInput.vue';
import AssetCard from '@/features/assets/AssetCard.vue';

export default {
    name: 'AssetInput',
    components: { AssetViewer, AssetCard },
    extends: BaseInput,
    props: {
        currentValue: String,
    },
    data() {
        return {
            showAssetSelector: false,
        };
    },
    methods: {
        updateValueWithSelectedAsset(selectedAsset) {
            if (selectedAsset) {
                this.value = selectedAsset;
            }
            this.showAssetSelector = false;
        },
    },
};
</script>
<style scoped>
.asset-viewer-content {
    height: calc(100vh - 64px - 52px);
}
</style>
