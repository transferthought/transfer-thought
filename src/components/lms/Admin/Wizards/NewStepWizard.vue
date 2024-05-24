<template>
    <BaseWizard ref="base-wizard" :steps="steps" @cancel="handleCancel" @submit="handleSubmit">
        <template v-slot:Step-1>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Step Name</label>
                    <v-text-field
                        :value="step.name"
                        hide-details
                        outlined
                        class="input-style font-size-input"
                        placeholder="New Step..."
                        @change="handleStepNameChange"
                    >
                        <template slot="prepend-inner">
                            <v-icon color="#adb5bd">
                                mdi-text-short
                            </v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <TextToSpeech :voice="state.coach.voice" :transcript="step.data.transcript" @change="handleTextToSpeachChange" />
                </v-col>
            </v-row>
        </template>
        <template v-slot:Step-2>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Select step type</label>
                    <StepTypeDropdown :type="step.type" @change="handleStepTypeChange" />
                </v-col>
            </v-row>
        </template>
        <template v-slot:Step-3>
            <StepOptionsEditorContainer ref="StepOptionsEditorContainer" :step="step" />
        </template>
    </BaseWizard>
</template>

<script>
import TextToSpeech from '@/components/steps/components/TextToSpeech.vue';
import _ from 'lodash';
import StepTypeDropdown from '@/components/steps/components/StepTypeDropdown.vue';
import StepOptionsEditorContainer from '@/components/steps/components/StepOptionsEditorContainer.vue';
import BaseWizard from './BaseWizard.vue';

export default {
    components: {
        BaseWizard,
        StepTypeDropdown,
        TextToSpeech,
        StepOptionsEditorContainer,
    },
    data() {
        return {
            steps: [
                {
                    name: 'Step Info',
                },
                {
                    name: 'Step Type',
                },
                {
                    name: 'Step Options',
                },
            ],
            step: {
                name: 'New Step...',
                type: 'TITLE_OVERLAY',
                data: {
                    title: 'New Step...',
                    transcript: '',
                },
            },
        };
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
        currentSteps() {
            return this.state.steps;
        },
    },
    mounted() {
        this.handleStepNameChange(`New Step ${this.currentSteps.length + 1}`);
    },
    methods: {
        handleTextToSpeachChange(data) {
            _.extend(this.step.data, data);
        },
        handleStepNameChange(newName) {
            this.step.name = newName;
            // maybe make this smarter in case user goes backwards and updates?
            this.step.data.title = newName;
        },
        handleStepTypeChange(newType) {
            this.step.type = newType;
        },
        getWizardData() {
            const stepData = this.$refs.StepOptionsEditorContainer.getStepData();
            _.extend(this.step.data, stepData);
            return this.step;
        },
        resetWizardData() {
            this.step = {
                name: 'New Step...',
                type: 'TITLE_OVERLAY',
                data: {
                    title: 'New Step...',
                    transcript: '',
                },
            };
            this.$refs['base-wizard'].reset();
        },
        handleNext() {
            this.$refs['base-wizard'].handleNext();
        },
        handleCancel() {
            this.resetWizardData();
            this.$emit('cancel');
        },
        handleSubmit() {
            const wizardData = this.getWizardData();
            this.resetWizardData();
            this.$emit('submit', wizardData);
        },
    },
};
</script>
