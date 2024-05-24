<template>
    <v-main fill-height>
        <PracticalNavigation />
        <div height="100px" width="100px" @mousemove="handleMouseDown" />
        <v-overlay :value="showControlsOverlay" style="pointer-events: none">
            <v-container>
                <v-row>
                    <v-col>
                        <div class="d-flex justify-center text-h1 font-weight-bold pointer-events-none user-select-none">
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
                                <v-btn icon :color="hover ? 'primary lighten-2' : 'white'" @click="start()">
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
        <portal-target class="scene-overlay" name="scene-overlay" />
        <v-toolbar v-if="sceneLoaded" absolute bottom :height="bottomHeight" style="border-radius:25px 25px 0 0; opacity: .9; width: 100%;z-index:4">
            <!-- <v-btn
                icon
                x-large
            >
                <v-icon>mdi-chevron-up</v-icon>
            </v-btn> -->
            <div class="d-flex justify-start">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon x-large v-bind="attrs" v-on="on">
                            <v-icon>
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item @click="launchInVR">
                            <v-list-item-title>Launch in VR (beta)</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn icon x-large :color="showTranscript ? 'primary' : 'default'" @click="toggleShowTranscript()">
                    <v-icon>
                        mdi-closed-caption
                    </v-icon>
                </v-btn>
            </div>
            <div class="d-flex justify-center align-center flex-shrink-1 flex-grow-1">
                <v-btn icon x-large @click="back()">
                    <v-icon>
                        mdi-skip-previous
                    </v-icon>
                </v-btn>
                <Coach ref="coach" :thumbnail-src="coachSrc" :style="{ marginBottom: '50px' }" :show-transcript="showTranscript" />
                <v-btn icon x-large @click="next()">
                    <v-icon>
                        mdi-skip-next
                    </v-icon>
                </v-btn>
            </div>
            <div class="d-flex justify-end">
                <v-btn icon x-large @click="toggleMute()">
                    <v-icon v-if="mute">
                        mdi-volume-off
                    </v-icon>
                    <v-icon v-else>
                        mdi-volume-high
                    </v-icon>
                </v-btn>
            </div>
        </v-toolbar>

        <portal to="scene-overlay">
            <StepViewerContainer @complete="handleStepCompleted" />
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
    </v-main>
</template>
<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

import Scene from '@/components/Scene.vue';

import Coach from '@/components/Coach.vue';
import PracticalNavigation from '@/components/PracticalNavigation.vue';
import SnackMessages from '@/components/editor/SnackMessages.vue';

import { mapState } from 'vuex';

import postal from 'postal';

import StepViewerContainer from '@/components/steps/components/StepViewerContainer.vue';

import { Howler } from 'howler';

import SyncVar from '@/tt-core/services/SyncVar';

// import AutoNextDialog from '@/components/steps/viewer/AutoNextDialog.vue';

const sceneChannel = postal.channel('scene');

export default {
    name: 'Editor',
    components: {
        Scene,
        Coach,
        PracticalNavigation,
        StepViewerContainer,
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
    },
    async mounted() {
        // HIDE help widget from view (we can add it to the toolbar if we need to)
        FreshworksWidget('hide', 'launcher');
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
        handleMouseDown() {
            const camera = document.getElementById('camera');
            if (camera) {
                const lookControls = camera.components['tt-look-controls'];
                if (lookControls) {
                    lookControls.setAnimation(false);
                }
            }
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
            window.cameraEl.setAttribute('camera', 'zoom', this.currentZoom);
        },
        async start() {
            this.$store.dispatch('steps/start');
            this.$store.dispatch('apps/incrementAppViews');
        },
        async addSponsorStep() {
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

            await this.$store.dispatch('steps/addStep', { step: { name: 'Sponsered By: Transfer Thought', type: 'SPONSOR' } });
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
                const lookControls = camera.components['tt-look-controls'];
                if (lookControls && !lookControls.animateRestingCamera && Date.now() - this.lastMouseDown > 5000) {
                    lookControls.setAnimation(true);
                }
            }
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
