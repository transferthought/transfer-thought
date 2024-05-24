<template>
    <div>
        <component
            :is="entityIdInputDefinition.controller"
            :etity-id="entityId"
            :input-definition="entityIdInputDefinition"
            :component-attributes="attributes"
            :current-value="getCurrentValueForAttribute(entityIdInputDefinition.name)"
            :on-value-changed="handleAttributeValueChanged"
        />
        <component
            :is="componentActionInputDefinition.controller"
            :etity-id="entityId"
            :input-definition="componentActionInputDefinition"
            :component-attributes="attributes"
            :current-value="getCurrentValueForAttribute(componentActionInputDefinition.name)"
            :on-value-changed="handleAttributeValueChanged"
        />
        <div v-for="actionArgument in actionArguments" :key="actionArgument.name">
            <component
                :is="actionArgument.controller"
                :input-definition="actionArgument"
                :current-value="getCurrentValueForAttribute(actionArgument.name)"
                :on-value-changed="handleAttributeValueChanged"
            />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import BaseComponentEditor from './BaseComponentEditor.vue';
import { EntityIdInputDefinition, ComponentActionInputDefinition } from './ComponentDefinitions';
import InputControllers from '../input-controllers';

export default {
    name: 'TriggerEditor',
    extends: BaseComponentEditor,
    computed: {
        entityIdInputDefinition() {
            return EntityIdInputDefinition;
        },
        componentActionInputDefinition() {
            return ComponentActionInputDefinition;
        },
        actionArguments() {
            const { action: actionId } = this.attributes;
            const action = this.$store.getters['apps/actions/getActionById'](actionId);
            if (action) {
                return _.map(action.argumentDefinitions, (argument) => ({
                    name: argument.name,
                    controller: this.getInputController(argument.controller),
                }));
            }
            return [];
        },
    },
    watch: {
        // action() {
        //     const newAttributes = {
        //         action: this.action,
        //         event: this.event,
        //     };
        //     this.actionArguments.forEach((actionArgument) => {
        //         newAttributes[actionArgument.name] = this.getCurrentValueForAttribute(actionArgument.name) || actionArgument.default;
        //     });
        //     this.onAttributesUpdated(newAttributes, true);
        // },
    },
    methods: {
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
