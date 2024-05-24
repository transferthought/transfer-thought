<template>
    <div style="position: relative; height: calc(var(--vh, 100vh))">
        <v-overlay :value="sceneLoaded && !steps.started">
            <v-container>
                <v-row>
                    <v-col>
                        <div class="d-flex justify-center text-h1 font-weight-bold pointer-events-none user-select-none">
                            {{ app.name }}
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-center pa-15">
                        <v-hover>
                            <template v-slot:default="{ hover }">
                                <v-btn id="take-play-btn" icon :color="hover ? 'primary lighten-2' : 'white'" @click="start()">
                                    <v-icon style="font-size: 10em">
                                        mdi-play-circle-outline
                                    </v-icon>
                                </v-btn>
                            </template>
                        </v-hover>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-center user-select-none">
                        <span class="font-weight-light text-h3 text-capitalize">
                            Powered by
                        </span>
                        <span class="font-weight-bold text-h3 text-capitalize ml-1">
                            Transfer Thought
                        </span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-center ">
                        <v-btn x-large class="font-weight-bold text-h3 text-capitalize" color="primary" @click="remix">
                            <v-icon left dark>
                                mdi-auto-fix
                            </v-icon>
                            Remix
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-overlay>
        <v-toolbar v-if="sceneLoaded" absolute bottom :height="bottomHeight" style="border-radius:25px 25px 0 0; opacity: .9; width: 100%;z-index:4">
            <div class="d-flex justify-center align-center flex-shrink-1 flex-grow-1">
                <v-btn icon x-large @click="back()">
                    <v-icon>
                        mdi-skip-previous
                    </v-icon>
                </v-btn>
                <v-btn v-if="paused" icon x-large @click="unPause()">
                    <v-icon :style="{ fontSize: '64px' }">
                        mdi-play
                    </v-icon>
                </v-btn>
                <v-btn v-else icon x-large @click="pause()">
                    <v-icon style="font-size: 64px">
                        mdi-pause
                    </v-icon>
                </v-btn>
                <v-btn icon x-large @click="next()">
                    <v-icon>
                        mdi-skip-next
                    </v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <Scene
            style="height:100%"
            embedded
            :vr-enabled="false"
            :ar-enabled="false"
            :app-id="app.appId"
            :style="{ opacity: sceneLoaded ? 1 : 0 }"
            @loaded="handleSceneLoaded()"
        />
        <portal-target class="scene-overlay" name="scene-overlay" />

        <portal v-if="sceneLoaded && steps.started" to="scene-overlay">
            <StepViewerContainer @complete="handleStepCompleted" />
            <EnvironmentViewerContainer />
        </portal>

        <v-dialog :value="!sceneLoaded" transition="dialog-bottom-transition" max-width="600" persistent hide-overlay>
            <template v-slot:default="">
                <v-card>
                    <v-card-title v-if="!sceneLoaded" class="text-h1">
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

