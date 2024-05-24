<template>
    <div id="app-view-container">
        <span v-show="!app.rendering" id="immersive-buttons-container">
            <v-btn v-show="arEnabled" id="TTARButton" class="mx-2">AR</v-btn>
            <v-btn v-show="vrEnabled" id="TTVRButton" class="mx-2">VR</v-btn>
        </span>
        <div id="app-container" ref="sceneview" />
        <v-container v-show="app.rendering" id="loading-screen" fill-height>
            <v-row align="center" justify="center">
                <v-col class="text-center" cols="12">
                    <v-progress-circular indeterminate size="64" />
                </v-col>
                <v-col class="text-center" cols="12">
                    Loading Assets...
                </v-col>
            </v-row>
        </v-container>
        <!--
            TODO: figure out a better way to do this
            This is a hack because we cannot render icons on canvas without this
        -->
        <v-icon style="z-index: -1; position: absolute; left: 0; top: 0;">
            play_arrow
        </v-icon>
    </div>
</template>

<script>
/* eslint-disable func-names */
import * as AFRAME from 'aframe';
import { mapState } from 'vuex';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import _ from 'lodash';
import Core from '@/tt-core';
import ActionService from '@/services/action-service';
import postal from 'postal';
import { effect } from '@vue/reactivity';

const sceneChannel = postal.channel('scene');

const { THREE } = AFRAME;

