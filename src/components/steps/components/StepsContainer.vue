<template>
    <v-layout fill-height id="step-container">
        <v-row
            v-shortkey="{ new: ['ctrl', 'n'], next: ['tab'], prev: ['shift', 'tab'], up: ['arrowup'], down: ['arrowdown'] }"
            no-gutters
            class="fill-height"
            style="width: 100%"
            @shortkey="handleShortKey"
        >
            <v-col id="objectives-container" class="fill-height">
                <v-list class="pa-0 fill-height d-flex flex-column">
                    <v-list-item-group
                        id="objectives-list"
                        ref="steps-list"
                        :value="currentStepIndex"
                        mandatory
                        color="primary"
                        @change="handleCurrentStepChange"
                    >
                        <StepItem
                            v-if="steps && steps.length"
                            :step="steps[0]"
                            :index="0"
                            @clone="handleCloneStep(steps[0], 0)"
                            @add="handleShowNewStepWizard(0)"
                        />
                        <draggable
                            :list="draggableSteps"
                            ghost-class="ghost"
                            handle=".draggable"
                            :scroll-sensitivity="100"
                            :force-fallback="true"
                            @change="handleStepOrderChange"
                        >
                            <StepItem
                                v-for="(step, index) in draggableSteps"
                                :key="index + 1"
                                :step="step"
                                :index="index + 1"
                                class="draggable"
                                @delete="handleDeleteStep(step, index + 1)"
                                @clone="handleCloneStep(step, index + 1)"
                                @add="handleShowNewStepWizard(index + 1)"
                            />
                        </draggable>
                    </v-list-item-group>
                    <!-- <SplitButton /> -->

                    <v-item-group class="split-button-container d-flex my-2 mx-3">
                        <v-btn
                            depressed
                            color="primary"
                            class="new-step-button main-button font-weight-600 text-h5 text-capitalize py-1 flex-grow-1 rounded-r-0"
                            x-large
                            @click="handleShowNewStepWizard()"
                        >
                            Add New Step
                            <v-icon dark>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    depressed
                                    color="primary"
                                    class="split-button font-weight-600 text-h3 text-capitalize py-1 rounded-l-0"
                                    x-large
                                    v-on="on"
                                    v-bind="attrs"
                                >
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="showEnvironmentPicker = true">
                                    <v-list-item-icon>
                                        <v-icon>
                                            mdi-image-multiple
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Create multiple steps from photos</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="showGenerateStepsDialog = true">
                                    <v-list-item-icon>
                                        <v-icon>
                                            mdi-auto-fix
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>(Beta) Create multiple steps from text</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-item-group>
                </v-list>
            </v-col>
        </v-row>
        <v-dialog v-model="showNewStepWizard" width="600px" @keydown.enter="$refs.NewStepWizard.handleNext">
            <NewStepWizard v-if="showNewStepWizard" ref="NewStepWizard" @submit="handleAddNewStep" @cancel="handleCloseNewStepWizard" />
        </v-dialog>

        <v-dialog v-model="showEnvironmentPicker" hide-overlay transition="dialog-bottom-transition">
            <AssetViewer
                title-display="Select 360 Photos"
                select-display="Select Photos"
                :views-to-show="['TRANSFER_THOUGHT_ASSETS', 'EXPLORE_EQ', 'DALL_EQ', 'BLOCKADE_EQ', 'MY_ASSET_VIEW']"
                :options="{ subFolder: 'environments' }"
                multiple
                @close="showEnvironmentPicker = false"
                @selected="handleEnvironmentSelected"
            />
        </v-dialog>
        <GenerateStepsDialog :show="showGenerateStepsDialog" @cancel="showGenerateStepsDialog = false" @submit="handleNewSteps" />
    </v-layout>
</template>
<script>
import _ from 'lodash';
import draggable from 'vuedraggable';
import SplitButton from '@/components/SplitButton.vue';
import AssetViewer from '@/features/assets/AssetViewer.vue';
import NewStepWizard from '@/components/lms/Admin/Wizards/NewStepWizard.vue';
import StepItem from '@/components/steps/components/StepItem.vue';

import GenerateStepsDialog from '@/components/GenerateStepsDialog.vue';

