<template>
    <div class="video-list">
        <div
            v-for="item in videoList"
            :key="item.id"
            :video="item"
            class="video-item"
        >
            <video
                :id="item.id"
                ref="videos"
                controls
                autoplay
                playsinline
                :height="cameraHeight"
                :muted="item.muted"
            />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import RTCMultiConnection from 'rtcmulticonnection';

require('adapterjs');

export default {
    name: 'vue-webrtc',
    data() {
        return {
            rtcmConnection: null,
            localVideo: null,
            videoList: [],
            canvas: null,
        };
    },
    props: {
        roomId: {
            type: String,
            default: 'public-room',
        },
        socketURL: {
            type: String,
            default: 'https://rtcmulticonnection.herokuapp.com:443/',
        },
        cameraHeight: {
            type: [Number, String],
            default: 160,
        },
        autoplay: {
            type: Boolean,
            default: true,
        },
        screenshotFormat: {
            type: String,
            default: 'image/jpeg',
        },
        enableAudio: {
            type: Boolean,
            default: true,
        },
        enableVideo: {
            type: Boolean,
            default: true,
        },
        enableLogs: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
    },
    mounted() {
        const that = this;
        this.rtcmConnection = new RTCMultiConnection();
        this.rtcmConnection.socketURL = this.socketURL;
        this.rtcmConnection.autoCreateMediaElement = false;
        this.rtcmConnection.enableLogs = this.enableLogs;
        this.rtcmConnection.session = {
            audio: this.enableAudio,
            video: this.enableVideo,
        };
        this.rtcmConnection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: this.enableAudio,
            OfferToReceiveVideo: this.enableVideo,
        };
        this.rtcmConnection.onstream = function (stream) {
            const found = that.videoList.find(video => video.id === stream.streamid);
            if (found === undefined) {
                const video = {
                    id: stream.streamid,
                    muted: stream.type === 'local',
                };
                that.videoList.push(video);
                if (stream.type === 'local') {
                    that.localVideo = video;
                }
            }
            setTimeout(() => {
                for (let i = 0, len = that.$refs.videos.length; i < len; i++) {
                    if (that.$refs.videos[i].id === stream.streamid) {
                        that.$refs.videos[i].srcObject = stream.stream;
                        break;
                    }
                }
            }, 1000);

            that.$emit('joined-room', stream.streamid);
        };
        this.rtcmConnection.onstreamended = function (stream) {
            const newList = [];
            that.videoList.forEach((item) => {
                if (item.id !== stream.streamid) {
                    newList.push(item);
                }
            });
            that.videoList = newList;
            that.$emit('left-room', stream.streamid);
        };
    },
    methods: {
        join() {
            const that = this;
            this.rtcmConnection.openOrJoin(this.roomId, (isRoomExist, roomid) => {
                if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
                    that.$emit('opened-room', roomid);
                }
            });
        },
        leave() {
            this.rtcmConnection.attachStreams.forEach((localStream) => {
                localStream.stop();
            });
            this.videoList = [];
        },
        capture() {
            return this.getCanvas().toDataURL(this.screenshotFormat);
        },
        getCanvas() {
            const video = this.getCurrentVideo();
            if (video !== null && !this.ctx) {
                const canvas = document.createElement('canvas');
                canvas.height = video.clientHeight;
                canvas.width = video.clientWidth;
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
            }
            const { ctx, canvas } = this;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas;
        },
        getCurrentVideo() {
            if (this.localVideo === null) {
                return null;
            }
            for (let i = 0, len = this.$refs.videos.length; i < len; i++) {
                if (this.$refs.videos[i].id === this.localVideo.id) { return this.$refs.videos[i]; }
            }
            return null;
        },
        shareScreen() {
            const that = this;
            if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
                function addStreamStopListener(stream, callback) {
                    let streamEndedEvent = 'ended';
                    if ('oninactive' in stream) {
                        streamEndedEvent = 'inactive';
                    }
                    stream.addEventListener(streamEndedEvent, () => {
                        callback();
                        callback = function () {};
                    }, false);
                }
                function onGettingSteam(stream) {
                    that.rtcmConnection.addStream(stream);
                    that.$emit('share-started', stream.streamid);
                    addStreamStopListener(stream, () => {
                        that.rtcmConnection.removeStream(stream.streamid);
                        that.$emit('share-stopped', stream.streamid);
                    });
                }
                function getDisplayMediaError(error) {
                    console.log(`Media error: ${JSON.stringify(error)}`);
                }
                if (navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then((stream) => {
                        onGettingSteam(stream);
                    }, getDisplayMediaError).catch(getDisplayMediaError);
                } else if (navigator.getDisplayMedia) {
                    navigator.getDisplayMedia({ video: true }).then((stream) => {
                        onGettingSteam(stream);
                    }, getDisplayMediaError).catch(getDisplayMediaError);
                }
            }
        },
    },
};
</script>
<style scoped>
  .video-list {
    background: whitesmoke;
    height: auto;
  }
    .video-list div {
      padding: 0px;
    }
  .video-item {
    transform: rotateY(180deg);
    background: #c5c4c4;
    display: inline-block;
  }
</style>
