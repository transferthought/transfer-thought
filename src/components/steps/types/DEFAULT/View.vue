<template>
    <v-container />
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'DefaultView',
    components: {},
    mixins: [StepViewerMixin],
    props: {
        step: Object,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {},
};
</script>

<style></style>
