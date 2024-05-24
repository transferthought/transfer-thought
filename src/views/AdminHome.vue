<template>
    <v-content class="admin-home">
        <v-container style="overflow:auto">
            <v-row>
                <Paging query-name="ownerAppsByName" :filter="{ type: { eq: 'master' } }">
                    <template v-slot:default="slotProps">
                        <v-col cols="3">
                            <v-card class="mx-auto" outline hover @click="newAppDialog = true">
                                <v-img class="white--text align-end" height="200px">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-icon x-large>
                                                mdi-plus
                                            </v-icon>
                                        </v-row>
                                    </template>
                                </v-img>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-subtitle>
                                            Create new app
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                            <v-dialog v-model="newAppDialog" persistent max-width="600px">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">New App</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6">
                                                    <v-text-field v-model="newApp.name" label="Name" outlined />
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                        <small>*indicates required field</small>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer />
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="
                                                newAppDialog = false;
                                                this.newApp = {};
                                            "
                                        >
                                            Close
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="onNewApp">
                                            Create
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <div v-if="slotProps.loading">
                            <v-col cols="3">
                                <v-skeleton-loader class="mx-auto" type="card" />
                            </v-col>
                        </div>
                        <v-col v-for="item in slotProps.items" :key="item.id" cols="3">
                            <v-card class="mx-auto" outline hover>
                                <v-btn icon absolute right top class="mt-10" style="z-index: 3" @click="cloneApp(item)">
                                    <v-icon>mdi-circle-multiple</v-icon>
                                </v-btn>
                                <v-btn icon absolute right top color="red" style="z-index: 3" @click="deleteConfirmation(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                                <router-link :to="appUrl(item)">
                                    <v-img class="white--text align-end" height="200px" :src="item.thumbnailUrl + '?crossorigin' || ''">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-icon x-large>
                                                    mdi-google-cardboard
                                                </v-icon>
                                            </v-row>
                                        </template>
                                        <v-card-title>{{ item.name }}</v-card-title>
                                    </v-img>
                                </router-link>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-subtitle>Updated: {{ new Date(item.updatedAt) | dateFormat('MMMM D, YYYY') }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-card>
                        </v-col>
                    </template>
                </Paging>
            </v-row>
            <v-dialog v-model="deleteAppDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Delete App?</span>
                    </v-card-title>
                    <v-card-text>
                        Are you sure you want to delete this app?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="deleteAppDialog = false">
                            No
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="deleteApp(appToDelete)">
                            Yes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-content>
</template>

<script>
import Paging from '@/components/Paging.vue';

export default {
    components: {
        Paging,
    },
    data: () => ({
        selectedConfigId: null,
        newApp: {
            name: 'New App',
            state: '{}',
            actions: '{}',
        },
        newAppDialog: false,
        creatingNewApp: false,
        deleteAppDialog: false,
        appToDelete: null,
    }),
    methods: {
        appUrl(app) {
            return `/edit/${app.appId}`;
        },
        runUrl(app) {
            return `/run/${app.appId}`;
        },
        async onNewApp() {
            this.creatingNewApp = true;
            const app = await this.$store.dispatch('apps/createApp', this.newApp);
            this.$router.push({ name: 'editor', params: { appId: app.appId } });
        },
        deleteConfirmation(app) {
            this.deleteAppDialog = true;
            this.appToDelete = app;
        },
        async cloneApp(app) {
            this.newApp = {
                name: `${app.name} (clone)`,
                config: app.config,
                state: app.state,
                actions: app.actions,
            };
            this.newAppDialog = true;
        },
        async deleteApp(app) {
            await this.$store.dispatch('apps/deleteApp', app);
            this.deleteAppDialog = false;
        },
    },
};
</script>

<style>
.admin-home {
    height: 100vh;
    overflow-y: auto;
}
</style>
