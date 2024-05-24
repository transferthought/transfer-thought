<template>
    <div>
        <v-select
            v-model="value"
            :label="inputDefinition.name"
            :items="items"
            dense
        />
    </div>
</template>

<script>
import _ from 'lodash';
import Components from '@/components/editor/component-editors/ComponentDefinitions';
import BaseInput from './BaseInput.vue';

export default {
    name: 'ComponentAttributeInput',
    extends: BaseInput,
    props: {
        componentType: String,
        allowAll: Boolean,
    },
    computed: {
        items() {
            const ComponentDefinition = Components[this.componentType];
            const items = _.map(ComponentDefinition.attributes, (item) => ({ text: item.name, value: item.name }));
            if (this.allowAll) {
                items.unshift({ text: 'all', value: 'all' });
            }
            return items;
        },
    },
};
</script>
