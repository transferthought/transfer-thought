<template>
    <fragment>
        <v-card outlined hover rounded :id="'page-template-card-' + page.title" class="page-template-card mb-6" @click="handleCreateClicked">
            <v-img :src="page.data.coverSrc" height="210">
                <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-icon x-large>
                            mdi-image
                        </v-icon>
                    </v-row>
                </template>
            </v-img>

            <v-card-text class="pa-3">
                <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                        <v-list-item-title class="text-h6 text-typo font-weight-600 mb-0">
                            {{ page.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ page.data.description }}</v-list-item-subtitle>
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
        page: Object,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        async handleCreateClicked() {
            const newPage = await this.$store.dispatch('pages/create', { data: this.page.data });
            this.$router.push({ name: 'PageEditor', params: { pageId: newPage.id } });
        },
    },
};
</script>
