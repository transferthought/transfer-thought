<template>
    <v-row>
        <v-col>
            <!-- <label class="label-color font-weight-600 mb-2 d-block">Advanced Interaction Description</label> -->

            <v-textarea
                :value="stepData.advancedInteractionText"
                placeholder="Please write out in best detail exactly what you would like to happen on this step"
                outlined
                rows="4"
                class="input-style font-size-input"
                hide-details
                @input="$emit('input')"
                @change="updateStepData('advancedInteractionText', $event)"
            />
        </v-col>
    </v-row>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'AdvancedInteractionOptionsEditor',
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
