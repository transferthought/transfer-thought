export default {
    icon: 'mdi-image-multiple',
    type: 'PICTURE_CHOICE',
    category: 'ASSESSMENT',
    display: 'Picture Choice',
    defaults: {
        autoProgressType: 'pause',
    },
    settings: {},
    isEmpty(stepData) {
        return !stepData.options;
    },
};
