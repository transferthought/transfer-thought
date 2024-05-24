<template>
    <div>
        <v-autocomplete
            v-model="value"
            :label="inputDefinition.name"
            :items="items"
        />
    </div>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'OptionsInput',
    extends: BaseInput,
    props: {
        currentValue: String,
    },
    data() {
        return {
            items: [],
        };
    },
    mounted() {
        this.setItems();
    },
    methods: {
        handleComponentAttributesChanged() {
            this.setItems();
        },
        setItems() {
            if (this.inputDefinition.getter) {
                this.items = this.inputDefinition.getter.call(this);
            } else if (this.inputDefinition.options) {
                this.items = this.inputDefinition.options;
            } else {
                this.items = [];
            }
        },
    },
};
</script>
