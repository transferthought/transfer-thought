<template>
    <v-app id="app">
        <router-view />
    </v-app>
</template>

<script>
export default {
    components: {
    },
    props: {
        source: String,
    },
};
</script>
