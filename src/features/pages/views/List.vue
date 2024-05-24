<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <h5 class="text-h5">
                    My Landing Pages
                </h5>
            </template>
            <template slot="Center">
                <v-text-field
                    id="pages-list-search"
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
                            <h4 class="text-h5">Start a new Landing Page</h4>
                        </v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col v-for="page in pageTemplates" :key="page.type" cols="12" lg="2" md="6">
                            <PageTemplateCard :page="page" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>
            <v-container v-if="pagesListStatus === 'LOADING'" id="pages-loader">
                <v-row>
                    <v-col cols="3">
                        <v-skeleton-loader type="card" />
                    </v-col>
                </v-row>
            </v-container>
            <v-container v-else>
                <v-row v-if="searchResults">
                    <v-col cols="12" md="3" v-for="page in searchResults" :key="page.id">
                        <PageCard :page="page" />
                    </v-col>
                </v-row>
                <v-row justify="center" v-if="pages.length > 0 && searchResults.length === 0">
                    <v-col cols="12">
                        <EmptyMessage title="No pages found" description="Try updating your search...." />
                    </v-col>
                </v-row>
                <v-row justify="center" v-if="pages.length === 0">
                    <v-col cols="12">
                        <EmptyMessage title="No pages yet" description="Create a new one from the options above" />
                    </v-col>
                </v-row>
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
                <v-tooltip :value="true" left v-for="page in pageTemplates" :key="page.id" color="grey darken-4">
                    <template v-slot:activator>
                        <v-btn fab small color="primary darken-1" class="ml-10" @click="createPage(page)">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Create {{ page.title }} page</span>
                </v-tooltip>
            </v-speed-dial>
        </v-main>

        <SnackMessages />
    </fragment>
</template>

<script>
import Fuse from 'fuse.js';

import AdminToolBar from '@/components/AdminToolBar.vue';

import SnackMessages from '@/components/editor/SnackMessages.vue';

import PageCard from '../components/PageCard.vue';
import PageTemplateCard from '../components/PageTemplateCard.vue';
import EmptyMessage from '@/components/EmptyMessage.vue';

export default {
    components: {
        AdminToolBar,
        SnackMessages,
        PageCard,
        PageTemplateCard,
        EmptyMessage,
    },
    data() {
        return {
            fab: false,
            refreshSearchResults: 0,
            searchString: '',
            pageTemplates: [
                {
                    title: 'Blank',
                    data: {
                        type: 'blank',
                        description: 'Great for embedding',
                        coverSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/8c3b3874-6bf0-4f12-a697-6119cc979140.470ab8df-56cd-4555-9f7d-efc3ce05d459',
                    },
                },
                {
                    title: 'Basic',
                    data: {
                        type: 'basic',
                        description: 'Modern Landing Page',
                        coverSrc: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
                    },
                },
            ],
        };
    },
    async mounted() {
        await this.$store.dispatch('pages/fetchList');
    },
    watch: {
        pages: {
            async handler() {
                // TRIGGER A RESET OF SEARCH RESULTS
                this.refreshSearchResults += 1;
                const options = {
                    keys: ['title'],
                    includeScore: true,
                    threshold: 0.3,
                    ignoreLocation: true,
                };
                this.fuse = new Fuse(this.pages || [], options);
            },
            immediate: true,
        },
    },
    computed: {
        pages() {
            return this.$store.getters['pages/list'];
        },
        pagesListStatus() {
            return this.$store.state.pages.listStatus;
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
            return this.pages;
        },
        async createPage(page) {
            const newPage = await this.$store.dispatch('pages/create', { data: page.data });
            this.$router.push({ name: 'PageEditor', params: { pageId: newPage.id } });
        },
    },
};
</script>
