import Vue from 'vue';

import TextToSpeech from '@/services/texttospeech-service';
import { Howl } from 'howler';

const CoachService = new Vue({
    data: {
        currentTranscriptId: 0,
        howl: null,
        playing: false,
        played: false,
        transcript: '',
        voice: '', // Store the current voice here
    },
    methods: {
        load(source) {
            if (this.howl) {
                this.howl.unload(); // Unload previous sound to free up resources
            }
            this.howl = new Howl({
                src: [source],
                html5: true, // Use HTML5 Audio for streaming capabilities
                onplay: () => {
                    this.played = false;
                    this.playing = true;
                    this.$emit('transcript.started');
                    this.$emit(`transcript.${this.currentTranscriptId}.started`);
                },
                onpause: () => {
                    this.playing = false;
                    this.$emit('transcript.paused');
                    this.$emit(`transcript.${this.currentTranscriptId}.paused`);
                },
                onend: () => {
                    this.playing = false;
                    this.played = true;
                    this.$emit(`transcript.ended`);
                    this.$emit(`transcript.${this.currentTranscriptId}.ended`);
                },
            });
            this.playing = false;
        },
        play() {
            if (this.howl) {
                this.howl.play();
            }
        },
        pause() {
            if (this.howl && this.playing) {
                this.howl.pause();
            }
        },
        stop() {
            if (this.howl) {
                this.howl.stop();
            }
        },
        async updateTranscript(newTranscript, newVoice) {
            // Only proceed if transcript or voice has changed
            if (this.transcript !== newTranscript || this.voice !== newVoice) {
                try {
                    this.$emit('transcript.updated');
                    const transcriptSrc = await TextToSpeech.getAudioFile(newTranscript, newVoice);
                    this.transcript = newTranscript;
                    this.voice = newVoice;
                    this.load(transcriptSrc);
                    this.currentTranscriptId += 1;
                } catch (error) {
                    console.error('Error fetching audio file:', error);
                }
            }
            return this.currentTranscriptId;
        },
        clearTranscript() {
            this.stop();
            this.transcript = null;
            this.voice = null;
        },
    },
});

export default CoachService;
