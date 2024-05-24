<template>
    <div id="scene-container" style="position: relative; height: calc(var(--vh, 100vh))">
        <PracticalNavigation />
        <div height="100px" width="100px" @mousemove="handleMouseDown" />
        <v-overlay :value="showControlsOverlay" style="pointer-events: none">
            <v-container>
                <v-row>
                    <v-col>
                        <div class="tt-text d-flex justify-center text-h4 font-weight-bold pointer-events-none user-select-none">
                            Click and drag the screen to look around
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-center pa-15 pointer-events-none">
                        <v-icon style="font-size: 10em">
                            mdi-gesture-swipe
                        </v-icon>
                    </v-col>
                </v-row>
            </v-container>
        </v-overlay>
        <v-overlay :value="sceneLoaded && !steps.started">
            <v-container id="welcome-overlay">
                <v-row>
                    <v-col>
                        <div class="tt-text text-center d-flex justify-center text-h4 font-weight-bold pointer-events-none user-select-none">
                            {{ app.name }}
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-center pa-15">
                        <v-hover>
                            <template v-slot:default="{ hover }">
                                <v-btn id="take-play-btn" icon :color="hover ? 'primary lighten-2' : 'white'" @click="start()">
                                    <v-icon class="tt-text" style="font-size: 10em">
                                        mdi-play-circle-outline
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="tt-text d-flex justify-center user-select-none">
                        <span class="font-weight-light text-h4 text-center text-capitalize">
                            Powered by
                        </span>
                    </v-col>
                    <v-col cols="12" class="tt-text d-flex justify-center user-select-none">
                        <span class="font-weight-bold text-h4 text-center text-capitalize ml-1">
                            Transfer Thought
                        </span>
                    </v-col>
                </v-row>
                <v-row v-if="getStateValue('settings.showRemix')">
                    <v-col class="d-flex justify-center ">
                        <v-btn x-large class="dark-background tt-text font-weight-bold text-h5 text-capitalize" color="primary" @click="remix">
                            <v-icon left dark>
                                mdi-auto-fix
                            </v-icon>
                            Remix
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-overlay>
        <v-btn v-if="!drawer" fab top right :style="{ top: $vuetify.breakpoint.width < 500 ? '100px' : '24px' }" absolute @click="handleCompassClicked">
            <v-icon color="red" :style="{ transform: 'rotate(' + compassAngle + 'deg)' }">
                mdi-navigation
            </v-icon>
        </v-btn>
        <v-btn
            v-if="!drawer"
            fab
            top
            right
            :style="{ top: $vuetify.breakpoint.width < 500 ? '170px' : '94px' }"
            absolute
            small
            :disabled="currentZoom >= 4"
            @click="zoom(1)"
        >
            <v-icon>
                mdi-magnify-plus-outline
            </v-icon>
        </v-btn>
        <v-btn
            v-if="!drawer"
            fab
            top
            right
            :style="{ top: $vuetify.breakpoint.width < 500 ? '220px' : '144px' }"
            absolute
            small
            :disabled="currentZoom <= 0.5"
            @click="zoom(-1)"
        >
            <v-icon>
                mdi-magnify-minus-outline
            </v-icon>
        </v-btn>
        <Scene
            style="height:100%"
            embedded
            :vr-enabled="false"
            :ar-enabled="false"
            :app-id="app.appId"
            :style="{ opacity: sceneLoaded ? 1 : 0 }"
            @loaded="handleSceneLoaded()"
        />
        <portal-target class="scene-overlay" name="scene-overlay" multiple />
        <v-toolbar
            id="bottom-bar"
            class="light-background"
            v-if="sceneLoaded"
            absolute
            bottom
            :height="bottomHeight"
            style="border-radius:25px 25px 0 0; width: 100%;z-index:15"
        >
            <!-- <v-btn
                icon
                x-large
            >
                <v-icon>mdi-chevron-up</v-icon>
            </v-btn> -->
            <div class="d-flex justify-start">
                <v-btn
                    v-if="clipboard && clipboard.pages && clipboard.pages.length"
                    class="tt-text"
                    icon
                    x-large
                    @click="toggleShowClipboard()"
                    :color="clipboard.visible ? 'primary' : 'default'"
                >
                    <v-icon>
                        mdi-clipboard-outline
                    </v-icon>
                </v-btn>
                <v-tooltip top v-else>
                    <template v-slot:activator="{ on }">
                        <v-btn class="tt-text" v-on="on" icon x-large disabled>
                            <v-icon>
                                mdi-clipboard-outline
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>Clipboard is Empty</span>
                </v-tooltip>
                <v-btn class="tt-text" icon x-large :color="showTranscript ? 'primary' : 'default'" @click="toggleShowTranscript()">
                    <v-icon>
                        mdi-closed-caption
                    </v-icon>
                </v-btn>
            </div>
            <div class="d-flex justify-center align-center flex-shrink-1 flex-grow-1">
                <!-- <v-btn icon x-large @click="back()">
                    <v-icon>
                        mdi-skip-previous
                    </v-icon>
                </v-btn> -->
                <Coach ref="coach" :thumbnail-src="coachSrc" :style="{ marginBottom: '50px' }" :show-transcript="steps.started && showTranscript" />
                <!-- <v-btn icon x-large @click="next()">
                    <v-icon>
                        mdi-skip-next
                    </v-icon>
                </v-btn> -->
            </div>
            <div class="d-flex justify-end">
                <v-btn class="tt-text" icon x-large @click="toggleMute()">
                    <v-icon v-if="mute">
                        mdi-volume-off
                    </v-icon>
                    <v-icon v-else>
                        mdi-volume-high
                    </v-icon>
                </v-btn>

                <v-menu id="menu" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="tt-text" icon x-large v-bind="attrs" v-on="on">
                            <v-icon>
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="openSupport">
                            <v-list-item-icon>
                                <v-icon>mdi-help-circle-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Help</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="launchInVR">
                            <v-list-item-icon>
                                <v-icon>mdi-virtual-reality</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Launch in Virtual Reality</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <!-- <v-btn class="tt-text" icon x-large @click="openSupport()">
                    <v-icon>
                        mdi-help-circle-outline
                    </v-icon>
                </v-btn> -->
            </div>
        </v-toolbar>

        <portal v-if="sceneLoaded && steps.started" to="scene-overlay">
            <EnvironmentViewerContainer />
            <div class="overlay-container">
                <StepViewerContainer @complete="handleStepCompleted" />
            </div>
        </portal>

        <v-dialog :value="!sceneLoaded" transition="dialog-bottom-transition" max-width="600" persistent hide-overlay>
            <template v-slot:default="">
                <v-card>
                    <v-card-title v-if="!sceneLoaded" class="text-h4">
                        Loading...
                    </v-card-title>
                    <v-card-actions v-if="!sceneLoaded" class="justify-center card-padding">
                        <v-progress-linear indeterminate color="primary" />
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <SnackMessages />
    </div>
