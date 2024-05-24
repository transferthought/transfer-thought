/* eslint-disable import/prefer-default-export */

import Client from '@/tt-api';
export const getStepTypeData = (step) => ({
    title: step.name,
});

export function getDefaultTexture(modelType) {
    if (modelType === 'female') {
        return `${Client.getAssetBase()}/Transfer_Thought_Media/avatars/females/textures/Female (19).jpg`;
    }
    return `${Client.getAssetBase()}/Transfer_Thought_Media/avatars/males/textures/Male (1).png`;
}

export function getModelType(src) {
    return _.includes(src, 'Female') ? 'female' : 'male';
}
