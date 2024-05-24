<template>
    <v-row>
        <v-col>
            <label class="label-color font-weight-600 mb-2 d-block">HTML</label>

            <v-textarea
                hide-details
                outlined
                rows="3"
                class="input-style font-size-input"
                placeholder="Embed src..."
                :value="stepData.src"
                @change="updateStepData('src', $event)"
            />
            <!-- <label class="label-color my-2 d-block">Add the following code snippet to the iframe for 100% width and height</label>
            <code>style="position: absolute; height: 100%; width: 100%; border: none"</code> -->
        </v-col>
    </v-row>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'EmbedOverlayOptionsEditor',
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
