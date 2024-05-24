<template>
    <StepOverlayLayout>
        <template v-slot:Toolbar>
            <StepTypeDropdown :type="currentStep.type" :disabled="currentStepIndex === 0" @change="handleStepChange({ type: $event })" />
        </template>
        <template v-slot:Hero>
            <v-row align="center" justify="center" no-gutters class="fill-height" style="width: 100%">
                <v-card class="pointer-events-auto" style="width: 80%">
                    <v-toolbar color="primary" dark flat class="dark-background tt-text font-weight-600 mb-0 text-capitalize">
                        Advanced Interaction
                    </v-toolbar>

                    <v-tabs v-model="tab" background-color="transparent" grow>
                        <v-tab key="request">
                            Description
                        </v-tab>
                        <v-tab key="code">
                            Advanced
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <v-tab-item key="request">
                            <v-card-text class="card-padding">
                                <AdvancedInteractionOptionsEditor ref="StepOptionsEditorContainer" :step="currentStep" @input="hasTextChanged = true" />
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-spacer />
                                <v-btn
                                    depressed
                                    color="primary"
                                    class="text-h4 font-weight-600 mb-0 text-capitalize"
                                    large
                                    :disabled="!hasTextChanged"
                                    @click="submit"
                                >
                                    <v-icon class="mr-2">
                                        mdi-email
                                    </v-icon>
                                    Send
                                </v-btn>
                            </v-card-actions>
                        </v-tab-item>
                        <v-tab-item key="code" v-if="action">
                            <v-card-text class="card-padding">
                                <AceEditor v-model="action.code" width="100%" height="400px" theme="dracula" lang="javascript" @init="editorInit" />
                            </v-card-text>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-row>
        </template>
        <template v-slot:Footer>
            <span />
        </template>
    </StepOverlayLayout>
</template>
<script>
import AdvancedInteractionOptionsEditor from './OptionsEditor.vue';
import StepEditorMixin from '../../mixins/StepEditorMixin';
import AceEditor from 'vue2-ace-editor';

import 'brace/ext/language_tools'; // language extension prerequsite.
import 'brace/mode/javascript'; // language
import 'brace/mode/json'; // language
import 'brace/theme/dracula';
import 'brace/snippets/text'; // snippette
import 'brace/snippets/javascript';
import 'brace/snippets/json';

export default {
    name: 'AdvancedInteractionEditor',
    components: {
        AdvancedInteractionOptionsEditor,
        AceEditor,
    },
    mixins: [StepEditorMixin],
    props: {},
    data() {
        return {
            tab: null,
            hasTextChanged: false,
        };
    },
    computed: {
        action() {
            if (this.currentStep && this.currentStep.data && this.currentStep.data.customActionId) {
                return this.$store.getters['apps/actions/getActionById'](this.currentStep.data.customActionId);
            }
        },
    },
    watch: {
        currentStep: {
            handler() {
                this.hasTextChanged = false;
            },
            deep: true,
            immediate: true,
        },
    },

    methods: {
        submit() {
            this.hasTextChanged = false;
            const newData = this.$refs.StepOptionsEditorContainer.getStepData();
            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData });
        },

        editorInit(editor) {
            editor.setShowPrintMargin(false);
        },
    },
};
</script>

<style scoped></style>