</template>
<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
import DefaultApp from '@/tt-core/scenes/360Objective/app';

import Scene from '@/components/Scene.vue';

import Coach from '@/components/Coach.vue';
import PracticalNavigation from '@/components/PracticalNavigation.vue';
import SnackMessages from '@/components/editor/SnackMessages.vue';

import { mapState } from 'vuex';

import postal from 'postal';

import StepViewerContainer from '@/components/steps/components/StepViewerContainer.vue';
import EnvironmentViewerContainer from '@/components/steps/components/EnvironmentViewerContainer.vue';

import { Howler } from 'howler';

import SyncVar from '@/tt-core/services/SyncVar';
// import AutoNextDialog from '@/components/steps/viewer/AutoNextDialog.vue';

const sceneChannel = postal.channel('scene');

export default {
    name: 'Take',
    components: {
        Scene,
        Coach,
        PracticalNavigation,
        StepViewerContainer,
        EnvironmentViewerContainer,
        SnackMessages,
        // AutoNextDialog,
    },
    mixins: [SyncVar],
    props: {},
    data() {
        return {
            showAutoNextDialog: false,
            compassAngle: 0,
            drawer: false,
            bottomHeight: 64,
            compassRotation: 0,
            showFinishMessage: false,
            sheet: true,
            sceneLoaded: false,
            showMultipleChoiceDialog: false,
            showControlsOverlay: false,
            currentNodeId: null,
            mute: false,
            hasMuted: false,
            showTranscript: false,
            nextTimeout: null,
            lastMouseDown: 0,
            recorder: null,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
            steps: (state) => state.steps,
        }),
        currentZoom() {
            return this.state.zoom || 1;
        },

        currentStepIndex() {
            return this.$store.state.steps.currentStepIndex;
        },
        currentStep() {
            // TODO: update this to steps/currentStep
            return this.state.currentStep;
        },
        coach() {
            try {
                return this.$store.state.apps.state.state.coach;
            } catch {
                return {};
            }
        },
        coachSrc() {
            if (this.$route.query.coach) {
                return this.$route.query.coach;
            }
            return this.coach && this.coach.src;
        },
        clipboard() {
            if (this.state?.currentEnvironment?.data) {
                const { clipboard } = this.state.currentEnvironment.data;
                if (clipboard && clipboard.length) {
                    return clipboard[0];
                }
            }
            return null;
        },
    },
    watch: {
        'steps.started': {
            handler() {
                if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
                    const sceneEl = document.querySelector('a-scene');
                    if (!sceneEl.is('vr-mode')) sceneEl.enterVR();
                }

                const introContainer = document.getElementById('TT_5a31667513114f1e8163561781bc6eb8');
                if (introContainer) {
                    introContainer.parentNode.removeChild(introContainer);
                }
            },
        },
        currentStepIndex() {
            this.triggerMessageToParent('step-change', { id: this.currentStep.id });

            // send complete on last step
            if (this.currentStepIndex >= this.state.steps.length - 1) {
                this.triggerMessageToParent('completed');
                // this.stopRecording();
            }
        },
    },
    async mounted() {
        // HIDE help widget from view (we can add it to the toolbar if we need to)
        // FreshworksWidget('hide', 'launcher');
        window.addEventListener('message', this.handleMessageFromParent.bind(this));
        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });
        try {
            if (this.$route.params.appId) {
                await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.appId, type: 'published' });
                await this.addSponsorStep();
                await this.$store.dispatch('steps/addStep', { step: { name: 'Completed', type: 'ENDING' } });

                sceneChannel.subscribe('events', (payload) => {
                    if (payload && payload.attributes && payload.attributes.event === 'tick') {
                        this.checkCameraMovement();
                        this.checkToAnimateCamera();
                    }
                });
                this.initializeVREvents();
            }
        } catch (err) {
            this.$router.push({ name: 'NotFound', query: { path: this.$route.path } });
        }
    },
    methods: {
        initializeVREvents() {
            const playButton = document.getElementById('TT_d631761906ed436d840e322e2805dc6a');
            if (playButton) {
                playButton.addEventListener('click', (event) => {
                    this.start();
                });
            }
        },
        getStateValue(selector) {
            const value = _.get(this.state, selector, _.get(DefaultApp.state, selector));
            return value;
        },
        handleMouseDown() {
            this.$store.dispatch('apps/state/update', { selector: 'user.idle', value: false });
            this.lastMouseDown = Date.now();
        },
        handleSceneLoaded() {
            this.sceneLoaded = true;
            this.$store.dispatch('steps/preloadAssets');
            this.$store.dispatch('steps/init');
            const camera = document.getElementById('camera');
            camera.addEventListener('mousedown', () => {
                this.handleMouseDown();
            });

            this.triggerMessageToParent('loaded');
        },
        handleCompassClicked() {
            // handle camera movement in addition to setting current environment
            const camera = document.getElementById('camera');
            if (camera) {
                const lookControls = camera.components['tt-look-controls'];
                if (lookControls) {
                    const { rotation } = this.state.currentEnvironment.data;
                    if (rotation) {
                        lookControls.setRotation(rotation.x, rotation.y, true);
                    }
                }
            }
        },
        zoom(direction) {
            // const minZoom = .7;
            // const maxZoom = 2;
            // this.currentZoom += 0.25 * direction;
            // const currentZoom = window.cameraEl.getAttribute('camera').zoom;
            // const newZoomValue = currentZoom + (0.3 * direction);

            // window.cameraEl.setAttribute('camera', 'zoom', this.currentZoom);
            this.$store.dispatch('apps/state/update', {
                selector: 'zoom',
                value: this.currentZoom ? this.currentZoom + 0.25 * direction : 1,
            });
        },
        async start() {
            this.$store.dispatch('steps/start');
            this.$store.dispatch('apps/incrementAppViews');

            if (this.$route.name === 'networkedtake') {
                this.initNetworking();
            }

            // this.startRecording();
        },
        async addSponsorStep() {
            try {
                // app is unlimited
                if (this.app.unlimtedLifetime || this.app.unlimited) {
                    return;
                }

                // user has unlimted
                if (this.app.ownerData.unlimtedLifetime || this.app.ownerData.unlimited) {
                    return;
                }
                // user has views left
                if (this.app.ownerData.plan === 'pilot' && this.app.ownerData.currentMonthViews < 10) {
                    return;
                }

                if (this.app.ownerData.plan === 'pro' && this.app.ownerData.currentMonthViews < 2500) {
                    return;
                }

                if (this.app.ownerData.plan === 'enterprise') {
                    return;
                }

                // await this.$store.dispatch('steps/addStep', { step: { name: 'Sponsered By: Transfer Thought', type: 'SPONSOR_OVERLAY' } });
            } catch (err) {}
        },
        handleStepCompleted() {
            this.next(500);
        },
        back() {
            this.$store.dispatch('steps/back');
        },
        next(timeout = 0) {
            clearTimeout(this.nextTimeout);
            this.nextTimeout = setTimeout(() => this.$store.dispatch('steps/next'), timeout);
        },
        toggleMute() {
            if (!this.hasMuted) {
                this.showTranscript = true;
            }
            this.hasMuted = true;
            this.mute = !this.mute;
            Howler.mute(this.mute);
        },
        toggleShowTranscript() {
            this.showTranscript = !this.showTranscript;
        },
        toggleShowClipboard() {
            if (this.clipboard) {
                this.$store.dispatch('apps/state/update', {
                    selector: 'currentEnvironment.data.clipboard[0].visible',
                    value: !this.clipboard.visible,
                });
            }
        },
        checkCameraMovement() {
            const camera = document.getElementById('camera');
            const rotation = camera.getAttribute('rotation');
            const { rotation: defaultRotation } = this.state?.currentEnvironment?.data;
            if (defaultRotation) {
                const rotationVector = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
                const defaultRotationVector = new THREE.Vector3(defaultRotation?.x || 0, defaultRotation?.y || 0, defaultRotation?.z || 0);
                if (rotationVector.distanceTo(defaultRotationVector) > 0.01) {
                    this.showControlsOverlay = false;
                    this.compassAngle = rotation.y - defaultRotation.y;
                }
            } else {
                this.showControlsOverlay = false;
            }
        },
        checkToAnimateCamera() {
            const camera = document.getElementById('camera');
            if (camera) {
                if (!this.state.user.idle && Date.now() - this.lastMouseDown > 5000) {
                    this.$store.dispatch('apps/state/update', { selector: 'user.rotation', value: this.getCameraRotation(camera) });

                    new TWEEN.Tween(camera.object3D.position)
                        .to({ x: 0, y: 0, z: 0 }, 1000)
                        .onComplete(() => {
                            this.$store.dispatch('apps/state/update', { selector: 'user.idle', value: true });
                        })
                        .start();
                }
            }
        },

        getCameraRotation(camera) {
            const object = camera.object3D;
            return {
                x: _.round(THREE.MathUtils.radToDeg(object.rotation.x), 2),
                y: _.round(THREE.MathUtils.radToDeg(object.rotation.y), 2),
                z: _.round(THREE.MathUtils.radToDeg(object.rotation.z), 2),
            };
        },
        handleAutoNextCancel() {
            this.showAutoNextDialog = false;
        },
        handleAutoNext() {
            this.showAutoNextDialog = false;
            this.$nextTick(() => {});
        },
        launchInVR() {
            document.querySelector('a-scene').enterVR();
        },
        handleMessageFromParent(e) {
            if (e && _.isString(e.data)) {
                const data = JSON.parse(e.data);
                if (data.event === 'goto-step') {
                    const stepId = data.payload.id;
                    const stepIndex = _.findIndex(this.state.steps, { id: stepId });
                    if (stepIndex > 0) {
                        this.$store.dispatch('steps/setCurrentStepIndex', stepIndex);
                    }
                }
            }
        },
        triggerMessageToParent(event, payload = {}) {
            if (window.parent && window.parent.postMessage) {
                const message = {
                    event,
                    payload,
                };
                window.parent.postMessage(JSON.stringify(message), '*');
            }
        },
        remix() {
            if (this.$route.params.appId) {
                const currentUrl = new URL(window.location);

                this.$router.push({ name: 'Remix', params: { resourceType: 'apps', resourceId: this.$route.params.appId } });
            }
        },
        startRecording() {
            const stream = document
                .getElementById('scene')
                .querySelector('canvas')
                .captureStream(25);
            this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const frames = [];

            this.recorder.ondataavailable = function(evt) {
                if (evt.data) frames.push(evt.data);
            };

            this.recorder.onstop = () => {
                const fileBlob = new Blob(frames, { type: 'video/webm' });
                const dataUrl = window.URL.createObjectURL(fileBlob);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = this.data;
                link.click();
            };

            this.recorder.start(100);
            // setTimeout(this.stopRecording(), 3000);
        },
        stopRecording() {
            this.recorder.stop();
        },
        async openSupport() {
            window.open('https://transferthought.freshdesk.com/support/tickets/new');
        },
    },
};
</script>

<style>
.wrap {
    overflow: hidden;
}
.content {
    width: 100000px;
}
.text {
    animation-name: animation;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    float: left;
    transition: 4s;
}
.paused .text {
    animation-play-state: paused;
}
@keyframes animation {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-100%);
    }
}
.v-snack .v-snack__content {
    font-size: 1.475rem;
    line-height: 1.75rem;
}
.floating-toolbar {
    max-width: 400px;
    width: calc(100% - 40px);
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
.scene-overlay .overlay-container {
    height: 70%;
    margin-top: 80px;
    pointer-events: none;
}
.scene-overlay * {
    pointer-events: auto;
}
#bottom-bar {
    opacity: 0.9;
}
</style>
