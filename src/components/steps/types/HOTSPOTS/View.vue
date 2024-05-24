<template></template>
<script>
import _ from 'lodash';

import Coach from '@/services/coach-service';

import TextSpeaker from '@/components/TextSpeaker.vue';
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'HotspotsViewer',
    components: {
        TextSpeaker,
    },
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            Coach,
            response: null,
            selectedResponse: null,
        };
    },
    computed: {
        allowIncorrect() {
            return !!this.$store.state.apps.state.state.allowIncorrect;
        },
        currentStepOptions() {
            return this.step.data.options;
        },
        coach() {
            try {
                return this.$store.state.apps.state.state.coach;
            } catch {
                return {};
            }
        },
    },
    mounted() {
        this.unsubscribe = this.$store.subscribeAction(({ type, payload }) => {
            if (type === 'steps/handleHotspotClick') {
                this.selectedResponse = _.find(this.currentStepOptions, (option) => {
                    return option.id === payload.id;
                });
                this.handleHotspotClick();
            }
        });
    },
    beforeDestroy() {
        this.unsubscribe();
    },
    methods: {
        async handleHotspotClick() {
            const hotspot = document.getElementById(this.selectedResponse.id);
            hotspot.setAttribute('visible', false);
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
            } else {
                const hotspot = document.getElementById(this.selectedResponse.id);
                hotspot.setAttribute('visible', true);
            }
        },
        validateResponse() {
            if (this.selectedResponse) {
                if (this.allowIncorrect) {
                    return true;
                }
                // handle no correct option defined
                if (!this.step.data.correctOption) {
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
