<template></template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'DefaultOptionsEditor',
    components: {},
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            options: {},
        };
    },
    computed: {},
    methods: {},
};
</script>

<style scoped></style>
