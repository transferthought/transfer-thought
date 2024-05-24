<template>
    <EnvironmentViewer v-if="currentEnvironment" :key="currentEnvironment && currentEnvironment.id" />
</template>
<script>
import _ from 'lodash';
import EnvironmentViewer from './EnvironmentViewer.vue';

export default {
    name: 'EnvironmentViewerContainer',
    components: {
        EnvironmentViewer,
    },
    props: {},
    data() {
        return {};
    },
    computed: {
        currentEnvironment() {
            return this.$store.state.apps.state.state.currentEnvironment;
        },
    },
};
</script>

<style scoped></style>
