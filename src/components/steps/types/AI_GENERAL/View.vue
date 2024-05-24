<template>
    <v-container id="ai-general" align="center" justify="center" class="fill-height pointer-events-none pa-5 align-end">
        <AIChatBox :step="step" :systemMessage="generateSystemMessage()" @continue="handleContinue" />
    </v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';
import AIChatBox from '../../components/AIChatBox.vue';

export default {
    name: 'AICoachView',
    components: { AIChatBox },
    mixins: [StepViewerMixin],
    props: {
        step: Object,
    },
    data() {
        return {};
    },
    methods: {
        generateSystemMessage() {
            return this.step.data.systemMessage;
        },
        handleContinue() {
            this.$emit('complete');
        },
    },
};
</script>

<style></style>
