export default {
    icon: 'mdi-application-brackets',
    type: 'EMBED_OVERLAY',
    category: 'OVERLAY',
    display: 'HTML Overlay',
    defaults: {
        autoProgressType: 'pause',
    },
    settings: {
        showAutoProgressOptions: true,
    },
    isEmpty(stepData) {
        return !stepData.src;
    },
};
