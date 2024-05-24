<template>
    <v-col cols="12">
        <v-toolbar color="background" dense flat>
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn depressed elevation="0" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                        {{ selectedItem.display }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item-group>
                        <v-list-item v-for="(item, index) in items" :key="index" @click="setCurrentEditor(index)">
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ item.display }}</v-list-item-title>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-menu>
            <v-spacer />
            <v-btn icon @click="closeBottomPanel">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card height="552px">
            <component :is="selectedItem.editor" />
        </v-card>
    </v-col>
</template>

<script>
import { mapState } from 'vuex';
import ActionEditor from './ActionEditor.vue';
import StateEditor from './StateEditor.vue';

const BottomPanel = {
    name: 'BottomPanel',
    components: {
        ActionEditor,
        StateEditor,
    },
    data() {
        return {
            selectedindex: 0,
            items: [
                {
                    editor: 'ActionEditor',
                    display: 'Actions',
                    icon: 'mdi-book-open',
                },
                {
                    editor: 'StateEditor',
                    display: 'State',
                    icon: 'mdi-webhook',
                },
            ],
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
        selectedItem() {
            return this.items[this.selectedindex];
        },
    },
    methods: {
        setCurrentEditor(newIndex) {
            this.selectedindex = newIndex;
        },
        closeBottomPanel() {
            this.$store.commit('apps/isBottomPanelOpen', false);
        },
    },
};

export default BottomPanel;
</script>
