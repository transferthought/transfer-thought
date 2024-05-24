import _ from 'lodash';

import { getStepDefinition } from '../types';

export default {
    props: {
        step: Object,
    },
    data() {
        return {
            stepData: {},
            stepDefinition: {},
        };
    },
    watch: {
        step: {
            async handler(newStep) {
                this.resetStepData();
                const stepDefinition = await getStepDefinition(newStep.type);
                if (stepDefinition) {
                    this.stepDefinition = stepDefinition;
                } else {
                    this.stepDefinition = {};
                }
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {},
    methods: {
        resetStepData() {
            this.stepData = _.cloneDeep(this.step.data);
            if (this.fields) {
                this.stepData = _.pick(this.stepData, this.fields);
            }
        },
        getStepDataValue(key) {
            return this.stepData[key];
        },
        updateStepData(key, value) {
            this.$set(this.stepData, key, value);
        },
        getStepData() {
            return this.stepData;
        },
    },
};
