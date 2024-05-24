<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" />
        <ToolbarBtn text="Change 3D Prop" icon="mdi-toolbox" @click="$emit('openAssetSelector', 'models')" />
        <FlipableOptions :step="step" :entity="entity" />
        <ScalableOptions :step="step" :entity="entity" />
        <DistanceOptions :step="step" :entity="entity" />
        <RotatableOptions :step="step" :entity="entity" />
        <AnimationOptions :step="step" :entity="entity" :increment="15" />
        <ToolbarBtn text="Change Audio" icon="mdi-music" @click="$emit('openAssetSelector', 'audio', handleNewAudio)" />

        <v-menu offset-y v-if="selectedModelAnimations && selectedModelAnimations.length">
            <template v-slot:activator="{ on, attrs }">
                <ToolbarBtn text="Action" icon="mdi-animation-play" v-bind="attrs" v-on="on" />
            </template>
            <v-list>
                <v-list-item-group :value="selectedAnimationIndex" color="primary">
                    <v-list-item v-for="(animation, index) in selectedModelAnimations" :key="animation.name" @click="handleNewAnimation(animation.value)">
                        <v-list-item-icon v-if="index === selectedAnimationIndex">
                            <v-icon>mdi-check-circle</v-icon>
                        </v-list-item-icon>
                        <v-list-item-icon v-else>
                            <v-icon>mdi-circle-outline</v-icon>
                        </v-list-item-icon>

                        <v-list-item-title>{{ animation.display }}</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
        <!-- <ToolbarBtn
            text="Outfit"
            icon="mdi-tshirt-crew"
            @click="entity.modelType === 'male' ? $emit('openAssetSelector', 'maleTextures') : $emit('openAssetSelector', 'femaleTextures')"
        /> -->
        <!-- <ToolbarBtn text="Action" icon="mdi-animation-play" @click="$emit('openAssetSelector', 'readyPlayerMeAnimations')" /> -->
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import ScalableOptions from './ScalableOptions.vue';
import FlipableOptions from './FlipableOptions.vue';
import DistanceOptions from './DistanceOptions.vue';
import RotatableOptions from './RotatableOptions.vue';
import AnimationOptions from './AnimationOptions.vue';
import EntityOptionsDialog from './EntityOptionsDialog.vue';
import _ from 'lodash';

export default {
    name: 'SelectedModelOptions',
    components: {
        ToolbarBtn,
        ScalableOptions,
        FlipableOptions,
        RotatableOptions,
        AnimationOptions,
        EntityOptionsDialog,
        DistanceOptions,
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
    computed: {
        selectedAnimationIndex() {
            return _.findIndex(this.selectedModelAnimations, (animation) => {
                return animation.value === this.entity.clip;
            });
        },
        selectedModelAnimations() {
            const element = document.querySelector(`#${this.entity.id} [data-name="Prop Mesh"]`);
            if (element) {
                const model = element.getObject3D('mesh');
                if (model && model.animations) {
                    const animationList = _.map(model.animations, (animation) => {
                        return {
                            display: animation.name,
                            value: animation.name,
                        };
                    });
                    return [{ display: 'None', value: '__NO__ANIMATION__' }, { display: 'All', value: '*' }, ...animationList];
                }
            }
            return [];
        },
    },
    mounted() {},

    methods: {
        handleNewAudio(src) {
            const { entities } = this.step.data;
            if (this.entity && this.entity.soundSrc !== src) {
                _.extend(this.entity, { soundSrc: src });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
        handleNewAnimation(newClip) {
            this.$store.dispatch('steps/updateEntity', {
                entityId: this.entity.id,
                newData: { clip: newClip },
            });
        },
    },
};
</script>

<style scoped></style>
