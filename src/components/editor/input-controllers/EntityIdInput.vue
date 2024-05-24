<template>
    <div>
        <v-select v-model="value" :label="inputDefinition.name" :items="items" />
    </div>
</template>

<script>
import _ from 'lodash';
import BaseInput from './BaseInput.vue';

export default {
    name: 'EntityIdInput',
    extends: BaseInput,
    computed: {
        items() {
            const entities = _.map(this.$store.getters['apps/config/flattenedEntityList'], (item) => ({ text: item.name, value: item.id }));
            return [{ text: '', value: null }].concat(entities);
        },
    },
};
</script>
