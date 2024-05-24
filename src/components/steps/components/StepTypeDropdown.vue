<template>
    <v-menu offset-y :disabled="disabled">
        <template v-slot:activator="{ on, attrs }">
            <v-btn large depressed :disabled="disabled" color="primary" class="font-weight-600 text-h5 text-capitalize" v-bind="attrs" v-on="on">
                <v-icon left>
                    {{ currentStepDefinition.icon }}
                </v-icon>
                <v-icon right>
                    mdi-chevron-down
                </v-icon>
            </v-btn>
        </template>
        <v-list class="step-type-list">
            <v-list-item v-for="(item, index) in options" :key="index" @click="handleTypeChange(item.value)">
                <v-list-item-icon class="mr-0">
                    <v-icon style="font-size:20px" v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script>
import _ from 'lodash';
import { getAvailableStepDefinitions, getStepDefinition } from '@/components/steps/types';

export default {
    name: 'StepTypeDropdown',
    components: {},
    props: {
        type: String,
        disabled: Boolean,
    },
    async created() {
        const stepTypeDefinitions = await getAvailableStepDefinitions();
        this.options = stepTypeDefinitions.map((stepDefinition) => {
            return {
                value: stepDefinition.type,
                text: stepDefinition.display,
                icon: stepDefinition.icon,
            };
        });
    },
    data() {
        return { currentStepDefinition: {}, options: [] };
    },
    watch: {
        type: {
            async handler(newType) {
                const stepDefinition = await getStepDefinition(newType);
                if (stepDefinition) {
                    this.currentStepDefinition = stepDefinition;
                } else {
                    this.currentStepDefinition = {};
                }
            },
            immediate: true,
        },
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return [];
            }
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
    },
    methods: {
        handleTypeChange(newType) {
            this.$emit('change', newType);
        },
    },
};
</script>

<style scoped>
.step-type-list {
    height: 500px;
    overflow-y: auto;
}
</style>
