export default {
    icon: 'mdi-head-question-outline',
    type: 'AI_COACH',
    category: 'OTHER',
    display: 'AI Coach Q&A',
    defaults: {
        autoProgressType: 'pause',
        timeoutSeconds: 3,
    },
    settings: {
        showAutoProgressOptions: false,
    },
    isEmpty(stepData) {
        return !stepData.promptPlaceholder || !stepData.additionalInfo;
    },
    getTextFromResponseData(stepData, responseData) {
        if (responseData && responseData.values && responseData.values[stepData.name]) {
            let result = '';

            responseData.values[stepData.name].forEach((item) => {
                if (item.role === 'user') {
                    result += 'User\n' + item.content + '\n\n';
                } else if (item.role === 'assistant') {
                    result += 'System\n' + item.content + '\n\n';
                }
            });
            // use quotes here to make sure everything is captured on the same column of a csv export
            return `"${result}"`;
        }
        return '';
    },
};
