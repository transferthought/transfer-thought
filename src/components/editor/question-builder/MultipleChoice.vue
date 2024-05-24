<template>
    <span>
        <v-list-item v-for="(option, optionIndex) in questionData.options" :key="option.id">
            <v-list-item-content class="pa-0">
                <label class="label-color font-weight-300 mb-2">Option {{ optionIndex + 1 }}</label>
                <v-text-field
                    outlined
                    class="input-style font-size-input"
                    :value="option.value"
                    :placeholder="'Option ' + (optionIndex + 1)"
                    append-outer-icon="mdi-delete"
                    @input="handleOptionValueChanged(optionIndex, $event)"
                    @click:append-outer="deleteOption(option)"
                />
            </v-list-item-content>
        </v-list-item>
        <v-list-item>
            <v-list-item-content>
                <v-btn text small color="primary" @click="addOption">
                    <v-icon left dark>mdi-plus</v-icon>
                    Add Option
                </v-btn>
            </v-list-item-content>
        </v-list-item>
    </span>
</template>
<script>
/* eslint-disable no-undef */
import * as UUID from 'uuid/v4';

export default {
    name: 'MultipleChoice',
    components: {},
    props: {
        questionIndex: Number,
        questionData: Object,
    },
    data() {},
    computed: {},
    watch: {},
    mounted() {
        this.handleOptionValueChanged = _.debounce(this.handleOptionValueChanged, 500);
    },
    methods: {
        async addOption() {
            const newOption = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                value: 'New Option',
            };
            await this.$store.dispatch('apps/state/insert', {
                selector: `questions[${this.questionIndex}].options`,
                value: newOption,
            });
        },
        async deleteOption(option) {
            const options = _.reject(this.questionData.options, option);
            await this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.questionIndex}].options`,
                value: options,
            });
        },
        handleOptionValueChanged(optionIndex, newValue) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.questionIndex}].options[${optionIndex}].value`,
                value: newValue,
            });
        },
    },
};
</script>

<style scoped></style>
