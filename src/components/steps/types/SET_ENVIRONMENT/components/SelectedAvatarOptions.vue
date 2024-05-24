<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" />
        <ToolbarBtn text="Change Charactar" icon="mdi-account" @click="$emit('openAssetSelector', 'avatars')" />
        <FlipableOptions :step="step" :entity="entity" />
        <ScalableOptions :step="step" :entity="entity" />
        <RotatableOptions :step="step" :entity="entity" />
        <AnimationOptions :step="step" :entity="entity" :increment="15" />
        <ToolbarBtn text="Change Audio" icon="mdi-music" @click="$emit('openAssetSelector', 'audio', handleNewAudio)" />
        <!-- <ToolbarBtn
            text="Outfit"
            icon="mdi-tshirt-crew"
            @click="entity.modelType === 'male' ? $emit('openAssetSelector', 'maleTextures') : $emit('openAssetSelector', 'femaleTextures')"
        /> -->
        <ToolbarBtn text="Action" icon="mdi-animation-play" @click="$emit('openAssetSelector', 'readyPlayerMeAnimations')" />
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
    name: 'SelectedAvatarOptions',
    components: {
        ToolbarBtn,
        ScalableOptions,
        FlipableOptions,
        RotatableOptions,
        AnimationOptions,
        EntityOptionsDialog,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {
            playing: false,
        };
    },
    computed: {},
    mounted() {},

    methods: {
        handleNewAudio(src) {
            console.log('src', src);
            const { entities } = this.step.data;
            if (this.entity && this.entity.soundSrc !== src) {
                _.extend(this.entity, { soundSrc: src });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
    },
};
</script>

<style scoped></style>
