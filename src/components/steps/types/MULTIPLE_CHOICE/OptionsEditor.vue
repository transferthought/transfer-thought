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
            <v-col justify="center" class="fill-height">
                <ImageInput :src="stepData.src" title="Image" :height="100" @change="handleFileUpload" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Options</label>
                <v-radio-group :value="correctOption" column mandatory @change="handleCorrectAnswerChanged">
                    <v-row v-for="(option, index) in currentOptions" :key="option.id" align="center">
                        <v-col cols="1">
                            <v-radio x-large :value="option.id" />
                        </v-col>
                        <v-col>
                            <v-text-field
                                outlined
                                class="input-style font-size-input"
                                :value="option.value"
                                @change="handleOptionValueChanged(option.id, $event)"
                            />
                        </v-col>
                        <v-col>
                            <v-btn
                                depressed
                                block
                                text
                                color="primary"
                                class="dark-background tt-text font-weight-600 text-capitalize py-1"
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
                <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize dark-background tt-text">
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
                    <v-btn depressed color="primary" class="font-weight-600 mb-0 text-capitalize dark-background tt-text" large @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>
<script>
import _ from 'lodash';

import ImageInput from '@/components/ImageInput.vue';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';
import OptionsMixin from '../../mixins/OptionsMixin';
import TextToSpeech from '../../components/TextToSpeech.vue';

export default {
    name: 'PictureChoiceOptionsEditor',
    components: {
        TextToSpeech,
        ImageInput,
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
        async handleFileUpload(imageUrl) {
            this.updateStepData('src', imageUrl);
        },
        deleteImage() {
            this.updateStepData('src', null);
        },
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
            const optionUpdateKeys = ['transcript'];
            _.forEach(optionUpdateKeys, (key) => {
                if (this.editingOption) {
                    const value = this.editingOption[key];
                    this.updateOptionKey(this.editingOption.id, key, value);
                }
            });
            this.editingOption = null;
        },
    },
};
</script>

<style scoped></style>
