<template>
    <v-row class="fill-height" justify="center">
        <v-col justify="center" class="fill-height">
            <VideoInput  :src="stepData.src" title="Video Overlay" :height="400" @change="handleVideoSrcUpdated" />
        </v-col>
    </v-row>
</template>
<script>
import VideoInput from '@/components/VideoInput.vue';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'VideoOverlayOptionsEditor',
    components: {
        VideoInput,
    },
    mixins: [OptionEditorMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        // deleteVideo() {
        //     this.updateStepData('src', null);
        // },
        async handleVideoSrcUpdated(newSrc) {
            this.updateStepData('src', newSrc);
            console.log(newSrc);
        },
    },
};
</script>

<style scoped></style>
