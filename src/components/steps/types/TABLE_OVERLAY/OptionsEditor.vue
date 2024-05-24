<template>
    <fragment>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Text Label</label>
                <v-text-field
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    placeholder="Label..."
                    :value="stepData.title"
                    @change="updateStepData('title', $event)"
                >
                    <template slot="prepend-inner">
                        <v-icon color="#adb5bd">
                            mdi-text-short
                        </v-icon>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Get Fields Action</label>
                <AceEditor v-model="getFieldsAction" width="100%" height="400px" theme="dracula" lang="javascript" @init="editorInit" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Get Values Action</label>
                <AceEditor v-model="getValuesAction" width="100%" height="400px" theme="dracula" lang="javascript" @init="editorInit" />
            </v-col>
        </v-row>
    </fragment>
</template>
<script>
import _ from 'lodash';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';
import OptionsMixin from '../../mixins/OptionsMixin';
import HotspotIconDropdown from '../../components/HotspotIconDropdown.vue';
import AceEditor from 'vue2-ace-editor';

import 'brace/ext/language_tools'; // language extension prerequsite.
import 'brace/mode/javascript'; // language
import 'brace/mode/json'; // language
import 'brace/theme/dracula';
import 'brace/snippets/text'; // snippette
import 'brace/snippets/javascript';
import 'brace/snippets/json';

export default {
    name: 'FlagOptionsEditor',
    components: {
        HotspotIconDropdown,
        AceEditor,
    },
    mixins: [OptionEditorMixin, OptionsMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            defaultGetFieldsAction: `return [{
                key: 'name',
                display: 'Name'
            }];`,
            defaultGetValuesAction: `return [{
                id: 1,
                name: 'Hello'
            }];`,
            showOptionSettingsDialog: false,
            editingOption: null,
            flagOptions: [
                { value: 'green', icon: 'thumb_up', text: 'Green Flag' },
                { value: 'red', icon: 'thumb_down', text: 'Red Flag' },
            ],
        };
    },
    computed: {
        getFieldsAction: {
            get() {
                return this.step.data.getFieldsAction || this.defaultGetFieldsAction;
            },
            set(newValue) {
                this.updateStepData('getFieldsAction', newValue);
            },
        },
        getValuesAction: {
            get() {
                return this.step.data.getValuesAction || this.defaultGetValuesAction;
            },
            set(newValue) {
                this.updateStepData('getValuesAction', newValue);
            },
        },
    },
    methods: {
        editorInit(editor) {
            editor.setShowPrintMargin(false);
        },
    },
};
</script>

<style scoped></style>
