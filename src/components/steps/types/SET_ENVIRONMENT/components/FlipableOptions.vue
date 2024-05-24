<template>
    <fragment>
        <ToolbarBtn text="Flip" icon="mdi-flip-horizontal" @click="hanldeFlipEntity" />
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'FlipableOptions',
    components: {
        ToolbarBtn,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        hanldeFlipEntity() {
            if (this.entity && this.entity.scale) {
                const scale = new THREE.Vector3(this.entity.scale.x * -1, this.entity.scale.y, this.entity.scale.z);
                if (this.$listeners.change) {
                    this.$emit('change', { scale });
                } else {
                    this.$store.dispatch('steps/updateEntity', {
                        entityId: this.entity.id,
                        newData: { scale },
                    });
                }
            }
        },
    },
};
</script>

<style scoped></style>
