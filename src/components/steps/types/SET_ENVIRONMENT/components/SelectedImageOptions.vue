<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" />
        <ToolbarBtn text="Change Image" icon="mdi-image" @click="$emit('openAssetSelector', 'images')" />
        <FlipableOptions :step="step" :entity="entity" />
        <ScalableOptions :step="step" :entity="entity" />
        <RotatableOptions :step="step" :entity="entity" :increment="15" />
        <AnimationOptions :step="step" :entity="entity" />
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import ScalableOptions from './ScalableOptions.vue';
import FlipableOptions from './FlipableOptions.vue';
import RotatableOptions from './RotatableOptions.vue';
import AnimationOptions from './AnimationOptions.vue';
import EntityOptionsDialog from './EntityOptionsDialog.vue';

export default {
    name: 'SelectedImageOptions',
    components: {
        ToolbarBtn,
        EntityOptionsDialog,
        ScalableOptions,
        FlipableOptions,
        RotatableOptions,
        AnimationOptions,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {};
    },

    computed: {},
    mounted() {},
    methods: {},
};
</script>

<style scoped></style>
