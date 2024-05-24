<template>
    <v-layout id="objective-editor" fill-height>
        <v-row id="editor-container" no-gutters class="fill-height">
            <v-col cols="3" class="left-panel-container fill-height" style="border-right: 1px solid rgba(0, 0, 0, 0.12);">
                <StepsContainer />
            </v-col>
            <v-col cols="9" class="fill-height">
                <v-card id="scene-container" class="fill-height">
                    <Scene embedded :vr-enabled="false" :ar-enabled="false" @loaded="handleSceneLoaded" />
                    <portal-target class="scene-overlay" name="scene-overlay" multiple />
                </v-card>
            </v-col>
        </v-row>
        <portal to="scene-overlay">
            <EnvironmentViewerContainer />
            <StepEditorContainer v-if="!!app.scene" class="fill-height" />
        </portal>
        <SnackMessages />
        <WelcomeDialog ref="welcome" />
        <v-tour name="overviewTour" :steps="overviewSteps" :callbacks="{ onStop: handleTourOnStop }" style="z-index: 8">
            <template slot-scope="tour">
                <transition name="fade">
                    <v-step
                        v-if="tour.steps[tour.currentStep]"
                        :key="tour.currentStep"
                        :step="tour.steps[tour.currentStep]"
                        :previous-step="tour.previousStep"
                        :next-step="tour.nextStep"
                        :stop="tour.stop"
                        :is-first="tour.isFirst"
                        :is-last="tour.isLast"
                        :labels="tour.labels"
                    ></v-step>
                </transition>
            </template>
        </v-tour>
    </v-layout>
</template>
<script>
/* eslint-disable no-undef */
import _ from 'lodash';
import EditorMixin from '@/mixins/EditorMixin';
import StepsContainer from '@/components/steps/components/StepsContainer.vue';
import StepEditorContainer from '@/components/steps/components/StepEditorContainer.vue';
import WelcomeDialog from '@/components/WelcomeDialog.vue';

import { TransformControls } from '@/tt-core/components/position-control';

import EnvironmentViewerContainer from '@/components/steps/components/EnvironmentViewerContainer.vue';

