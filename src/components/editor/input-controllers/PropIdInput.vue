<template>
    <div>
        <label class="label-color font-weight-600 mb-2 d-block">
            {{ inputDefinition.label }}
        </label>
        <v-select v-model="value" :items="items" outlined class="input-style font-size-input" placeholder="No prop selected..." />
    </div>
</template>

<script>
import _ from 'lodash';
import BaseInput from './BaseInput.vue';

export default {
    name: 'PropIdInput',
    extends: BaseInput,
    props: {},

    computed: {
        currentEnvironment() {
            return this.$store.getters['steps/getCurrentEnvironment']();
        },
        items() {
            const entities = _.values(this.currentEnvironment.data.entities);
            // TODO: add filter here based on if certain things exist or not (like if they have audio)
            return _.map(entities, (item) => ({ text: item.title, value: item.id }));
        },
    },
};
</script>
