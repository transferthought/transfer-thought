<template>
    <fragment>
        <template v-for="optionComponent in optionComponents">
            <component v-if="optionComponent" :is="optionComponent" :key="optionComponent.name" :step="step" :ref="optionComponent.name" />
        </template>
    </fragment>
</template>
<script>
// Step Option Editor is the container to all the Step Option Editors
// This way, components that need editors can use this component without having to import all the components
// Can also be used as a nice interface to the editors
import _ from 'lodash';
import { getStepOptionsEditor, getStepDefinition } from '../types';
import AutoProgressOptions from './Settings/AutoProgressOptions.vue';

export default {
    name: 'StepOptionsEditorContainer',
    components: {
        AutoProgressOptions,
    },
    props: {
        step: Object,
    },
    data() {
        return {
            allSettingOptionComponents: [
                {
                    setting: 'showAutoProgressOptions',
                    component: AutoProgressOptions,
                },
            ],
            currentStepOptionEditor: null,
            currentStepDefinition: null,
        };
    },
    watch: {
        step: {
            async handler(newStep) {
                const stepEditor = await getStepOptionsEditor(newStep.type);
                if (stepEditor) {
                    this.currentStepOptionEditor = stepEditor;
                } else {
                    this.currentStepOptionEditor = null;
                }
                const stepDefinition = await getStepDefinition(newStep.type);
                if (stepDefinition) {
                    this.currentStepDefinition = stepDefinition;
                } else {
                    this.currentStepDefinition = {};
                }
            },
            immediate: true,
        },
    },
    computed: {
        optionComponents() {
            // make sure the components are working
            const optionComponents = [this.currentStepOptionEditor];
            const visibleSettingsOptionComponents = this.allSettingOptionComponents
                .filter((item) => {
                    return this.currentStepDefinition?.settings[item.setting];
                })
                .map((item) => item.component);

            return optionComponents.concat(visibleSettingsOptionComponents);
        },
    },
    methods: {
        resetStepData(...args) {
            this.optionComponents.forEach((optionComponent) => {
                const ref = this.$refs[optionComponent.name][0];
                ref.resetStepData.apply(null, args);
            });
        },
        updateStepData(...args) {
            this.optionComponents.forEach((optionComponent) => {
                const ref = this.$refs[optionComponent.name][0];
                ref.updateStepData.apply(null, args);
            });
        },
        getStepData(...args) {
            const stepData = {};
            this.optionComponents.forEach((optionComponent) => {
                const ref = this.$refs[optionComponent.name][0];
                if (ref.getStepData) {
                    const optionComponentData = ref.getStepData.apply(null, args);
                    _.extend(stepData, optionComponentData);
                }
            });
            return stepData;
        },
        cancel() {
            const ref = this.$refs[this.currentStepOptionEditor.name][0];
            if (ref && ref.cancel) {
                ref.cancel();
            }
            this.resetStepData();
        },
        save() {
            const ref = this.$refs[this.currentStepOptionEditor.name][0];
            if (ref && ref.save) {
                ref.save();
            }

            const newData = this.getStepData();
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData,
            });
        },
    },
};
</script>
