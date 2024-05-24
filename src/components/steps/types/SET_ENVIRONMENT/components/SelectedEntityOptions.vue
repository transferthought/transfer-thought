<template>
    <fragment>
        <!-- <ToolbarBtn text="Options" icon="mdi-cog" @click="options" /> -->
        <ToolbarBtn text="Flip" icon="mdi-flip-horizontal" @click="flip" />
        <ToolbarBtn text="Scale Down" icon="mdi-magnify-minus" @click="scaleDown" />
        <ToolbarBtn text="Scale Up" icon="mdi-magnify-plus" @click="scaleUp" />
        <ToolbarBtn text="Delete" icon="mdi-delete" @click="deleteEntity" />
        <slot></slot>
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'SelectedEntityOptions',
    components: {
        ToolbarBtn,
    },
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        options() {
            this.$emit('openOptions');
        },
        flip() {
            this.$emit('flip');
        },
        scaleUp() {
            this.$emit('scaleUp');
        },
        scaleDown() {
            this.$emit('scaleDown');
        },
        deleteEntity() {
            this.$emit('deleteEntity');
        },
    },
};
</script>

<style scoped></style>
