<template>
    <v-stepper v-model="currentStep">
        <v-stepper-header class="elevation-0">
            <template v-for="(step, index) in steps">
                <v-stepper-step :key="`${index}-name`" :complete="currentStep > index + 1" :step="index + 1">
                    {{ step.name }}
                </v-stepper-step>

                <v-divider v-if="index !== steps.length" :key="index" />
            </template>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content v-for="(step, index) in steps" :key="`${index}-content`" :step="index + 1">
                <v-card>
                    <v-form @submit.prevent="handleNext">
                        <v-card-text class="card-padding pt-0">
                            <slot :name="`Step-${index + 1}`" />
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text class="text-h5 text-capitalize py-1 px-2" @click="handleCancel">
                                Cancel
                            </v-btn>
                            <v-spacer />
                            <v-btn v-if="index > 0" class="font-weight-600 text-h5 text-capitalize py-1 px-2" color="secondary" @click="handleBack">
                                Back
                            </v-btn>
                            <v-btn class="font-weight-600 text-h5 text-capitalize py-1 px-2" color="primary" type="submit">
                                {{ getSubmitText(index) }}
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
// TODO: makle this class better and easier to extend
// should be able to handle some base functionalaty
// reset data
// submit
// sub classes should then be able to override data collection in each step and thats about it
export default {
    components: {},
    props: {
        steps: Array,
    },
    data() {
        return {
            currentStep: 1,
        };
    },
    methods: {
        reset() {
            this.currentStep = 1;
        },
        handleBack() {
            this.currentStep -= 1;
        },
        handleNext() {
            if (this.currentStep >= this.steps.length) {
                this.$emit('submit');
            } else {
                this.currentStep += 1;
            }
        },
        handleCancel() {
            this.$emit('cancel');
        },
        getSubmitText(index) {
            if (index >= this.steps.length - 1) {
                return 'Submit';
            }
            return 'Continue';
        },
    },
};
</script>
