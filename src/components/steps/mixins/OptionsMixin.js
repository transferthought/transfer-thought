/* eslint-disable no-undef */
import * as UUID from 'uuid/v4';
import _ from 'lodash';

export default {
    components: {},
    data() {
        return {};
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
        currentStepIndex() {
            return this.state.currentStepIndex;
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
        correctOption() {
            return this.currentStep.data.correctOption;
        },
        currentOptions() {
            return this.currentStep.data.options;
        },
    },
    methods: {
        addOption(data = {}) {
            const newOption = _.defaults(
                {
                    id: `TT_${UUID().replace(/-/g, '')}`,
                    value: 'New Option',
                },
                data
            );
            const currentOptions = _.clone(this.currentStep.data.options) || [];
            currentOptions.push(newOption);

            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: { options: currentOptions } });
            return newOption;
        },
        async deleteOption(id) {
            const currentOptions = this.currentStep.data.options;
            const options = _.reject(currentOptions, { id });
            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: { options } });
            if (this.isCorrectOption(id)) {
                const newCorrectId = options?.length ? options[0].id : null;
                this.handleCorrectAnswerChanged(newCorrectId);
            }
        },
        updateOptionKey(id, key, value) {
            const { options } = this.currentStep.data;
            const currentOption = _.find(options, { id });
            if (currentOption) {
                _.extend(currentOption, { [key]: value });
                this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: { options: _.cloneDeep(options) } });
            }
        },
        handleOptionValueChanged(id, newValue) {
            this.updateOptionKey(id, 'value', newValue);
        },
        handleCorrectAnswerChanged(id) {
            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: { correctOption: id } });
        },
        isCorrectOption(id) {
            return this.currentStep.data.correctOption === id;
        },
    },
};
