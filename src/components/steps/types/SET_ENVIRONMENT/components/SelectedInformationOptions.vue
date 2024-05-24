<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity">
            <template v-slot:Extra>
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Hover Text
                        </label>
                        <v-text-field
                            :value="entity.label"
                            hide-details
                            outlined
                            class="input-style font-size-input"
                            @input="handleTextChange"
                            placeholder="Enter Label Text...."
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Description
                        </label>
                        <RichTextInput :value="entity.description" @change="entity.description = $event" />
                    </v-col>
                </v-row>
            </template>
        </EntityOptionsDialog>
        <!-- <v-row>
            <v-col>
                <v-text-field
                    :value="entity.label"
                    hide-details
                    outlined
                    dense
                    label="Hover Text"
                    class="input-style font-size-input"
                    @input="handleTextChange"
                    placeholder="Enter Label Text...."
                ></v-text-field>
            </v-col>
        </v-row> -->
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import ScalableOptions from './ScalableOptions.vue';
import RotatableOptions from './RotatableOptions.vue';
import AnimationOptions from './AnimationOptions.vue';
import EntityOptionsDialog from './EntityOptionsDialog.vue';
import RichTextInput from '@/components/RichTextInput.vue';

export default {
    name: 'SelectedTextOptions',
    components: {
        ToolbarBtn,
        ScalableOptions,
        RotatableOptions,
        AnimationOptions,
        EntityOptionsDialog,
        RichTextInput,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {
            follow: false,
            showColorPicker: false,
            showFontMenu: false,
            fonts: [
                {
                    title: 'Roboto',
                    value: 'roboto',
                },
                {
                    title: 'Aileronsemibold',
                    value: 'aileronsemibold',
                },
                {
                    title: 'Dejavu',
                    value: 'dejavu',
                },
                {
                    title: 'Exo2bold',
                    value: 'exo2bold',
                },
                {
                    title: 'Exo2semibold',
                    value: 'exo2semibold',
                },
                {
                    title: 'Kelsonsans',
                    value: 'kelsonsans',
                },
                {
                    title: 'Monoid',
                    value: 'monoid',
                },
                {
                    title: 'Mozillavr',
                    value: 'mozillavr',
                },
                {
                    title: 'Sourcecodepro',
                    value: 'sourcecodepro',
                },
            ],
        };
    },

    computed: {},
    mounted() {},
    methods: {
        toggleFollow() {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.follow = !currentEntity.follow;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
        handleTextChange(newText) {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.label = newText;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
        handleFontChange(newFont) {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.font = newFont;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
        handleColorChange(newColor) {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.color = newColor;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
    },
};
</script>

<style scoped></style>
