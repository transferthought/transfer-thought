<template>
    <v-container fluid>
        <v-layout align-center justify-center>
            <v-flex text-xs-center>
                <h1 class="display-1">404</h1>
                <h2 class="headline">Ooops....we could not find resource for path {{ path }}</h2>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            path: this.$route.query.path || 'Unknown',
        };
    },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
