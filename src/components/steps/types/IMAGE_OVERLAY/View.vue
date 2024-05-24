<template>
    <v-container id="image-overlay" align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card elevation="0" class="fill-height image-overlay pointer-events-none" width="100%" color="transparent">
            <v-img :src="step.data.src" height="100%" contain />
        </v-card>
    </v-container>
</template>

<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'ImageOverlayViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return { test: 'This is a test' };
    },
    computed: {},
    methods: {},
};
</script>

<style>
.image-overlay {
    pointer-events: none;
}
.image-overlay * {
    pointer-events: none;
}
</style>
