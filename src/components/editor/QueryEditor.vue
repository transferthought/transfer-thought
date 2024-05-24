<template>
    <div :id="'entity-' + entityId">
        {{ entityId }}
        <v-container>
            <v-textarea v-model="query.raw" />
            <v-btn @click="onRunQuery">
                Run
            </v-btn>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable */

import nlp from 'compromise';
import _ from 'lodash';
import ComponentEditorContainer from '@/components/editor/component-editors/ComponentEditorContainer.vue';
import Components, { ComponentList } from '@/components/editor/component-editors/ComponentDefinitions';

const EntityEditor = {
    name: 'EntityEditor',
    components: {
        ComponentEditorContainer,
    },
    props: {
        scene: Object,
        entityId: String,
    },
    data() {
        return {
            query: {
                raw: '',
                subject: '',
                object: '',
                verb: '',
            },
            components: [],
            componentList: ComponentList,
            componentDialog: false,
            entityDialog: false,
            newEntityName: '',
            newComponent: { entityId: this.entityId, componentType: 'position', attributes: {} },
        };
    },
    mounted() {
        this.updateComponentList();
        this.entityId = 'scene';
    },
    watch: {
        entityId() {
            this.updateComponentList();
            this.newComponent.entityId = this.entityId;
        },
    },
    methods: {
        onRunQuery() {
            const doc = nlp(this.query.raw);
            if (doc.verbs().json()[0].text === 'is') {
                const newEntityId = this.onAddEntity(doc.nouns().json()[0].text);
                if (doc.nouns().json()[1].text === 'box') {
                    this.newComponent = { entityId: newEntityId, componentType: 'geometry', attributes: {} };
                    this.onAddComponent(this.newComponent);
                    if (this.isColor(doc.nouns().adjectives().json()[0].text)) {
                        const newColor = doc.nouns().adjectives().json()[0].text;
                        this.newComponent = { entityId: newEntityId, componentType: 'material', attributes: { color: newColor } };
                        this.onAddComponent(this.newComponent);
                    }
                }
                this.updateComponentList();
            }
        },
        isColor(strColor) {
            const s = new Option().style;
            s.color = strColor;
            return s.color === strColor;
        },
        onAddEntity(name) {
            this.entityDialog = false;
            this.newEntityName = '';
            return this.scene.config.addEntity(this.entityId, name);
        },
        onAddComponent(component) {
            this.componentDialog = false;
            this.scene.config.addComponent(component.entityId, component.componentType, component.attributes);
            this.newComponent = { entityId: this.entityId, componentType: 'position', attributes: {} };
        },
        onComponentUpdate(component) {
            this.scene.updateComponent(component.entityId, component.componentType, component.attributes);
        },
        updateComponentList() {
            this.components = [];
            _.forOwn(this.scene.config, (item) => {
                if (item && item.type === 'component') {
                    if (item.entityId === this.entityId) {
                        this.components.push(item);
                    }
                }
            });
        },
        getComponentDefinitionByType(componentType) {
            return Components[componentType];
        },
    },
};

export default EntityEditor;
</script>


<style scoped>
</style>
