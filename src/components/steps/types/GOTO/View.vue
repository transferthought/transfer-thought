<template>
    <v-container id="go-to-step" align="center" justify="center" class="fill-height pa-5"></v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';
import GoToStepOptionsEditor from './OptionsEditor.vue';

export default {
    name: 'GoToStep',
    components: { GoToStepOptionsEditor },
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        async RunStep() {
            if (this.step?.data?.stepId) {
                this.$store.dispatch('steps/gotToStepById', { stepId: this.step.data.stepId });
            } else {
                this.$store.dispatch('steps/next');
            }
        },
    },
};
</script>

<style></style>
