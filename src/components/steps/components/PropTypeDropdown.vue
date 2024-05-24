<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">
            <ToolbarBtn text="Add Prop" icon="mdi-plus" v-on="on" />
        </template>
        <v-list>
            <v-list-item
                v-for="(item, index) in visibleOptions"
                :key="index"
                @click="handleTypeSelected(item.value)"
                v-shortkey="['ctrl', 'shift', 'b']"
                @shortkey="showBetaProps = true"
            >
                <v-list-item-icon class="mr-1">
                    <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>

        <!-- <ToolbarBtn v-if="!selectedEntityId" text="Characters" icon="mdi-account" @click="openAssetSelector('avatars')" /> -->
        <!-- <ToolbarBtn v-if="!selectedEntityId" text="Props" icon="mdi-toolbox" @click="openAssetSelector('prop')" /> -->
        <!-- <ToolbarBtn v-if="!selectedEntityId" text="Images" icon="mdi-image" @click="openAssetSelector('images')" />
            <ToolbarBtn v-if="!selectedEntityId" text="Text" icon="mdi-format-title" @click="handleNewText" />
            <ToolbarBtn v-if="!selectedEntityId" text="Audio" icon="mdi-music" @click="openAssetSelector('audio')" /> -->
    </v-menu>
</template>
<script>
import _ from 'lodash';
import ToolbarBtn from './ToolbarBtn.vue';

export default {
    name: 'PropTypeDropdown',
    components: { ToolbarBtn },
    data() {
        return {
            showBetaProps: false,
            options: [
                { icon: 'mdi-account', text: 'Character', value: 'avatar' },
                { icon: 'mdi-image', text: 'Image', value: 'image' },
                { icon: 'mdi-format-title', text: 'Text', value: 'text' },
                { icon: 'mdi-music', text: 'Audio', value: 'audio' },
                { icon: 'mdi-information', text: 'Information Point', value: 'information' },
            ],
            betaOptions: [
                { icon: 'mdi-account', text: 'Character', value: 'avatar' },
                { icon: 'mdi-toolbox', text: '3D Prop', value: 'model' },
                { icon: 'mdi-image', text: 'Image', value: 'image' },
                { icon: 'mdi-format-title', text: 'Text', value: 'text' },
                { icon: 'mdi-music', text: 'Audio', value: 'audio' },
                { icon: 'mdi-information', text: 'Information Point', value: 'information' },
            ],
        };
    },
    computed: {
        visibleOptions() {
            if (this.showBetaProps) {
                return this.betaOptions;
            }

            return this.options;
        },
    },
    methods: {
        handleTypeSelected(newType) {
            this.$emit('selected', newType);
        },
    },
};
</script>

<style scoped></style>
