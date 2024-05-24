<template>
    <div v-if="entity" :id="'entity'" class="fill-height" style="overflow: auto">
        <v-hover v-slot="{ hover }">
            <v-list-item class="pt-1">
                <v-list-item-content>
                    <v-list-item-title v-show="!editingName" @click="enableEditEntityName()">
                        {{ entity.name }}
                    </v-list-item-title>
                    <v-text-field v-show="editingName" ref="entityName" v-model="entity.name" solo dense hide-details single-line @blur="editingName = false" />
                </v-list-item-content>

                <v-list-item-icon v-show="hover && !editingName">
                    <v-btn icon x-small @click="enableEditEntityName()">
                        <v-icon color="grey ligten-4">
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </v-list-item-icon>

                <v-list-item-icon x-small>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon small v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="updateShowAddEntityDialog(true)">
                                <v-list-item-icon>
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Add Child</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="componentDialog = true">
                                <v-list-item-icon>
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Add Component</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item-icon>
            </v-list-item>
        </v-hover>
        <v-divider light class="ma-1" />
        <v-expansion-panels flat tile>
            <v-expansion-panel v-for="component in components" :key="component.id" class="mt-0">
                <v-expansion-panel-header>
                    <template v-slot:actions>
                        <v-icon x-small>
                            $expand
                        </v-icon>
                    </template>
                    <v-list-item class="pa-0 component-item">
                        <v-list-item-content class="pa-0 ">
                            <v-list-item-title color="primary" class="grey--text text--lighten-1 text-caption text-uppercase">
                                {{ getComponentDisplayName(component.componentType) }}
                            </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-icon class="ma-0">
                            <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon x-small v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="copyId(component)">
                                        <v-list-item-icon>
                                            <v-icon>mdi-content-copy</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Copy Component Id</v-list-item-title>
                                    </v-list-item>
                                    <v-list-item @click="onDeleteComponent(component)">
                                        <v-list-item-icon>
                                            <v-icon>mdi-delete</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Delete</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-list-item-icon>
                    </v-list-item>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <ComponentEditorContainer
                        :entity-id="entity.id"
                        :component-type="component.componentType"
                        :attributes="component.attributes"
                        :on-update="
                            (attributes) => {
                                onComponentUpdate(component, attributes);
                            }
                        "
                    />
                </v-expansion-panel-content>
                <v-divider light class="ma-1" />
            </v-expansion-panel>
        </v-expansion-panels>

        <v-dialog :value="showAddEntityDialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Object</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-container class="elementContainer">
                            <h4>Empty</h4>
                            <v-row id="emptyRow" class="shapeRow">
                                <v-col v-for="empty in empties" :key="empty.type" cols="2">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn outlined @click="onAddEntity(empty.type)" v-on="on">
                                                <v-icon>{{ empty.icon }}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ empty.name }}</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <h4>3D Shapes</h4>
                            <v-row class="shapeRow">
                                <v-col v-for="threeDShape in threeDShapes" :key="threeDShape.type" cols="2">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn outlined @click="onAddEntity(threeDShape.type)" v-on="on">
                                                <v-icon>{{ threeDShape.icon }}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ threeDShape.name }}</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <h4>2D Shapes</h4>
                            <v-row class="shapeRow">
                                <v-col v-for="twoDShape in twoDShapes" :key="twoDShape.type" cols="2">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn outlined @click="onAddEntity(twoDShape.type)" v-on="on">
                                                <v-icon>{{ twoDShape.icon }}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ twoDShape.name }}</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                            <h4>UI Elements</h4>
                            <v-row class="shapeRow">
                                <v-col v-for="UIElement in UIElements" :key="UIElement.type" cols="2">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn outlined @click="onAddEntity(UIElement.type)" v-on="on">
                                                <v-icon>{{ UIElement.icon }}</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>{{ UIElement.name }}</span>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-row class="inputPrefab">
                            <v-btn depressed @click="showPrefabSelector = true">
                                Prefab
                            </v-btn>
                            <v-dialog v-model="showPrefabSelector" fullscreen hide-overlay transition="dialog-bottom-transition">
                                <v-card>
                                    <v-toolbar dark color="primary">
                                        <v-btn icon dark @click="showPrefabSelector = false">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        <v-toolbar-title>Prefabs</v-toolbar-title>
                                        <v-spacer />
                                    </v-toolbar>
                                    <Paging query-name="ownerAppsByName" :filter="{ type: { eq: 'prefab' } }">
                                        <template v-slot:default="slotProps">
                                            <v-col v-for="item in slotProps.items" :key="item.id" cols="3">
                                                <v-card class="mx-auto" outline hover @click="selectedPrefab = item">
                                                    <v-card-title>{{ item.name }}</v-card-title>
                                                </v-card>
                                            </v-col>
                                            <v-col v-if="slotProps.loading" cols="3">
                                                <v-skeleton-loader class="mx-auto" type="card" />
                                            </v-col>
                                        </template>
                                    </Paging>
                                    <v-card-actions class="background lighten-1 text-center">
                                        <v-spacer />
                                        <v-btn color="primary" :disabled="!selectedPrefab" @click="onAddPrefab">
                                            Select
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="closeButton" color="blue darken-1" text @click="updateShowAddEntityDialog(false)">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="componentDialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Component</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-autocomplete v-model="newComponent.componentType" :items="componentList" label="Component" required />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <ComponentEditorContainer
                                    :entity-id="entity.id"
                                    :component-type="newComponent.componentType"
                                    :attributes="newComponent.attributes"
                                    :on-update="onNewComponentAttributesUpdate"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="grey" text @click="componentDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" raised @click="onAddComponent(newComponent)">
                        Select
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ComponentEditorContainer from '@/components/editor/component-editors/ComponentEditorContainer.vue';
import Components, { ComponentList } from '@/components/editor/component-editors/ComponentDefinitions';
import Paging from '@/components/Paging.vue';

