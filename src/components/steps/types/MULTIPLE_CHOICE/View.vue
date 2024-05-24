<template>
    <v-container id="multiple-choice" align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card class="pointer-events-auto d-flex flex-column fill-height" width="100%" elevation="5">
            <v-toolbar color="primary" class="dark-background tt-text header">
                <v-toolbar-title dark class="tt-text wrap toolbar-title white--text font-weight-600 text-capitalize">
                    <TextSpeaker class="white--text" :text="step.data.title" />
                    {{ step.data.title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="light-background flex-grow-1 flex-shrink-1 fill-height card-padding" style="overflow-y:scroll">
                <v-row v-if="step.data.src" align="center" justify="center" no-gutters class="pointer-events-none" style="width:100%">
                    <v-img :src="step.data.src" contain height="200px" aspect-ratio="1" />
                </v-row>
                <v-radio-group v-for="option in currentStepOptions" :key="option.id" v-model="response" :disabled="isProcessingSubmission">
                    <v-row>
                        <TextSpeaker :text="option.value" />
                        <v-radio :label="option.value" :value="option.id" />
                    </v-row>
                </v-radio-group>
            </v-card-text>
            <v-divider />
            <v-card-actions class="light-background footer">
                <v-spacer />
                <v-btn
                    class="tt-text dark-background text-capitalize font-weight-bold"
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
import _ from 'lodash';

import Coach from '@/services/coach-service';
import TextSpeaker from '@/components/TextSpeaker.vue';
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'PictureChoiceViewer',
    components: {
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
    computed: {
        allowIncorrect() {
            return !!this.$store.state.apps.state.state.allowIncorrect;
        },
        currentStepOptions() {
            return this.step.data.options;
        },
        selectedResponse() {
            return _.find(this.currentStepOptions, { id: this.response });
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
