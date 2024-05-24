const AvailableSteps = [
    'NARRATION_ONLY',
    'TITLE_OVERLAY',
    'IMAGE_OVERLAY',
    'CLIPBOARD_OVERLAY',
    // 'VIDEO_OVERLAY',
    // 'LINK_LAUNCHER',
    'TABLE_OVERLAY',
    'EMBED_OVERLAY',
    'TEXT_INPUT',
    'HOTSPOTS',
    'FLAG',
    'MULTIPLE_CHOICE',
    'PICTURE_CHOICE',
    'SET_ENVIRONMENT',
    'GOTO',
    'AI_COACH',
    'AI_GENERAL',
    'ADVANCED_INTERACTION',
];

export const getAvailableStepDefinitions = async () => {
    const availableStepPromises = AvailableSteps.map(async (type) => {
        return await getStepDefinition(type);
    });
    const availableStep = await Promise.all(availableStepPromises);
    return availableStep;
};

export const getStepDefinition = async (type) => {
    try {
        const definition = await import(/* webpackChunkName: "StepDefinitions" */ `@/components/steps/types/${type}`);
        return definition.default;
    } catch (err) {
        console.warn('STEP DEFINTION NOT FOUND', err);
    }
};

export const getStepEditor = async (type) => {
    try {
        const editor = await import(/* webpackChunkName: "StepEditors" */ `@/components/steps/types/${type}/Editor.vue`);
        return editor.default;
    } catch (err) {
        console.warn('STEP EDITOR NOT FOUND, RETURNING DEFAULT', err);
        const editor = await import(`@/components/steps/types/DEFAULT/Editor.vue`);
        return editor.default;
    }
};
export const getStepOptionsEditor = async (type) => {
    try {
        const editor = await import(/* webpackChunkName: "StepEditors" */ `@/components/steps/types/${type}/OptionsEditor.vue`);
        return editor.default;
    } catch (err) {
        console.warn('STEP OPTION EDITOR NOT FOUND, RETURNING DEFAULT', err);
        const editor = await import(`@/components/steps/types/DEFAULT/OptionsEditor.vue`);
        return editor.default;
    }
};
export const getStepViewer = async (type) => {
    try {
        const view = await import(/* webpackChunkName: "StepViewers" */ `@/components/steps/types/${type}/View.vue`);
        return view.default;
    } catch (err) {
        console.warn('STEP View NOT FOUND, RETURNING DEFAULT', err);
        const view = await import(`@/components/steps/types/DEFAULT/View.vue`);
        return view.default;
    }
};
