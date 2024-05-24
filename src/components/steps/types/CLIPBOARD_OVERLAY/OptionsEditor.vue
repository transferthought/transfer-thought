<template>
    <ClipboardOptions ref="ClipboardOptions" @change="updateStepData('updates', { clipboard: $event })" />
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

import ClipboardOptions from '../SET_ENVIRONMENT/components/ClipboardOptions.vue';

export default {
    name: 'ClipboardOverlayOptionsEditor',
    components: { ClipboardOptions },
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {},
    computed: {},
    methods: {},
};
</script>

<style scoped></style>
