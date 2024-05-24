<template>
    <StepOverlayLayout>
        <template v-slot:Toolbar>
            <StepTypeDropdown
                v-if="!selectedEntityId"
                :type="currentStep.type"
                :disabled="currentStepIndex === 0"
                @change="handleStepChange({ type: $event })"
            />
            <StepOptionsEditorDialog v-if="!selectedEntityId" :step="currentStep" />

            <ToolbarBtn
                id="update-environment-button"
                v-if="!selectedEntityId"
                text="Environment"
                icon="mdi-image-filter-hdr"
                @click="openAssetSelector('360')"
            />
            <ToolbarBtn id="set-view-button" v-if="!selectedEntityId" text="Set View" icon="mdi-video" @click="setDefaultView" />
            <ToolbarBtn id="add-clipboard-button" v-if="!selectedEntityId" text="Clipboard" icon="mdi-clipboard-outline" @click="openClipboardOptions" />
            <PropTypeDropdown id="select-prop-button" v-if="!selectedEntityId" @selected="handlePropSelected" />

            <!-- <ToolbarBtn v-if="!selectedEntityId" text="Characters" icon="mdi-account" @click="openAssetSelector('avatars')" /> -->
            <!-- <ToolbarBtn v-if="!selectedEntityId" text="Props" icon="mdi-toolbox" @click="openAssetSelector('prop')" /> -->
            <!-- <ToolbarBtn v-if="!selectedEntityId" text="Images" icon="mdi-image" @click="openAssetSelector('images')" />
            <ToolbarBtn v-if="!selectedEntityId" text="Text" icon="mdi-format-title" @click="handleNewText" />
            <ToolbarBtn v-if="!selectedEntityId" text="Audio" icon="mdi-music" @click="openAssetSelector('audio')" /> -->

            <SelectedAvatarOptions
                v-if="selectedEntity && selectedEntity.type === 'avatar'"
                :step="currentStep"
                :entity="selectedEntity"
                @openAssetSelector="openAssetSelector"
            />
            <SelectedModelOptions
                v-if="selectedEntity && selectedEntity.type === 'model'"
                :step="currentStep"
                :entity="selectedEntity"
                @openAssetSelector="openAssetSelector"
            />

            <SelectedImageOptions
                v-if="selectedEntity && selectedEntity.type === 'image'"
                :step="currentStep"
                :entity="selectedEntity"
                @openAssetSelector="openAssetSelector"
            />
            <SelectedAudioOptions
                v-if="selectedEntity && selectedEntity.type === 'audio'"
                :step="currentStep"
                :entity="selectedEntity"
                @openAssetSelector="openAssetSelector"
            />

            <SelectedTextOptions
                v-if="selectedEntity && selectedEntity.type === 'text'"
                :step="currentStep"
                :entity="selectedEntity"
                @openAssetSelector="openAssetSelector"
            />

            <SelectedInformationOptions v-if="selectedEntity && selectedEntity.type === 'information'" :step="currentStep" :entity="selectedEntity" />

            <ToolbarBtn v-if="selectedEntityId" text="Delete" icon="mdi-delete" @click="handleDeleteEntity" />

            <v-dialog v-model="showClipboardOptions" hide-overlay persistent width="800">
                <v-card>
                    <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                        Clipboard Options
                    </v-toolbar>
                    <v-card-text class="pt-4">
                        <ClipboardOptions ref="ClipboardOptions" />
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text class="text-capitalize py-1 px-2" @click="handleCancelClipboard">
                            Cancel
                        </v-btn>
                        <v-btn depressed color="primary" class="font-weight-600 text-capitalize py-1 px-2" @click="handleSaveClipboard">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="isAssetSelectorOpen" hide-overlay transition="dialog-bottom-transition">
                <AssetViewer
                    :key="assetSelectionType"
                    :title-display="assetView && assetView.title"
                    :select-display="assetView && assetView.select"
                    :views-to-show="assetView && assetView.views"
                    :options="assetView && assetView.viewOptions"
                    @close="closeAssetSelector"
                    @selected="handleAssetSelection"
                />
            </v-dialog>
        </template>
        <template v-slot:Hero>
            <v-row v-if="!hasEnvironmentSrc" align="center" justify="center" no-gutters class="fill-height pointer-events-auto" style="width: 100%">
                <v-btn class="font-weight-600 text-h5 text-capitalize py-1 px-8 mr-2" depressed x-large @click="openAssetSelector('360')">
                    Set Environment
                </v-btn>
            </v-row>
        </template>
    </StepOverlayLayout>
