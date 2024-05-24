<template>
    <div>
        <v-file-input
            v-model="file"
            label="Upload image"
        >
            <template v-slot:selection="{ text }">
                {{ text }}
            </template>
        </v-file-input>
        <img
            ref="hiddenImageContainer"
            style="display: none;"
        >
    </div>
</template>

<script>
import gql from 'graphql-tag';
import * as UUID from 'uuid/v4';
import Client from '@/tt-api';
import BaseInput from './BaseInput.vue';

export default {
    name: 'BooleanInput',
    extends: BaseInput,
    props: {
        currentValue: [HTMLImageElement, Object, String],
    },
    data() {
        return {
            file: null,
            published: false,
        };
    },
    watch: {
        file() {
            if (this.file) {
                // const uploadFileBlob = URL.createObjectURL(this.file);
                // this.$refs.hiddenImageContainer.src = uploadFileBlob;
                // this.value = this.$refs.hiddenImageContainer;
                this.uploadAsset(this.file);
            } else {
                this.value = '';
            }
        },
    },
    methods: {
        async uploadAsset(file) {
            const key = UUID();

            await Client.Storage.put(key, file, {
                contentType: file.type,
            });

            const { data: { createAsset: asset } } = await this.$apollo.mutate({
                mutation: gql(Client.Mutations.createAsset),
                variables: {
                    input: {
                        name: file.name,
                        key,
                        tag: 'unknown',
                        fileType: file.type,
                    },
                },
            });

            this.value = Client.getAssetUrl(asset.key);
        },
    },
};
</script>
