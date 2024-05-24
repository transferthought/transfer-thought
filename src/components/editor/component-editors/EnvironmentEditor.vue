<template>
    <div>
        <v-select
            v-model="preset"
            :items="items"
            @input="handleAttributeValueChanged('preset', preset)"
        />
    </div>
</template>

<script>
import BaseComponentEditor from './BaseComponentEditor.vue';

export default {
    name: 'EnvironmentEditor',
    extends: BaseComponentEditor,
    data() {
        return {
            preset: this.attributes.preset || 'none',
            items: ['none', 'default', 'contact', 'egypt', 'checkerboard', 'forest',
                'goaland', 'yavapai', 'goldmine', 'threetowers', 'poison', 'arches',
                'tron', 'japan', 'dream', 'volcano', 'starry', 'osiris'],
        };
    },
};
</script>
