<template>
    <div>
        <label class="label-color font-weight-600 mb-2 d-block">
            {{ inputDefinition.label }}
        </label>
        <v-select v-model="value" :items="items" outlined class="input-style font-size-input" placeholder="No step selected...">
            <template v-slot:item="{ item, on, attrs }">
                <v-list-item v-on="on" v-bind="attrs" class="text-truncate">
                    <v-list-item-icon x-small>
                        <v-btn small depressed>
                            <!-- <v-icon left>
                                {{ getStedDefinition(item).icon }}
                            </v-icon> -->
                            {{ item.index + 1 }}
                        </v-btn>
                    </v-list-item-icon>
                    <v-list-item-content class="text-truncate">
                        <v-list-item-title class="text-truncate">
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-select>
    </div>
</template>

<script>
import _ from 'lodash';
import BaseInput from './BaseInput.vue';

export default {
    name: 'StepIdInput',
    extends: BaseInput,
    props: {},
    computed: {
        items() {
            return _.map(this.$store.getters['steps/getCurrentSteps'](), (item, index) => ({ id: item.id, text: item.name, value: item.id, index }));
        },
    },
    methods: {
        getStepIndex(step) {
            debugger;
        },
        getStedDefinition(step) {
            debugger;
        },
    },
};
</script>
