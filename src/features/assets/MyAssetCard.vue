<template>
    <fragment>
        <v-card :data-title="asset.name" outlined hover rounded class="asset-card mb-6" :color="active ? 'primary lighten-1' : ''" @click="$emit('click')">
            <v-container fluid class="pa-0" v-if="isAudio">
                <v-row class="fill-height ma-0 align-center justify-center">
                    <v-icon class="text-center" width="100%" style="font-size: 200px;">mdi-music</v-icon>
                </v-row>
                <v-row class="px-2">
                    <v-col cols="3">
                        <v-btn icon x-large v-show="!audio.playing()" @click.stop="play">
                            <v-icon x-large>
                                mdi-play
                            </v-icon>
                        </v-btn>

                        <v-btn icon x-large v-show="audio.playing()" @click.stop="stop">
                            <v-icon>
                                mdi-stop
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-container fluid class="pa-0" v-else>
                <v-img class="ma-1 rounded-sm white--text align-end thumbnail" lazy-src="http://placehold.jp/200x200.png" aspect-ratio="1" :src="thumbnail">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5" />
                        </v-row>
                    </template>
                </v-img>
            </v-container>
            <v-card-text class="pa-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <ClickToEditTextInput :id="'asset-name-input-' + asset.name" ref="name-editor" :value="asset.name" @change="handleAssetNameChange">
                            <template v-slot:Display="{ value, edit }">
                                <v-list-item-title v-if="tempName" class="text-truncate text-typo mb-0">{{ tempName }} (saving...)</v-list-item-title>
                                <v-list-item-title v-else class="text-truncate text-typo font-weight-600 mb-0" @click.stop="edit">
                                    {{ value }}
                                </v-list-item-title>
                            </template>
                        </ClickToEditTextInput>
                        <!-- <v-list-item-subtitle>Updated {{ new Date(updatedAt) | dateFormat('MM/DD/YYYY') }}</v-list-item-subtitle> -->
                    </v-list-item-content>
                    <v-list-item-action class="ma-0">
                        <v-menu
                            v-model="isMenuOpen"
                            id="asset-card-menu"
                            bottom
                            :close-on-content-click="false"
                            min-width="200px"
                            rounded
                            offset-y
                            class="ml-2"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" v-on:click.prevent>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list dense>
                                <v-list-group id="asset-card-menu-move" prepend-icon="mdi-folder-move-outline">
                                    <template v-slot:activator>
                                        <v-list-item-title>Move</v-list-item-title>
                                    </template>

                                    <v-list-item
                                        v-for="folder in folders"
                                        :key="folder.id"
                                        :disabled="folder.id === currentParentId"
                                        @click="handleMoveClick(folder)"
                                    >
                                        <v-list-item-content class="ml-5">
                                            <v-list-item-title>
                                                {{ folder.name }}
                                                <span v-if="folder.id === currentParentId">(current)</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-folder-outline</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list-group>
                                <v-divider></v-divider>

                                <v-list-item id="asset-card-menu-rename" @click="handleRenameClick">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-pencil-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Rename</v-list-item-title>
                                </v-list-item>
                                <v-list-item id="asset-card-menu-delete" @click="showConfirmationDialog = true">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item-action>
                </v-list-item>
            </v-card-text>
        </v-card>

        <ConfirmationDialog
            type="Asset"
            :name="asset && name"
            :show="showConfirmationDialog"
            :loading="deleting"
            @cancel="showConfirmationDialog = false"
            @confirm="handleDeleteAsset"
        />
    </fragment>
</template>

<script>
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';

import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

export default {
    name: 'MyAssetCard',
    components: { ConfirmationDialog, ClickToEditTextInput },
    props: {
        asset: Object,
        src: String,
        name: String,
        active: Boolean,
    },
    data() {
        return {
            tempName: null,
            isAudio: false,
            audio: null,
            deleting: false,
            showConfirmationDialog: false,
            isMenuOpen: false,
        };
    },
    mounted() {
        this.checkIsAudio();
    },
    computed: {
        folders() {
            return this.$store.getters['assets/folders'];
        },
        currentParentId() {
            return this.$store.state.assets.currentParentId;
        },
        thumbnail() {
            return this.asset?.variationUrls?.thumbnail || this.asset.src;
        },
    },
    methods: {
        async checkIsAudio() {
            try {
                if (this.src.endsWith('.wav') || this.src.endsWith('.mp3')) {
                    this.isAudio = true;
                } else {
                    const res = await fetch(this.src, { method: 'HEAD' });
                    this.isAudio = res.headers.get('content-type').startsWith('audio');
                }
                this.initAudio();
            } catch (err) {
                console.error(err);
            }
        },
        initAudio() {
            if (this.isAudio) {
                this.audio = new Howl({
                    src: [this.src],
                    html5: true,
                });
            }
        },
        play() {
            this.audio.play();
        },
        stop() {
            this.audio.stop();
        },
        async handleAssetNameChange(newName) {
            if (newName !== this.asset.name) {
                this.tempName = newName;
                await this.$store.dispatch('assets/update', { newItem: { id: this.asset.id, name: newName } });
                this.tempName = null;
            }
        },
        async handleMoveClick(newParent) {
            await this.$store.dispatch('assets/update', { newItem: { id: this.asset.id, parentId: newParent.id } });
            this.isMenuOpen = false;
            this.$store.commit('apps/snackMessage', {
                message: 'Successfully Moved Asset',
                color: 'success',
            });
        },

        handleRenameClick() {
            this.isMenuOpen = false;

            const assetNameEditor = this.$refs['name-editor'];
            assetNameEditor.enableEdit();
        },
        async handleDeleteAsset() {
            this.deleting = true;
            this.isMenuOpen = false;

            await this.$store.dispatch('assets/destroy', { id: this.asset.id });
            this.deleting = false;

            this.showConfirmationDialog = false;
            this.$store.commit('apps/snackMessage', {
                message: 'Successfully Deleted Asset',
                color: 'success',
            });
        },
    },
};
</script>
<style scoped>
.thumbnail {
    overflow: hidden;
}
</style>
