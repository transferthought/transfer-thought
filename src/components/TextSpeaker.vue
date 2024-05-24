<template>
    <v-btn icon large :loading="loading" @click="togglePlay()">
        <v-icon v-if="playing">
            mdi-stop
        </v-icon>
        <v-icon v-else class="tt-text">
            mdi-volume-high
        </v-icon>
    </v-btn>
</template>

<script>
import TextToSpeech from '@/services/texttospeech-service';
import { Howl } from 'howler';

export default {
    name: 'TextSpeaker',
    components: {},
    props: {
        text: String,
        autoplay: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            sound: null,
            loading: false,
        };
    },
    watch: {
        autoplay: {
            handler(value) {
                if (value && !this.playing) {
                    this.togglePlay();
                }
            },
            immediate: true,
        },
    },
    computed: {
        coach() {
            try {
                return this.$store.state.apps.state.state.coach;
            } catch {
                return {};
            }
        },
        playing() {
            return this.sound && this.sound.playing();
        },
    },
    methods: {
        async togglePlay() {
            if (this.playing) {
                this.sound.stop();
            } else {
                this.loading = true;
                const currentSrc = await TextToSpeech.getAudioFile(this.text, this.coach.voice);

                this.sound = new Howl({
                    src: [currentSrc],
                    html5: true,
                });
                this.sound.play();
                this.loading = false;
            }
        },
    },
};
</script>
<style scoped></style>
