<template>
    <fragment>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Title</label>
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
                <label class="label-color font-weight-600 mb-2 d-block">What should the coach be asking for?</label>
                <v-text-field
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    placeholder="Prompt Placeholder"
                    :value="stepData.promptPlaceholder"
                    @change="updateStepData('promptPlaceholder', $event)"
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
                <label class="label-color font-weight-600 mb-2 d-block">Additional Info for your AI Coach</label>
                <v-textarea filled name="input-7-4" v-model="systemMessage" placeholder="Enter any details that would like your AI Coach to know"></v-textarea>
            </v-col>
        </v-row>
    </fragment>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'AIGeneral',
    components: {},
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {
        return {};
    },
    computed: {
        systemMessage: {
            get() {
                return this.step.data.systemMessage;
            },
            set(newValue) {
                this.updateStepData('systemMessage', newValue);
            },
        },
    },
    methods: {},
};
</script>

<style scoped></style>
