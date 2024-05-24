<template>
    <v-container>
        <HiddenFileInput multiple @files-changed="handleFileUpload" ref="HiddenFileInput">
            <template v-slot:default="{ openFileSelect }">
                <v-card
                    @drop.prevent="onDrop($event)"
                    @dragover.prevent="dragover = true"
                    @dragenter.prevent="dragover = true"
                    @dragleave.prevent="dragover = false"
                    @click="openFileSelect"
                    :class="{ 'grey lighten-2': dragover }"
                    tile
                    flat
                >
                    <v-card-text>
                        <v-row class="d-flex flex-column" dense align="center" justify="center">
                            <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
                                mdi-cloud-upload
                            </v-icon>
                            <p>Drop your file(s) here, or click to select them.</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </template>
        </HiddenFileInput>

        <v-list dense height="240" class="mt-4" style="overflow-y: scroll;">
            <v-subheader>{{ uploadLabel }}</v-subheader>
            <v-list-item v-for="asset in uploadingAssets" :key="asset.id" @click="handleUploadedAssetClick(asset)">
                <v-list-item-content>
                    <v-list-item-title>{{ asset.name }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action class="ma-0">
                    <v-btn icon v-if="asset.status === 'SUCCESS'">
                        <v-icon color="green">mdi-check-circle</v-icon>
                    </v-btn>
                    <v-progress-circular v-else color="primary" :value="asset.progressPercent"></v-progress-circular>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<script>
import _ from 'lodash';
import gql from 'graphql-tag';
import * as UUID from 'uuid/v4';
import Client from '@/tt-api';

import HiddenFileInput from '@/components/HiddenFileInput.vue';
export default {
    name: 'AssetsUploader',
    components: {
        HiddenFileInput,
    },
    props: {},
    data() {
        return {
            dragover: false,
            files: null,
            publishing: false,
        };
    },
    computed: {
        uploadingAssets() {
            return this.$store.state.assets.uploading;
        },
        uploadLabel() {
            if (this.uploadingAssets && this.uploadingAssets.length) {
                const counts = _.countBy(this.uploadingAssets, 'status');
                if (counts.UPLOADING) {
                    return `${counts.UPLOADING} item(s) uploading`;
                } else if (counts.SUCCESS) {
                    return `${counts.SUCCESS} item(s) uploaded`;
                }
            }
            return null;
        },
        currentParentId() {
            return this.$store.state.assets.currentParentId;
        },
    },
    watch: {
        files() {
            if (this.files) {
                this.uploadAssets();
            }
        },
    },
    methods: {
        handleFileUpload(files) {
            this.files = [...files];
        },
        onDrop(e) {
            this.dragover = false;
            this.files = [...e.dataTransfer.files];
        },
        async uploadAssets() {
            this.publishing = true;
            const newAssets = [];
            this.$emit('open-my-assets');
            await Promise.all(
                this.files.map(async (file) => {
                    try {
                        const id = UUID();
                        const key = UUID();
                        const name = file.name.indexOf('.') > -1 ? file.name.split('.')[0] : file.name;
                        const fileType = file.type || 'application/octet-stream';
                        const newAsset = { id, key, name, fileType, tag: 'unknown', file, parentId: this.currentParentId };
                        newAssets.push(newAsset);
                        await this.$store.dispatch('assets/create', newAsset);
                    } catch (err) {
                        Client.Logger.error(err);
                    }
                })
            );
            const message = `${this.files.length} asset(s) uploaded`;
            this.$store.commit('apps/snackMessage', { message, color: 'success' });
            this.files = null;
            this.publishing = false;
            this.$emit('open-my-assets', newAssets);
        },
        handleUploadedAssetClick(asset) {
            this.$emit('open-my-assets', [asset]);
            this.$store.dispatch('assets/setCurrentParentId', { id: asset.parentId });
        },
        openFileSelect() {
            if (this.$refs.HiddenFileInput) {
                this.$refs.HiddenFileInput.openFileSelect();
            }
        },
    },
};
</script>
