<template>
    <StepOverlayLayout>
        <template v-slot:Toolbar>
            <StepTypeDropdown :type="currentStep.type" @change="handleStepChange({ type: $event })" />
            <StepOptionsEditorDialog :step="currentStep" />
        </template>
    </StepOverlayLayout>
</template>
<script>
import StepEditorMixin from '../../mixins/StepEditorMixin';

export default {
    name: 'NarrationOnlyEditor',
    components: {},
    mixins: [StepEditorMixin],
    props: {},
    data() {
        return {
            showEditOptionsDialog: false,
        };
    },
    computed: {},
    methods: {},
};
</script>

<style scoped></style>
