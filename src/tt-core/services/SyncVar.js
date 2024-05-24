import Client from '@/tt-api';
import gql from 'graphql-tag';
import WebRTCService from '@/services/webrtc-service';
import * as UUID from 'uuid/v4';

import postal from 'postal';
const sceneChannel = postal.channel('scene');

export default {
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
                //     timestamp: 0,
                //     syncVarSettings: { interpolate: false },
                // },
                server_props: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: false },
                },
            },
            userInfo: {
                id: `TT_${UUID().replace(/-/g, '')}`,
                userId: `TT_${UUID().replace(/-/g, '')}`,
                userName: 'Trainee',
                crosshair: {
                    position: {
                        x: 0,
                        y: 0,
                        z: -80,
                        timestamp: 0,
                    },
                    state: {
                        visible: true,
                        clicked: true,
                    },
                    timestamp: 0,
                },
                position: {
                    x: 0,
                    y: 0,
                    z: -5,
                    timestamp: 0,
                },
                rotation: { x: 0, y: 0, z: 0 },
                rightHand: {
                    position: {
                        x: 0,
                        y: 0,
                        z: -5,
                        timestamp: 0,
                    },
                    rotation: { x: 0, y: 0, z: 0 },
                    state: 'open',
                },
            },
            server_props: [],
            server_userInfo: [],
            // currentStepIndex: { value: 0 },
            networkSettings: { syncRate: 500 },
            lerpSpeed: 50,
        };
    },
    computed: {
        isPresenter() {
            return Boolean(this.$route.query.presenter);
        },
    },
    async mounted() {
        // // Initialize Networking
        // this.EstablishNetworkSubscription();
        // this.RegisterSyncVars();
        // this.joinSession();

        // sceneChannel.subscribe('events', (payload) => {
        //     if (payload && payload.attributes && payload.attributes.event === 'tick') {
        //         this.onTick();
        //     }
        // });

        if (this.$route.query.name) {
            this.userInfo.userName = this.$route.query.name;
        }
    },
    methods: {
        initNetworking() {
            //const config = ``;

            //this.$store.dispatch('apps/config/addConfigSegment', { parentId: 'scene', segment: JSON.parse(config) });

            // Initialize Networking
            this.EstablishNetworkSubscription();
            this.RegisterSyncVars();
            this.joinSession();

            sceneChannel.subscribe('events', (payload) => {
                if (payload && payload.attributes && payload.attributes.event === 'tick') {
                    this.onTick();
                }
            });
        },
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
                console.log(error);
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
        onTick() {
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
                this.userInfo.crosshair.position = crosshairPosition;

                const rightHand = document.getElementById('rightHand');
                const rightHandPosition = rightHand.getAttribute('position');
                const handRotation = rightHand.getAttribute('rotation');

                this.userInfo.rightHand.position = new THREE.Vector3(rightHandPosition.x, rightHandPosition.y, rightHandPosition.z);
                this.userInfo.rightHand.rotation = new THREE.Vector3(handRotation.x, handRotation.y, handRotation.z);

                this.userInfo.rightHand.state = document.getElementById('rightHand').components['hand-controls-plus'].gesture;

                //Only server updates props
                if (this.isPresenter && this.server_props) {
                    for (const newProp of this.server_props) {
                        newProp.position = document.getElementById(newProp.id).object3D.getWorldPosition();
                        newProp.rotation = document.getElementById(newProp.id).getAttribute('rotation');
                    }
                }

                if (this.connection != null) {
                    this.currentStepIndex.value = this.$store.state.steps.currentStepIndex;
                }
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
            //Set self
            this.$store.dispatch('apps/state/update', {
                selector: 'myUserId',
                value: this.userInfo.id,
            });

            //Register all networked props from the app state so they begin receiving updates
            if (this.isPresenter) {
                if (this.$store.state.apps.state.state.server_props) {
                    for (const newProp of this.$store.state.apps.state.state.server_props) {
                        this.server_props.push(newProp);
                    }
                }
            } else {
                //set mass to zero for all remote props
                if (this.$store.state.apps.state.state.server_props) {
                    for (const newProp of this.$store.state.apps.state.state.server_props) {
                        this.server_props.push(newProp);
                        document.getElementById(newProp.id).removeAttribute('body');
                        document.getElementById(newProp.id).removeAttribute('velocity');
                    }
                }
            }

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
                        if (key == 'currentStepIndex') {
                            this.$store.dispatch('steps/setCurrentStepIndex', this[key].value);
                        } else {
                            this.$store.dispatch('apps/state/update', {
                                selector: key,
                                value: this[key],
                            });
                        }
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
                    if (key === 'server_userInfo' || key === 'server_props') {
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
                    delete data.server_props;
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
    },
};
