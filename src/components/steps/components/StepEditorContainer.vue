<template>
    <component class="step-editor-container" :is="currentStepEditor" v-if="currentStepEditor" />
</template>
<script>
import _ from 'lodash';
import { getStepEditor } from '../types';

export default {
    name: 'StepEditorContainer',
    components: {},
    props: {},
    data() {
        return {
            currentStepEditor: null,
        };
    },
    watch: {
        currentStep: {
            async handler(newStep) {
                const stepEditor = await getStepEditor(newStep.type);
                if (stepEditor) {
                    this.currentStepEditor = stepEditor;
                } else {
                    this.currentStepEditor = null;
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