export default {
    name: 'Editor',
    components: {
        StepsContainer,
        StepEditorContainer,
        EnvironmentViewerContainer,
        WelcomeDialog,
    },
    mixins: [EditorMixin],
    props: {
        appId: String,
    },
    data() {
        return {
            distanceFromCamera: 2,
            overviewSteps: [
                {
                    target: '#help-button',
                    content: 'First things first. If you ever get stuck, have questions, or need a hand. You can get help here!',
                },
                {
                    target: '#app-settings-button',
                    content:
                        'Here is your settings button. This section allows you to do things like: name your project, create thumbnails for your course and "coach", set the voice/dialect of your coach, and adjust the style to align with your brand',
                },
                {
                    target: '#step-container',
                    content:
                        'Here is the "Step Container". This is where you can add, delete, and sequence the steps in your learning experience. You can think of these like slides in a PowerPoint',
                    params: {
                        placement: 'right',
                    },
                },
                {
                    target: '#step-toolbar',
                    content:
                        'This is the "Step Toolbar". This is where you can choose how your content will be best delivered and how you want your learners to interact with the content in each step. Unlike PowerPoint, the Step Toolbar allows trainers to create a wide range of experiences through our variety of <a href="https://transferthought.freshdesk.com/support/solutions/folders/72000563542" target="_blank">Step Types.</a>',
                    params: {
                        placement: 'bottom',
                    },
                },
                {
                    target: '#transcript-container',
                    content:
                        'Narrations is where you will develop the instructional text for each step within your Transfer Thought. Your copy will be converted to audio and read to your trainees via the Transfer Thought "Coach." ',
                    params: {
                        placement: 'top',
                    },
                },
                {
                    target: '#publish-button',
                    content:
                        "Publishing allows you to share your Transfer Thought in multiple ways so that your training content is easily accessible to all of your learners. Before you share, you can preview your Transfer Thought from the learners' perspective.",
                },
            ],
        };
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return [];
            }
        },
        actions() {
            try {
                return this.$store.state.apps.actions.actions;
            } catch {
                return [];
            }
        },
        steps() {
            try {
                return this.state.steps;
            } catch {
                return [];
            }
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
    },
    watch: {
        currentStep: {
            handler(newStepData, oldStepData) {
                if (this.app.scene && newStepData && oldStepData) {
                    if (newStepData.id !== oldStepData.id) {
                        this.app.scene.el.object3D.positionGizmo.detach();
                    }
                }
            },
        },
        state: {
            handler() {
                if (this.currentStep) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
        actions: {
            handler() {
                if (this.currentStep) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
    },
    async mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
        if (this.userData && (this.userData.autoShowTour || this.userData.autoShowTour === null)) {
            const confirmed = await this.$refs.welcome.open();
            if (confirmed) {
                this.$tours.overviewTour.start();
            } else {
                this.$store.dispatch('user/updateUserData', { key: 'autoShowTour', value: false });
            }
        }
    },
    methods: {
        async saveConfig() {
            // if user is not logged in, prompt login
            if (!this.user) {
                this.showAuthForm = true;
                return;
            }
            this.savingConfig = true;
            await this.$store.dispatch('apps/updateApp', { type: 'master' });
            this.savingConfig = false;
        },
        setupPostionGizmo() {
            const positionGizmo = new TransformControls(this.app.scene.el.camera, this.app.scene.el.renderer.domElement);
            this.app.scene.el.object3D.positionGizmo = positionGizmo;
            this.app.scene.el.object3D.add(positionGizmo);
            positionGizmo.setSnapDistanceToCamera(true);
            let handledMouseUp = false;
            const gizmoClassNames = ['hotspot', 'prop', 'avatar', 'audio'];
            this.app.scene.el.addEventListener('mouseup', (e) => {
                if (!handledMouseUp) {
                    if (e.target && gizmoClassNames.some((className) => e.target.classList.contains(className))) {
                        handledMouseUp = true;
                        this.app.scene.el.object3D.positionGizmo.attach(e.target.object3D);
                    } else {
                        this.app.scene.el.object3D.positionGizmo.detach();
                    }
                }
            });

            this.app.scene.el.object3D.positionGizmo.addEventListener('object-changed', (event) => {
                const newEntityId = event.value ? event.value.el.id : null;
                this.$store.dispatch('apps/context/setSelectedEntityId', newEntityId);
            });

            this.app.scene.el.addEventListener('mousedown', () => {
                handledMouseUp = false;
            });

            this.app.scene.el.object3D.positionGizmo.addEventListener('mouseUp', () => {
                handledMouseUp = true;
            });
        },
        async handleSceneLoaded() {
            this.setupPostionGizmo();
            await this.$store.dispatch('steps/init');
        },
        launchPublishedSite() {
            const currentUrl = new URL(window.location);
            window.open(`${currentUrl.origin}/take/${this.appId}`);
        },
        async publish() {
            if (this.steps && this.steps.length) {
                await this.publishApp();
            }
        },
        handleTourOnStop() {
            this.$store.dispatch('user/updateUserData', { key: 'autoShowTour', value: false });
        },
    },
};
</script>

<style>
#objective-editor {
    height: calc(100vh - 100px);
}
#objective-editor-container {
    overflow-y: scroll;
}

#set-camera {
    position: absolute;
    right: 10px;
    bottom: 100px;
}
#reset-camera {
    position: absolute;
    left: 10px;
    bottom: 100px;
}
.scene-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 10;
}
.scene-overlay * {
    pointer-events: auto;
}
#objective-editor .node-editor {
    padding: 16px 0 16px 0;
    margin: 0;
    border: none;
}
</style>
