<template>
    <v-skeleton-loader v-if="pageStatus !== 'SUCCESS'" type="card"></v-skeleton-loader>
    <component v-else :is="page.data.type" :page="page" />
</template>

<script>
import basic from '../components/templates/Basic.vue';
import blank from '../components/templates/Blank.vue';

export default {
    components: {
        basic,
        blank,
    },
    data() {
        return {};
    },
    methods: {},
    watch: {
        page: {
            handler() {
                if (this.page && this.page.title) {
                    document.title = this.page.title;
                }
            },
            immediate: true,
        },
        pageStatus() {
            if (this.pageStatus === 'FAILED') {
                this.$router.push({ name: 'NotFound', query: { path: this.$route.path } });
            }
        },
    },
    async mounted() {
        this.$store.dispatch('pages/fetchById', { id: this.$route.params.pageId, type: 'published' });
    },
    computed: {
        page() {
            return this.$store.getters['pages/byId'](this.$route.params.pageId);
        },
        pageStatus() {
            return this.$store.state.pages.singleStatus;
        },
    },
};
</script>

<style></style>
