<template>
    <v-container id="text-input" align="center" justify="center" class="fill-height pa-5">
        <v-card class="pointer-events-auto d-flex flex-column" width="100%">
            <v-toolbar color="primary" class="dark-background tt-text header">
                <v-toolbar-title dark class="tt-text wrap toolbar-title white--text font-weight-600 text-h4 text-capitalize">
                    {{ step.data.title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="light-background pa-5">
                <v-text-field :label="step.data.title" v-model="value" />
            </v-card-text>
            <v-card-actions class="light-background footer">
                <v-spacer />
                <v-btn
                    class="tt-text dark-background text-capitalize font-weight-bold"
                    :disabled="!inputValue"
                    depressed
                    x-large
                    color="primary"
                    @click="handleSubmit"
                >
                    Submit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'TextInputViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            inputValue: null,
        };
    },
    mounted() {
        debugger;
    },
    watch: {
        'appContext.inVRMode': {
            handler() {
                if (this.appContext.inVRMode) {
                    this.initializeVRKeyboard();
                } else {
                    this.destroyVRKeyboard();
                }
            },
        },
    },
    computed: {
        responses() {
            return this.$store.state.apps.state.state.responses;
        },
        value: {
            get() {
                if (
                    this.responses &&
                    this.responses[this.step.id] &&
                    this.responses[this.step.id].values &&
                    this.responses[this.step.id].values[this.step.data.title]
                ) {
                    return this.responses[this.step.id].values[this.step.data.title];
                }
                return '';
            },
            set(value) {
                this.$store.dispatch('steps/updateResponseValue', {
                    stepId: this.step.id,
                    valueId: this.step.data.title,
                    value,
                });
                this.inputValue = value;
            },
        },
    },
    methods: {
        async BeforeRunStep() {
            this.initializeVRKeyboard();
            await StepViewerMixin.methods.BeforeRunStep.call(this);
        },
        async BeforeExitStep() {
            this.destroyVRKeyboard();
            await StepViewerMixin.methods.BeforeExitStep.call(this);
        },
        initializeVRKeyboard() {
            if (this.appContext.inVRMode) {
                this.vrKeyboard = document.getElementById('TT_31eedb494b124c089198da37a689f52e');
                if (this.vrKeyboard) {
                    this.vrKeyboard = document.getElementById('TT_31eedb494b124c089198da37a689f52e');
                    this.vrKeyboard.setAttribute('super-keyboard', {
                        label: this.step.data.title,
                        value: this.value,
                        show: true,
                    });

                    this.vrKeyboard.addEventListener('superkeyboardchange', this.updateValue);
                    this.vrKeyboard.addEventListener('superkeyboarddismiss', this.showKeyBoard);
                    this.vrKeyboard.addEventListener('superkeyboardinput', this.handleSubmit);
                }
            }
        },
        destroyVRKeyboard() {
            if (this.vrKeyboard) {
                this.vrKeyboard.removeEventListener('superkeyboardchange', this.updateValue);
                this.vrKeyboard.removeEventListener('superkeyboarddismiss', this.showKeyBoard);
                this.vrKeyboard.removeEventListener('superkeyboardinput', this.handleSubmit);
                this.vrKeyboard.setAttribute('super-keyboard', {
                    show: false,
                });
            }
        },
        updateValue(event) {
            console.log(event);
            this.value = event.detail.value;
        },
        showKeyBoard() {
            this.vrKeyboard.setAttribute('super-keyboard', {
                show: true,
            });
        },
        handleSubmit() {
            this.$emit('complete');
        },
    },
};
</script>

<style></style>
