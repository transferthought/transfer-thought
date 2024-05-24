<template>
    <v-main fill-height>
        <div class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
    </v-main>
</template>
<script>
export default {
    name: 'Remix',
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {},
    watch: {},
    async mounted() {
        if (this.$route.params.resourceType && this.$route.params.resourceId) {
            const resourceType = this.$route.params.resourceType;
            const resourceId = this.$route.params.resourceId;
            const clonedResource = await this.$store.dispatch(`${resourceType}/remix`, {
                id: resourceId,
                appendToName: '(Clone)',
            });
            const resourceMetadata = this.$store.getters[`${resourceType}/metadata`];
            this.$router.push({ name: resourceMetadata.editorRouteName, params: { [resourceMetadata.idKey]: clonedResource[resourceMetadata.idKey] } });
        }
    },
    methods: {},
};
</script>

<style></style>
