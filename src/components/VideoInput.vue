<template>
    <div>
        <v-row>
            <v-col>
                <label v-if="title" class="label-color font-weight-600 mb-2 d-block">{{ title }}</label>
                <v-btn @click="showAssetSelector = true">
                    Change
                </v-btn>
                <!-- <v-btn @click="clearVideo">
                    Remove
                </v-btn> -->
                <video v-if="videoSrc" controls width="50%" :key="videoSrc">
                    <source :src="videoSrc" type="video/mp4" />
                </video>
            </v-col>
        </v-row>
        <v-dialog v-model="showAssetSelector" hide-overlay transition="dialog-bottom-transition">
            <AssetViewer
                :multiple="multiple"
                :title-display="title"
                :views-to-show="['MY_ASSET_VIEW']"
                @close="showAssetSelector = false"
                @selected="handleSelectedAsset"
            />
        </v-dialog>
    </div>
</template>

<script>
import AssetViewer from '@/features/assets/AssetViewer.vue';

export default {
    name: 'AssetInput',
    components: { AssetViewer },
    props: {
        height: {
            type: Number,
            default: 200,
        },
        src: {
            type: [String, Array],
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        disabled: Boolean,
        multiple: {
            type: Boolean,
            default: false,
        },
        viewOptions: {
            default: {
                subFolder: 'videos',
            },
        },
    },
    data() {
        return {
            showAssetSelector: false,
            videoSrc: this.src,
        };
    },
    computed: {
        selectDisplay() {
            return `Change ${this.title}`;
        },
        // currentSrc() {
        //     if (typeof this.src === 'string') {
        //         return this.src;
        //     }
        //     if (this.multiple && this.src.length > 0) {
        //         return this.src[0];
        //     }
        //     return '';
        // },
    },
    methods: {
        handleSelectedAsset(newSrc) {
            console.log(newSrc);
            this.showAssetSelector = false;
            if (this.videoSrc !== newSrc) {
                this.videoSrc = newSrc;
                this.$emit('change', newSrc);
            }
        },
        clearVideo() {
            this.videoSrc = null;
            this.$emit('change', null);
            // this.updateStepData(src, null);
        },
    },
};
</script>
<style scoped></style>
