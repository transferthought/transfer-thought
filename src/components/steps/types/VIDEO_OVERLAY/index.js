export default {
    icon: 'mdi-video',
    type: 'VIDEO_OVERLAY',
    category: 'OVERLAY',
    display: 'Video Overlay',
    defaults: {
        autoProgressType: 'pause',
    },
    settings: {},
    isEmpty(stepData) {
        return !stepData.src;
    },
};
