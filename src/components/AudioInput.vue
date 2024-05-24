<template>
    <div>
        <v-row>
            <v-col>
                <label v-if="title" class="label-color font-weight-600 mb-2 d-block">{{ title }}</label>
                <v-hover>
                    <template v-slot:default="{ hover }">
                        <v-btn id="end-audio-button">
                            <v-fade-transition v-if="!disabled">
                                <v-overlay v-show="hover" absolute>
                                    <v-btn @click="showAssetSelector = true">
                                        Change Audio
                                    </v-btn>
                                </v-overlay>
                            </v-fade-transition>
                            <v-icon medium>
                                mdi-music
                            </v-icon>
                            {{ getFileNameFromUrl(src) }}
                        </v-btn>
                    </template>
                </v-hover>
            </v-col>
        </v-row>
        <v-dialog v-model="showAssetSelector" hide-overlay transition="dialog-bottom-transition">
            <AssetViewer
                :multiple="multiple"
                :title-display="title"
                :views-to-show="['TRANSFER_THOUGHT_ASSETS', 'MY_ASSET_VIEW']"
                :options="viewOptions"
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
            default() {
                return {
                    subFolder: 'audio',
                };
            },
        },
    },
    data() {
        return {
            showAssetSelector: false,
        };
    },
    computed: {
        selectDisplay() {
            return `Change ${this.title}`;
        },
        currentSrc() {
            if (typeof this.src === 'string') {
                return this.src;
            }
            if (this.multiple && this.src.length > 0) {
                return this.src[0];
            }
            return '';
        },
    },
    methods: {
        handleSelectedAsset(newSrc) {
            this.showAssetSelector = false;
            if (this.src !== newSrc) {
                this.$emit('change', newSrc);
            }
        },
        getFileNameFromUrl(url) {
            let name = url.split('/');
            name = name[name.length - 1];
            return name.replace(/_/g, ' ');
        },
    },
};
</script>
<style scoped>
#end-audio-button {
    background-color: white !important;
}
</style>
