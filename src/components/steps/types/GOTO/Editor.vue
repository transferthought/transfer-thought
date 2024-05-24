<template>
    <StepOverlayLayout ref="StepOverlayLayout">
        <template v-slot:Toolbar>
            <StepTypeDropdown :type="currentStep.type" @change="handleStepChange({ type: $event })" />
            <StepOptionsEditorDialog ref="StepOptionsEditorDialog" :step="currentStep" />
        </template>
        <template v-slot:Hero>
            <v-row align="center" justify="center" no-gutters class="fill-height pointer-events-auto" style="width: 100%">
                <v-btn class="font-weight-600 text-capitalize py-1 px-8 mr-2" depressed x-large @click="openDialog">
                    Open Options Dialog
                </v-btn>
            </v-row>
        </template>
        <template v-slot:Footer>
            <span />
        </template>
    </StepOverlayLayout>
</template>
<script>
import StepEditorMixin from '../../mixins/StepEditorMixin';

export default {
    name: 'GoToStepEditor',
    components: {},
    mixins: [StepEditorMixin],
    props: {},
    data() {
        return {};
    },
    mounted() {},
    computed: {},
    methods: {
        openDialog() {
            console.log(this.$refs, this.$refs.StepOverlayLayout.$scopedSlots.Toolbar()[1].context.$refs);
            this.$refs.StepOptionsEditorDialog.openDialog();
        },
    },
};
</script>

<style scoped></style>
