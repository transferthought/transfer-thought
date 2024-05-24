<template>
    <fragment>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Prompt</label>
                <v-text-field
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    placeholder="Title..."
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
                <label class="label-color font-weight-600 mb-2 d-block">Options</label>
                <v-radio-group :value="correctOption" column @change="handleCorrectAnswerChanged">
                    <v-row v-for="(option, index) in currentOptions" :key="option.id" align="center">
                        <v-col cols="1">
                            <v-radio x-large :value="option.id" />
                        </v-col>
                        <v-col>
                            <PictureChoiceOptionItem :option="option" editing :index="index" />
                        </v-col>
                        <v-col>
                            <v-btn
                                depressed
                                block
                                text
                                color="primary"
                                class="font-weight-600 text-capitalize py-1"
                                x-large
                                @click="openOptionSettingsDialog(index)"
                            >
                                Settings
                            </v-btn>
                        </v-col>
                        <v-col cols="1">
                            <v-btn icon x-small @click="deleteOption(option.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-radio-group>
                <v-btn depressed block color="primary" class="font-weight-600 text-capitalize py-1" x-large @click="addOption()">
                    Add New Option
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="showOptionSettingsDialog" transition="dialog-top-transition" width="800">
            <v-card>
                <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                    Edit Step Options
                </v-toolbar>
                <v-card-text class="pa-3">
                    <TextToSpeech
                        label="Feedback"
                        :voice="state.coach.voice"
                        :transcript="editingOption && editingOption.transcript"
                        @change="handleAudioChange"
                    />
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text large class="font-weight-400 mb-0 text-capitalize" @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn depressed color="primary" class="font-weight-600 mb-0 text-capitalize" large @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>
<script>
import _ from 'lodash';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';
import OptionsMixin from '../../mixins/OptionsMixin';
import TextToSpeech from '../../components/TextToSpeech.vue';

import PictureChoiceOptionItem from './components/PictureChoiceOptionItem.vue';

export default {
    name: 'PictureChoiceOptionsEditor',
    components: {
        PictureChoiceOptionItem,
        TextToSpeech,
    },
    mixins: [OptionEditorMixin, OptionsMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            showOptionSettingsDialog: false,
            editingOption: null,
        };
    },
    computed: {},
    methods: {
        handleAudioChange(data) {
            this.editingOption = { ...this.editingOption, ...data };
        },
        openOptionSettingsDialog(optionIndex) {
            this.showOptionSettingsDialog = true;
            this.editingOption = this.currentStep.data.options[optionIndex];
        },
        cancel() {
            this.editingOption = null;
            this.showOptionSettingsDialog = false;
        },
        save() {
            this.showOptionSettingsDialog = false;
            if (this.editingOption) {
                const value = this.editingOption['transcript'];
                this.updateOptionKey(this.editingOption.id, 'transcript', value);
            }
            this.editingOption = null;
        },
    },
};
</script>

<style scoped></style>
