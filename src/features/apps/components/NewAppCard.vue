<template>
    <fragment>
        <v-card outlined hover rounded class="new-app-card mb-6" @click="newApp">
            <v-row class="fill-height ma-0" align="center" justify="center" style="height: 210px">
                <v-icon x-large style="font-size: 100px">
                    mdi-plus
                </v-icon>
            </v-row>
            <v-divider></v-divider>

            <v-card-text class="pr-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <v-list-item-title class="text-h6 text-typo font-weight-600 mb-0">
                            Blank
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
        </v-card>
    </fragment>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        async newApp() {
            const { default: app } = await import(/* webpackChunkName: "App" */ `@/tt-core/scenes/360Objective/app`);
            const newApp = {
                name: 'Untitled',
                config: JSON.stringify(app.config),
                state: JSON.stringify(app.state),
                actions: JSON.stringify(app.actions),
                thumbnailUrl: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
            };
            const newAppItem = await this.$store.dispatch('apps/createApp', newApp);
            this.$router.push({ name: 'AppEditor', params: { appId: newAppItem.appId } });
        },
    },
};
</script>
