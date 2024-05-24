<template>
    <div>
        <ComponentEditorContainer v-if="layer.type === 'layer'" :component-type="getComponentType()" :attributes="value.value" :on-update="onValueUpdate" />
        <ComponentEditorContainer
            v-if="layer.type === 'action'"
            :component-editor-override="TriggerEditor"
            :attributes="value.value"
            :on-update="onValueUpdate"
        />
    </div>
</template>

<script>
import ComponentEditorContainer from '@/components/editor/component-editors/ComponentEditorContainer.vue';
import TriggerEditor from '@/components/editor/component-editors/TriggerEditor.vue';

export default {
    name: 'LayerValueEditor',
    components: {
        ComponentEditorContainer,
    },
    props: {
        layer: Object,
        value: Object,
    },
    data() {
        return {
            TriggerEditor,
        };
    },
    computed: {
        config() {
            return this.$store.state.apps.config.config;
        },
    },
    methods: {
        getComponentType() {
            if (this.layer) {
                const component = this.config[this.layer.id];
                if (component) {
                    return component.componentType;
                }
            }
            return null;
        },
        onValueUpdate(attributes) {
            this.value.value = attributes;
        },
    },
};
</script>
