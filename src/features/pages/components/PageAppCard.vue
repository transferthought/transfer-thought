<template>
    <fragment>
        <v-skeleton-loader v-if="fetchingApp" type="card"></v-skeleton-loader>

        <v-hover v-else-if="publishedApp" v-slot="{ hover }">
            <v-card outlined rounded hover class=" mb-6" :href="getAppUrl(publishedApp.appId)" :data-title="publishedApp.name">
                <v-img :src="publishedApp.thumbnailUrl" height="210">
                    <v-overlay :value="hover" absolute>
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-icon x-large>
                                    mdi-image
                                </v-icon>
                            </v-row>
                        </template>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-icon v-if="hover" color="white" size="96" class="mt-5">
                                mdi-play-circle-outline
                            </v-icon>
                        </v-row>
                    </v-overlay>
                </v-img>

                <v-card-text class="pr-0">
                    <v-list-item class="pr-0">
                        <v-list-item-content>
                            <v-list-item-title class="text-typo font-weight-600 mb-0">
                                {{ publishedApp.name }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-card-text>
            </v-card>
        </v-hover>
        <v-card v-else-if="masterApp" outlinedrounded hover class=" mb-6" :data-title="masterApp.name">
            <v-img :src="masterApp.thumbnailUrl" height="210">
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
                        <v-list-item-title class="text-typo font-weight-600 mb-0">
                            {{ masterApp.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="error--text text--darken-4">
                            This Scenario is not published yet.
                            <router-link v-if="isEditMode" :to="{ name: 'AppEditor', params: { appId: masterApp.appId } }">Edit</router-link>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
        </v-card>
    </fragment>
</template>

<script>
import Client from '@/tt-api';
import gql from 'graphql-tag';
export default {
    data() {
        return { masterApp: null, publishedApp: null, fetchingApp: false };
    },
    props: {
        pageApp: Object,
    },
    async mounted() {
        await this.fetchAppData();
    },
    computed: {
        isEditMode() {
            const currentUrl = new URL(window.location);
            return currentUrl.href.indexOf('/edit') > -1;
        },
    },
    methods: {
        async fetchAppData() {
            this.fetchingApp = true;
            let [
                {
                    data: { getApp: masterApp },
                },
                {
                    data: { getApp: publishedApp },
                },
            ] = await Promise.all([
                Client.Api.query({
                    query: gql(Client.Queries.getApp),
                    variables: {
                        appId: this.pageApp.appId,
                        type: 'master',
                    },
                    fetchPolicy: 'no-cache',
                }),
                Client.Api.query({
                    query: gql(Client.Queries.getApp),
                    variables: {
                        appId: this.pageApp.appId,
                        type: 'published',
                    },
                    fetchPolicy: 'no-cache',
                }),
            ]);
            this.masterApp = masterApp;
            this.publishedApp = publishedApp;
            this.fetchingApp = false;
        },
        getAppUrl(appId) {
            const currentUrl = new URL(window.location);
            return `${currentUrl.origin}/apps/${appId}?redirect=${currentUrl}`;
        },
    },
};
</script>

<style scoped></style>
