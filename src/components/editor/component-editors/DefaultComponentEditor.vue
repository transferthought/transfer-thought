<template>
    <div v-if="componentDefinition">
        <div
            v-for="inputDefinition in componentDefinition.attributes"
            :key="inputDefinition.name"
        >
            <component
                :is="inputDefinition.controller"
                :entity-id="entityId"
                :input-definition="inputDefinition"
                :component-attributes="attributes"
                :current-value="getCurrentValueForAttribute(inputDefinition.name)"
                :on-value-changed="handleAttributeValueChanged"
            />
        </div>
    </div>
</template>

<script>
import BaseComponentEditor from './BaseComponentEditor.vue';

export default {
    name: 'DefaultComponentEditor',
    extends: BaseComponentEditor,
};
</script>
