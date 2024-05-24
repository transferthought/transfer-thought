<template>
    <div>
        <v-row>
            <v-col>
                <label v-if="title" class="label-color font-weight-600 mb-2 d-block">{{ title }}</label>
                <v-hover>
                    <template v-slot:default="{ hover }">
                        <v-img class="white--text align-end" width="100%" :height="height" aspect-ratio="1.4" contain :src="currentSrc">
                            <v-fade-transition v-if="!disabled">
                                <v-overlay v-show="hover" absolute>
                                    <v-btn class="change-input-button" @click="showAssetSelector = true">
                                        Change
                                    </v-btn>
                                </v-overlay>
                            </v-fade-transition>
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-icon x-large>
                                        mdi-image
                                    </v-icon>
                                </v-row>
                            </template>
                        </v-img>
                    </template>
                </v-hover>
            </v-col>
        </v-row>
        <v-dialog v-model="showAssetSelector" hide-overlay transition="dialog-bottom-transition">
            <AssetViewer
                :multiple="multiple"
                :title-display="title"
                :views-to-show="['TRANSFER_THOUGHT_ASSETS', 'EXPLORE', 'MY_ASSET_VIEW']"
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
        name: {
            type: String,
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
                    subFolder: 'images',
                };
            },
        },
    },
    data() {
        return {
            showAssetSelector: false,
            newSrc: null,
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
            this.newSrc = newSrc;
            if (this.src !== this.newSrc) {
                this.$emit('change', this.newSrc);
            }
        },
    },
};
</script>
<style scoped></style>
