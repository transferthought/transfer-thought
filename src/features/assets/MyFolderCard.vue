<template>
    <fragment>
        <v-card :data-title="folder.name" outlined hover rounded class="folder-card mb-6" @click="$emit('click')">
            <div class="row fill-height ma-0 align-center justify-center">
                <v-icon class="text-center" width="100%" style="font-size: 200px;">mdi-folder</v-icon>
            </div>
            <v-card-text class="pa-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <ClickToEditTextInput :id="'folder-name-input-' + folder.name" ref="name-editor" :value="folder.name" @change="handleAssetNameChange">
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
                        <v-menu id="folder-card-menu" bottom min-width="200px" rounded offset-y class="ml-2">
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" v-on:click.prevent>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list dense>
                                <v-list-item id="folder-card-menu-rename" @click="handleRenameClick">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-pencil-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Rename</v-list-item-title>
                                </v-list-item>
                                <v-list-item id="folder-card-menu-delete" @click="showConfirmationDialog = true">
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
            type="Folder"
            :name="folder && folder.name"
            :show="showConfirmationDialog"
            :loading="deleting"
            @cancel="showConfirmationDialog = false"
            @confirm="handleDeleteAsset"
        >
            <template v-slot:ExtraOptions>
                This folder contains {{ childAssets.length }} assets. How would you like to handle them?
                <v-radio-group v-model="deleteFolderContent">
                    <v-radio label="Delete folder but move the content to root" value="reparentToRoot"></v-radio>
                    <v-radio label="Delete folder and all of it's content" value="deleteAll"></v-radio>
                </v-radio-group>
            </template>

            <slot name="Right" class="mr-2" />
        </ConfirmationDialog>
    </fragment>
</template>

<script>
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';

import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

export default {
    name: 'MyFolderCard',
    components: { ConfirmationDialog, ClickToEditTextInput },
    props: {
        folder: Object,
    },
    data() {
        return {
            tempName: null,
            deleting: false,
            deleteFolderContent: 'reparentToRoot',
            showConfirmationDialog: false,
        };
    },
    computed: {
        childAssets() {
            return this.$store.getters['assets/childAssets'](this.folder.id);
        },
    },
    methods: {
        async handleAssetNameChange(newName) {
            if (newName !== this.folder.name) {
                this.tempName = newName;
                await this.$store.dispatch('assets/update', { newItem: { id: this.folder.id, name: newName } });
                this.tempName = null;
            }
        },
        handleMoveClick() {},

        handleRenameClick() {
            const assetNameEditor = this.$refs['name-editor'];
            assetNameEditor.enableEdit();
        },
        async handleDeleteAsset() {
            this.deleting = true;
            if (this.deleteFolderContent === 'reparentToRoot') {
                // update all child assets
                const allRequests = this.childAssets.map((child) => {
                    this.$store.dispatch('assets/update', { newItem: { id: child.id, parentId: null } });
                });
                await Promise.all(allRequests);
            } else {
                const allRequests = this.childAssets.map((child) => {
                    this.$store.dispatch('assets/destroy', { id: child.id });
                });
                await Promise.all(allRequests);
            }
            await this.$store.dispatch('assets/destroy', { id: this.folder.id });
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
