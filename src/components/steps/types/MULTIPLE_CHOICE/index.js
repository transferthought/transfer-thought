export default {
    icon: 'mdi-format-list-checkbox',
    type: 'MULTIPLE_CHOICE',
    category: 'ASSESSMENT',
    display: 'Multiple Choice',
    defaults: {
        autoProgressType: 'pause',
    },
    settings: {},
    isEmpty(stepData) {
        return !stepData.options;
    },
};
