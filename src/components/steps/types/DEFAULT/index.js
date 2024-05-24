export default {
    icon: 'mdi-format-title',
    type: 'DEFAULT',
    category: 'OVERLAY',
    display: 'Default',
    defaults: {
        autoProgressType: 'transcript',
        timeoutSeconds: 3,
    },
    settings: {
        showAutoProgressOptions: true,
    },
    getTextFromResponseData(stepData, responseData) {
        return '';
    },
};
