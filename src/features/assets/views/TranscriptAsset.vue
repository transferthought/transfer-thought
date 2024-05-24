<template>
    <div>
        <div class="card-header-padding ma-0 card-border-bottom">
            <TextToSpeech :voice="state.coach.voice" @change="handleAudioChange" />
        </div>
    </div>
</template>

<script>
import AssetViewMixin from './AssetViewMixin';
import TextToSpeech from '@/components/steps/components/TextToSpeech.vue';
import TextToSpeechService from '@/services/texttospeech-service';
export default {
    name: 'TranscriptAssetView',
    components: {
        TextToSpeech,
    },
    mixins: [AssetViewMixin],
    data() {
        return {
            transcript: '',
            voice: '',
        };
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
    },
    methods: {
        handleAudioChange(data) {
            this.voice = data.voice;
            this.transcript = data.transcript;
            this.$emit('selection-change', [data]);
        },
        async getSelectedAssetUrls() {
            const audioSrc = await TextToSpeechService.getAudioFile(this.transcript, this.voice);
            return [audioSrc];
        },
    },
};
</script>
<style scoped></style>
