<template>
    <StepOverlayLayout>
        <template v-slot:Toolbar>
            <StepTypeDropdown v-if="!selectedEntityId" :type="currentStep.type" @change="handleStepChange({ type: $event })" />
            <StepOptionsEditorDialog v-if="!selectedEntityId" :step="currentStep" />
            <ToolbarBtn v-if="!selectedEntityId" text="Add Hotspot" icon="mdi-plus" @click="showHotspotDialog = true" />
            <v-dialog v-model="showHotspotDialog" transition="dialog-top-transition" width="800">
                <v-card>
                    <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                        Add Hotspot
                    </v-toolbar>
                    <v-card-text class="card-padding">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Select Hotspot Icon
                        </label>
                        <HotspotIconDropdown :value="newHotspotData.icon" @change="handleNewHotspotIconChange" />
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text large class="font-weight-400 mb-0 text-capitalize" @click="cancel">
                            Cancel
                        </v-btn>
                        <v-btn depressed color="primary" class="font-weight-600 mb-0 text-capitalize" large @click="addHotspot">
                            Insert
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <SelectedHotspotOptions v-if="selectedEntity" :step="currentStep" :entity="selectedEntity" />
        </template>
    </StepOverlayLayout>
</template>
<script>
/* eslint-disable no-undef */
import StepEditorMixin from '../../mixins/StepEditorMixin';
import OptionsMixin from '../../mixins/OptionsMixin';

import HotspotIconDropdown from '../../components/HotspotIconDropdown.vue';

import SelectedHotspotOptions from './components/SelectedHotspotOptions.vue';

export default {
    name: 'HotspotsEditor',
    components: {
        HotspotIconDropdown,
        SelectedHotspotOptions,
    },
    mixins: [StepEditorMixin, OptionsMixin],
    props: {},
    data() {
        return {
            showHotspotDialog: false,
            newHotspotData: {
                icon: 'radio_button_unchecked',
                correct: true,
                proceed: false,
            },
        };
    },
    mounted() {
        this.handleOptionPositionUpdate = this.handleOptionPositionUpdate.bind(this);
        this.subscribe();
    },
    beforeDestroy() {
        this.unsubscribe();
    },
    computed: {
        selectedEntity() {
            const { options } = this.currentStep.data;
            if (options) {
                return options.find((options) => options.id === this.selectedEntityId);
            }
            return null;
        },
    },
    watch: {
        currentStep: {
            handler() {
                if (this.selectedEntityId) {
                    // wait for next tick so that the hotspot has been rendered
                    this.$nextTick(() => {
                        const newHotspotEl = document.getElementById(this.selectedEntityId);
                        if (newHotspotEl) {
                            this.app.scene.el.object3D.positionGizmo.attach(newHotspotEl.object3D);
                        }
                    });
                } else {
                    this.app.scene.el.object3D.positionGizmo.detach();
                }
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        subscribe() {
            this.app.scene.el.object3D.positionGizmo.addEventListener('mouseUp', this.handleOptionPositionUpdate);
        },
        unsubscribe() {
            this.app.scene.el.object3D.positionGizmo.detach();
            this.app.scene.el.object3D.positionGizmo.removeEventListener('mouseUp', this.handleOptionPositionUpdate);
        },
        handleNewHotspotIconChange(newIcon) {
            this.newHotspotData.icon = newIcon;
        },
        resetHotspotData() {
            this.newHotspotData = {
                icon: 'radio_button_unchecked',
                correct: true,
                proceed: true,
            };
        },
        cancel() {
            this.resetHotspotData();
            this.showHotspotDialog = false;
        },
        addHotspot() {
            const camera = document.getElementById('camera');
            const position = new THREE.Vector3(0, 0, -60);
            position.applyQuaternion(camera.object3D.quaternion);
            const newOption = this.addOption({
                ...this.newHotspotData,
                attachToCamera: false,
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                scale: {
                    x: 35,
                    y: 35,
                    z: 35,
                },
            });
            this.resetHotspotData();
            this.showHotspotDialog = false;

            // wait for next tick so that the hotspot has been rendered
            this.$nextTick(() => {
                const newHotspotEl = document.getElementById(newOption.id);
                if (newHotspotEl) {
                    this.app.scene.el.object3D.positionGizmo.attach(newHotspotEl.object3D);
                }
            });
        },
        handleOptionPositionUpdate(event) {
            const hotspotId = event.target.object.el.id;
            const position = {
                x: event.target.object.position.x,
                y: event.target.object.position.y,
                z: event.target.object.position.z,
            };
            this.updateOptionKey(hotspotId, 'position', position);
        },
        handleDeleteEntity() {
            const id = this.selectedEntityId;
            this.app.scene.el.object3D.positionGizmo.detach();
            this.deleteOption(id);
        },
    },
};
</script>

<style scoped></style>
