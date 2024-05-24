<template>
    <v-container>
        <v-row v-for="inputDefinition in inputDefinitions" :key="inputDefinition.name">
            <v-col>
                <component
                    :is="inputDefinition.controller"
                    :input-definition="inputDefinition"
                    :current-value="getStepDataValue(inputDefinition.name)"
                    :on-value-changed="updateStepData"
                />
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

import InputControllers from '@/components/editor/input-controllers';
export default {
    name: 'GoToStepOptionsEditor',
    components: { ...InputControllers },
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            inputDefinitions: [
                {
                    label: 'Select Step',
                    name: 'stepId',
                    controller: 'StepIdInput',
                    default: null,
                },
            ],
        };
    },
    computed: {},
    methods: {},
};
</script>

<style scoped></style>
