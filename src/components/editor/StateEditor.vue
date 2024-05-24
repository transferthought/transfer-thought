<template>
    <v-row no-gutters class="fill-height state-editor">
        <v-col cols="12" class="fill-height">
            <AceEditor :value="getState()" width="100%" height="100%" theme="dracula" lang="json" @init="editorInit" @input="setState" />
        </v-col>
    </v-row>
</template>

<script>
import _ from 'lodash';
import Client from '@/tt-api';
import AceEditor from 'vue2-ace-editor';

const { Logger } = Client;
const StateEditor = {
    name: 'StateEditor',
    components: {
        AceEditor,
    },
    data() {
        return {
            selectedActionIndex: null,
            options: {
                lineNumbers: true,
                theme: 'monokai',
                mode: {
                    name: 'javascript',
                    json: true,
                },
            },
        };
    },
    mounted() {
        this.setState = _.debounce(this.setState, 3000);
    },
    methods: {
        getState() {
            return JSON.stringify(this.$store.state.apps.state.state, null, 4);
        },
        setState(newState) {
            try {
                this.$store.commit('apps/state/init', JSON.parse(newState));
                this.$store.commit('apps/snackMessage', 'Parsing Succeeded');
            } catch (err) {
                Logger.error(err);
                this.$store.commit('apps/snackMessage', { message: 'Parsing Failed', color: 'error' });
            }
        },
        editorInit(editor) {
            editor.setShowPrintMargin(false);
        },
    },
};

export default StateEditor;
</script>
