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
            :data="templates"
            @node:dragging:finish="updateEntityParent"
            @node:selected="onSelectedChange"
        >
            <span slot-scope="{ node }" class="tree-row row">
                <v-menu :style="{ position: 'absolute', right: 0 }">
                    <template v-slot:activator="{ on }">
                        <v-icon small v-on="on">
                            mdi-dots-vertical
                        </v-icon>
                    </template>
                    <v-list>
                        <v-list-item-group>
                            <v-list-item @click="saveAsPrefab(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-floppy</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>save</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="cloneEntity(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-circle-multiple</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>duplicate</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deleteEntity(node)">
                                <v-list-item-icon>
                                    <v-icon>mdi-delete</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>delete</v-list-item-title>
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

const AssetsEditor = {
    name: 'AssetsEditor',
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
        templates() {
            this.$refs.tree.setModel(this.templates);
            this.expandAll();
        },
    },
    computed: {
        templates() {
            return this.$store.getters['apps/config/templateList'];
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
        saveAsPrefab(item) {
            this.$store.dispatch('apps/config/saveAsPrefab', { entityId: item.id });
        },
        async cloneEntity(item) {
            const entity = await this.$store.dispatch('apps/config/clone', { entityId: item.id });
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

export default AssetsEditor;
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
</style>
