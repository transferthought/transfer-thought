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
// import AutoNextDialog from '@/components/steps/viewer/AutoNextDialog.vue';

import Client from '@/tt-api';
import gql from 'graphql-tag';
import WebRTCService from '@/services/webrtc-service';

import * as UUID from 'uuid/v4';

const sceneChannel = postal.channel('scene');

// To test run in two tabs:
// To present: http://localhost:8080/networkedtake/fa8ec770-2d93-42ce-87c5-6024285a4970?presenter=true
// To view:    http://localhost:8080/networkedtake/fa8ec770-2d93-42ce-87c5-6024285a4970

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
    mixins: [],
    props: {},
    data() {
        return {
            syncVar: {
                userInfo: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: false, unique: true },
                },
                server_userInfo: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: false },
                },
                // position: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                // rotation: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                currentModel: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: false },
                },
                // crosshairPosition: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                // position_guest: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                // rotation_guest: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                // crosshairPosition_guest: {
                //     timestamp: 0, syncVarSettings: { interpolate: true },
                // },
                // currentStepIndex: {
                //     timestamp: 0, syncVarSettings: { interpolate: false },
                // },
            },
            userInfo: {
                id: `TT_${UUID().replace(/-/g, '')}`,
                userId: `TT_${UUID().replace(/-/g, '')}`,
                userName: 'Trainee',
                crosshairPosition: {
                    x: 0,
                    y: 0,
                    z: -80,
                    timestamp: 0,
                },
                position: {
                    x: 0,
                    y: 0,
                    z: -5,
                    timestamp: 0,
                },
                rotation: { x: 0, y: 0, z: 0 },
            },
            server_userInfo: [],
            connection: null,
            // crosshairPosition: {
            //     x: 0, y: 0, z: -80, timestamp: 0,
            // },
            // position: {
            //     x: 0, y: 0, z: -5, timestamp: 0,
            // },
            // rotation: { x: 0, y: 0, z: 0 },
            // crosshairPosition_guest: {
            //     x: 0, y: 0, z: -80, timestamp: 0,
            // },
            // position_guest: {
            //     x: 0, y: 0, z: -5, timestamp: 0,
            // },
            // rotation_guest: { x: 0, y: 0, z: 0 },
            // currentStepIndex: 2,
            networkSettings: { syncRate: 500 },
            lerpSpeed: 50,
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
        // New Network code
        currentStepIndexValue() {
            return this.$store.state.steps.currentStepIndex;
        },
        // End New Network Code
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
        isPresenter() {
            return Boolean(this.$route.query.presenter);
        },
    },
    watch: {
        currentStepIndexValue() {
            if (this.isPresenter) {
                this.currentStepIndex = this.currentStepIndexValue;
            }
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

            const config = `{
    "TT_da0663846bbe4d24a4cd4740be22094a": {
        "id": "TT_da0663846bbe4d24a4cd4740be22094a",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "geometry",
        "attributes": {
            "primitive": "plane"
        }
    },
    "TT_8aed08fd2c5240aba7fdd6439d448d92": {
        "id": "TT_8aed08fd2c5240aba7fdd6439d448d92",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "visible",
        "attributes": {
            "visible": true
        }
    },
    "TT_f211d8d342c6432b9b869ce145cbe35b": {
        "id": "TT_f211d8d342c6432b9b869ce145cbe35b",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "position",
        "attributes": {
            "x": "0",
            "y": "0",
            "z": "-5"
        }
    },
    "TT_087fbab8595f4bbcb5e674669e94d0c8": {
        "id": "TT_087fbab8595f4bbcb5e674669e94d0c8",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "rotation",
        "attributes": {
            "x": 0,
            "y": 0,
            "z": 0
        }
    },
    "TT_54c6ccb2fdba4047a84681b137b40de5": {
        "id": "TT_54c6ccb2fdba4047a84681b137b40de5",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "material",
        "attributes": {
            "color": "white",
            "shader": "flat",
            "src": "https://transferthought1382d681d5a54845b17b150d2dc36136235825-staging.s3.us-east-1.amazonaws.com/public/6f34f716-3533-4027-be51-c32943056386.825bc3b9-85eb-4bdd-8773-d806f4fd9294",
            "transparent": true,
            "opacity": "1"
        }
    },
    "TT_1457c5f9bd8e4708ac1950e8f1e9d256": {
        "id": "TT_1457c5f9bd8e4708ac1950e8f1e9d256",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "tt-look-at",
        "attributes": {
            "selector": "#camera"
        }
    },
    "TT_a13209a137ca49168bdbc88c30c8541d": {
        "id": "TT_a13209a137ca49168bdbc88c30c8541d",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "raycastable",
        "attributes": {
            "enabled": "true",
            "objectClass": "raycastable"
        }
    },
    "TT_31b1628c925346ab8a0ffaf9fe0347f5": {
        "id": "TT_31b1628c925346ab8a0ffaf9fe0347f5",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "class",
        "attributes": {
            "value": "prop"
        }
    },
    "TT_21aba12754f2414c87a2899150a7652a": {
        "id": "TT_21aba12754f2414c87a2899150a7652a",
        "type": "component",
        "entityId": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "componentType": "scale",
        "attributes": {
            "x": "15",
            "y": "15",
            "z": "15"
        }
    },
    "TT_f6ba8e23356c4329aa19665d75a41c87": {
        "id": "TT_f6ba8e23356c4329aa19665d75a41c87",
        "name": "Crosshair",
        "type": "entity",
        "parent": null
    }
}`;
            // await this.$store.dispatch('apps/config/addConfigSegment', { parentId: 'scene', segment: JSON.parse(config) });

            // Initialize Networking
            this.EstablishNetworkSubscription();
            this.RegisterSyncVars();
            this.joinSession();

            sceneChannel.subscribe('events', (payload) => {
                if (payload && payload.attributes && payload.attributes.event === 'tick') {
                    this.checkCameraMovement();
                    this.checkToAnimateCamera();
                }
            });
        }
    },
    methods: {
        /// networking start
        async setupWebRTC() {
            const formValues = {
                region: 'us-east-1',
                channelName: 'test',
                clientId: `TT_${UUID().replace(/-/g, '')}`,
                sendVideo: true,
                sendAudio: true,
                openDataChannel: true,
                onConnectionStatusChanged: this.handleConnectionStatusChanged.bind(this),
                onRemoteDataMessage: this.ReceiveDataMessage.bind(this),
                widescreen: true,
                fullscreen: false,
                natTraversalDisabled: false,
                forceTURN: false,
                accessKeyId: 'INSERT_ACCESS_KEY',
                endpoint: null,
                secretAccessKey: 'INSERT_SECRET_KEY',
                sessionToken: null,
                isMaster: this.isPresenter,
            };

            this.canvasCombined = document.createElement('canvas');
            // <video> HTML elements to use to display the local webcam stream and remote stream from the master
            const localView = {}; // document.getElementsByTagName('video')[0];

            const remoteView = {}; // this.$refs.RemoteView;
            try {
                if (this.isPresenter) {
                    this.localStream = await this.getMediaStream();
                    this.connection = await WebRTCService.startMaster(localView, this.localStream, remoteView, formValues);
                } else {
                    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    this.connection = await WebRTCService.startViewer(localView, this.localStream, remoteView, formValues);
                }
            } catch (error) {
                debugger;
            }
        },
        async getMediaStream() {
            try {
                const localStream = this.canvasCombined.captureStream();
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                const audioTracks = audioStream.getAudioTracks();

                localStream.addTrack(audioTracks[0]);
                return localStream;
            } catch (e) {
                console.error('[MASTER] Could not find webcam', e);
                Sentry.captureException(e);
                return null;
            }
        },
        async joinSession() {
            this.joinedSession = true;
            await this.setupWebRTC();
            if (this.isRecording) {
                this.startRecording();
            }
        },
        startRecording() {
            // TODO: local stream should be merged with remote stream for recording
            const options = {
                stream: this.localStream,
                recordingInterval: this.recordingInterval,
                handleChunk: (chunk) => {
                    const datetime = new Date();
                    const timestamp = datetime.getTime();

                    const dateDisplay = datetime.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                    });
                    const key = `${this.app.appId}|${timestamp}|${dateDisplay}`;
                    this.$store.dispatch('assets/createRealityShareRecording', { blob: chunk, key });
                },
            };
            RecordingService.startRecording(options);
        },
        EstablishNetworkSubscription() {
            const observable = Client.Api.subscribe({
                query: gql(Client.Subscriptions.onCreateEvent),
                variables: { subscriptionId: '0' },
            });

            observable.subscribe({
                next: this.ReceiveNetworkUpdate.bind(this), // this.receiveNetworkPosition.bind(this),
                complete: console.log,
                error: console.log,
            });

            /*
            //  Announce That You Joined The Channel
            await Client.Api.mutate({
                mutation: gql(Client.Mutations.createEvent),
                variables: {
                    input: {
                        name: 'UserConnected',
                        data: '{"userId": 1}',
                        subscriptionId: '0',
                        createdAt: new Date(),
                    },
                },
            });
            */
        },
        RegisterSyncVars() {
            // Trigger Updates to SyncVar object when local equivalents of syncVars are updates.
            Object.keys(this.syncVar).forEach((key) => {
                this.$watch(
                    key,
                    () => {
                        // TODO: Add a check to see if this change was done locally or through the network

                        // Presenter should check if syncVar is userInfo
                        // If it is userInfo, do not send a network update, update the plural
                        if (this.isPresenter && key === 'userInfo') {
                            // Update the server array of user infos
                            const currentUserInfo = _.findIndex(this.server_userInfo, { userId: this[key].userId });
                            if (currentUserInfo > -1) {
                                this.server_userInfo[currentUserInfo] = this[key]; // currentUserInfo = newData[key];
                            } else {
                                this.server_userInfo.push(this[key]);
                            }
                        } else if (!this.syncVar[key].dirty) {
                            // if not remotly updated submit network update
                            // if remotely updated apply changes then unset remote update
                            _.extend(this.syncVar[key], { timestamp: new Date() });
                            this.SubmitNetworkUpdate();
                        } else if (!this.syncVar[key].syncInProgress) {
                            // unset remotly update here so that you dont have to set it on local changes
                            // check if lerping is in progress
                            // if lerping do not unset this

                            this.syncVar[key].dirty = false;
                        }
                        // Update Render Layer
                        this.$store.dispatch('apps/state/update', {
                            selector: key,
                            value: this[key],
                        });
                    },
                    { deep: true }
                );
            });
        },
        ReceiveNetworkUpdate(data) {
            if (data.data.onCreateEvent.name && data.data.onCreateEvent.name === 'state|update') {
                const newData = JSON.parse(data.data.onCreateEvent.data);
                // Loop through keys of new update
                Object.keys(newData).forEach((key) => {
                    newData[key].timestamp = new Date(newData[key].timestamp);
                    // Only apply requested change if it's newer than current update
                    if (newData[key].timestamp > this.syncVar[key].timestamp) {
                        this.ApplyNetworkUpdate(key, newData);
                    }
                });
            }
        },
        ReceiveDataMessage(data) {
            if (true) {
                const newData = JSON.parse(data.data);
                // Loop through keys of new update
                Object.keys(newData).forEach((key) => {
                    if (key === 'server_userInfo') {
                        this.ApplyNetworkUpdate(key, newData);
                    } else {
                        newData[key].timestamp = new Date(newData[key].timestamp);
                        // Only apply requested change if it's newer than current update
                        if (newData[key].timestamp > this.syncVar[key].timestamp) {
                            this.ApplyNetworkUpdate(key, newData);
                        }
                    }
                });
            }
        },
        ApplyNetworkUpdate(key, newData) {
            // Currently SyncVars only work at top level
            this.syncVar[key].dirty = true;
            this.syncVar[key].timestamp = newData[key].timestamp;

            // this[key] = newData[key];
            // Check if this syncVar is setup for interpolation, else snap to new update

            // Only update server userInfo array if you are a presenter
            if (this.isPresenter && key === 'userInfo') {
                // This is how we apply updates normally:
                //  this[key] = newData[key];
                // We need to update a subfield of this[key], because this field is unique to each user

                // Oh this is a unique thing, I' not going to touch the field they said
                // I'm going to update the plural field based on their client id
                const currentUserInfo = _.findIndex(this.server_userInfo, { userId: newData[key].userId });
                if (currentUserInfo > -1) {
                    this.server_userInfo[currentUserInfo] = newData[key]; // currentUserInfo = newData[key];
                    // currentUserInfo = newData[key];
                    // this.SubmitNetworkUpdate();

                    // this.server_userInfo = _.map(this.server_userInfo, (item) => {
                    //     if (item.userId === newData[key].userId) {
                    //         return newData[key];
                    //     }
                    //     return item;
                    // });
                } else {
                    this.server_userInfo.push(newData[key]);
                }
            } else if (this.syncVar[key].syncVarSettings && this.syncVar[key].syncVarSettings.interpolate) {
                // TODO: Consider object being updated, interpolation currently assumes a vector3

                // If there is already a tween, cancel it before creating a new one
                if (this.syncVar[key].syncInProgress) {
                    this.syncVar[key].tween.stop();
                }
                this.syncVar[key].syncInProgress = true;
                this.syncVar[key].tween = new TWEEN.Tween(this[key])
                    .to({ x: newData[key].x, y: newData[key].y, z: newData[key].z }, this.lerpSpeed)
                    .onComplete(() => {
                        this.syncVar[key].dirty = true;
                        this[key] = newData[key];
                        this.syncVar[key].syncInProgress = false;
                    })
                    .start();
            } else if (key !== 'userInfo') {
                this[key] = newData[key];
            }
        },
        // eslint-disable-next-line func-names
        SubmitNetworkUpdate: _.throttle(function() {
            const data = _.cloneDeep(_.pick(this, _.keys(this.syncVar)));
            _.forOwn(this.syncVar, (value, key) => {
                _.extend(data[key], value);
            });
            if (this.isPresenter) {
                Object.keys(this.connection.dataChannelByClientId).forEach((clientId) => {
                    try {
                        this.connection.dataChannelByClientId[clientId].send(JSON.stringify(data));
                    } catch (e) {
                        console.error('[MASTER] Send DataChannel: ', e.toString());
                        Sentry.captureException(e);
                    }
                });
            } else if (this.connection.dataChannel) {
                try {
                    delete data.server_userInfo;
                    this.connection.dataChannel.send(JSON.stringify(data));
                } catch (e) {
                    console.error('[VIEWER] Send DataChannel: ', e.toString());
                    Sentry.captureException(e);
                }
            }

            // const data = _.cloneDeep(_.pick(this, _.keys(this.syncVar)));
            // _.forOwn(this.syncVar, (value, key) => {
            //     _.extend(data[key], value);
            // });
            // Client.Api.mutate({
            //     mutation: gql(Client.Mutations.createEvent),
            //     variables: {
            //         input: {
            //             name: 'state|update',
            //             data: JSON.stringify(data),
            //             subscriptionId: '0',
            //             createdAt: new Date(),
            //         },
            //     },
            // });
        }, 10),
        handleConnectionStatusChanged() {
            if (this.isPresenter) {
                const connectedIds = Object.keys(this.connection.peerConnectionByClientId);
                this.connected = _.some(connectedIds, () => {
                    const connection = this.connection.peerConnectionByClientId[connectedIds];
                    return connection.connectionState === 'connected';
                });
            } else {
                // check for peer connected
                this.connected = this.connection.peerConnection.connectionState === 'connected';
            }
        },
        /// Networking end
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
            // Networking
            if (true) {
                // Need to grab world position
                const position = camera.object3D.getWorldPosition();

                this.userInfo.position = new THREE.Vector3(position.x, position.y, position.z);
                this.userInfo.rotation = new THREE.Vector3(rotation.x, rotation.y, rotation.z);

                const crosshairPosition = new THREE.Vector3(0, 0, -80);
                crosshairPosition.applyQuaternion(camera.object3D.quaternion);
                this.userInfo.crosshairPosition = crosshairPosition;
            }
            // } else {
            //     // Need to grab world position
            //     const position = camera.object3D.getWorldPosition();

            //     this.position_guest = new THREE.Vector3(position.x, position.y, position.z);
            //     this.rotation_guest = new THREE.Vector3(rotation.x, rotation.y, rotation.z);

            //     const crosshairPosition = new THREE.Vector3(0, 0, -80);
            //     crosshairPosition.applyQuaternion(camera.object3D.quaternion);
            //     this.crosshairPosition_guest = crosshairPosition;
            // }
            // End Networking
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
