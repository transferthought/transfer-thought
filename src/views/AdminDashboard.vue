<template>
    <v-content class="admin-config" />
</template>

<script>
// import gql from 'graphql-tag';
// import Client from '@/tt-api';

export default {
    components: {
    },
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
    },
    methods: {
    },
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
