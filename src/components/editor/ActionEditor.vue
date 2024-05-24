<template>
    <v-row no-gutters class="fill-height action-editor">
        <v-col cols="3" class="fill-height">
            <v-toolbar dense flat :style="{ background: 'var(--v-background-lighten1)' }">
                <v-text-field v-model="search" solo dense hide-details class="pr-2" label="Search" />
                <v-btn color="white" outlined @click="addAction">
                    <v-icon left dark>
                        mdi-plus
                    </v-icon>
                    New
                </v-btn>
            </v-toolbar>
            <v-list style="overflow: auto;height:calc(100% - 48px)">
                <v-list-item-group v-model="selectedActionIndex" mandatory>
                    <template v-for="action in filteredActions">
                        <ActionListItem :action="action" :key="action.id" />
                    </template>
                </v-list-item-group>
            </v-list>
        </v-col>
        <v-col v-if="selectedAction" cols="9" class="fill-height" style="overflow: hidden; width:1px">
            <v-toolbar dense flat :style="{ background: 'var(--v-background-lighten1)' }">
                <v-spacer />
                {{ selectedAction.name }}
                <v-spacer />
                <v-btn outlined color="white" @click="runAction">
                    Run
                    <v-icon right dark>
                        mdi-play
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-container style="overflow-y: auto;height:calc(100% - 48px)">
                <v-row>
                    <v-col cols="12">
                        <v-select v-model="selectedActionType" :items="actionTypes" label="Type" outlined />
                    </v-col>
                </v-row>
                <v-row v-if="selectedAction.type === 'custom'">
                    <v-col cols="12">
                        <v-switch v-model="selectedAction.watch" color="primary" label="Run action on input change" />
                    </v-col>
                </v-row>
                <v-divider />
                <v-row style="position: relative">
                    <v-col ref="editorcontainer" cols="12" style="height: 400px; overflow: auto">
                        <AceEditor
                            v-if="selectedAction.type === 'custom'"
                            v-model="selectedAction.code"
                            width="100%"
                            height="100%"
                            theme="dracula"
                            :options="options"
                            lang="javascript"
                            @init="editorInit"
                        />
                        <TimelineEditor v-else-if="selectedAction.type === 'timeline'" :selected-timeline="selectedAction" />
                    </v-col>
                    <v-btn style="position: absolute;bottom: 15px;right: 15px;z-index: 10" icon @click="fullscreen">
                        <v-icon>mdi-fullscreen</v-icon>
                    </v-btn>
                </v-row>
                <v-divider />
                <v-row>
                    <v-col cols="12">
                        <AceEditor
                            :value="getArgumentDefinitions()"
                            width="100%"
                            height="100px"
                            theme="dracula"
                            lang="json"
                            @init="editorInit"
                            @input="setArgumentDefinitions"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-col>
    </v-row>
</template>

<script>
/* eslint-disable no-unused-expressions */

import _ from 'lodash';
import Client from '@/tt-api';
import AceEditor from 'vue2-ace-editor';
import ActionService from '@/services/action-service';
import ActionListItem from './ActionListItem.vue';
import TimelineEditor from './TimelineEditor.vue';

const { Logger } = Client;

const ActionEditor = {
    name: 'ActionEditor',
    components: {
        AceEditor,
        ActionListItem,
        TimelineEditor,
    },
    mounted() {
        this.setArgumentDefinitions = _.debounce(this.setArgumentDefinitions, 3000);
    },
    data() {
        return {
            search: '',
            actionTypes: [
                { value: 'custom', text: 'Custom' },
                { value: 'timeline', text: 'Timeline' },
            ],
            selectedActionIndex: null,
            selectedActionType: null,
            previousSelectedActionIndex: null,
            argumentDefinitionsString: '',
            options: {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true,
            },
        };
    },
    computed: {
        actions() {
            const actions = this.$store.getters['apps/actions/userActions'];
            if (actions && actions.length) {
                this.selectedActionIndex = 0;
            }
            return actions;
        },
        filteredActions() {
            return this.actions.filter((action) => action.name.toLowerCase().includes(this.search.toLowerCase()));
        },
        selectedAction() {
            return this.filteredActions[this.selectedActionIndex];
        },
    },
    methods: {
        addAction() {
            this.$store.dispatch('apps/actions/newAction');
        },
        runAction() {
            ActionService.runAction(this.selectedAction.id);
        },
        fullscreen() {
            this.$refs.editorcontainer.requestFullscreen();
        },
        getArgumentDefinitions() {
            if (this.selectedAction && this.selectedAction.argumentDefinitions) {
                return JSON.stringify(this.selectedAction.argumentDefinitions, null, 4);
            }
            return '';
        },
        setArgumentDefinitions(newDefinitions) {
            try {
                this.selectedAction.argumentDefinitions = JSON.parse(newDefinitions);
            } catch (err) {
                Logger.error(err);
            }
        },

        editorInit(editor) {
            editor.setOptions(this.options);
            editor.setShowPrintMargin(false);

            // const { snippetManager } = ace.require('ace/snippets');
            // snippetManager.insertSnippet(editor, jsSnippet);
        },
    },
    watch: {
        selectedAction: {
            imediate: true,
            handler() {
                this.selectedActionType = this.selectedAction.type;
            },
        },
        selectedActionType: {
            handler() {
                if (this.selectedActionType !== this.selectedAction.type) {
                    this.$store.dispatch('apps/actions/updateActionType', {
                        action: this.selectedAction,
                        type: this.selectedActionType,
                    });
                }
            },
        },
    },
};

export default ActionEditor;
</script>