import Client from '@/tt-api';
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
            currentZoom: 1,
            bottomHeight: 64,
            compassRotation: 0,
            showFinishMessage: false,
            sheet: true,
            sceneLoaded: false,
            showMultipleChoiceDialog: false,
            showControlsOverlay: false,
            currentNodeId: null,
            mute: false,
            showTranscript: true,
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
        paused() {
            return this.$store.state.steps.paused;
        },
    },
    watch: {
        currentStepIndex() {
            this.triggerMessageToParent('step-change', { id: this.currentStep.id });

            // send complete on last step
            if (this.currentStepIndex >= this.state.steps.length - 1) {
                this.triggerMessageToParent('completed');
                this.stopRecording();
            } else if (this.recordingData && this.recordingData.segments) {
                const currentStep = this.state.steps[this.currentStepIndex];
                const currentTime = new Date();
                const elapsedSeconds = (currentTime - this.recordingData.startTime) / 1000;
                const newSegment = { start: elapsedSeconds, name: currentStep.name };
                console.log('currentStep', currentStep.name, newSegment);
                this.recordingData.segments.push(newSegment);
            }
        },
    },
    async mounted() {
        Howler.volume(1);
        // HIDE help widget from view (we can add it to the toolbar if we need to)
        // FreshworksWidget('hide', 'launcher');
        window.addEventListener('message', this.handleMessageFromParent.bind(this));
        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });
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
        }
    },
    methods: {
        pause() {
            this.$store.dispatch('steps/togglePause');
        },
        unPause() {
            this.$store.dispatch('steps/togglePause');
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
            this.currentZoom += 0.25 * direction;
            // const currentZoom = window.cameraEl.getAttribute('camera').zoom;
            // const newZoomValue = currentZoom + (0.3 * direction);

            // window.cameraEl.setAttribute('camera', 'zoom', this.currentZoom);
            this.$store.dispatch('apps/state/update', {
                selector: 'zoom',
                value: this.currentZoom || 1,
            });
        },
        async start() {
            this.$store.dispatch('steps/start');
            this.$store.dispatch('apps/incrementAppViews');

            if (this.$route.name === 'networkedtake') {
                this.initNetworking();
            }
            this.startRecording();
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
            this.mute = !this.mute;
            Howler.mute(this.mute);
        },
        toggleShowTranscript() {
            this.showTranscript = !this.showTranscript;
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
                    this.$store.dispatch('apps/state/update', { selector: 'user.idle', value: true });
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
            const data = JSON.parse(e.data);
            if (data.event === 'goto-step') {
                const stepId = data.payload.id;
                const stepIndex = _.findIndex(this.state.steps, { id: stepId });
                if (stepIndex > 0) {
                    this.$store.dispatch('steps/setCurrentStepIndex', stepIndex);
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
                window.open(`${currentUrl.origin}/remix/${this.$route.params.appId}`);
            }
        },
        startRecording() {
            this.recordingData = { startTime: new Date(), segments: [] };
            const stream = document
                .getElementById('scene')
                .querySelector('canvas')
                .captureStream(60);
            // add scene audio to the recording
            const scene = document.getElementById('scene');
            if (scene.audioListener) {
                const destination = scene.audioListener.context.createMediaStreamDestination();
                scene.audioListener.getInput().connect(destination);
                stream.addTrack(destination.stream.getAudioTracks()[0]);
            }
            if (Howler.ctx) {
                const destination = Howler.ctx.createMediaStreamDestination();
                Howler.masterGain.connect(destination);
                console.log(destination.stream.getAudioTracks());
                stream.addTrack(destination.stream.getAudioTracks()[0]);
            }

            // create the recorder
            this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const frames = [];

            this.recorder.ondataavailable = function(evt) {
                if (evt.data) frames.push(evt.data);
            };

            this.recorder.onstop = async () => {
                const fileBlob = new Blob(frames, { type: 'video/webm' });
                // const dataUrl = window.URL.createObjectURL(fileBlob);
                // const link = document.createElement('a');
                // link.href = dataUrl;
                // link.download = `${this.app.name}.webm`;
                // link.click();

                await Client.Storage.put(`recordings/${this.app.name}/recording.webm`, fileBlob, {
                    contentType: fileBlob.type,
                });

                const jsonData = JSON.stringify(this.recordingData, null, 2);

                // Create a Blob object with the JSON data
                var blob = new Blob([jsonData], { type: 'application/json' });

                // Create a temporary anchor element
                // var a = document.createElement('a');
                // a.href = URL.createObjectURL(blob);
                // a.download = 'recording-data.json';

                await Client.Storage.put(`recordings/${this.app.name}/recording-data.json`, blob, {
                    contentType: blob.type,
                });

                // Append the anchor element to the document body
                // document.body.appendChild(a);

                // // Programmatically trigger a click event on the anchor element
                // a.click();
            };

            this.recorder.start(100);
            // setTimeout(this.stopRecording(), 3000);
        },
        stopRecording() {
            this.recorder.stop();
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
    height: 70%;
    left: 0;
    top: 80px;
    pointer-events: none;
    z-index: 2;
}
.scene-overlay * {
    pointer-events: auto;
}
</style>
