<template>
    <v-row style="margin: 0">
        <v-col v-for="(item, index) in assets" :key="index" cols="3">
            <AssetCard :asset="item" @click="setSelectedAsset" />
        </v-col>
    </v-row>
</template>

<script>
import AssetCard from '@/features/assets/AssetCard.vue';

export default {
    name: 'SharedAssetsView',
    components: {
        AssetCard,
    },
    props: {
        onSelectedAssetChanged: Function,
    },
    data() {
        const srcBase = 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/client/360lev/';
        return {
            selectedAsset: null,
            assets: [
                { name: 'ALMA_panorama_two', src: `${srcBase}ALMA_panorama_two-4096x2048.jpg` },
                { name: 'Cosmic_Vista_two', src: `${srcBase}Cosmic_Vista_two-4096x2048.jpg` },
                { name: 'gwbone', src: `${srcBase}gwbone-4096x2048.jpg` },
                { name: 'gwbtwo', src: `${srcBase}gwbtwo-4096x2048.jpg` },
                { name: 'hellgate', src: `${srcBase}hellgate-4096x2048.jpg` },
                { name: 'Inside_the_Dome_two', src: `${srcBase}Inside_the_Dome_two-4096x2048.jpg` },
                { name: 'La_Silla_Observatory_two', src: `${srcBase}La_Silla_Observatory_two-4096x2048.jpg` },
                { name: 'rfksuspension', src: `${srcBase}rfksuspension-4096x2048.jpg` },
                { name: 'rfktruss', src: `${srcBase}rfktruss-4096x2048.jpg` },
                { name: 'vlt_panorama_two', src: `${srcBase}vlt_panorama_two-4096x2048.jpg` },
                { name: 'wards', src: `${srcBase}wards-4096x2048.jpg` },
            ],
        };
    },
    computed: {},
    watch: {
        selectedAsset() {
            if (this.onSelectedAssetChanged) {
                this.onSelectedAssetChanged(this.selectedAsset);
            }
        },
    },
    methods: {
        setSelectedAsset(asset) {
            this.selectedAsset = asset;
        },
    },
};
</script>
<style scoped></style>
