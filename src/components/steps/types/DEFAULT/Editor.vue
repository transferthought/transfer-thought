<template>
    <StepOverlayLayout>
        <template v-slot:Toolbar>
            <StepTypeDropdown :type="currentStep.type" @change="handleStepChange({ type: $event })" />
            <StepOptionsEditorDialog ref="StepOptionsDialog" :step="currentStep" />
        </template>
        <template v-slot:Hero>
            <EmptyStep v-if="isEmpty" @open-step-options-dialog="onOpenStepOptionsDialog" />

            <StepViewerContainer v-else />
        </template>
    </StepOverlayLayout>
</template>
<script>
import StepEditorMixin from '../../mixins/StepEditorMixin';

export default {
    name: 'DefaultEditor',
    components: {},
    mixins: [StepEditorMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        onOpenStepOptionsDialog() {
            this.$refs.StepOptionsDialog.openDialog();
        },
    },
};
</script>

<style scoped></style>
