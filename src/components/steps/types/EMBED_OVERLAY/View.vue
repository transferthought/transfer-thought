<template>
    <v-container id="embed-overlay" align="center" justify="center" class="fill-height pa-5 pointer-events-auto">
        <v-card class="light-background fill-height" width="100%" v-html="step.data.src"></v-card>
    </v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'EmbedOverlayViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {},
};
</script>

<style></style>
