<template>
    <fragment>
        <v-container id="ai-coach" align="center" justify="center" class="fill-height pointer-events-none pa-5 align-end">
            <AIChatBox :step="step" :systemMessage="generateSystemMessage()" @continue="handleContinue" />
        </v-container>
    </fragment>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';
import AIChatBox from '../../components/AIChatBox.vue';

export default {
    name: 'AICoachView',
    components: {
        AIChatBox,
    },
    mixins: [StepViewerMixin],
    props: {
        step: Object,
    },
    data() {
        return {};
    },
    methods: {
        generateStepDataForSystemMessage() {
            // grab all of the proceding steps data
            const stepDataString = this.steps.slice(0, this.currentStepIndex).map((step, index) => {
                return `Step ${index + 1}
Name: ${step.name}
Data: ${step.data.transcript || 'none'}`;
            });
            return stepDataString.join('\n');
        },
        generateSystemMessage() {
            const systemMessageTemplate = `You are an AI tutor. Your job is to answer student questions to the best of your ability based on the Presentation Data and Additional Info provided.

If a question is asked that is unrelated to the provided data, please respond with "I am not sure how to answer that, please ask your supervisor."
Presentation Data: <${this.generateStepDataForSystemMessage()}>
Additional Info: <${this.step.data.additionalInfo || 'none'}>

It is important that you respond with less than 50 words.`;
            return systemMessageTemplate;
        },
        handleContinue() {
            this.$emit('complete');
        },
    },
};
</script>

<style></style>
