<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" @save="handleOptionUpdate" />
        <FlipableOptions :step="step" :entity="entity" @change="handleOptionScaleUpdate" />
        <ScalableOptions :step="step" :entity="entity" @change="handleOptionScaleUpdate" />
        <ToolbarBtn text="Delete" icon="mdi-delete" @click="handleOptionDelete" />
    </fragment>
</template>
<script>
import OptionsMixin from '../../../mixins/OptionsMixin';

import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import ScalableOptions from '../../SET_ENVIRONMENT/components/ScalableOptions.vue';
import FlipableOptions from '../../SET_ENVIRONMENT/components/FlipableOptions.vue';
import EntityOptionsDialog from '../../SET_ENVIRONMENT/components/EntityOptionsDialog.vue';

export default {
    name: 'SelectedHotspotOptions',
    components: {
        ToolbarBtn,
        ScalableOptions,
        FlipableOptions,
        EntityOptionsDialog,
    },
    mixins: [OptionsMixin],
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
        app() {
            return this.$store.state.apps;
        },
    },
    mounted() {},

    methods: {
        handleOptionDelete() {
            this.app.scene.el.object3D.positionGizmo.detach();
            this.deleteOption(this.entity.id);
        },
        handleOptionUpdate(newData) {
            console.log('NEW DATA', newData);
            const { options } = this.step.data;
            if (this.entity) {
                _.extend(this.entity, newData);
                this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: { options: _.cloneDeep(options) } });
            }
        },
        handleOptionScaleUpdate({ scale }) {
            this.updateOptionKey(this.entity.id, 'scale', scale);
        },
    },
};
</script>

<style scoped></style>
