<template>
    <v-app id="app">
        <!-- <v-app-bar app clipped-left color="primary">
            <v-toolbar-title class="mr-12 align-center">
                <span class="title">{{$route.query.siteName || "Transfer Thought" }}</span>
            </v-toolbar-title>
            <v-spacer />
        </v-app-bar> -->

        <v-app-bar
            app
            flat
            color="white"
            height="100"
        >
            <v-avatar
                class="mr-3"
                color="grey lighten-5"
                size="70"
            >
                <v-img
                    contain
                    max-height="70%"
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                />
            </v-avatar>

            <v-toolbar-title class="font-weight-black headline">
                Paint Chat
            </v-toolbar-title>
        </v-app-bar>

        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>

export default {
    components: {
    },
    props: {
        source: String,
    },
    data: () => ({
        joinRoomId: '',
    }),
};
</script>
