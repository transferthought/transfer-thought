<template>
    <div>
        <v-row class="card-header-padding  card-border-bottom ma-0">
            <v-text-field
                v-model="link"
                rounded
                hide-details
                outlined
                background-color="white"
                color="rgba(0,0,0,.6)"
                light
                placeholder="Copy and paste link here..."
                class="font-size-input placeholder-dark input-alternative input-icon"
                @keyup.enter="setSelectedAsset"
            />
            <v-btn depressed rounded class="font-weight-600 text-h5 text-capitalize py-1 ml-3" @click="setSelectedAsset">
                Done
            </v-btn>
        </v-row>

        <v-row class="ma-0" v-if="selectedResult">
            <v-col cols="4" offset="4">
                <AssetCard :src="selectedResult.url" :thumbnail="selectedResult.url" :name="link" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import AssetCard from '@/features/assets/AssetCard.vue';
export default {
    name: 'ExploreAssets',
    components: { AssetCard },
    props: {},
    data() {
        return {
            link: '',
            selectedResult: null,
        };
    },
    methods: {
        setSelectedAsset() {
            this.selectedResult = {
                name: `https://qaqv02l4hh.execute-api.us-east-1.amazonaws.com/default/google-asset-passthrough?query=${this.link}`,
                url: `https://qaqv02l4hh.execute-api.us-east-1.amazonaws.com/default/google-asset-passthrough?query=${this.link}`,
            };
            this.$emit('selection-change', [this.selectedResult]);
        },
        async getSelectedAssetUrls() {
            const proxySrc = `https://qaqv02l4hh.execute-api.us-east-1.amazonaws.com/default/google-asset-passthrough?query=${this.link}`;
            const response = await fetch(proxySrc);
            const data = await response.blob();
            const imageUrl = await this.$store.dispatch('assets/createThumbnail', { file: data });
            return [imageUrl];
        },
    },
};
</script>
<style scoped></style>
