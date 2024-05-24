<template>
    <component id="step-view-container" :is="currentStepViewer" v-if="currentStepViewer" :key="key" :step="step" @complete="$emit('complete')" />
</template>
<script>
import _ from 'lodash';
import { getStepViewer } from '../types';

export default {
    name: 'StepViewerContainer',
    components: {},
    props: {},
    data() {
        return { currentStepViewer: null, key: null, step: null };
    },
    watch: {
        currentStep: {
            async handler(newStep) {
                console.log('CURRENT STEP CHANGE', newStep);
                const stepViewer = await getStepViewer(newStep.type);
                if (stepViewer) {
                    this.step = newStep;
                    this.currentStepViewer = stepViewer;
                    this.key = newStep.id;
                } else {
                    this.step = null;
                    this.currentStepViewer = null;
                    this.key = null;
                }
            },
            immediate: true,
        },
    },
    computed: {
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
    },
};
</script>

<style scoped></style>
