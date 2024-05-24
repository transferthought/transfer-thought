<template>
    <div>
        <v-checkbox
            v-model="value"
            :label="inputDefinition.name"
            data-vv-name="checkbox"
            type="checkbox"
            required
        />
    </div>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'BooleanInput',
    extends: BaseInput,
    props: {
        currentValue: Boolean,
    },
};
</script>
