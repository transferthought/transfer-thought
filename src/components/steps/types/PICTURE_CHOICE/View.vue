<template>
    <v-container align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card class="pointer-events-auto d-flex flex-column fill-height" width="100%" elevation="5">
            <v-toolbar color="primary" class="header dark-background tt-text">
                <v-toolbar-title dark class="tt-text wrap toolbar-title white--text font-weight-600 text-capitalize">
                    <TextSpeaker class="white--text" :text="step.data.title" />
                    {{ step.data.title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="light-background flex-grow-1 flex-shrink-1 fill-height" style="overflow-y:scroll">
                <v-item-group v-model="response">
                    <v-row class="card-padding">
                        <v-col v-for="(option, index) in currentStepOptions" :key="option.id" cols="12" md="3">
                            <PictureChoiceOptionItem :option="option" :index="index" :disabled="isProcessingSubmission" />
                        </v-col>
                    </v-row>
                </v-item-group>
            </v-card-text>
            <v-divider />
            <v-card-actions class="footer light-background">
                <v-spacer />
                <v-btn
                    id="picture-choice-submit"
                    :class="{ 'tt-text dark-background text-capitalize font-weight-bold': true, 'is-loading': isProcessingSubmission }"
                    shaped
                    depressed
                    x-large
                    color="primary"
                    :disabled="!selectedResponse || isProcessingSubmission"
                    :loading="isProcessingSubmission"
                    @click="handleSubmit()"
                >
                    Submit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import TextToSpeech from '@/services/texttospeech-service';
import Coach from '@/services/coach-service';
import TextSpeaker from '@/components/TextSpeaker.vue';
import StepViewerMixin from '../../mixins/StepViewMixin';

import PictureChoiceOptionItem from './components/PictureChoiceOptionItem.vue';

export default {
    name: 'PictureChoiceViewer',
    components: {
        PictureChoiceOptionItem,
        TextSpeaker,
    },
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            Coach,
            response: null,
            isProcessingSubmission: false,
        };
    },
    watch: {
        'appContext.inVRMode': {
            handler() {
                if (this.appContext.inVRMode) {
                    this.initializeVRPictureChoice();
                } else {
                    this.destroyVRPictureChoice();
                }
            },
        },
        selectedResponse() {
            Array.from(this.currentStepOptions).forEach((option) => {
                const responseEl = document.getElementById(option.id);
                const selectionRing = responseEl.querySelector('.selection-ring');

                if (this.selectedResponse.id === option.id) {
                    selectionRing.setAttribute('material', { color: '#118AB2' });
                } else {
                    selectionRing.setAttribute('material', { color: 'black' });
                }
            });
        },
    },
    computed: {
        allowIncorrect() {
            return !!this.$store.state.apps.state.state.allowIncorrect;
        },
        currentStepOptions() {
            return this.step.data.options;
        },
        selectedResponse() {
            if (this.response > -1 && this.response < this.currentStepOptions.length) {
                return this.currentStepOptions[this.response];
            }
            return null;
        },
        coach() {
            try {
                return this.$store.state.apps.state.state.coach;
            } catch {
                return {};
            }
        },
    },
    methods: {
        async BeforeRunStep() {
            this.initializeVRPictureChoice();
            await StepViewerMixin.methods.BeforeRunStep.call(this);
        },
        async BeforeExitStep() {
            this.destroyVRPictureChoice();
            await StepViewerMixin.methods.BeforeExitStep.call(this);
        },
        initializeVRPictureChoice() {
            if (this.appContext.inVRMode) {
                this.vrPictureChoice = document.getElementById('TT_a399df5cd9e243f0a40a69d6d10f06a0');
                if (this.vrPictureChoice) {
                    this.vrPictureChoice.setAttribute('visible', true);
                    document.addEventListener('click', this.handleVROptionClick);
                    const submitButton = document.getElementById('TT_ab6f64df410a44da9540a8b1d63f7cc4');
                    submitButton.addEventListener('click', this.handleSubmit);
                }
            }
        },
        destroyVRPictureChoice() {
            if (this.vrPictureChoice) {
                this.vrPictureChoice.setAttribute('visible', false);
                document.removeEventListener('click', this.handleVROptionClick);
                const submitButton = document.getElementById('TT_ab6f64df410a44da9540a8b1d63f7cc4');
                submitButton.removeEventListener('click', this.handleSubmit);
            }
        },
        handleVROptionClick(event) {
            if (event?.target && event.target.matches('.picture-option')) {
                const { target } = event;
                const { parentEl } = target;
                const responseId = parentEl.id;
                this.response = _.findIndex(this.currentStepOptions, (option) => option.id === responseId);
                console.log(responseId, this.response);
            }
        },
        async handleSubmit() {
            this.isProcessingSubmission = true;
            if (this.selectedResponse && this.selectedResponse.transcript) {
                const transcriptId = await this.Coach.updateTranscript(this.selectedResponse.transcript, this.coach.voice);
                this.Coach.$on(`transcript.${transcriptId}.ended`, this.handleFeedbackEnded.bind(this));
                this.Coach.play();
            } else {
                this.handleFeedbackEnded();
            }
        },
        handleFeedbackEnded() {
            const isResponseValid = this.validateResponse();
            this.isProcessingSubmission = false;
            if (isResponseValid) {
                this.$store.dispatch('steps/updateResponseValue', {
                    stepId: this.step.id,
                    valueId: this.selectedResponse.id,
                    value: true,
                });
                this.$emit('complete');
            }
        },
        validateResponse() {
            if (this.selectedResponse) {
                if (this.allowIncorrect) {
                    return true;
                }
                return this.step.data.correctOption === this.selectedResponse.id;
            }
            return false;
        },
    },
};
</script>

<style scoped></style>
