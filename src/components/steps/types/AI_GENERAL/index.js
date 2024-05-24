export default {
    icon: 'mdi-auto-fix',
    type: 'AI_GENERAL',
    category: 'OTHER',
    display: 'AI General',
    defaults: {
        autoProgressType: 'pause',
        timeoutSeconds: 3,
    },
    settings: {
        showAutoProgressOptions: false,
    },
    isEmpty(stepData) {
        return !stepData.promptPlaceholder || !stepData.systemMessage;
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
