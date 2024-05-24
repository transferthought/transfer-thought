<template>
    <div>
        <v-select v-model="value" :label="inputDefinition.name" :items="items" />
    </div>
</template>

<script>
import _ from 'lodash';
import BaseInput from './BaseInput.vue';

export default {
    name: 'ComponentIdInput',
    extends: BaseInput,
    props: {
        entityId: String,
    },
    computed: {
        items() {
            return _.map(this.$store.getters['apps/config/getEntityComponents'](this.entityId), (item) => ({ text: item.componentType, value: item.id }));
        },
    },
};
</script>
