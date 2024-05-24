<template>
    <v-toolbar id="step-toolbar" rounded absolute class="ma-5" height="70">
        <v-card v-for="option in toolbarItems" :key="option.text" justify="center" align="center" style="display:flex" @click="option.clickHandler">
            <v-row no-gutters justify="center" align="center" class="flex-wrap-no-wrap">
                <v-col cols="12">
                    <v-icon color="grey darken-3" style="font-size:30px">
                        {{ option.options && option.options.length ? option.options[option.selectedOptionIndex].icon : option.icon }}
                    </v-icon>
                </v-col>
                <v-col cols="12" color="grey darken-3" class="text-h4 text-capitalize pt-1" @click="option.clickHandler">
                    {{ option.text }}
                </v-col>
            </v-row>
            <v-row v-if="option.options" no-gutters justify="center" align="center">
                <v-col cols="12">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon x-small v-bind="attrs" v-on="on">
                                <v-icon color="grey darken-3" style="font-size:30px">
                                    mdi-chevron-down
                                </v-icon>
                            </v-btn>
                        </template>

                        <v-card>
                            <v-row justify="center" align="center" class="py-4">
                                <v-col v-for="(item, index) in option.options" :key="index" cols="3" justify="center" align="center">
                                    <v-btn icon @click="item.clickHandler(index)">
                                        <v-icon color="grey darken-3" style="font-size:30px">
                                            {{ item.icon }}
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card>
    </v-toolbar>
</template>
<script>
import _ from 'lodash';
import ObjectivesService from '@/services/objectives-service';
import * as UUID from 'uuid/v4';

export default {
    name: 'ObjectivesContainer',
    components: {},
    props: {},
    data() {
        return {
            toolbarItems: [
                { text: 'Set View', icon: 'mdi-camera-control', clickHandler: this.setDefaultView.bind(this) },
                { text: 'Zoom In', icon: 'mdi-magnify-plus-outline', clickHandler: this.zoomIn.bind(this) },
                { text: 'Zoom Out', icon: 'mdi-magnify-minus-outline', clickHandler: this.zoomOut.bind(this) },
                {
                    text: 'Icon',
                    icon: 'mdi-checkbox-blank-circle-outline',
                    selectedOptionIndex: 0,
                    clickHandler: this.addIcon.bind(this),
                    options: [
                        { icon: 'radio_button_unchecked', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'block', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'touch_app', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'directions_walk', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'arrow_upward', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'arrow_forward', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'arrow_downward', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'arrow_back', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'thumb_up', clickHandler: this.selectIcon.bind(this) },
                        { icon: 'thumb_down', clickHandler: this.selectIcon.bind(this) },
                    ],
                },
            ],
        };
    },
    computed: {
        state() {
            return this.$store.state.apps.state.state;
        },
        scenes() {
            try {
                return this.$store.state.apps.state.state.scenes;
            } catch {
                return [];
            }
        },
        selectedSceneIndex() {
            try {
                return this.$store.state.apps.state.state.selectedSceneIndex;
            } catch {
                return null;
            }
        },
        selectedScene() {
            try {
                return this.scenes[this.selectedSceneIndex];
            } catch {
                return null;
            }
        },
    },
    methods: {
        selectIcon(index) {
            const iconItem = _.find(this.toolbarItems, { text: 'Icon' });
            iconItem.selectedOptionIndex = index;
        },
        async setDefaultView() {
            const camera = document.getElementById('camera');
            const rotation = camera.getAttribute('rotation');
            ObjectivesService.updateNodeData(this.selectedScene.id, {
                rotation: {
                    x: rotation.x,
                    y: rotation.y,
                    z: rotation.z,
                },
            });
            this.$store.commit('apps/snackMessage', { message: 'Step view set', color: 'success' });
        },
        addIcon() {
            const iconItem = _.find(this.toolbarItems, { text: 'Icon' });
            const selectedOption = iconItem.options[iconItem.selectedOptionIndex];
            const camera = document.getElementById('camera');
            const position = new THREE.Vector3(0, 0, -2);
            position.applyQuaternion(camera.object3D.quaternion);
            const newOption = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                value: 'New Hotspot',
                icon: selectedOption.icon,
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                },
            };
            const currentHotspots = _.clone(this.selectedScene.data.hotspots);
            currentHotspots.push(newOption);
            ObjectivesService.updateNodeData(this.selectedScene.id, { hotspots: currentHotspots });
        },
        zoomIn() {
            const currentZoom = this.state.zoom;
            const newZoom = currentZoom + 0.25;
            ObjectivesService.updateNodeData(this.selectedScene.id, { zoom: newZoom });
            this.$store.dispatch('apps/state/update', {
                selector: 'zoom',
                value: newZoom,
            });
        },
        zoomOut() {
            const currentZoom = this.state.zoom;
            const newZoom = currentZoom - 0.25;
            ObjectivesService.updateNodeData(this.selectedScene.id, { zoom: newZoom });
            this.$store.dispatch('apps/state/update', {
                selector: 'zoom',
                value: newZoom,
            });
        },
    },
};
</script>

<style scoped>
#step-toolbar {
    width: max-content;
    margin: auto;
}
</style>
