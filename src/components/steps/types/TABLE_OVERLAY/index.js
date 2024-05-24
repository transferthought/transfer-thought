export default {
    icon: 'mdi-table',
    type: 'TABLE_OVERLAY',
    category: 'OVERLAY',
    display: 'Table Overlay',
    defaults: {
        autoProgressType: 'pause',
    },
    settings: {
        showAutoProgressOptions: true,
    },
    isEmpty(stepData) {
        return !stepData.getFieldsAction && !stepData.getValuesAction;
    },
};