export default {
    name: 'AppView',
    props: {
        embedded: Boolean,
        containerElSelector: {
            type: String,
            default: null,
        },
        vrEnabled: {
            type: Boolean,
            default: true,
        },
        arEnabled: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            user: (state) => state.user.user,
            config: (state) => state.apps.config.config,
            state: (state) => state.apps.state.state,
            steps: (state) => state.steps,
        }),
        actions() {
            return this.$store.getters['apps/actions/actionsList'];
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.render();
            this.subscription = this.$store.subscribe((mutation) => {
                const { type, payload } = mutation;
                if (type === 'apps/config/init') {
                    this.$nextTick(() => this.render());
                }
                if (type === 'apps/config/update') {
                    if (_.has(payload.partial, 'attributes')) {
                        this.handleNewAttributes(payload.id, payload.partial.attributes);
                    }
                    if (_.has(payload.partial, 'parent')) {
                        this.handleNewParent(payload.id, payload.partial.parent);
                    }
                }
                if (type === 'apps/config/add') {
                    this.handleNewObject(payload);
                }
                if (type === 'apps/config/delete') {
                    this.handleDeleteObject(payload);
                }
                if (type === 'apps/state/init') {
                    this.handleResetState(payload);
                }
                if (type === 'apps/queryParams/init') {
                    this.handleResetQueryParams(payload);
                }
                if (type === 'apps/state/update') {
                    this.handleStateUpdate(payload);
                }
                if (type === 'apps/context/update') {
                    this.handleAppContextUpdate(payload);
                }

                if (type === 'steps/setStarted') {
                    this.scene.updateState({ selector: 'started', value: payload }, 'steps');
                }
                if (type === 'steps/setPause') {
                    this.scene.updateState({ selector: 'paused', value: payload }, 'steps');
                }
                if (type === 'steps/setTranscriptPlaying') {
                    this.scene.updateState({ selector: 'transcriptPlaying', value: payload }, 'steps');
                }
            });
            this.$store.watch((state) => state.apps.selectedEntityId, this.handleSelectedEntityIdChange.bind(this));
            this.$store.watch((state) => state.apps.context.mode, this.handleModeChanged.bind(this));
            this.$store.watch((state) => state.apps.gizmoMode, this.handleGizmoModeChanged.bind(this));
            this.$store.watch((state) => state.apps.gizmoSnapTranslation, this.handleGizmoSnapTranslationChanged.bind(this));
            this.$store.watch((state) => state.apps.gizmoSnapRotation, this.handleGizmoSnapRotationChanged.bind(this));
        });
    },
    beforeDestroy() {
        if (this.scene && this.scene.el && this.scene.el.parentNode) {
            this.scene.el.parentNode.removeChild(this.scene.el);
        }
        ActionService.endAllActions();
        this.subscription();
    },
    methods: {
        async render() {
            if (this.$refs.sceneview && this.app.appId) {
                this.$store.commit('apps/rendering', true);
                if (this.scene && this.scene.el && this.scene.el.parentNode) {
                    this.scene.el.parentNode.removeChild(this.scene.el);
                }
                const containerEl = this.containerElSelector ? document.querySelector(this.containerElSelector) : null;
                this.scene = await Core.SceneManager.createScene(
                    _.cloneDeep(this.config),
                    {
                        state: this.state,
                        appContext: this.app.context,
                        steps: this.steps,
                        queryParams: this.app.queryParams,
                    },
                    containerEl || this.$refs.sceneview
                );

                if (this.embedded) {
                    this.scene.el.setAttribute('embedded', true);
                }
                this.scene.on('loaded', () => {
                    this.sceneLoaded();
                    if (this.app.context.mode === 'edit') {
                        this.initializeEditor();
                    }

                    this.initializeComputedActions();
                });
                if (this.app.context.mode === 'preview') {
                    this.initializePreview();
                } else if (this.app.context.mode === 'play') {
                    this.initializePlay();
                }
                this.scene.on('enter-vr', () => {
                    this.$store.commit('apps/context/update', { selector: 'inVRMode', value: true });
                });
                this.scene.on('exit-vr', () => {
                    this.$store.commit('apps/context/update', { selector: 'inVRMode', value: false });
                });

                this.scene.on('tick', (payload) => {
                    sceneChannel.publish('events.tick', payload);
                });

                this.scene.on('click', (payload) => {
                    sceneChannel.publish('events.click', payload);
                });
            }
        },

        sceneLoaded() {
            this.$store.commit('apps/rendering', false);
            this.$store.commit('apps/scene', this.scene);
            this.$emit('loaded', this.scene);

            ActionService.endAllActions();
        },

        initializeEditor() {
            // render editor cam
            // add click events to all entities that can have gizmos this.$store.commit(app/selectedEntityId, clickedEntityId)
            _.forEach(this.config, (item) => {
                if (item.type === 'entity' && !_.includes(['scene', 'camera', 'cameraRig'], item.id)) {
                    const entityEl = document.getElementById(item.id);
                    if (entityEl) {
                        entityEl.addEventListener('click', () => {
                            this.$store.commit('apps/selectedEntityId', item.id);
                        });
                    }
                }
            });
            const gizmo = new TransformControls(this.scene.el.camera, this.scene.el.renderer.domElement);
            this.scene.el.object3D.gizmo = gizmo;
            this.scene.el.object3D.add(gizmo);
            // Setup event listener to update ECSON when gizmo is moved
            const onGizmoDragFinish = function(event) {
                const {
                    target: { object },
                } = event;
                if (this.app.gizmoMode === 'translate') {
                    this.$store.dispatch('apps/config/updateComponent', {
                        entityId: this.app.selectedEntityId,
                        componentType: 'position',
                        attributes: this.getPositionFromObject(object),
                    });
                } else if (this.app.gizmoMode === 'rotate') {
                    this.$store.dispatch('apps/config/updateComponent', {
                        entityId: this.app.selectedEntityId,
                        componentType: 'rotation',
                        attributes: this.getRotationFromObject(object),
                    });
                } else if (this.app.gizmoMode === 'scale') {
                    this.$store.dispatch('apps/config/updateComponent', {
                        entityId: this.app.selectedEntityId,
                        componentType: 'scale',
                        attributes: this.getScaleFromObject(object),
                    });
                }
            };
            gizmo.addEventListener('mouseUp', onGizmoDragFinish.bind(this));
        },

        initializePreview() {
            this.initializeEvents();
        },

        initializePlay() {
            this.initializeEvents();
        },

        initializeEvents() {
            this.scene.on('event', (event) => {
                sceneChannel.publish('events', event);
                const { attributes } = event;
                if (attributes && attributes.action) {
                    const actionId = attributes.action;
                    ActionService.runAction(actionId, attributes, event);
                }
            });
        },

        initializeComputedActions() {
            _.forEach(this.actions, (action) => {
                if (action.watch) {
                    effect(() => ActionService.runAction(action.id), {
                        lazy: false,
                    });
                }
            });
        },

        handleResetState(state) {
            if (this.scene) {
                this.scene.resetState(state);
            }
        },

        handleResetQueryParams() {
            if (this.scene) {
                this.scene.updateState(this.app.queryParams, 'queryParams');
            }
        },

        handleStateUpdate(payload) {
            if (this.scene) {
                this.scene.updateState(payload, 'state');
            }
        },
        handleStepsUpdate(payload) {
            if (this.scene) {
                this.scene.updateState(payload, 'steps');
            }
        },

        handleAppContextUpdate(payload) {
            if (this.scene) {
                this.scene.updateState(payload, 'appContext');
            }
        },

        handleConfigUpdate() {
            // this.scene.el.systems.state.state = _.extend({}, this.config, this.state);
            // this.scene.el.emit('STATE_UPDATED');
        },

        handleDeleteObject(item) {
            if (item.type === 'entity') {
                this.scene.removeEntity(item.id);
            }
            if (item.type === 'component') {
                this.scene.removeComponent(item.id);
            }
        },

        handleNewObject(payload) {
            const { item } = payload;

            if (item.type === 'template') {
                const template = this.scene.createNewTemplate(item);
                const parent = this.scene.getEntity('aframe-assets');
                if (parent) {
                    parent.addChild(template);
                }
            } else if (item.type === 'entity') {
                const entity = this.scene.createNewEntity(item);
                const parent = this.scene.getEntity(item.parent);
                if (parent) {
                    parent.addChild(entity);
                }
            } else if (item.type === 'component') {
                const component = this.scene.createNewComponent(item);
                const entity = this.scene.getEntity(item.entityId);
                if (entity) {
                    entity.addComponent(component);
                }
            }
        },

        handleSelectedEntityIdChange(newSelectedEntityId) {
            // Don't attach scene to gizmo, it causes maximum callstack error
            if (!_.includes(['scene', 'camera', 'cameraRig'], newSelectedEntityId) && this.app.gizmoMode && this.app.gizmoMode !== 'select') {
                // Attach current object to gizmo instance - automatically detaches old object
                const entity = document.querySelector(`#${newSelectedEntityId}`);
                if (entity && entity.object3D) {
                    this.scene.el.object3D.gizmo.attach(entity.object3D);
                }
            }
        },
        handleNewAttributes(componentId, attributes) {
            const component = this.scene.getComponent(componentId);
            if (component) {
                component.updateAttributes(attributes);
            }
        },

        handleNewParent(entityId, newParentId) {
            if (this.scene.el.object3D.gizmo) {
                this.scene.el.object3D.gizmo.detach();
            }
            this.scene.reparent(entityId, newParentId);
        },

        handleModeChanged() {
            if (this.app.context.mode === 'edit') {
                this.$store.commit('apps/state/reset');
                this.$store.commit('apps/config/reset');
            } else if (this.app.context.mode === 'preview') {
                this.$store.commit('apps/state/cache');
                this.$store.commit('apps/config/cache');
            }

            this.render();
        },
        handleGizmoModeChanged(newMode) {
            if (newMode === 'select') {
                this.scene.el.object3D.gizmo.detach();
            } else {
                const selectedEntity = document.querySelector(`#${this.app.selectedEntityId}`);
                if (selectedEntity) {
                    this.scene.el.object3D.gizmo.setMode(newMode);
                    this.scene.el.object3D.gizmo.attach(selectedEntity.object3D);
                }
            }
        },
        handleGizmoSnapTranslationChanged(newIncrement) {
            this.scene.el.object3D.gizmo.setTranslationSnap(newIncrement);
        },
        handleGizmoSnapRotationChanged(newIncrement) {
            this.scene.el.object3D.gizmo.setRotationSnap(newIncrement);
        },

        getPositionFromObject(object) {
            return {
                x: _.round(object.position.x, 2),
                y: _.round(object.position.y, 2),
                z: _.round(object.position.z, 2),
            };
        },

        getRotationFromObject(object) {
            return {
                x: _.round(THREE.MathUtils.radToDeg(object.rotation.x), 2),
                y: _.round(THREE.MathUtils.radToDeg(object.rotation.y), 2),
                z: _.round(THREE.MathUtils.radToDeg(object.rotation.z), 2),
            };
        },

        getScaleFromObject(object) {
            return {
                x: _.round(object.scale.x, 2),
                y: _.round(object.scale.y, 2),
                z: _.round(object.scale.z, 2),
            };
        },
    },
};
</script>

<style>
#app-view-container {
    width: 100%;
    height: 100%;
    position: relative;
}
#app-container {
    width: 100%;
    height: 100%;
}
#loading-screen {
    z-index: 100; /** 100 to above scene but below welcome modal */
    position: absolute;
    background: var(--v-background-base);
    max-width: 100%;
    top: 0;
    left: 0;
}
#immersive-buttons-container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1000;
}
#arjs-video {
    max-width: initial;
}
</style>
