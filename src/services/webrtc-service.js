/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import * as Sentry from '@sentry/vue';
import * as KVSWebRTC from 'amazon-kinesis-video-streams-webrtc';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

loadScript('https://sdk.amazonaws.com/js/aws-sdk-2.585.0.min.js');

async function getSignalingChannel(kinesisVideoClient, channelName = 'default') {
    try {
        const describeSignalingChannelResponse = await kinesisVideoClient
            .describeSignalingChannel({
                ChannelName: channelName,
            })
            .promise();
        return describeSignalingChannelResponse.ChannelInfo;
    } catch (err) {
        console.log('[Create Signaling Channel]', channelName);
        Sentry.captureException(err);
        // create channel first
        await kinesisVideoClient
            .createSignalingChannel({
                ChannelName: channelName,
            })
            .promise();

        const describeSignalingChannelResponse = await kinesisVideoClient
            .describeSignalingChannel({
                ChannelName: channelName,
            })
            .promise();
        return describeSignalingChannelResponse.ChannelInfo;
    }
}

class WebRTCService {
    static async startMaster(localView, localStream, remoteView, formValues) {
        const master = {
            signalingClient: null,
            peerConnectionByClientId: {},
            dataChannelByClientId: {},
            localStream: null,
            remoteStreams: [],
            peerConnectionStatsInterval: null,
        };
        master.localView = localView;
        master.remoteView = remoteView;
        // Create KVS client
        const kinesisVideoClient = new AWS.KinesisVideo({
            region: formValues.region,
            accessKeyId: formValues.accessKeyId,
            secretAccessKey: formValues.secretAccessKey,
            sessionToken: formValues.sessionToken,
            endpoint: formValues.endpoint,
            correctClockSkew: true,
        });

        const signalingChannelInfo = await getSignalingChannel(kinesisVideoClient, formValues.channelName);
        const channelARN = signalingChannelInfo.ChannelARN;
        console.log('[MASTER] Channel ARN: ', channelARN);
        // Get signaling channel endpoints
        const getSignalingChannelEndpointResponse = await kinesisVideoClient
            .getSignalingChannelEndpoint({
                ChannelARN: channelARN,
                SingleMasterChannelEndpointConfiguration: {
                    Protocols: ['WSS', 'HTTPS'],
                    Role: KVSWebRTC.Role.MASTER,
                },
            })
            .promise();
        const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});
        console.log('[MASTER] Endpoints: ', endpointsByProtocol);
        // Create Signaling Client
        master.signalingClient = new KVSWebRTC.SignalingClient({
            channelARN,
            channelEndpoint: endpointsByProtocol.WSS,
            role: KVSWebRTC.Role.MASTER,
            region: formValues.region,
            credentials: {
                accessKeyId: formValues.accessKeyId,
                secretAccessKey: formValues.secretAccessKey,
                sessionToken: formValues.sessionToken,
            },
            systemClockOffset: kinesisVideoClient.config.systemClockOffset,
        });
        // Get ICE server configuration
        const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
            region: formValues.region,
            accessKeyId: formValues.accessKeyId,
            secretAccessKey: formValues.secretAccessKey,
            sessionToken: formValues.sessionToken,
            endpoint: endpointsByProtocol.HTTPS,
            correctClockSkew: true,
        });
        const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
            .getIceServerConfig({
                ChannelARN: channelARN,
            })
            .promise();
        const iceServers = [];
        if (!formValues.natTraversalDisabled && !formValues.forceTURN) {
            iceServers.push({ urls: `stun:stun.kinesisvideo.${formValues.region}.amazonaws.com:443` });
        }
        if (!formValues.natTraversalDisabled) {
            getIceServerConfigResponse.IceServerList.forEach((iceServer) =>
                iceServers.push({
                    urls: iceServer.Uris,
                    username: iceServer.Username,
                    credential: iceServer.Password,
                })
            );
        }
        console.log('[MASTER] ICE servers: ', iceServers);
        const configuration = {
            iceServers,
            iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
        };
        master.localStream = localStream;
        master.signalingClient.on('open', async () => {
            console.log('[MASTER] Connected to signaling service');
        });
        master.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
            console.log(`[MASTER] Received SDP offer from client: ${remoteClientId}`);
            // Create a new peer connection using the offer from the given client
            const peerConnection = new RTCPeerConnection(configuration);
            master.peerConnectionByClientId[remoteClientId] = peerConnection;
            if (formValues.openDataChannel) {
                master.dataChannelByClientId[remoteClientId] = peerConnection.createDataChannel('kvsDataChannel');
                peerConnection.ondatachannel = (event) => {
                    event.channel.onmessage = (e) => {
                        console.log(e);
                        formValues.onRemoteDataMessage(e);
                    };
                };
            }
            // Poll for connection stats
            // if (!master.peerConnectionStatsInterval) {
            //     master.peerConnectionStatsInterval = setInterval(() => peerConnection.getStats().then(onStatsReport), 1000);
            // }
            // Send any ICE candidates to the other peer
            peerConnection.addEventListener('icecandidate', ({ candidate }) => {
                if (candidate) {
                    console.log(`[MASTER] Generated ICE candidate for client: ${remoteClientId}`);
                    // When trickle ICE is enabled, send the ICE candidates as they are generated.
                    console.log(`[MASTER] Sending ICE candidate to client: ${remoteClientId}`);
                    master.signalingClient.sendIceCandidate(candidate, remoteClientId);
                } else {
                    console.log(`[MASTER] All ICE candidates have been generated for client: ${remoteClientId}`);
                }
            });

            peerConnection.addEventListener('connectionstatechange', (event) => {
                console.log(`[MASTER] peer connection state chaged: ${remoteClientId}`);
                formValues.onConnectionStatusChanged(event);
            });
            // As remote tracks are received, add them to the remote view
            peerConnection.addEventListener('track', (event) => {
                console.log(`[MASTER] Received remote track from client: ${remoteClientId}`);
                if (remoteView.srcObject) {
                    return;
                }
                // eslint-disable-next-line prefer-destructuring
                remoteView.srcObject = event.streams[0];
                remoteView.play();
            });
            // If there's no video/audio, master.localStream will be null. So, we should skip adding the tracks from it.
            if (master.localStream) {
                // master.localStream.getTracks().forEach((track) => peerConnection.addTrack(track, master.localStream));

                master.localStream.getTracks().forEach((track) => {
                    track.applyConstraints({ frameRate: 120, width: 1920, height: 1080, aspectRatio: 1.777777778 });
                    peerConnection.addTrack(track, master.localStream);
                });
            }
            await peerConnection.setRemoteDescription(offer);
            // Create an SDP answer to send back to the client
            console.log(`[MASTER] Creating SDP answer for client: ${remoteClientId}`);
            await peerConnection.setLocalDescription(
                await peerConnection.createAnswer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                })
            );
            console.log(`[MASTER] Sending SDP answer to client: ${remoteClientId}`);
            master.signalingClient.sendSdpAnswer(peerConnection.localDescription, remoteClientId);
            console.log(`[MASTER] Generating ICE candidates for client: ${remoteClientId}`);
        });
        master.signalingClient.on('iceCandidate', async (candidate, remoteClientId) => {
            console.log(`[MASTER] Received ICE candidate from client: ${remoteClientId}`);
            // Add the ICE candidate received from the client to the peer connection
            const peerConnection = master.peerConnectionByClientId[remoteClientId];
            peerConnection.addIceCandidate(candidate);
        });
        master.signalingClient.on('close', () => {
            console.log('[MASTER] Disconnected from signaling channel');
        });
        master.signalingClient.on('error', () => {
            console.error('[MASTER] Signaling client error');
        });
        console.log('[MASTER] Starting master connection');
        master.signalingClient.open();
        return master;
    }

    static async startViewer(localView, localStream, remoteView, formValues) {
        const viewer = {};
        viewer.localView = localView;
        viewer.remoteView = remoteView;
        // Create KVS client
        const kinesisVideoClient = new AWS.KinesisVideo({
            region: formValues.region,
            accessKeyId: formValues.accessKeyId,
            secretAccessKey: formValues.secretAccessKey,
            sessionToken: formValues.sessionToken,
            endpoint: formValues.endpoint,
            correctClockSkew: true,
        });
        // Get signaling channel ARN
        const signalingChannelInfo = await getSignalingChannel(kinesisVideoClient, formValues.channelName);
        const channelARN = signalingChannelInfo.ChannelARN;
        console.log('[VIEWER] Channel ARN: ', channelARN);
        // Get signaling channel endpoints
        const getSignalingChannelEndpointResponse = await kinesisVideoClient
            .getSignalingChannelEndpoint({
                ChannelARN: channelARN,
                SingleMasterChannelEndpointConfiguration: {
                    Protocols: ['WSS', 'HTTPS'],
                    Role: KVSWebRTC.Role.VIEWER,
                },
            })
            .promise();
        const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});
        console.log('[VIEWER] Endpoints: ', endpointsByProtocol);
        const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
            region: formValues.region,
            accessKeyId: formValues.accessKeyId,
            secretAccessKey: formValues.secretAccessKey,
            sessionToken: formValues.sessionToken,
            endpoint: endpointsByProtocol.HTTPS,
            correctClockSkew: true,
        });
        // Get ICE server configuration
        const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
            .getIceServerConfig({
                ChannelARN: channelARN,
            })
            .promise();
        const iceServers = [];
        if (!formValues.natTraversalDisabled && !formValues.forceTURN) {
            iceServers.push({ urls: `stun:stun.kinesisvideo.${formValues.region}.amazonaws.com:443` });
        }
        if (!formValues.natTraversalDisabled) {
            getIceServerConfigResponse.IceServerList.forEach((iceServer) =>
                iceServers.push({
                    urls: iceServer.Uris,
                    username: iceServer.Username,
                    credential: iceServer.Password,
                })
            );
        }
        console.log('[VIEWER] ICE servers: ', iceServers);
        // Create Signaling Client
        const configuration = {
            iceServers,
            iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
        };

        async function initPeerConnection() {
            // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
            // If no video/audio needed, no need to request for the sources.
            // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
            try {
                viewer.localStream = localStream; // await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                viewer.localStream.getTracks().forEach((track) => {
                    track.applyConstraints({ frameRate: 10 });
                    viewer.peerConnection.addTrack(track, viewer.localStream);
                });
            } catch (e) {
                console.error('[VIEWER] Could not find webcam');
                Sentry.captureException(e);
                return;
            }
            // Create an SDP offer to send to the master
            console.log('[VIEWER] Creating SDP offer');
            await viewer.peerConnection.setLocalDescription(
                await viewer.peerConnection.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                })
            );
            console.log('[VIEWER] Sending SDP offer');
            viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
            console.log('[VIEWER] Generating ICE candidates');
        }
        function initSignalingClient() {
            viewer.signalingClient = new KVSWebRTC.SignalingClient({
                channelARN,
                channelEndpoint: endpointsByProtocol.WSS,
                clientId: formValues.clientId,
                role: KVSWebRTC.Role.VIEWER,
                region: formValues.region,
                credentials: {
                    accessKeyId: formValues.accessKeyId,
                    secretAccessKey: formValues.secretAccessKey,
                    sessionToken: formValues.sessionToken,
                },
                systemClockOffset: kinesisVideoClient.config.systemClockOffset,
            });

            viewer.signalingClient.on('open', async () => {
                console.log('[VIEWER] Connected to signaling service');
                initPeerConnection();
            });
            viewer.signalingClient.on('sdpAnswer', async (answer) => {
                // Add the SDP answer to the peer connection
                console.log('[VIEWER] Received SDP answer');
                await viewer.peerConnection.setRemoteDescription(answer);
            });
            viewer.signalingClient.on('iceCandidate', (candidate) => {
                // Add the ICE candidate received from the MASTER to the peer connection
                console.log('[VIEWER] Received ICE candidate');
                viewer.peerConnection.addIceCandidate(candidate);
            });
            viewer.signalingClient.on('close', () => {
                console.log('[VIEWER] Disconnected from signaling channel');
            });
            viewer.signalingClient.on('error', (error) => {
                console.error('[VIEWER] Signaling client error: ', error);
            });
            console.log('[VIEWER] Starting viewer connection');
            viewer.signalingClient.open();
        }

        function newPeerConnection() {
            viewer.peerConnection = new RTCPeerConnection(configuration);
            viewer.dataChannel = viewer.peerConnection.createDataChannel('kvsDataChannel');
            viewer.peerConnection.ondatachannel = (event) => {
                event.channel.onmessage = (e) => {
                    formValues.onRemoteDataMessage(e);
                };
            };
            // Send any ICE candidates to the other peer
            viewer.peerConnection.addEventListener('connectionstatechange', (event) => {
                console.log('[VIEWER] peer connection state chaged: ', event, viewer.peerConnection.connectionState);
                if (viewer.peerConnection.connectionState === 'disconnected') {
                    newPeerConnection();
                    initPeerConnection();
                    remoteView.srcObject = null;
                }
                formValues.onConnectionStatusChanged(event);
            });

            // Send any ICE candidates to the other peer
            viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
                if (candidate) {
                    console.log('[VIEWER] Generated ICE candidate');
                    console.log('[VIEWER] Sending ICE candidate');
                    viewer.signalingClient.sendIceCandidate(candidate);
                } else {
                    console.log('[VIEWER] All ICE candidates have been generated');
                }
            });
            // As remote tracks are received, add them to the remote view
            viewer.peerConnection.addEventListener('track', (event) => {
                console.log('[VIEWER] Received remote track');
                if (remoteView.srcObject) {
                    return;
                }
                // eslint-disable-next-line prefer-destructuring
                viewer.remoteStream = event.streams[0];
                remoteView.srcObject = viewer.remoteStream;
                remoteView.play();
            });
        }
        initSignalingClient();
        newPeerConnection();
        // Poll for connection stats
        // viewer.peerConnectionStatsInterval = setInterval(() => viewer.peerConnection.getStats().then(onStatsReport), 1000);
        return viewer;
    }
}

export default WebRTCService;
