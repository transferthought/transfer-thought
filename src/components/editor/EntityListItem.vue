<template>
    <div :id="'entity'">
        <!-- <v-divider/>
        <v-text-field
            class="pa-3"
            v-model="search"
            solo
            flat
            hide-details
            clearable
            prepend-inner-icon="mdi-magnify"
      ></v-text-field>
        <v-divider/> -->
        <LiquorTree
            id="entity-tree-list"
            ref="tree"
            :options="options"
            :data="entities"
            @node:dragging:finish="updateEntityParent"
            @node:selected="onSelectedChange"
        >
            <span slot-scope="{ node }" class="tree-row row">
                <v-menu :style="{ position: 'absolute', right: 0 }">
                    <template v-slot:activator="{ on }">
                        <v-icon small v-on="on">
                            mdi-box-shadow
                        </v-icon>
                    </template>
                    <v-list>
                        <v-list-item-group>
                            <v-list-item @click="saveAsPrefab(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-floppy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Save</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="cloneEntity(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-circle-multiple</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Duplicate</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="copyId(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Copy Entity Id</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="copyECSON(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Copy ECSON</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="pasteECSON(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-content-paste</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Paste ECSON</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="convertToTemplate(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-floor-plan</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Convert to Template</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deleteEntity(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-delete</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-menu>
                <span class="tree-text float-left">{{ node.text }}</span>
            </span>
        </LiquorTree>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import LiquorTree from 'liquor-tree';
import _ from 'lodash';

const EntityListItem = {
    name: 'EntityListItem',
    components: { draggable, LiquorTree },
    data() {
        return {
            search: null,
            options: {
                propertyNames: {
                    text: 'name',
                },
                multiple: false,
                dnd: true,
            },
        };
    },
    mounted() {
        this.$store.watch((state) => state.apps.selectedEntityId, this.handleSelectedEntityIdChange.bind(this));
    },
    watch: {
        entities() {
            this.$refs.tree.setModel(this.entities);
            this.expandAll();
        },
    },
    computed: {
        entities() {
            return this.$store.getters['apps/config/entityList'];
        },
    },
    methods: {
        expandAll() {
            const nodes = this.$refs.tree.findAll({ expanded: false });
            nodes.expand();
        },
        deleteEntity(entity) {
            this.$store.dispatch('apps/config/deleteEntity', entity);
        },
        async saveAsPrefab(item) {
            const segment = this.$store.getters['apps/config/getNestedConfigByEntityId'](item.id);
            const entity = this.$store.state.apps.config.config[item.id];

            await this.$store.dispatch('apps/createPrefab', {
                name: entity.name,
                config: JSON.stringify(segment),
                state: JSON.stringify(this.$store.state.apps.state.state),
                actions: JSON.stringify(this.$store.state.apps.actions.actions),
            });
        },
        async cloneEntity(item) {
            const entity = await this.$store.dispatch('apps/config/clone', { entityId: item.id });
            this.$store.commit('apps/selectedEntityId', entity.id);
        },
        async copyId(item) {
            navigator.clipboard.writeText(item.id);
        },
        async copyECSON(item) {
            const segment = this.$store.getters['apps/config/getNestedConfigByEntityId'](item.id);
            navigator.clipboard.writeText(JSON.stringify(segment, null, 4));
        },
        async pasteECSON(item) {
            try {
                const clipboardContent = await navigator.clipboard.readText();
                const segment = JSON.parse(clipboardContent);
                const entity = await this.$store.dispatch('apps/config/addConfigSegment', { parentId: item.id, segment });
                this.$store.commit('apps/selectedEntityId', entity.id);
            } catch (err) {
                console.log(err);
            }
        },
        async convertToTemplate(item) {
            const entity = await this.$store.dispatch('apps/config/convertToTemplate', { entityId: item.id });
            this.$store.commit('apps/selectedEntityId', entity.id);
        },
        onSelectedChange(select) {
            this.$store.commit('apps/selectedEntityId', select.id);
        },
        handleSelectedEntityIdChange(newSelectedEntityId) {
            const selection = this.$refs.tree.find({ id: newSelectedEntityId });
            selection.select(true);
        },
        updateEntityParent(targetNode, dropNode, position) {
            const distinationNode = position === 'drag-on' ? dropNode : dropNode.parent;
            if (distinationNode) {
                this.$store.dispatch('apps/config/updateEntityParent', { id: targetNode.id, parent: distinationNode.id });
            }
        },
    },
};

export default EntityListItem;
</script>

<style>
#entity-tree-list .tree-arrow {
    margin-left: 0;
}
#entity-tree-list .tree-text {
    color: white;
}
#entity-tree-list .tree-node.selected > .tree-content {
    background: none;
}
#entity-tree-list .tree-node.selected > .tree-content .tree-text {
    color: var(--v-primary-base);
}
#entity-tree-list .tree-node:not(.selected) > .tree-content:hover {
    background: none;
}
#entity-tree-list .tree-dragnode {
    background: var(--v-background-base);
    border-color: var(--v-background-base);
}
#entity-tree-list .tree-node.has-child.expanded.draggable {
    right: 30px;
}
#entity-tree-list .tree-node.has-child.draggable {
    right: 30px;
}

#entity-tree-list .tree-root {
    padding-left: 30px;
}
#entity-tree-list .tree-text.float-left {
    margin-left: 5px;
}
</style>
