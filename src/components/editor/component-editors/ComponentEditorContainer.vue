<template>
    <div>
        <div v-if="componentEditorOverride">
            <component
                :is="componentEditorOverride"
                :entity-id="entityId"
                :attributes="attributes"
                :on-attributes-updated="onAttributesUpdated"
            />
        </div>
        <div v-else-if="componentDefinition">
            <component
                :is="componentDefinition.editor"
                :component-definition="componentDefinition"
                :entity-id="entityId"
                :attributes="attributes"
                :on-attributes-updated="onAttributesUpdated"
            />
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import Components from './ComponentDefinitions';

export default {
    name: 'ComponentEditorContainer',
    props: {
        entityId: String,
        componentEditorOverride: Object,
        componentType: String,
        attributes: Object,
        onUpdate: {
            type: Function,
            default: () => {},
        },
    },
    computed: {
        componentDefinition() {
            return Components[this.componentType];
        },
    },
    methods: {
        onAttributesUpdated(newAttributes, replace) {
            let attributes = _.clone(newAttributes);
            if (!replace && _.isObject(this.attributes)) {
                attributes = _.extend({}, this.attributes, newAttributes);
            }
            this.onUpdate(attributes);
        },
    },
};
</script>
