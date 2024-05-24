<template>
    <div>
        <v-snackbar
            v-show="shouldShowTranscript"
            :timeout="-1"
            :value="shouldShowTranscript"
            light
            class="user-select-none"
            style="margin-bottom: 200px; text-align: center;z-index:11"
            @click="hideTranscript = true"
        >
            {{ Coach.transcript }}

            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="hideTranscript = true">
                    <v-icon dark right>
                        mdi-close
                    </v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar v-model="showNoTranscriptMessage" :timeout="3000" light class="user-select-none" style="margin-bottom: 200px; text-align: center">
            There is no transcript for this step
        </v-snackbar>
        <v-hover>
            <template v-slot:default="{ hover }">
                <v-avatar :size="$vuetify.breakpoint.mobile ? 150 : 200" :class="{ coach: true, animate: Coach.playing }">
                    <audio ref="audio" muted crossorigin="annonymouse">
                        <track ref="captions" default kind="captions" srclang="en" />
                        Sorry, your browser doesn't support embedded videos.
                    </audio>

                    <v-card
                        v-show="showNextButton"
                        elevation="0"
                        class="fill-height fill-width v-responsive"
                        color="primary"
                        :style="{ border: '10px white solid !important', 'border-radius': '50%' }"
                        @click="next"
                    >
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-btn icon dark x-large>
                                <v-icon :style="{ fontSize: '64px' }">
                                    mdi-skip-next
                                </v-icon>
                            </v-btn>
                        </v-row>
                    </v-card>

                    <v-img v-show="!showNextButton" :src="thumbnailSrc" alt="Coach" :style="{ border: '10px white solid' }">
                        <v-overlay v-if="hover" absolute>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-btn v-if="paused" icon dark x-large @click="unPause()">
                                    <v-icon :style="{ fontSize: '64px' }">
                                        mdi-play
                                    </v-icon>
                                </v-btn>
                                <v-btn v-else icon dark x-large @click="pause()">
                                    <v-icon style="font-size: 64px">
                                        mdi-pause
                                    </v-icon>
                                </v-btn>
                            </v-row>
                        </v-overlay>
                    </v-img>
                </v-avatar>
            </template>
        </v-hover>
    </div>
</template>
<script>
import Coach from '@/services/coach-service';

import { getStepDefinition } from '@/components/steps/types';

export default {
    name: 'Coach',
    props: {
        thumbnailSrc: {
            type: String,
            default: null,
        },
        showTranscript: Boolean,
    },
    data() {
        return {
            Coach,
            fab: false,
            progress: 0,
            currentSrcTranscript: null,
            sound: null,
            showNoTranscriptMessage: false,
            hideTranscript: false, // temporary hide
            currentStepDefinition: null,
        };
    },
    watch: {
        currentTranscript() {
            this.hideTranscript = false;
        },

        currentStep: {
            async handler(newStep) {
                const stepDefinition = await getStepDefinition(newStep.type);
                if (stepDefinition) {
                    this.currentStepDefinition = stepDefinition;
                } else {
                    this.currentStepDefinition = null;
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
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
        showNextButton() {
            if (
                this.currentStep &&
                this.currentStep.data.autoProgressType === 'pause' &&
                this.currentStepDefinition &&
                this.currentStepDefinition.category === 'OVERLAY'
            ) {
                // transcrpt is not playing and wasnt paused by user
                return this.Coach.played;
            }
            return false;
        },
        paused() {
            return this.$store.state.steps.paused;
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
        shouldShowTranscript() {
            return this.Coach.playing && !this.hideTranscript && this.showTranscript && this.Coach.transcript && this.Coach.transcript.length;
        },
        currentStepAutoProgressSetting() {
            const autoProgressType = this.step.data.autoProgressType;
            return autoProgressType || 'transcript';
        },
    },
    methods: {
        pause() {
            this.$store.dispatch('steps/togglePause');
        },
        unPause() {
            this.$store.dispatch('steps/togglePause');
        },
        next() {
            this.$store.dispatch('steps/next');
        },
    },
};
</script>
<style>
.coach {
    z-index: 0 !important;
    overflow: initial;
    top: -12px;
}

.coach::before,
.coach::after {
    -webkit-border-radius: 1000px;
    -moz-border-radius: 1000px;
    border-radius: 1000px;
    content: '';
    display: block;
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 0;
    animation-play-state: paused;
    pointer-events: none;
}
.coach.animate::before {
    -moz-animation: audio1 1.5s infinite ease-in-out;
    -o-animation: audio1 1.5s infinite ease-in-out;
    -webkit-animation: audio1 1.5s infinite ease-in-out;
    animation: audio1 1.5s infinite ease-in-out;
}
.coach.animate::after {
    -moz-animation: audio2 2.2s infinite ease-in-out;
    -o-animation: audio2 2.2s infinite ease-in-out;
    -webkit-animation: audio2 2.2s infinite ease-in-out;
    animation: audio2 2.2s infinite ease-in-out;
}

@keyframes audio1 {
    0%,
    100% {
        box-shadow: 0 0 0 0.8em rgba(255, 255, 255, 0.7);
    }
    25% {
        box-shadow: 0 0 0 0.3em rgba(255, 255, 255, 0.15);
    }
    50% {
        box-shadow: 0 0 0 1.1em rgba(255, 255, 255, 0.55);
    }
    75% {
        box-shadow: 0 0 0 0.5em rgba(255, 255, 255, 0.25);
    }
}
@keyframes audio2 {
    0%,
    100% {
        box-shadow: 0 0 0 0.5em rgba(255, 255, 255, 0.15);
    }
    25% {
        box-shadow: 0 0 0 0.8em rgba(255, 255, 255, 0.3);
    }
    50% {
        box-shadow: 0 0 0 0.3em rgba(255, 255, 255, 0.05);
    }
    75% {
        box-shadow: 0 0 0 1.1em rgba(255, 255, 255, 0.45);
    }
}
</style>
