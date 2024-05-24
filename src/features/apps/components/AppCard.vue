<template>
    <fragment>
        <v-card :data-title="app.name" outlined hover rounded class="app-card mb-6" :to="{ name: 'AppEditor', params: { appId: app.appId } }">
            <v-img :src="app.thumbnailUrl" height="210">
                <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-icon x-large>
                            mdi-image
                        </v-icon>
                    </v-row>
                </template>
            </v-img>

            <v-card-text class="pr-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <v-list-item-title class="text-h6 text-typo font-weight-600 mb-0">
                            {{ app.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>Updated {{ new Date(app.updatedAt) | dateFormat('MM/DD/YYYY') }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-menu id="app-card-menu" bottom min-width="200px" rounded offset-y class="ml-2">
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" v-on:click.prevent>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item id="app-card-menu-duplicate" @click="handleCloneClick">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Duplicate</v-list-item-title>
                                </v-list-item>
                                <v-list-item id="app-card-menu-delete" @click="showConfirmationDialog = true">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-delete</v-icon>
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
            type="App"
            :name="app && app.name"
            :show="showConfirmationDialog"
            :loading="deleting"
            @cancel="showConfirmationDialog = false"
            @confirm="handleDelete"
        />
    </fragment>
</template>

<script>
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

export default {
    components: { ConfirmationDialog },
    props: {
        app: Object,
    },
    data() {
        return {
            deleting: false,
            showConfirmationDialog: false,
        };
    },
    computed: {},
    methods: {
        async handleCloneClick() {
            const newApp = {
                name: `${this.app.name} (clone)`,
                config: this.app.config,
                state: this.app.state,
                actions: this.app.actions,
                thumbnailUrl: this.app.thumbnailUrl,
            };
            const newAppItem = await this.$store.dispatch('apps/createApp', newApp);
            this.$router.push({ name: 'AppEditor', params: { appId: newAppItem.appId } });
        },
        async handleDelete() {
            this.deleting = true;
            await this.$store.dispatch('apps/destroy', { appId: this.app.appId, type: this.app.type });
            this.deleting = false;
            this.showConfirmationDialog = false;
            this.$store.commit('apps/snackMessage', {
                message: 'Successfully Deleted App',
                color: 'success',
            });
        },
    },
};
</script>