const EntityEditor = {
    name: 'EntityEditor',
    components: {
        ComponentEditorContainer,
        Paging,
    },
    data() {
        return {
            editingName: false,
            componentList: ComponentList,
            componentDialog: false,
            showPrefabSelector: false,
            selectedPrefab: null,
            newEntityName: '',
            newComponent: { componentType: 'position', attributes: {} },
            empties: [
                {
                    name: 'Empty',
                    type: 'empty',
                    icon: 'mdi-cube-outline',
                },
            ],
            threeDShapes: [
                {
                    name: 'Box',
                    type: 'box',
                    icon: 'mdi-cube',
                },
                {
                    name: 'Sphere',
                    type: 'sphere',
                    icon: 'mdi-basketball',
                },
                {
                    name: 'Cone',
                    type: 'cone',
                    icon: 'mdi-traffic-cone',
                },
                {
                    name: 'Cylinder',
                    type: 'cylinder',
                    icon: 'mdi-cup-outline',
                },
            ],
            twoDShapes: [
                {
                    name: 'Circle',
                    type: 'circle',
                    icon: 'mdi-circle',
                },
                {
                    name: 'Square',
                    type: 'plane',
                    icon: 'mdi-square',
                },
                {
                    name: 'Ring',
                    type: 'ring',
                    icon: 'mdi-circle-double',
                },
            ],
            UIElements: [
                {
                    name: 'Modal',
                    type: 'modal',
                    icon: 'mdi-group',
                },
                {
                    name: 'Tooltip',
                    type: 'tooltip',
                    icon: 'mdi-tooltip',
                },
                {
                    name: 'Button',
                    type: 'button',
                    icon: 'mdi-gesture-tap-button',
                },
            ],
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            config: (state) => state.apps.config.config,
        }),
        showAddEntityDialog() {
            return this.app.showAddEntityDialog;
        },
        components() {
            const components = this.$store.getters['apps/config/getEntityComponents'](this.app.selectedEntityId);
            // Create list of components to suppress
            const suppressed = [];
            _.forOwn(components, (item) => {
                if (item && this.getComponentDefinitionByType(item.componentType) && this.getComponentDefinitionByType(item.componentType).isInterface) {
                    suppressed.push(...this.getComponentDefinitionByType(item.componentType).suppress);
                }
            });

            // Suppress components
            const visibleComponents = components.filter((item) => item && suppressed.indexOf(item.componentType) === -1);

            return visibleComponents;
        },
        entity() {
            return this.config[this.app.selectedEntityId];
        },
    },
    watch: {
        'newComponent.componentType': function handler() {
            const componentDefinition = this.getComponentDefinitionByType(this.newComponent.componentType);
            this.newComponent.attributes = {};
            _.forEach(componentDefinition.attributes, (attribute) => {
                this.newComponent.attributes[attribute.name] = attribute.default;
            });
        },
    },
    methods: {
        enableEditEntityName() {
            this.editingName = true;
            this.$nextTick(() => this.$refs.entityName.focus());
        },
        updateShowAddEntityDialog(showAddEntityDialog) {
            this.$store.commit('apps/updateShowAddEntityDialog', showAddEntityDialog);
        },
        async onAddEntity(primitive) {
            this.$store.commit('apps/updateShowAddEntityDialog', false);
            this.newEntityName = '';
            const entity = await this.$store.dispatch('apps/config/addPrimitive', {
                parentEntityId: this.app.selectedEntityId,
                primitive,
            });

            this.$store.commit('apps/selectedEntityId', entity.id);
        },
        onAddComponent(component) {
            this.componentDialog = false;
            this.$store.dispatch('apps/config/addComponent', {
                entityId: this.app.selectedEntityId,
                componentType: component.componentType,
                attributes: component.attributes,
            });
            this.newComponent = { componentType: 'position', attributes: {} };
        },
        onComponentUpdate(component, attributes) {
            this.$store.dispatch('apps/config/updateComponentById', {
                componentId: component.id,
                attributes,
            });
        },
        onNewComponentAttributesUpdate(attributes) {
            _.extend(this.newComponent.attributes, attributes);
        },
        onDeleteComponent(component) {
            this.$store.dispatch('apps/config/deleteComponent', component);
        },
        getComponentDefinitionByType(componentType) {
            return Components[componentType];
        },
        getComponentDisplayName(componentType) {
            return Components[componentType] ? Components[componentType].display : componentType;
        },
        onEntityNameChange(name) {
            this.$store.dispatch('apps/config/updateEntity', {
                id: this.app.selectedEntityId,
                name,
            });
        },
        async copyId(item) {
            navigator.clipboard.writeText(item.id);
        },
        async onAddPrefab() {
            // TODO: this should be smarter
            // maybe figure out all of the state/actions that matter instead of an all or nothing
            // instead of extending the base state/actions we should namespace it
            this.$store.commit('apps/updateShowAddEntityDialog', false);
            this.newEntityName = '';
            const config = JSON.parse(this.selectedPrefab.config);
            this.$store.dispatch('apps/state/extend', { state: JSON.parse(this.selectedPrefab.state) });
            this.$store.dispatch('apps/actions/extend', { actions: JSON.parse(this.selectedPrefab.actions) });
            const entity = await this.$store.dispatch('apps/config/addConfigSegment', { parentId: this.app.selectedEntityId, segment: config });

            this.$store.commit('apps/selectedEntityId', entity.id);
        },
    },
};

export default EntityEditor;
</script>

<style scoped>
.elementContainer {
    position: relative;
    top: -70px;
}
.headline {
    margin-bottom: -20px;
}
.shapeRow {
    margin-top: -30px;
    margin-bottom: -25px;
}
.closeButton {
    margin-bottom: 10px;
}
.component-item {
    min-height: 0px;
    overflow: hidden;
}
</style>
