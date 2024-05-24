<template>
    <div>
        <v-text-field
            :label="inputDefinition.name"
            :value="stringify(value)"
            outlined
            @change="updateValue"
        />
    </div>
</template>

<script>
import _ from 'lodash';
import Client from '@/tt-api';
import BaseInput from './BaseInput.vue';

const { Logger } = Client;

export default {
    name: 'ObjectInput',
    extends: BaseInput,
    mount() {
        this.updateValue = _.debounce(this.updateValue, 200);
    },
    methods: {
        stringify(value) {
            return JSON.stringify(value);
        },
        updateValue(newValue) {
            try {
                const value = JSON.parse(newValue);
                this.value = value;
            } catch (error) {
                Logger.error(error);
            }
        },
    },
};
</script>
