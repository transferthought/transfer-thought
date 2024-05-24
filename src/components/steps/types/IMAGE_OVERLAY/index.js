export default {
    icon: 'mdi-image',
    type: 'IMAGE_OVERLAY',
    category: 'OVERLAY',
    display: 'Image Overlay',
    defaults: {
        autoProgressType: 'transcript',
    },
    settings: {
        showAutoProgressOptions: true,
    },
    isEmpty(stepData) {
        return !stepData.src;
    },
};
