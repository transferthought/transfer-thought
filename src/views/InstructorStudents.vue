<template>
    <v-content class="admin-config">
        <v-container fluid class="px-6 mt-n16">
            <v-row>
                <v-col class="pt-0" cols="12">
                    <v-card class="card-shadow" rounded>
                        <div class="card-header-padding card-border-bottom">
                            <p class="font-weight-600 text-typo mb-0">
                                Light table
                            </p>
                        </div>

                        <v-card-text class="px-0 py-0">
                            <v-data-table :headers="headers" :items="projects" hide-default-footer class="table thead-light" mobile-breakpoint="0">
                                <template v-slot:body="{ items }">
                                    <tbody>
                                        <tr v-for="(item, i) in items" :key="item.id">
                                            <td class="border-bottom">
                                                <v-list class="py-0">
                                                    <v-list-item class="px-0 py-4">
                                                        <v-list-item-avatar rounded :size="48" class="my-0 me-5">
                                                            <v-img :alt="item.imgSrc" :src="item.imgSrc" />
                                                        </v-list-item-avatar>

                                                        <v-list-item-content>
                                                            <v-list-item-title class="text-body text-subtitle-2 ls-0 font-weight-600">
                                                                {{ item.project }}
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list>
                                            </td>
                                            <td class="text-body border-bottom text-h5">
                                                {{ item.budget }}
                                            </td>
                                            <td class="text-body border-bottom text-h5">
                                                <span :class="`text-${item.statusColor}`" class="me-1">●</span>
                                                {{ item.status }}
                                            </td>
                                            <td class="border-bottom">
                                                <span class="avatar-group d-flex me-2">
                                                    <v-tooltip v-for="avatar in projects[i].avatars" :key="avatar.avatarSrc" top color="#212529">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-avatar size="32" v-bind="attrs" v-on="on">
                                                                <img :src="avatar.avatarSrc" :alt="avatar.avatarSrc" />
                                                            </v-avatar>
                                                        </template>
                                                        <span>{{ avatar.tooltipName }}</span>
                                                    </v-tooltip>
                                                </span>
                                            </td>
                                            <td class="border-bottom">
                                                <div class="d-flex align-center">
                                                    <span class="me-2 text-body text-h5">{{ item.progressValue }}%</span>
                                                    <v-progress-linear
                                                        class="progress-shadow"
                                                        :value="item.progressValue"
                                                        rounded
                                                        background-color="#e9ecef"
                                                        :color="item.progressColor"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-data-table>
                        </v-card-text>
                        <div class="card-padding d-flex justify-end">
                            <v-pagination
                                v-model="page"
                                prev-icon="mdi-chevron-left"
                                next-icon="mdi-chevron-right"
                                class="pagination"
                                color="#5e72e4"
                                :length="4"
                                circle
                            />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
/* eslint-disable global-require */

// import gql from 'graphql-tag';
// import Client from '@/tt-api';

export default {
    components: {},
    data: () => ({
        app: {},
        selectedSession: -1,
        miniCards: [
            {
                subtitle: 'Total Traffic',
                title: '350,897',
                gradient: 'bg-gradient-danger',
                icon: 'ni-active-40',
            },
            {
                subtitle: 'New Users',
                title: '2,356',
                gradient: 'bg-gradient-warning',
                icon: 'ni-chart-pie-35',
            },
            {
                subtitle: 'Sales',
                title: '924',
                gradient: 'bg-gradient-success',
                icon: 'ni-money-coins',
            },
            {
                subtitle: 'Performance',
                title: '49,65%',
                gradient: 'bg-gradient-success',
                icon: 'ni-chart-bar-32',
            },
        ],
        page: 1,
        headers: [
            {
                text: 'Project',
                align: 'start',
                sortable: false,
                value: 'project',
            },
            { text: 'Budget', value: 'budget' },
            { text: 'Status', value: 'status' },
            { text: 'Users', value: 'users' },
            { text: 'Completion', value: 'completion' },
        ],
        projects: [
            {
                id: 0,
                project: 'Some Project',
                imgSrc: require('@/assets/images/team-1.jpg'),
                budget: '$2500',
                status: 'pending',
                statusColor: 'warning',
                avatars: [
                    {
                        avatarSrc: require('@/assets/images/team-1.jpg'),
                        tooltipName: 'Ryan Thompson',
                    },
                    {
                        avatarSrc: require('@/assets/images/team-2.jpg'),
                        tooltipName: 'Romina Hadid',
                    },
                    {
                        avatarSrc: require('@/assets/images/team-3.jpg'),
                        tooltipName: 'Alexander Smith',
                    },
                    {
                        avatarSrc: require('@/assets/images/team-4.jpg'),
                        tooltipName: 'Jessica Doe',
                    },
                ],
                progressValue: '90',
                progressColor: '#fb6340',
            },
        ],
    }),
    computed: {},
    methods: {},
    apollo: {
        // app() {
        //     return {
        //         query: gql(Client.Queries.getApp),
        //         variables: { id: this.$route.params.appId },
        //         update: data => data.getApp,
        //     };
        // },
    },
};
</script>
