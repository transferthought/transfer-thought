<template>
    <fragment></fragment>
</template>

<script>
import Client from '@/tt-api';
import gql from 'graphql-tag';

export default {
    name: 'FriendlyURL',
    components: {},
    data() {
        return {};
    },
    computed: {},
    watch: {},
    async mounted() {
        // get path
        // check for destination
        // redirect
        const {
            data: { sourceByDestination },
        } = await Client.Api.query({
            query: gql(Client.Queries.sourceByDestination),
            variables: { destination: this.$route.params.destination },
            fetchPolicy: 'no-cache',
        });
        const redirect = sourceByDestination?.items?.length ? sourceByDestination.items[0] : null;
        if (redirect) {
            this.$router.push(this.$route.path.replace(`/${this.$route.params.destination}`, redirect.source));
        } else {
            this.$router.push('/404');
        }
    },
    methods: {},
};
</script>

<style scoped></style>