</template>
<script>
/* eslint-disable no-undef */
import * as UUID from 'uuid/v4';
import _ from 'lodash';

import { getModelType, getDefaultTexture } from '@/stores/steps/utils';

import AssetViewer from '@/features/assets/AssetViewer.vue';
import StepEditorMixin from '../../mixins/StepEditorMixin';
import SelectedAudioOptions from './components/SelectedAudioOptions.vue';
import SelectedTextOptions from './components/SelectedTextOptions.vue';
import SelectedInformationOptions from './components/SelectedInformationOptions.vue';
import SelectedImageOptions from './components/SelectedImageOptions.vue';
import SelectedAvatarOptions from './components/SelectedAvatarOptions.vue';
import SelectedModelOptions from './components/SelectedModelOptions.vue';

import ClipboardOptions from './components/ClipboardOptions.vue';
import PropTypeDropdown from '@/components/steps/components/PropTypeDropdown.vue';

export default {
    name: 'AdvancedInteractionEditor',
    mixins: [StepEditorMixin],
    components: {
        AssetViewer,
        SelectedAudioOptions,
        SelectedTextOptions,
        SelectedInformationOptions,
        SelectedImageOptions,
        SelectedAvatarOptions,
        SelectedModelOptions,
        ClipboardOptions,
        PropTypeDropdown,
    },
    data() {
        return {
            showCopyEntityId: false,
            assetSelectionType: null,
            isAssetSelectorOpen: false,
            showClipboardOptions: false,
            AssetViews: {
                '360': {
                    title: 'Update 360 Image',
                    select: 'Select Image',
                    views: ['TRANSFER_THOUGHT_ASSETS', 'EXPLORE_EQ', 'DALL_EQ', 'BLOCKADE_EQ', 'MY_ASSET_VIEW'],
                    viewOptions: {
                        subFolder: 'environments',
                    },
                    handler: this.handleSelected360Image,
                },
                images: {
                    title: 'Add Image',
                    select: 'Select Image',
                    views: ['TRANSFER_THOUGHT_ASSETS', 'EXPLORE', 'MY_ASSET_VIEW'],
                    viewOptions: {
                        subFolder: 'images',
                    },
                    handler: this.handleNewImage,
                },
                avatars: {
                    title: 'Add Character',
                    select: 'Select Character',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        subFolder: 'avatars/Ready_Player_Me/models',
                    },
                    handler: this.handleNewAvatar,
                },
                maleTextures: {
                    title: 'Update Outfit',
                    select: 'Select Outfit',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        subFolder: 'avatars/males/textures',
                    },
                    handler: this.handleTextureUpdate,
                },
                femaleTextures: {
                    title: 'Update Outfit',
                    select: 'Select Outfit',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        subFolder: 'avatars/females/textures',
                    },
                    handler: this.handleTextureUpdate,
                },
                readyPlayerMeAnimations: {
                    title: 'Update Action',
                    select: 'Select Animation',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        thumbnailFileType: '.gif',
                        subFolder: 'avatars/Ready_Player_Me/animations',
                    },
                    handler: this.handleUpdateAnimation,
                },
                prop: {
                    title: 'Add Prop',
                    select: 'Select Prop',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        subFolder: 'PROPS',
                    },
                    handler: this.handleNewProp,
                },
                models: {
                    title: 'Add 3D Prop',
                    select: 'Select 3D Prop',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        subFolder: '3D_PROPS',
                    },
                    handler: this.handleNew3DProp,
                },
                audio: {
                    title: 'Add Audio',
                    select: 'Select Audio',
                    views: ['TRANSFER_THOUGHT_ASSETS', 'TRANSCRIPT_VIEW', 'MY_ASSET_VIEW'],
                    viewOptions: {
                        subFolder: 'audio',
                    },
                    handler: this.handleNewAudio,
                },
            },
        };
    },
    computed: {
        hasEnvironmentSrc() {
            return this.currentStep && this.currentStep.data && this.currentStep.data.src;
        },
        assetView() {
            return this.AssetViews[this.assetSelectionType];
        },
        selectedEntity() {
            const id = this.selectedEntityId;
            const { entities } = this.currentStep.data;
            if (entities) {
                const currentEntity = entities[id];
                return currentEntity ? currentEntity : null;
            }
            return null;
        },
    },
    mounted() {
        this.handlePositionUpdate = this.handlePositionUpdate.bind(this);
        this.subscribe();
    },
    beforeDestroy() {
        this.unsubscribe();
    },
    methods: {
        subscribe() {
            this.app.scene.el.object3D.positionGizmo.addEventListener('mouseUp', this.handlePositionUpdate);
        },
        unsubscribe() {
            this.app.scene.el.object3D.positionGizmo.detach();
            this.app.scene.el.object3D.positionGizmo.removeEventListener('mouseUp', this.handlePositionUpdate);
        },
        openAssetSelector(type, callback) {
            this.assetSelectionType = type;
            this.isAssetSelectorOpen = true;
            if (callback) {
                this.assetSelectionCallback = callback;
            } else {
                this.assetSelectionCallback = null;
            }
        },
        openClipboardOptions() {
            this.showClipboardOptions = true;
        },
        handleCancelClipboard() {
            this.$refs['ClipboardOptions'].reset();
            this.showClipboardOptions = false;
        },
        handleSaveClipboard() {
            this.$refs['ClipboardOptions'].save();
            this.showClipboardOptions = false;
        },
        handlePropSelected(propType) {
            console.log(propType);
            if (propType === 'text') {
                this.handleNewText();
            } else if (propType === 'avatar') {
                this.openAssetSelector('avatars');
            } else if (propType === 'model') {
                this.openAssetSelector('models');
            } else if (propType === 'audio') {
                this.openAssetSelector('audio');
            } else if (propType === 'image') {
                this.openAssetSelector('images');
            } else if (propType === 'information') {
                this.handleNewInformationPoint();
            }
        },
        closeAssetSelector() {
            this.assetSelectionType = null;
            this.isAssetSelectorOpen = false;
        },
        handleAssetSelection(src) {
            debugger;
            if (this.assetSelectionCallback) {
                this.assetSelectionCallback(src);
            } else {
                this.assetView.handler(src);
            }
            this.closeAssetSelector();
        },
        handleSelected360Image(newImageSrc) {
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.currentStep.id,
                newData: { src: newImageSrc },
            });
        },
        handleTextureUpdate(newTextureSrc) {
            const id = this.selectedEntityId;
            const { entities } = this.currentStep.data;
            const currentEntity = entities[id];
            if (currentEntity) {
                _.extend(currentEntity, { texture: newTextureSrc });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.currentStep.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
        handleUpdateAnimation(newAnimationSrc) {
            const id = this.selectedEntityId;
            const { entities } = this.currentStep.data;
            const currentEntity = entities[id];
            if (currentEntity) {
                _.extend(currentEntity, { action: newAnimationSrc });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.currentStep.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
        async handleNewText(newTextString = 'Enter Text...') {
            const camera = document.getElementById('camera');
            const position = new THREE.Vector3(0, 0, -75);
            position.applyQuaternion(camera.object3D.quaternion);
            const newText = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                tags: '',
                title: 'Text',
                text: newTextString,
                follow: false,
                color: '#FFFFFF',
                font: 'roboto',
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                events: {
                    click: {
                        event: 'click',
                        action: undefined,
                    },
                    mouseenter: {
                        event: 'mouseenter',
                        action: undefined,
                    },
                    mouseleave: {
                        event: 'mouseleave',
                        action: undefined,
                    },
                    mousedown: {
                        event: 'mousedown',
                        action: undefined,
                    },
                    mouseup: {
                        event: 'mouseup',
                        action: undefined,
                    },
                    'sound-ended': {
                        event: 'sound-ended',
                        action: undefined,
                    },
                    'sound-started': {
                        event: 'sound-started',
                        action: undefined,
                    },
                },
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                },
                scale: {
                    x: 20,
                    y: 20,
                    z: 20,
                },
                animation: {
                    duration: 3000,
                    delay: 0,
                    to: null,
                    direction: 'normal',
                },
                type: 'text',
            };
            const newEntity = await this.$store.dispatch('steps/createEntity', { entity: newText });
            this.handleNewEntity(newText);
        },
        async handleNew3DProp() {
            const scene = document.getElementById('scene');
            const position = new THREE.Vector3(0, 0, -75);
            const cameraWorldQuaternion = new THREE.Quaternion();
            scene.camera.getWorldQuaternion(cameraWorldQuaternion);
            position.applyQuaternion(cameraWorldQuaternion);
            const new3DProp = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                tags: '',
                title: '3D Prop',
                src: 'https://tt-assets-us-east-1.s3.amazonaws.com/FE.glb',
                clip: '__NO__ANIMATION__',
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                },
                scale: {
                    x: 20,
                    y: 20,
                    z: 20,
                },
                distance: -75,
                animation: {
                    duration: 3000,
                    delay: 0,
                    to: null,
                    direction: 'normal',
                },
                type: 'model',
            };

            const newEntity = await this.$store.dispatch('steps/createEntity', { entity: new3DProp });
            this.handleNewEntity(new3DProp);
        },
        async handleNewInformationPoint() {
            const camera = document.getElementById('camera');
            const position = new THREE.Vector3(0, 0, -75);
            position.applyQuaternion(camera.object3D.quaternion);
            const newInformationPoint = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                tags: '',
                title: 'Information',
                label: 'Hover Text...',
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                position: {
                    x: position.x,
                    y: position.y,
                    z: position.z,
                },
                scale: {
                    x: 20,
                    y: 20,
                    z: 20,
                },
                animation: {
                    duration: 3000,
                    delay: 0,
                    to: null,
                    direction: 'normal',
                },
                type: 'information',
            };

            const newEntity = await this.$store.dispatch('steps/createEntity', { entity: newInformationPoint });
            this.handleNewEntity(newInformationPoint);
        },
        async handleNewImage(newImageSrc) {
            debugger;
            if (this.selectedEntityId) {
                await this.$store.dispatch('steps/updateEntity', { entityId: this.selectedEntityId, newData: { src: newImageSrc } });
            } else {
                const camera = document.getElementById('camera');
                const position = new THREE.Vector3(0, 0, -75);
                position.applyQuaternion(camera.object3D.quaternion);
                const newEntity = await this.$store.dispatch('steps/createImage', { src: newImageSrc, position });
                this.$nextTick(() => {
                    const newEntityEl = document.getElementById(newEntity.id);
                    if (newEntityEl) {
                        this.app.scene.el.object3D.positionGizmo.attach(newEntityEl.object3D);
                    }
                });
            }
        },
        handleNewProp(newPropSrc) {
            if (this.selectedEntityId) {
                const id = this.selectedEntityId;
                const { entities } = this.currentStep.data;
                const currentEntity = entities[id];
                if (currentEntity && currentEntity.src !== newPropSrc) {
                    _.extend(currentEntity, { src: newPropSrc });
                    this.$store.dispatch('steps/updateStepDataById', {
                        id: this.currentStep.id,
                        newData: { entities: _.cloneDeep(entities) },
                    });
                }
            } else {
                const camera = document.getElementById('camera');
                const position = new THREE.Vector3(0, 0, -75);
                position.applyQuaternion(camera.object3D.quaternion);
                const newProp = {
                    id: `TT_${UUID().replace(/-/g, '')}`,
                    tags: '',
                    title: 'Prop',
                    src: newPropSrc,
                    rotation: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                    },
                    scale: {
                        x: 1,
                        y: 1,
                        z: 1,
                    },
                    events: {
                        click: {
                            event: 'click',
                            action: undefined,
                        },
                        mouseenter: {
                            event: 'mouseenter',
                            action: undefined,
                        },
                        mouseleave: {
                            event: 'mouseleave',
                            action: undefined,
                        },
                        mousedown: {
                            event: 'mousedown',
                            action: undefined,
                        },
                        mouseup: {
                            event: 'mouseup',
                            action: undefined,
                        },
                    },
                    animationClip: 'none',
                    type: 'prop',
                };
                this.handleNewEntity(newProp);
            }
        },
        async handleNewAudio(newAudioSrc) {
            if (this.selectedEntityId) {
                const id = this.selectedEntityId;
                const { entities } = this.currentStep.data;
                const currentEntity = entities[id];
                if (currentEntity && currentEntity.src !== newAudioSrc) {
                    _.extend(currentEntity, { src: newAudioSrc });
                    this.$store.dispatch('steps/updateStepDataById', {
                        id: this.currentStep.id,
                        newData: { entities: _.cloneDeep(entities) },
                    });
                }
            } else {
                const camera = document.getElementById('camera');
                const position = new THREE.Vector3(0, 0, -2);
                position.applyQuaternion(camera.object3D.quaternion);
                const newAudio = {
                    id: `TT_${UUID().replace(/-/g, '')}`,
                    tags: '',
                    title: 'Audio',
                    src: newAudioSrc,
                    rotation: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                    },
                    scale: {
                        x: 1,
                        y: 1,
                        z: 1,
                    },
                    positional: false,
                    loop: false,
                    volume: 100,
                    type: 'audio',
                };
                const newEntity = await this.$store.dispatch('steps/createEntity', { entity: newAudio });
                this.handleNewEntity(newAudio);
            }
        },

        async handleNewAvatar(avatarSrc) {
            if (this.selectedEntityId) {
                // TODO: remove this later
                const modelType = getModelType(avatarSrc);
                const id = this.selectedEntityId;
                const { entities } = this.currentStep.data;
                const currentEntity = entities[id];
                if (currentEntity && currentEntity.src !== avatarSrc) {
                    const texture = getDefaultTexture(modelType);
                    _.extend(currentEntity, { src: avatarSrc, modelType, action: 'idle', texture });
                    this.$store.dispatch('steps/updateStepDataById', {
                        id: this.currentStep.id,
                        newData: { entities: _.cloneDeep(entities) },
                    });
                }
            } else {
                const camera = document.getElementById('camera');
                const position = new THREE.Vector3(0, 0, -75);
                position.applyQuaternion(camera.object3D.quaternion);
                const newEntity = await this.$store.dispatch('steps/createAvatar', { src: avatarSrc, position });
                this.$nextTick(() => {
                    const newEntityEl = document.getElementById(newEntity.id);
                    if (newEntityEl) {
                        this.app.scene.el.object3D.positionGizmo.attach(newEntityEl.object3D);
                    }
                });
            }
        },
        handleNewEntity(newEntity) {
            // wait for next tick so that the hotspot has been rendered
            this.$nextTick(() => {
                const newEntityEl = document.getElementById(newEntity.id);
                if (newEntityEl) {
                    this.app.scene.el.object3D.positionGizmo.attach(newEntityEl.object3D);
                }
            });
        },
        handlePositionUpdate(event) {
            if (event.target && event.target.object) {
                const { id } = event.target.object.el;

                const position = {
                    x: event.target.object.position.x,
                    y: event.target.object.position.y,
                    z: event.target.object.position.z,
                };

                const { entities } = this.currentStep.data;
                const currentEntity = entities[id];
                if (currentEntity && !currentEntity.follow) {
                    // if in animation mode update the to property
                    if (this.appContext.inAnimationMode) {
                        _.set(currentEntity.animation, 'to', position);
                    } else {
                        _.extend(currentEntity, { position });
                    }
                    this.$store.dispatch('steps/updateStepDataById', {
                        id: this.currentStep.id,
                        newData: { entities: _.cloneDeep(entities) },
                    });
                }
            }
        },
        handleDeleteEntity() {
            const id = this.selectedEntityId;
            this.app.scene.el.object3D.positionGizmo.detach();
            const { entities } = this.currentStep.data;
            delete entities[id];
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.currentStep.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
        async setDefaultView() {
            const camera = document.getElementById('camera');
            const rotation = camera.getAttribute('rotation');

            const newRotation = {
                x: rotation.x,
                y: rotation.y,
                z: rotation.z,
            };
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.currentStep.id,
                newData: { rotation: newRotation },
            });
            this.$store.commit('apps/snackMessage', {
                message: 'View Saved',
                color: 'success',
            });
        },
    },
};
</script>

<style scoped></style>