export default {
    name: 'ObjectivesContainer',
    components: {
        draggable,
        SplitButton,
        AssetViewer,
        NewStepWizard,
        StepItem,
        GenerateStepsDialog,
    },
    props: {
        objectives: {
            default: () => [],
            type: Array,
        },
    },
    data() {
        return {
            prompt: '',
            showNewStepWizard: false,
            showEnvironmentPicker: false,
            newStepIndex: null,
            showGenerateStepsDialog: false,
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
        steps() {
            return _.cloneDeep(this.state.steps || []);
        },
        draggableSteps() {
            return this.steps.slice(1);
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
        currentStepIndex() {
            return this.$store.state.steps.currentStepIndex;
        },
    },
    watch: {
        currentStepIndex() {},
    },
    methods: {
        async handleEnvironmentSelected(images) {
            if (images && images.length) {
                const newEnvironmentPromises = images.map(async (image) => {
                    return this.$store.dispatch('steps/addStep', {
                        step: {
                            type: 'SET_ENVIRONMENT',
                            data: {
                                src: image,
                            },
                        },
                    });
                });
                await Promise.all(newEnvironmentPromises);

                const newStepIndex = this.steps.length - images.length;
                await this.$store.dispatch('steps/setCurrentStepIndex', newStepIndex);
                const stepsListEl = this.$refs['steps-list'];
                if (stepsListEl && stepsListEl.$el) {
                    const averageItemHeight = stepsListEl.$el.scrollHeight / this.steps.length;
                    stepsListEl.$el.scrollTop = averageItemHeight * this.currentStepIndex;
                }
            }
            this.showEnvironmentPicker = false;
        },
        handleCurrentStepChange(selectedIndex) {
            this.$store.dispatch('steps/setCurrentStepIndex', selectedIndex);
        },
        handleShowNewStepWizard(index = null) {
            // this.showNewStepWizard = true;
            this.newStepIndex = index !== null && index > -1 ? index + 1 : null;
            this.handleAddNewStep({ type: 'TITLE_OVERLAY' });
        },
        handleCloseNewStepWizard() {
            this.showNewStepWizard = false;
            this.newStepIndex = null;
        },
        async handleNewSteps(steps) {
            steps.forEach(async (step) => {
                await this.$store.dispatch('steps/addStep', { step });
            });
            this.showGenerateStepsDialog = false;
        },
        async handleAddNewStep(data) {
            await this.$store.dispatch('steps/addStep', { step: data, index: this.newStepIndex });
            const newStepIndex = this.newStepIndex || this.steps.length - 1;
            await this.$store.dispatch('steps/setCurrentStepIndex', newStepIndex);
            const stepsListEl = this.$refs['steps-list'];
            if (stepsListEl && stepsListEl.$el) {
                const averageItemHeight = stepsListEl.$el.scrollHeight / this.steps.length;
                stepsListEl.$el.scrollTop = averageItemHeight * this.currentStepIndex;
            }
            this.handleCloseNewStepWizard();
        },
        async handleCloneStep(step, index) {
            const newIndex = index + 1;
            const newStep = await this.$store.dispatch('steps/cloneStep', step.id);
            await this.$store.dispatch('steps/addStep', { step: newStep, index: newIndex });
            await this.$store.dispatch('steps/setCurrentStepIndex', newIndex);
        },
        handleDeleteStep(step) {
            this.$store.dispatch('steps/deleteStep', step.id);
        },
        handleStepOrderChange(event) {
            this.$store.dispatch('steps/reorder', { oldIndex: event.moved.oldIndex + 1, newIndex: event.moved.newIndex + 1 });
            this.$store.dispatch('steps/setCurrentStepIndex', event.moved.newIndex + 1);
        },

        handleShortKey(data) {
            if (data.srcKey === 'next' || data.srcKey === 'down') {
                this.$store.dispatch('steps/setCurrentStepIndex', this.currentStepIndex + 1);
            } else if (data.srcKey === 'prev' || data.srcKey === 'up') {
                this.$store.dispatch('steps/setCurrentStepIndex', this.currentStepIndex - 1);
            } else if (data.srcKey === 'new') {
                this.handleShowNewStepWizard();
            }
        },
    },
};
</script>

<style>
#objectives-list {
    overflow: scroll;
    overflow-x: hidden;
    max-height: 100%;
}
#objectives-container {
    display: flex;
    flex-direction: column;
    z-index: 20;
    overflow: hidden;
}
.ghost {
    border: solid 2px var(--v-primary-base) !important;
}
.sortable-fallback {
    display: none;
}

.split-button-container .main-button {
    margin-right: 2px;
}
.split-button-container .split-button {
    min-width: 50px !important;
}
</style>
