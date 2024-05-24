<template>
    <v-layout fill-height>
        <v-navigation-drawer
            v-if="!$apollo.queries.app.loading"
            permanent
            stateless
        >
            <template v-slot:prepend>
                <v-list-item>
                    <v-list-item-avatar>
                        <img src="">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ app.name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <v-divider inset />
            <v-list
                dense
                nav
            >
                <v-list-item :to="dashboardUrl(app)">
                    <v-list-item-action>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="grey--text text--darken-1">
                        Dashboard
                    </v-list-item-title>
                </v-list-item>
                <v-list-item :to="editUrl(app)">
                    <v-list-item-action>
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="grey--text text--darken-1">
                        Edit
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <router-view />
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';
import Client from '@/tt-api';

export default {
    components: {
    },
    data: () => ({
        app: {},
        selectedSession: -1,
        headers: [
            {
                text: 'Event Name',
                value: 'name',
                filterable: true,
                sortable: true,
            },
            {
                text: 'Timestamp',
                value: 'timestamp',
                filterable: true,
                sortable: true,
            },
            {
                text: 'Data',
                value: 'data',
                filterable: true,
                sortable: true,
            },
        ],
    }),
    computed: {
        logs() {
            if (this.selectedSession > -1) {
                return this.sessions[this.selectedSession].logs;
            }
            return [];
        },
        // headers() {
        //     if (this.logs && this.logs.length) {
        //         const keys = _.keys(this.logs[0]);
        //         return keys.map(key => ({
        //             text: key,
        //             value: key,
        //             filterable: true,
        //             sortable: true,
        //         }));
        //     }
        //     return [];
        // },
    },
    methods: {
        dashboardUrl(app) {
            return `/app/${app.appId}/dashboard`;
        },
        editUrl(app) {
            return `/edit/${app.appId}`;
        },
        runUrl(app) {
            return `/run/${app.appId}`;
        },
    },
    apollo: {
        app() {
            return {
                query: gql(Client.Queries.getApp),
                variables: { appId: this.$route.params.appId, type: 'master' },
                update: (data) => data.getApp,
            };
        },
    },
};
</script>
