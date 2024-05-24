<template>
    <v-row class="fill-height" justify="center">
        <v-col justify="center" class="fill-height">
            <ImageInput :src="stepData.src" title="Image Overlay" :height="400" @change="handleImageSrcUpdated" />
        </v-col>
    </v-row>
</template>
<script>
import ImageInput from '@/components/ImageInput.vue';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'ImageOverlayOptionsEditor',
    components: {
        ImageInput,
    },
    mixins: [OptionEditorMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        deleteImage() {
            this.updateStepData('src', null);
        },
        async handleImageSrcUpdated(newSrc) {
            this.updateStepData('src', newSrc);
        },
    },
};
</script>

<style scoped></style>
