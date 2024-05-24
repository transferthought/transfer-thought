<template>
    <div>
        <component
            :is="attributesOverrideDefinition.controller"
            :entity-id="entityId"
            :input-definition="attributesOverrideDefinition"
            :component-attributes="attributes"
            :current-value="getCurrentValueForAttribute(attributesOverrideDefinition.name)"
            :on-value-changed="handleAttributeValueChanged"
        />
        <component
            :is="eventInputDefinition.controller"
            :entity-id="entityId"
            :input-definition="eventInputDefinition"
            :component-attributes="attributes"
            :current-value="getCurrentValueForAttribute(eventInputDefinition.name)"
            :on-value-changed="handleAttributeValueChanged"
        />
        <ComponentEditorContainer :component-editor-override="TriggerEditor" :entity-id="entityId" :attributes="attributes" :on-update="onAttributesUpdated" />
    </div>
</template>

<script>
import _ from 'lodash';
import BaseComponentEditor from './BaseComponentEditor.vue';
import TriggerEditor from './TriggerEditor.vue';
import ComponentEditorContainer from './ComponentEditorContainer.vue';

export default {
    name: 'EventEditor',
    components: {
        ComponentEditorContainer,
    },
    extends: BaseComponentEditor,
    data() {
        const { action, event } = this.attributes;
        return {
            action,
            event,
            actionAttributes: [],
            TriggerEditor,
        };
    },
    computed: {
        attributesOverrideDefinition() {
            return _.find(this.componentDefinition.attributes, (attribute) => attribute.name === 'attributesOverride');
        },
        eventInputDefinition() {
            return _.find(this.componentDefinition.attributes, (attribute) => attribute.name === 'event');
        },
    },
};
</script>
