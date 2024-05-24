<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <v-skeleton-loader v-if="pageStatus === 'IDLE' || pageStatus === 'LOADING'" type="text"></v-skeleton-loader>
                <v-row v-else align="center" no-gutters class="flex-nowrap">
                    <h5 style="max-width: 250px;" class="text-h5 text-truncate">{{ page.title }}</h5>
                    <PageSettings :page="page" />
                </v-row>
            </template>
            <template slot="Right">
                <v-btn x-large class="font-weight-bold text-capitalize py-1 px-8 mx-2" depressed color="primary lighten-1" @click="handlePublishClick">
                    Publish
                    <v-icon right dark>
                        mdi-cloud-upload
                    </v-icon>
                </v-btn>
            </template>
        </AdminToolBar>
        <v-main>
            <v-container>
                <v-sheet id="landing-page-container" color="white" elevation="5" class="fill-height" rounded>
                    <v-skeleton-loader id="page-loader" v-if="pageStatus === 'IDLE' || pageStatus === 'LOADING'" type="card"></v-skeleton-loader>
                    <component v-else :page="page" :is="page.data.type" />
                </v-sheet>
            </v-container>
        </v-main>
        <PublishDialog v-if="page" ref="PublishDialog" resourceType="pages" :resourceId="page.id" :only="['link', 'embed', 'qr-code']" />
        <SnackMessages />
    </fragment>
</template>

<script>
import AdminToolBar from '@/components/AdminToolBar.vue';
import PublishDialog from '@/components/dialogs/PublishDialog.vue';
import SnackMessages from '@/components/editor/SnackMessages.vue';

import basic from '../components/templates/Basic.vue';
import blank from '../components/templates/Blank.vue';

import PageSettings from '../components/PageSettings.vue';

export default {
    components: {
        AdminToolBar,
        SnackMessages,
        PageSettings,
        PublishDialog,
        basic,
        blank,
    },
    data() {
        return {};
    },
    watch: {
        page: {
            handler() {
                if (this.page && this.page.title) {
                    document.title = this.page.title;
                }
            },
            immediate: true,
        },
    },
    async mounted() {
        await this.$store.dispatch('pages/fetchById', { id: this.$route.params.pageId, type: 'master' });
        await this.$store.dispatch('apps/fetchList');
    },
    computed: {
        page() {
            const page = this.$store.getters['pages/byId'](this.$route.params.pageId);
            return page;
        },
        pageStatus() {
            return this.$store.state.pages.singleStatus;
        },
    },
    methods: {
        handlePublishClick() {
            this.$store.dispatch('pages/publish', { id: this.$route.params.pageId });
            this.$refs.PublishDialog.show();
        },
    },
};
</script>

<style scoped>
#landing-page-container {
    height: 85vh;
    overflow-y: scroll;
}
</style>
