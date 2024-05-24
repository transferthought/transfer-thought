<template>
    <v-list-item :key="action.id" @mouseover="hover = true" @mouseleave="hover = false">
        <template v-slot:default="{ active }">
            <v-list-item-icon>
                <v-icon v-if="action.type === 'custom'">
                    mdi-nodejs
                </v-icon>
                <v-icon v-else-if="action.type === 'timeline'">
                    mdi-chart-timeline
                </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-show="!editing" @click="active && enableEditActionName()">
                    {{ action.name }}
                </v-list-item-title>
                <v-text-field v-show="editing" ref="name" v-model="action.name" solo dense hide-details single-line @blur="handleNameChange" />
            </v-list-item-content>

            <v-list-item-icon v-show="hover && !editing">
                <v-btn icon small @click="enableEditActionName()">
                    <v-icon color="grey ligten-4">
                        mdi-pencil
                    </v-icon>
                </v-btn>
            </v-list-item-icon>

            <v-list-item-icon v-show="hover || editing">
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn icon small v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="copyId(action)">
                            <v-list-item-title>Copy Id</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="duplicateAction(action)">
                            <v-list-item-title>Duplicate</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteAction(action)">
                            <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-list-item-icon>
        </template>
    </v-list-item>
</template>

<script>
const ActionListItem = {
    name: 'ActionListItem',
    components: {},
    mounted() {},
    props: {
        action: Object,
    },
    data() {
        return {
            hover: false,
            editing: false,
        };
    },
    computed: {},
    methods: {
        enableEditActionName() {
            this.editing = true;
            this.$nextTick(() => this.$refs.name.focus());
        },
        handleNameChange() {
            this.editing = false;
        },
        copyId(action) {
            navigator.clipboard.writeText(action.id);
        },
        duplicateAction() {
            // TODO: implement
        },
        deleteAction(action) {
            this.$store.dispatch('apps/actions/deleteAction', action);
        },
    },
};

export default ActionListItem;
</script>
