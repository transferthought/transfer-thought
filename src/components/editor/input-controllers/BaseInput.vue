<template>
    <div>
        <label class="label-color font-weight-600 mb-2 d-block">
            {{ inputDefinition.label || inputDefinition.name }}
        </label>
        <v-text-field v-model="value" outlined class="input-style font-size-input" />
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'BaseInput',
    components: {},
    props: {
        inputDefinition: Object,
        entityId: String,
        componentAttributes: Object,
        currentValue: [Number, String, Boolean, Object, Array],
        onValueChanged: Function,
    },
    data() {
        return {
            value: !_.isUndefined(this.currentValue) && !_.isNull(this.currentValue) ? this.currentValue : this.inputDefinition.default,
        };
    },
    watch: {
        currentValue() {
            console.log('current value', this.currentValue);
            this.value = !_.isUndefined(this.currentValue) && !_.isNull(this.currentValue) ? this.currentValue : this.inputDefinition.default;
        },
        value() {
            this.onValueChanged(this.inputDefinition.name, this.value);
        },
        componentAttributes: {
            handler() {
                this.handleComponentAttributesChanged();
            },
            deep: true,
        },
    },
    methods: {
        handleComponentAttributesChanged() {},
    },
};
</script>
