<template>
    <v-row>
        <v-col>
            <label class="label-color font-weight-600 mb-2 d-block">Title</label>
            <v-text-field
                id="title-overlay-display"
                hide-details
                outlined
                class="input-style font-size-input"
                placeholder="Title..."
                :value="stepData.title"
                @change="updateStepData('title', $event)"
            >
                <template slot="prepend-inner">
                    <v-icon color="#adb5bd">
                        mdi-text-short
                    </v-icon>
                </template>
            </v-text-field>
        </v-col>
    </v-row>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'TitleOverlayOptionsEditor',
    components: {},
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            options: {},
            fields: ['title'],
        };
    },
    computed: {},
    methods: {},
};
</script>

<style scoped></style>
