<template>
    <div>
        <v-row class="card-header-padding  card-border-bottom ma-0">
            <v-text-field
                id="assets-list-search"
                v-model="searchString"
                rounded
                hide-details
                outlined
                background-color="white"
                color="rgba(0,0,0,.6)"
                light
                placeholder="Search for places, objects, and more..."
                class="font-size-input placeholder-dark input-alternative input-icon"
                @input="search"
            />
        </v-row>
        <v-card-text v-if="assetListStatus === 'SUCCESS'" class="card-padding">
            <v-breadcrumbs :items="breadcrumbs">
                <template v-slot:item="{ item }">
                    <v-btn text color="primary" @click="setParent(item)" :disabled="item.disabled">{{ item.name }}</v-btn>
                </template>
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
            <v-row class="ma-0">
                <v-col cols="12" md="3" v-if="currentParentId === null">
                    <v-card class="asset-folder-new" outlined @click="handleNewFolder">
                        <div class="row fill-height ma-0 align-center justify-center">
                            <v-icon class="text-center" width="100%" style="font-size: 200px;">mdi-plus</v-icon>
                        </div>
                        <p class="text-capitalize text-center">
                            Create New Folder
                        </p>
                    </v-card>
                </v-col>
                <v-col v-for="(item, index) in folders" :key="index" cols="12" md="3">
                    <MyFolderCard :folder="item" @click="setParent(item)" />
                </v-col>
            </v-row>
            <v-item-group v-model="selectedIndexes" :multiple="multiple">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results.slice(0, maxResults)" :key="index" cols="12" md="3">
                        <v-item v-slot="{ active, toggle }">
                            <MyAssetCard :active="active" :asset="item" :src="item.src" :name="item.name" @click="toggle"></MyAssetCard>
                        </v-item>
                    </v-col>
                    <v-col v-if="loading" cols="12" md="3">
                        <v-card outlined>
                            <v-skeleton-loader class="mx-auto" type="card" />
                        </v-card>
                    </v-col>
                </v-row>
            </v-item-group>
            <v-row justify="center" v-if="assetList.length > 0 && results.length === 0">
                <v-col cols="12">
                    <EmptyMessage title="No Transfer Thoughts found" description="Try updating your search...." />
                </v-col>
            </v-row>
            <v-row justify="center" v-if="assetList.length === 0">
                <v-col cols="12">
                    <EmptyMessage title="No Transfer Thoughts yet" description="Create a new one from the options above" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <v-row>
                <v-col cols="3">
                    <v-skeleton-loader type="card" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn v-if="maxResults < results.length" class="font-weight-600 text-capitalize" depressed @click="showMore">
                Show More
            </v-btn>
            <v-spacer />
        </v-card-actions>
    </div>
</template>

<script>
import _ from 'lodash';
import Client from '@/tt-api';
import gql from 'graphql-tag';
import * as UUID from 'uuid/v4';
import { mapState } from 'vuex';
import MyAssetCard from '@/features/assets/MyAssetCard.vue';
import MyFolderCard from '@/features/assets/MyFolderCard.vue';

import AssetViewMixin from './AssetViewMixin';

import Fuse from 'fuse.js';
import EmptyMessage from '@/components/EmptyMessage.vue';

export default {
    name: 'MyAssetsView',
    components: {
        MyAssetCard,
        MyFolderCard,
        EmptyMessage,
    },
    mixins: [AssetViewMixin],
    props: {
        uploadedAssets: Array,
    },
    data() {
        return {
            refreshSearchResults: 0,
            searchString: '',
            assetToDelete: null,
            showConfirmationDialog: false,
            maxResults: 8,
        };
    },
    watch: {
        currentParentId() {
            this.updateResults();
        },
        assetList: {
            async handler() {
                // TRIGGER A RESET OF SEARCH RESULTS
                this.refreshSearchResults += 1;
                const options = {
                    keys: ['name'],
                    includeScore: true,
                    threshold: 0.3,
                    ignoreLocation: true,
                };
                this.fuse = new Fuse(this.assetList || [], options);
                this.updateResults();
            },
            immediate: true,
        },
    },
    async created() {
        await this.$store.dispatch('assets/init');
        await this.$store.dispatch('assets/fetchList');

        this.subscription = this.$store.subscribe((mutation) => {
            const { type, payload } = mutation;
            if (type === 'assets/updateUploadingItem') {
                console.log('payload', payload);
                if (payload.status === 'SUCCESS') {
                    const selectIndex = _.findIndex(this.results);
                    console.log('new index', selectIndex);
                    this.updateSelectedIndexes(selectIndex);
                }
                debugger;
            }
        });
    },
    beforeDestroy() {
        this.subscription();
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),
        assetList() {
            return this.$store.getters['assets/list'];
        },
        assetListStatus() {
            return this.$store.state.assets.listStatus;
        },
        uploadingAssets() {
            return this.$store.state.assets.uploading;
        },
        currentParentId() {
            return this.$store.state.assets.currentParentId;
        },
        breadcrumbs() {
            return this.$store.getters['assets/breadcrumbs'];
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
            return this.assetList;
        },
    },
    methods: {
        updatedSelectedAssets(newAssets) {
            console.log('updatedSelectedAssets');
            if (this.multiple) {
                this.selectedIndexes = _.map(newAssets, (newAsset) => {
                    return _.findIndex(this.results, (currentResult) => {
                        return newAsset.id === currentResult.id;
                    });
                });
            } else if (newAssets.length) {
                this.selectedIndexes = _.findIndex(this.results, (currentResult) => {
                    return newAssets[0].id === currentResult.id;
                });
            }
        },
        search() {
            this.updateResults();
        },
        async showMore() {
            this.maxResults += 8;
        },
        async handleNewFolder() {
            const id = UUID();
            const key = UUID();
            const name = 'New Folder';

            await this.$store.dispatch('assets/createFolder', { id, key, name, parentId: this.currentParentId, tag: 'unknown' });
        },

        async setParent(item) {
            await this.$store.dispatch('assets/setCurrentParentId', { id: item.id });
        },
        updateResults() {
            console.log('updateResults');
            [this.folders, this.results] = _(this.searchResults)
                .filter((item) => {
                    return item.parentId === this.currentParentId;
                })
                .partition({ isFolder: true })
                .value();
        },
    },
};
</script>
<style scoped>
.asset-folder-new {
    outline-style: dashed;
}
</style>
