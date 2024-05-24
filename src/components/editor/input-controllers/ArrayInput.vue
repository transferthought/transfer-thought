<template>
    <div>
        <v-btn
            icon
            @click="addValue"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div
            v-for="(item, index) in value"
            :key="index"
        >
            <v-text-field
                :label="inputDefinition.name"
                :value="item"
                outlined
                dense
                @change="onItemValueChanged(index, $event)"
            />
        </div>
    </div>
</template>

<script>
// import _ from 'lodash';
import BaseInput from './BaseInput.vue';

export default {
    name: 'ArrayInput',
    extends: BaseInput,
    methods: {
        addValue() {
            this.value.push(undefined);
        },
        onItemValueChanged(index, value) {
            this.value.splice(index, 1, value);
        },
    },
};
</script>
