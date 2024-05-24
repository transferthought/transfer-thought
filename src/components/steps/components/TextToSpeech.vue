<template>
    <div v-shortkey="['ctrl', 'shift', 't']" @shortkey="showRecordingButton = true">
        <v-row>
            <v-col>
                <label class="label-color font-weight-bold mb-2 d-block text-left">{{ label }}</label>
            </v-col>
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-col class="pt-0" v-if="allowVoiceChange && state.coach.showVoicePickerPerStep">
                <VoiceOptions :voice="viewVoice" @change="handleVoiceChanged" />
            </v-col>
            <v-col class="pt-0">
                <v-btn v-if="recording" depressed class="font-weight-600 text-h5 text-capitalize py-1 float-right" @click="stopRecording">
                    <v-icon style="font-size:24px" class="mr-2">
                        mdi-stop
                    </v-icon>
                    Stop
                </v-btn>
                <v-btn
                    v-if="showRecordingButton && !recording"
                    depressed
                    class="font-weight-600 text-h5 text-capitalize py-1 float-right"
                    :loading="loadingTranscript"
                    @click="startRecording"
                >
                    <v-icon style="font-size:24px" class="mr-2" color="red">
                        mdi-record
                    </v-icon>
                    Record
                </v-btn>
                <v-btn v-if="!playing" depressed large class="font-weight-bold text-capitalize py-5 float-right" :loading="waitingForAudio" @click="play">
                    <v-icon style="font-size:24px" class="mr-2">
                        mdi-play
                    </v-icon>
                    Preview Audio
                </v-btn>
                <v-btn v-else depressed large class="font-weight-bold text-capitalize py-5 float-right" @click="stop">
                    <v-icon style="font-size:24px" class="mr-2">
                        mdi-stop
                    </v-icon>
                    Stop
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-textarea
                id="text-to-speech"
                v-model="viewTranscript"
                placeholder="Everything written here will be converted to audio and read to your trainees"
                outlined
                rows="2"
                class="text-to-speech input-style font-size-input"
                hide-details
                @blur="saveTranscript"
            />
            <audio ref="audio" :src="transcriptAudioUrl" crossorigin="annonymouse" />
        </v-row>
    </div>
</template>
<script>
import { mapState } from 'vuex';

import Client from '@/tt-api';
import mic from 'microphone-stream';
import TextToSpeech from '@/services/texttospeech-service';

import VoiceOptions from '@/components/steps/components/VoiceOptions.vue';

export default {
    name: 'TextToSpeech',
    components: { VoiceOptions },
    props: {
        allowVoiceChange: {
            type: Boolean,
            default: true,
        },
        transcript: {
            type: String,
            default: '',
        },
        voice: {
            type: String,
            default: 'Joanna',
        },
        label: {
            type: String,
            default: 'Narrations',
        },
    },
    data() {
        return {
            viewTranscript: '',
            viewVoice: '',
            playing: false,
            waitingForAudio: false,
            recording: false,
            showRecordingButton: false,
            loadingTranscript: false,
            transcriptAudioUrl: null,
        };
    },
    computed: {
        ...mapState({
            state: (state) => state.apps.state.state,
        }),
        hasVoiceChanged() {
            return this.voice !== this.viewVoice;
        },
        hasTranscriptChanged() {
            return this.transcript !== this.viewTranscript;
        },
    },
    watch: {
        transcript: {
            imediate: true,
            handler() {
                this.viewTranscript = this.transcript;
            },
        },
        voice: {
            imediate: true,
            handler() {
                this.viewVoice = this.voice;
            },
        },
    },
    mounted() {
        this.viewTranscript = this.transcript;
        this.viewVoice = this.voice;
    },
    methods: {
        saveTranscript() {
            if (this.hasTranscriptChanged) {
                this.$emit('change', { transcript: this.viewTranscript });
            }
        },
        handleVoiceChanged(newVoice) {
            this.viewVoice = newVoice;
            if (this.hasVoiceChanged) {
                this.$emit('change', { voice: this.viewVoice });
            }
        },
        async startRecording() {
            this.audioBuffer = [];

            const stream = await window.navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            const startMic = new mic();

            startMic.setStream(stream);
            startMic.on('data', (chunk) => {
                const raw = mic.toRaw(chunk);
                if (raw == null) {
                    return;
                }
                this.audioBuffer = this.audioBuffer.concat(...raw);
            });

            this.recording = true;
            this.micStream = startMic;
        },

        async stopRecording() {
            this.micStream.stop();
            this.micStream = null;
            this.recording = false;

            const resultBuffer = this.audioBuffer;

            this.loadingTranscript = true;
            const result = await Client.Predictions.convert({
                transcription: {
                    source: {
                        bytes: resultBuffer,
                    },
                    language: 'en-US', // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
                },
            });
            this.loadingTranscript = false;
            if (result?.transcription?.fullText) {
                this.viewTranscript = result.transcription.fullText;
                this.save();
            }
        },
        async play() {
            this.waitingForAudio = true;
            this.transcriptAudioUrl = await TextToSpeech.getAudioFile(this.viewTranscript, this.viewVoice);
            this.waitingForAudio = false;
            this.playing = true;
            this.$nextTick(() => this.$refs.audio.play());
            this.$refs.audio.addEventListener('ended', () => {
                this.playing = false;
            });
        },
        stop() {
            this.$refs.audio.pause();
            this.$refs.audio.currentTime = 0;
            this.playing = false;
        },
    },
};
// listen, save, cancel
</script>

<style scoped></style>
