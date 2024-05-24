<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <h5 id="apps-list-title" class="text-h5">
                    My Transfer Thoughts
                </h5>
            </template>
            <template slot="Center">
                <v-text-field
                    id="apps-list-search"
                    v-model="searchString"
                    rounded
                    outlined
                    hide-details
                    background-color="white"
                    light
                    placeholder="Search..."
                />
            </template>
        </AdminToolBar>
        <v-main>
            <v-container fluid class="grey lighten-2 hidden-sm-and-down">
                <v-container>
                    <v-row align="center">
                        <v-col>
                            <h4 class="text-h5">Start a new Transfer Thought</h4>
                        </v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col cols="12" lg="2" md="6">
                            <NewAppCard />
                        </v-col>

                        <v-col v-for="app in appTemplates" :key="app.appId" cols="12" lg="2" md="6">
                            <AppTemplateCard :app="app" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>

            <v-container class="pt-5">
                <v-row align="center">
                    <v-col>
                        <h4 class="text-h5">Recent Transfer Thoughts</h4>
                    </v-col>
                </v-row>

                <v-container v-if="appListStatus === 'SUCCESS'">
                    <v-row v-if="searchResults">
                        <v-col cols="12" md="3" v-for="app in searchResults" :key="app.appId">
                            <AppCard :app="app" />
                        </v-col>
                    </v-row>
                    <v-row justify="center" v-if="appList.length > 0 && searchResults.length === 0">
                        <v-col cols="12">
                            <EmptyMessage title="No Transfer Thoughts found" description="Try updating your search...." />
                        </v-col>
                    </v-row>
                    <v-row justify="center" v-if="appList.length === 0">
                        <v-col cols="12">
                            <EmptyMessage title="No Transfer Thoughts yet" description="Create a new one from the options above" />
                        </v-col>
                    </v-row>
                </v-container>

                <v-container v-else id="apps-loader">
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-skeleton-loader type="card" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>

            <v-speed-dial v-model="fab" bottom right fixed class="hidden-md-and-up">
                <template v-slot:activator>
                    <v-btn v-model="fab" color="primary darken-2" dark fab>
                        <v-icon v-if="fab">
                            mdi-close
                        </v-icon>
                        <v-icon v-else>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </template>

                <v-tooltip :value="true" left color="grey darken-4">
                    <template v-slot:activator>
                        <v-btn fab small color="primary darken-1" class="ml-10" @click="newApp">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Create Blank App</span>
                </v-tooltip>

                <v-tooltip :value="true" left color="grey darken-4">
                    <template v-slot:activator>
                        <v-btn fab small color="primary darken-1" class="ml-10" @click="newAppFromTemplate('a0f21d31-0cf4-490b-83ac-a700876cb23e')">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Create Starter App</span>
                </v-tooltip>
                <!-- <v-tooltip :value="true" left v-for="app in appTemplates" :key="app.appId" color="grey darken-4">
                    <template v-slot:activator>
                        <v-btn fab small color="primary darken-1" class="ml-10">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ app.name }}</span>
                </v-tooltip> -->
            </v-speed-dial>
        </v-main>
        <SnackMessages />
    </fragment>
</template>

<script>
import Fuse from 'fuse.js';

import AdminToolBar from '@/components/AdminToolBar.vue';

import Paging from '@/components/Paging.vue';

import SnackMessages from '@/components/editor/SnackMessages.vue';
import AppCard from '../components/AppCard.vue';
import NewAppCard from '../components/NewAppCard.vue';
import AppTemplateCard from '../components/AppTemplateCard.vue';
import EmptyMessage from '@/components/EmptyMessage.vue';

export default {
    components: {
        AdminToolBar,
        Paging,
        SnackMessages,
        AppCard,
        NewAppCard,
        AppTemplateCard,
        EmptyMessage,
    },
    data() {
        return {
            fab: false,
            refreshSearchResults: 0,
            searchString: '',
            appTemplates: [
                {
                    name: 'Starter',
                    appId: 'a0f21d31-0cf4-490b-83ac-a700876cb23e',
                    thumbnailUrl:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/8c3b3874-6bf0-4f12-a697-6119cc979140.470ab8df-56cd-4555-9f7d-efc3ce05d459',
                },
                {
                    name: 'Fire Safety',
                    appId: 'b88151e2-98af-44dd-966e-71602bb4be8f',
                    thumbnailUrl:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/9d521084-81df-43b2-a1d8-9778e6aedee9.328fe178-f438-4c0d-872c-659a261dc61e',
                },
                {
                    name: 'Table Saw',
                    appId: '2684be4b-40ad-4eb5-9cf7-6e2766b75e85',
                    thumbnailUrl:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/96a25b0e-84ce-4d9a-85d5-31404ae825e1.67cd8172-9882-4cc7-a01b-8ea65a588a6b',
                },
                {
                    name: 'Fork Lift',
                    appId: '49e31bc0-502c-40ba-aeee-328d55e5c938',
                    thumbnailUrl:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/37bc7dfa-7343-45fc-93da-91909ff039d9.45900bc4-0e16-4f47-81d6-60d2bc25fd44',
                },
                {
                    name: 'Loader',
                    appId: '8e727173-3197-43b1-9264-33bc8fd15761',
                    thumbnailUrl:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/6546228b-e57a-43d2-848f-52011271264c.31b7c0ec-78ba-4e82-a402-7e2dc1e7dc65',
                },
            ],
        };
    },
    async mounted() {
        await this.$store.dispatch('apps/fetchList');
    },
    watch: {
        appList: {
            async handler() {
                // TRIGGER A RESET OF SEARCH RESULTS
                this.refreshSearchResults += 1;
                const options = {
                    keys: ['name'],
                    includeScore: true,
                    threshold: 0.3,
                    ignoreLocation: true,
                };
                this.fuse = new Fuse(this.appList || [], options);
            },
            immediate: true,
        },
    },
    computed: {
        appListStatus() {
            return this.$store.state.apps.listStatus;
        },
        appList() {
            const appLists = this.$store.getters['apps/list'];
            debugger;
            return appLists;
        },
        isSearching() {
            return this.searchString && this.searchString.length;
        },
        searchResults() {
            this.refreshSearchResults;
            if (this.isSearching) {
                const searchResults = this.fuse.search(this.searchString);
                return _.map(searchResults, (result) => result.item);
            }
            return this.appList;
        },
    },
    methods: {
        async signOut() {
            this.drawer = false;
            await this.$store.dispatch('user/signOut');
            this.$router.push({ name: 'signin' });
        },
        async newApp() {
            const { default: app } = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/360Objective/app`);
            const newApp = {
                name: 'Untitled',
                config: JSON.stringify(app.config),
                state: JSON.stringify(app.state),
                actions: JSON.stringify(app.actions),
                thumbnailUrl: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
            };
            const newAppItem = await this.$store.dispatch('apps/createApp', newApp);
            this.$router.push({ name: 'AppEditor', params: { appId: newAppItem.appId } });
        },
        async newAppFromTemplate(appId) {
            const newAppItem = await this.$store.dispatch('apps/cloneApp', { appId });
            this.$router.push({ name: 'AppEditor', params: { appId: newAppItem.appId } });
        },
    },
};
</script>
