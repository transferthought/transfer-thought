<template>
    <fragment>
        <v-card outlined hover rounded class=" mb-6" @click="handleCreateClicked">
            <v-img :src="app.thumbnailUrl" height="210">
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
                        <v-list-item-title class="text-h6 text-typo font-weight-600 mb-0">
                            {{ app.name }}
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
    props: {
        app: Object,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        async handleCreateClicked() {
            const newAppItem = await this.$store.dispatch('apps/cloneApp', { appId: this.app.appId });
            this.$router.push({ name: 'AppEditor', params: { appId: newAppItem.appId } });
        },
    },
};
</script>
