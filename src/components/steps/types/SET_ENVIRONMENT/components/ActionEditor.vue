<template>
    <div>
        <label class="label-color font-weight-600 mb-2 d-block">Action</label>
        <v-select v-model="action" :items="actionItems" outlined class="input-style font-size-input">
            <template v-slot:item="{ on, attrs, item }">
                <v-list-item v-on="on" v-bind="attrs">
                    <v-list-item-icon v-if="item.icon">
                        <v-icon style="font-size:20px">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-select>
        <div v-for="actionArgument in actionArguments" :key="actionArgument.name">
            <component
                :key="actionArgument.name"
                :is="actionArgument.controller"
                :input-definition="actionArgument"
                :current-value="getArgumentValue(actionArgument.name)"
                :on-value-changed="handleAttributeValueChanged"
            />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import {
    GoToNextStep,
    GoToPreviousStep,
    GoToStep,
    SetState,
    ShowEntity,
    HideEntity,
    PlaySound,
    StopSound,
    PlayAction,
    StopAction,
} from '@/components/editor/ActionDefinitions';

import InputControllers from '@/components/editor/input-controllers';
import { ShowOverlay } from '../../../../editor/ActionDefinitions';
export default {
    name: 'ActionEditor',
    props: {
        value: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            actionItems: [
                { text: 'None', value: null },
                { icon: 'mdi-skip-next', text: GoToNextStep.name, value: GoToNextStep.id },
                { icon: 'mdi-skip-previous', text: GoToPreviousStep.name, value: GoToPreviousStep.id },
                { icon: 'mdi-directions-fork', text: GoToStep.name, value: GoToStep.id },
                { divider: true },
                { icon: 'mdi-eye-off', text: HideEntity.name, value: HideEntity.id },
                { icon: 'mdi-eye', text: ShowEntity.name, value: ShowEntity.id },
                { icon: 'mdi-play', text: PlaySound.name, value: PlaySound.id },
                { divider: true },
                { icon: 'mdi-image-area-close', text: ShowOverlay.name, value: ShowOverlay.id },
                // { icon: 'mdi-stop', text: StopSound.name, value: StopSound.id },
                { icon: 'mdi-animation-play', text: PlayAction.name, value: PlayAction.id },
                // { icon: 'mdi-stop', text: StopAction.name, value: StopAction.id },
                { divider: true },
                { icon: 'mdi-database', text: SetState.name, value: SetState.id },
            ],
        };
    },
    computed: {
        action: {
            get() {
                if (this.value.action) {
                    return this.value.action;
                }
                // Return null to force first selection in selection options
                return null;
            },
            set(action) {
                this.$emit('change', { action });
            },
        },
        actionArguments() {
            const action = this.$store.getters['apps/actions/getActionById'](this.action);
            if (action) {
                return _.map(action.argumentDefinitions, (argument) => ({
                    label: argument.label,
                    name: argument.name,
                    controller: this.getInputController(argument.controller),
                    data: argument.data ? argument.data(this.value) : {},
                }));
            }
            return [];
        },
    },
    watch: {},
    methods: {
        handleChange() {
            this.$emit('change');
        },
        getArgumentValue(property) {
            return this.value[property] || null;
        },
        handleAttributeValueChanged(property, newValue) {
            this.$emit('change', { [property]: newValue });
        },
        getInputController(controller) {
            const inputController = InputControllers[controller];
            if (inputController) {
                return inputController;
            }
            return InputControllers.BaseInput;
        },
    },
};
</script>
