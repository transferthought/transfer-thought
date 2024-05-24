<template>
    <v-list-item class="step-item text-truncate">
        <v-list-item-icon x-small>
            <v-btn small depressed>
                <v-icon left>
                    {{ stepDefinition.icon }}
                </v-icon>
                {{ index + 1 }}
            </v-btn>
        </v-list-item-icon>
        <v-hover v-slot="{}">
            <v-list-item-content class="text-truncate">
                <ClickToEditTextInput :id="'step-name-input-' + step.name" ref="name-editor" :value="step.name" @change="handleStepNameChange(step, $event)">
                    <template v-slot:Display="{ value, edit }">
                        <v-list-item-title class="text-truncate" @click="edit">
                            {{ value }}
                            <v-btn v-show="false" icon x-small @click="edit">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-list-item-title>
                    </template>
                </ClickToEditTextInput>
            </v-list-item-content>
        </v-hover>

        <v-list-item-icon x-small>
            <v-menu offset-y :close-on-content-click="true">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-list-item-content class="justify-center">
                        <div class="mx-auto">
                            <v-btn class="text-capitalize" depressed rounded text @click="handleRenameClick">
                                <v-icon class="mr-2">
                                    mdi-pencil
                                </v-icon>
                                Rename Step
                            </v-btn>
                            <v-divider class="my-3" />
                            <v-btn class="text-capitalize" depressed rounded text @click="$emit('add')">
                                <v-icon class="mr-2">
                                    mdi-plus
                                </v-icon>
                                Insert Step
                            </v-btn>
                            <v-divider class="my-3" />
                            <v-btn class="text-capitalize" depressed rounded text @click="$emit('clone')">
                                <v-icon class="mr-2">
                                    mdi-content-copy
                                </v-icon>
                                Clone Step
                            </v-btn>
                            <v-divider class="my-3" />
                            <v-btn :disabled="index === 0" class="text-capitalize" depressed text @click="$emit('delete')">
                                <v-icon class="mr-2">
                                    mdi-delete
                                </v-icon>
                                Delete Step
                            </v-btn>
                        </div>
                    </v-list-item-content>
                </v-card>
            </v-menu>
        </v-list-item-icon>
    </v-list-item>
</template>
<script>
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';

import { getStepDefinition } from '../types';

export default {
    name: 'ObjectiveStep',
    components: {
        ClickToEditTextInput,
    },
    props: {
        index: {
            default: () => 0,
            type: Number,
        },
        step: {
            default: () => {},
            type: Object,
        },
    },
    data() {
        return { stepDefinition: {} };
    },
    watch: {
        step: {
            async handler(newStep) {
                const stepDefinition = await getStepDefinition(newStep.type);
                if (stepDefinition) {
                    this.stepDefinition = stepDefinition;
                } else {
                    this.stepDefinition = {};
                }
            },
            immediate: true,
        },
    },
    computed: {},
    methods: {
        handleStepNameChange(step, newName) {
            this.$store.dispatch('steps/updateStepById', { id: step.id, newData: { name: newName } });
        },
        handleRenameClick() {
            const stepNameEditor = this.$refs['name-editor'];
            stepNameEditor.enableEdit();
        },
    },
};
</script>

<style></style>
