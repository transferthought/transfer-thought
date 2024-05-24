<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" />
        <v-row>
            <v-col>
                <v-text-field
                    :value="entity.text"
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    @input="handleTextChange"
                    placeholder="Enter Text...."
                ></v-text-field>
            </v-col>
        </v-row>
        <!-- <v-menu offset-y v-model="showFontMenu" :close-on-content-click="true">
            <template v-slot:activator="{ attrs }">
                <ToolbarBtn text="Font" icon="mdi-format-text-variant" v-bind="attrs" @click="showFontMenu = true" />
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in fonts" :key="index" @click="handleFontChange(item.value)">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu> -->
        <ScalableOptions :step="step" :entity="entity" />
        <RotatableOptions :step="step" :entity="entity" :increment="15" />
        <AnimationOptions :step="step" :entity="entity" />
        <v-menu nudge-left="120" offset-y v-model="showColorPicker" :close-on-content-click="false" :close-on-click="true" bottom origin="center center">
            <template v-slot:activator="{ attrs }">
                <ToolbarBtn text="Color" icon="mdi-palette" v-bind="attrs" @click="showColorPicker = true" />
            </template>
            <v-color-picker
                hide-inputs
                :value="entity.color"
                mode="hexa"
                @input="handleColorChange"
                bottom
                origin="center center"
                transition="scale-transition"
            ></v-color-picker>
        </v-menu>
        <ToolbarBtn v-if="entity.follow" text="Lock to camera" icon="mdi-camera-lock" @click="toggleFollow" />
        <ToolbarBtn v-else text="World Space" icon="mdi-earth" @click="toggleFollow" />
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import ScalableOptions from './ScalableOptions.vue';
import RotatableOptions from './RotatableOptions.vue';
import AnimationOptions from './AnimationOptions.vue';
import EntityOptionsDialog from './EntityOptionsDialog.vue';

export default {
    name: 'SelectedTextOptions',
    components: {
        ToolbarBtn,
        ScalableOptions,
        RotatableOptions,
        AnimationOptions,
        EntityOptionsDialog,
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
            currentEntity.text = newText;
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
