import StepOptionsEditorDialog from '../components/StepOptionsEditorDialog.vue';
import StepOverlayLayout from '../components/StepOverlayLayout.vue';
import ToolbarBtn from '../components/ToolbarBtn.vue';
import StepTypeDropdown from '../components/StepTypeDropdown.vue';
import EmptyStep from '../components/EmptyStep.vue';
import StepViewerContainer from '@/components/steps/components/StepViewerContainer.vue';

import { getStepDefinition } from '../types';

export default {
    components: {
        StepTypeDropdown,
        StepOptionsEditorDialog,
        StepOverlayLayout,
        ToolbarBtn,
        EmptyStep,
        StepViewerContainer,
    },
    data() {
        return {
            currentStepDefinition: null,
        };
    },
    watch: {
        currentStep: {
            async handler() {
                const stepDefinition = await getStepDefinition(this.currentStep.type);
                this.currentStepDefinition = stepDefinition;
            },
            immediate: true,
        },
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
        currentStepIndex() {
            return this.$store.state.steps.currentStepIndex;
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
        app() {
            return this.$store.state.apps;
        },
        appContext() {
            return this.$store.state.apps.context;
        },
        selectedEntityId() {
            return this.$store.state.apps.context.selectedEntityId;
        },
        isEmpty() {
            if (this.currentStepDefinition && this.currentStepDefinition.isEmpty) {
                return this.currentStepDefinition.isEmpty(this.currentStep.data);
            }
            return false;
        },
    },
    methods: {
        handleStepChange(newData) {
            this.$store.dispatch('steps/updateStepById', { id: this.currentStep.id, newData });
        },
        handleStepDataChange(newData) {
            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData });
        },
    },
};
