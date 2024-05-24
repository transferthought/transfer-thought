<template>
    <v-container id="video-overlay" align="center" justify="center" class="fill-height pa-5" pointer-events-auto>
        <v-card class="fill-height" color="transparent" justify="center">
            <div class="video-container">
                <video class="video" ref="videoElement" :src="step.data.src" controls @ended="handleVideoEnded"></video>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import StepViewerMixin from '../../mixins/StepViewMixin';
export default {
    name: 'VideoOverlayViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            test: 'This is a test',
        };
    },
    computed: {},
    methods: {
        handleVideoEnded() {
            this.next();
        },
    },
};
</script>

<style>
.video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
    /* background-color: black; */
}
.video {
    max-width: 80%;
    width: 80%;
    height: auto;
    align-items: center;
}
</style>
