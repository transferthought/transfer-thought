<template>
    <div>
        <v-text-field
            v-model="value"
            :label="inputDefinition.name"
            type="string"
            step="0.1"
            outlined
            dense
        />
    </div>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'NumberInput',
    extends: BaseInput,
};
</script>
