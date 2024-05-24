<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                My Scenarios
            </template>
            <template slot="Center">
                <v-text-field
                    v-model="searchString"
                    rounded
                    hide-details
                    outlined
                    background-color="white"
                    color="rgba(0,0,0,.6)"
                    light
                    placeholder="Search..."
                    class="font-size-input placeholder-dark input-alternative input-icon"
                />
            </template>
        </AdminToolBar>
        <v-main>
            <v-container class="red">
                <v-row align="center">
                    <v-col>
                        <h3 class="text-h3 font-weight-bold">Start a new Transfer Thought</h3>
                    </v-col>
                </v-row>
            </v-container>

            <v-container>
                <Paging ref="PagingRef" query-name="ownerAppsByName" :hide-search="true" :query="searchString" :filter="{ type: { eq: 'master' } }">
                    <template v-slot:default="slotProps">
                        <div v-if="slotProps.loading">
                            <v-col cols="3">
                                <v-skeleton-loader class="mx-auto" type="card" />
                            </v-col>
                        </div>
                        <v-col v-for="app in slotProps.items" :key="app.id" cols="12" lg="3" md="6" class="py-0">
                            <AppCard :app="app" />
                        </v-col>
                    </template>
                </Paging>
            </v-container>
        </v-main>

        <ConfirmationDialog
            type="App"
            :name="appToDelete && appToDelete.name"
            :show="showConfirmationDialog"
            @cancel="showConfirmationDialog = false"
            @confirm="deleteApp"
        />
        <SnackMessages />
    </fragment>
</template>

<script>
import { mapState } from 'vuex';

import AdminToolBar from '@/components/AdminToolBar.vue';

import Paging from '@/components/Paging.vue';

import SnackMessages from '@/components/editor/SnackMessages.vue';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';
import * as UUID from 'uuid/v4';

export default {
    components: {
        AdminToolBar,
        Paging,
        SnackMessages,
        ConfirmationDialog,
    },
    data() {
        return {
            searchString: '',
            showConfirmationDialog: false,
            appToDelete: null,
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
        }),
        userInitials() {
            try {
                return this.user.attributes.email[0];
            } catch {
                return ':)';
            }
        },
    },
    methods: {
        async signOut() {
            this.drawer = false;
            await this.$store.dispatch('user/signOut');
            this.$router.push({ name: 'signin' });
        },
        async newApp(data) {
            const { default: app } = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/360Objective/app`);
            const newApp = {
                name: 'Untitled',
                config: JSON.stringify(app.config),
                state: JSON.stringify(app.state),
                actions: JSON.stringify(app.actions),
                thumbnailUrl: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
            };
            const newAppItem = await this.$store.dispatch('apps/createApp', newApp);
            this.$router.push({ name: 'AdminAppEditor', params: { appId: newAppItem.appId } });
        },
        deleteConfirmation(app) {
            this.showConfirmationDialog = true;
            this.appToDelete = app;
        },
        async cloneApp(app) {
            const newApp = {
                name: `${app.name} (clone)`,
                config: app.config,
                state: app.state,
                actions: app.actions,
                thumbnailUrl: app.thumbnailUrl,
            };
            const newAppItem = await this.$store.dispatch('apps/createApp', newApp);
            this.$router.push({ name: 'AdminAppEditor', params: { appId: newAppItem.appId } });
        },
        async deleteApp() {
            await this.$store.dispatch('apps/deleteApp', this.appToDelete);
            this.$refs.PagingRef.removeItem('appId', this.appToDelete.appId);
            this.appToDelete = null;
            this.showConfirmationDialog = false;
        },
    },
};
</script>
