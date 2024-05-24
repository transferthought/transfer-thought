<template>
    <v-dialog v-model="showDialog" transition="dialog-top-transition" width="800">
        <template v-slot:activator="{}">
            <ToolbarBtn class="step-options-dialog-button" text="Edit Step Options" icon="mdi-cog" @click="openDialog" />
        </template>

        <v-card>
            <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                Edit Step Options
            </v-toolbar>
            <v-card-text class="card-padding">
                <StepOptionsEditorContainer :key="step.id" ref="StepOptionsEditorContainer" :step="step" />
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn id="step-options-cancel-button" text large class="font-weight-400 mb-0 text-capitalize" @click="cancel">
                    Cancel
                </v-btn>
                <v-btn id="step-options-save-button" depressed color="primary" class="font-weight-600 mb-0 text-capitalize" large @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import StepOptionsEditorContainer from './StepOptionsEditorContainer.vue';
import ToolbarBtn from './ToolbarBtn.vue';

export default {
    name: 'StepOptionsEditorDialog',
    components: {
        StepOptionsEditorContainer,
        ToolbarBtn,
    },
    props: {
        step: Object,
    },
    data() {
        return {
            showDialog: false,
        };
    },
    computed: {
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
    },
    watch: {
        currentStep() {
            // watch for current step type change
            // if current step id is the same but the type has changed
            // show dialog
            // this.showDialog = true;
        },
    },
    methods: {
        openDialog() {
            this.showDialog = true;
        },
        cancel() {
            this.showDialog = false;
            this.$refs.StepOptionsEditorContainer.cancel();
        },
        save() {
            this.$refs.StepOptionsEditorContainer.save();
            this.showDialog = false;
        },
    },
};
</script>

<style scoped></style>
