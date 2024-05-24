/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import * as UUID from 'uuid/v4';
import * as Sentry from '@sentry/vue';
import posthog from 'posthog-js';

import { getStepDefinition } from '@/components/steps/types';
import { getStepTypeData } from './utils';
let environmentTransitionTimeout = null;

// let currentStepRunner;

export const setCurrentStepIndex = async ({ commit, rootState, state, dispatch }, newStepIndex) => {
    console.log('setCurrentStepIndex', newStepIndex);
    const { steps, currentStep, currentEnvironment } = rootState.apps.state.state;
    const clampedNewStepIndex = _.min([steps ? steps.length - 1 : 0, newStepIndex]);
    const { currentStepIndex } = state;

    commit('setCurrentStepIndex', clampedNewStepIndex);

    // send of exit

    const newStep = steps[clampedNewStepIndex];
    const newEnvironment = _.findLast(steps, { type: 'SET_ENVIRONMENT' }, clampedNewStepIndex);
    const previousStep = _.clone(currentStep);
    const previousEnvironment = _.clone(currentEnvironment);

    const payload = {
        newStep,
        newEnvironment,
    };

    // only handle exit if this is before step enter
    if (currentStepIndex !== null) {
        _.extend(payload, { previousStep, previousEnvironment });
        console.log('Before BeforeExitStep', Date.now());
        await dispatch('BeforeExitStep', payload);
        console.log('After BeforeExitStep', Date.now());
    }

    await dispatch('BeforeSetStep', payload);
    await dispatch('SetStep', payload);
    setTimeout(async () => {
        await dispatch('BeforeRunStep', payload);
    }, 1000);
};

export const addStep = ({ dispatch, state, rootState }, payload = { step: {} }) => {
    const { appId, name } = rootState.apps;
    const { steps } = rootState.apps.state.state;
    const { step, index } = payload;
    const newStep = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        name: step.name || `New Step ${steps.length + 1}`,
        type: step.type || 'TITLE_OVERLAY',
    };
    newStep.data = step.data || getStepTypeData(newStep);
    if (index && index > 0) {
        steps.splice(index, 0, newStep);
    } else {
        steps.push(newStep);
    }
    dispatch('apps/state/update', { selector: 'steps', value: [...steps] }, { root: true });

    posthog.capture('steps.created', {
        type: newStep.type,
        appData: { appId, name },
    });
    return newStep;
};

export const deleteStep = ({ dispatch, rootState }, stepId) => {
    const { steps } = rootState.apps.state.state;
    const newSteps = steps.filter((step) => step.id !== stepId);
    dispatch('apps/state/update', { selector: 'steps', value: newSteps }, { root: true });
};

export const cloneStep = ({ rootState }, stepId) => {
    const { steps } = rootState.apps.state.state;
    const step = _.find(steps, { id: stepId });
    const newStep = _.cloneDeep(step);
    newStep.id = `TT_${UUID().replace(/-/g, '')}`;
    newStep.name += ' (clone)';
    return newStep;
};

export const updateStepById = async ({ dispatch, rootState }, payload) => {
    const { steps } = rootState.apps.state.state;
    const { id, newData } = payload;
    const newStepPromises = steps.map(async (step, index) => {
        if (step.id === id) {
            const newStep = _.extend({}, steps[index], newData);
            // link the title with the name
            newStep.data.title = newStep.name;

            // check if the type is changing
            if (newData && newData.type) {
                const stepDefinition = await getStepDefinition(newStep.type);
                _.extend(newStep.data, stepDefinition.defaults);
            }

            // check if newData is creating advanced interaction without a customActionId
            if (newData && newData.type === 'ADVANCED_INTERACTION' && !newStep.data.customActionId) {
                const newAction = await dispatch('apps/actions/newAction', undefined, { root: true });
                newStep.data.customActionId = newAction.id;
            }
            return newStep;
        }
        return step;
    });

    const newSteps = await Promise.all(newStepPromises);
    dispatch('apps/state/update', { selector: 'steps', value: newSteps }, { root: true });
    dispatch('shouldResetCurrentStep', { id });
};

export const updateStepDataById = async ({ dispatch, rootState }, payload) => {
    const { steps } = rootState.apps.state.state;
    const { id, newData } = payload;
    const newSteps = steps.map((step, index) => {
        if (step.id === id) {
            const newStep = _.clone(steps[index]);
            _.extend(newStep.data, newData);
            // link the name with the title
            if (newStep.data.title) {
                newStep.name = newStep.data.title;
            }
            return newStep;
        }
        return step;
    });

    dispatch('apps/state/update', { selector: 'steps', value: newSteps }, { root: true });
    dispatch('shouldResetCurrentStep', { id });
};
export const updateSteps = () => {};

export const reorder = ({ dispatch, rootState }, { oldIndex, newIndex }) => {
    const { steps } = rootState.apps.state.state;
    const newSteps = [...steps];
    const startIndex = oldIndex < 0 ? newSteps.length + oldIndex : oldIndex;

    if (startIndex >= 0 && startIndex < newSteps.length) {
        const endIndex = newIndex < 0 ? newSteps.length + newIndex : newIndex;

        const [item] = newSteps.splice(oldIndex, 1);
        newSteps.splice(endIndex, 0, item);
        dispatch('apps/state/update', { selector: 'steps', value: newSteps }, { root: true });
    }
};

export const init = async ({ dispatch, rootState }) => {
    dispatch('apps/state/update', { selector: 'currentStep', value: {} }, { root: true });
    dispatch('apps/state/update', { selector: 'currentEnvironment', value: {} }, { root: true });
    dispatch('setCurrentStepIndex', 0);

    const { styles } = rootState.apps.state.state;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'custom-styles';

    head.appendChild(style);

    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
};

// STEP LIFECYCLE
export const BeforeExitStep = async ({ dispatch }, payload) => {
    console.log('BeforeExitStep', payload);
    try {
        const { newEnvironment, previousEnvironment } = payload;
        if (previousEnvironment && previousEnvironment.data) {
            if (newEnvironment.id !== previousEnvironment.id && newEnvironment.data.src !== previousEnvironment.data.src) {
                console.log('environmentTransition started', Date.now());
                await dispatch('environmentTransition', { from: 0, to: 1 });
                console.log('environmentTransition ended', Date.now());
            }
        }
    } catch (e) {
        Sentry.captureException(e);
    }
};
// TODO: change camera to run before run stepo
// Before Set Step
// this action is for running anything before we set the current step and current environment
// That is anything you want to run before the view is changed, do it here
export const BeforeSetStep = async ({ dispatch }, payload) => {
    try {
        console.log('BeforeSetStep');
        const { newEnvironment, previousEnvironment } = payload;

        // if previous environment is defined
        if (previousEnvironment && previousEnvironment.data) {
            // DO NOT CHANGE CAMERA IF ENVIRONMENT HAS NOT CHANGED
            if (newEnvironment.id !== previousEnvironment.id) {
                if (newEnvironment.data.src === previousEnvironment.data.src) {
                    dispatch('adjustCameraToEnvironment', {
                        newEnvironment,
                        lerp: true,
                    });
                } else {
                    dispatch('adjustCameraToEnvironment', { newEnvironment });
                }
            }
        } else {
            dispatch('adjustCameraToEnvironment', { newEnvironment });
        }
    } catch (e) {
        Sentry.captureException(e);
    }
};

// When new step index changes we need to make sure to change the current environment and current step data for the TT application
// this is used for rendering hot spots, props, current environment photos,...
export const SetStep = ({ dispatch, rootState }, payload) => {
    console.log('SetStep');
    const { newStep, newEnvironment, previousEnvironment } = payload;
    dispatch('resetCurrentStep', { newStep });
};

export const BeforeRunStep = async ({ dispatch }, payload) => {
    try {
        console.log('SetStep');
        // currentStepRunner.beforeRun();
        const { newEnvironment, previousEnvironment } = payload;

        // if previous environment is defined
        if (previousEnvironment && previousEnvironment.data) {
            // if environment has changed
            if (newEnvironment.id !== previousEnvironment.id) {
                // environment has changed but source is the same
                if (newEnvironment.data.src !== previousEnvironment.data.src) {
                    await dispatch('environmentTransition', { from: 1, to: 0 });
                }
            }
        }
    } catch (e) {
        Sentry.captureException(e);
    }
};

// CHECK TO SEE IF WE SHOULD RESET THE CURRENT STEP
// make sure to update the step and environment any type the current step is updated in the editor
export const shouldResetCurrentStep = ({ dispatch, getters, state }, payload) => {
    const { id } = payload;
    const currentStep = getters.getCurrentStep();
    if (currentStep.id === id) {
        dispatch('resetCurrentStep', { newStep: currentStep });
    }
};

export const resetCurrentStep = ({ dispatch, getters, state }, payload) => {
    const { newStep } = payload;
    dispatch('apps/state/update', { selector: 'currentStep', value: newStep }, { root: true });
    dispatch('resetCurrentEnvironment');
};
// CHECK TO SEE IF WE SHOULD RESET THE CURRENT ENVIRONMENT
// make sure to update the step and environment any type the current step is updated in the editor
export const shouldResetCurrentEnvironment = ({ dispatch, getters, state }, payload) => {
    const { id } = payload;
    const currentEnvironment = getters.getCurrentEnvironment();
    if (currentEnvironment.id === id) {
        dispatch('resetCurrentEnvironment', { newEnvironment: currentEnvironment });
    }
};

// TODO:
// USE THE CURRENT ENVIRONMENT AS A BASE
// STARTING FROM THE CURRENT ENVIRONEMNT INDEX, find the next update envuronment steps and
// APPLY Removals
// Apply Updates
// Apply Additions
// Continue from that index

// make sure to update the step and environment any type the current step is updated in the editor
export const resetCurrentEnvironment = ({ dispatch, getters, state }, payload) => {
    const { currentStepIndex } = state;
    const steps = getters.getCurrentSteps();
    const currentEnvironment = getters.getCurrentEnvironment();
    const clampedCurrentStepIndex = _.min([steps ? steps.length - 1 : 0, currentStepIndex]);
    const currentEnvironmentIndex = _.findLastIndex(steps, { type: 'SET_ENVIRONMENT' }, clampedCurrentStepIndex);

    const entities = _.cloneDeep(currentEnvironment.data.entities);
    for (let i = currentEnvironmentIndex + 1; i <= currentStepIndex; i++) {
        const step = steps[i];
        // TODO: apply removals
        // TODO: APPLY additions
        // apply updates
        _.forEach(step.data.updates, (updateData, updateKey) => {
            // check to see if the entity exists. If it exists, extend it. If it doesn't ust add it
            if (entities[updateKey]) {
                _.extend(entities[updateKey], updateData);
            } else {
                entities[updateKey] = updateData;
            }
        });
    }

    const entityLists = {};
    _.transform(
        entities,
        (result, entity) => {
            result[entity.type] = result[entity.type] || [];
            result[entity.type].push(entity);
        },
        entityLists
    );
    // remove all lists before resetting them
    currentEnvironment.data = _.omit(currentEnvironment.data, ['avatar', 'prop', 'audio', 'image', 'text', 'model', 'clipboard', 'information']);
    _.extend(currentEnvironment.data, entityLists);

    dispatch('apps/state/update', { selector: 'currentEnvironment', value: currentEnvironment }, { root: true });
};

// TODO set to visible false/true
export const environmentTransition = ({ rootState }, payload = { from: 0, to: 1 }) => {
    return new Promise((resolve) => {
        console.log('parameter', payload);
        if (rootState.apps.context.mode === 'edit') {
            return resolve();
        }

        if (environmentTransitionTimeout) {
            clearTimeout(environmentTransitionTimeout);
        }

        const transSphere = document.getElementById('TT_7882928a227a4b549c1e21996639041c');
        const duration = _.parseInt(transSphere.components.animation.attrValue.dur);
        transSphere.setAttribute('visible', true);
        transSphere.setAttribute('animation', _.extend({ autoplay: true }, payload));

        environmentTransitionTimeout = setTimeout(() => {
            console.log('parameter', payload, transSphere.components.material.attrValue);
            transSphere.setAttribute('animation', { autoplay: false });
            if (payload.to === 0) {
                transSphere.setAttribute('visible', false);
            }

            resolve();
        }, duration + 250);
    });
};

export const adjustCameraToEnvironment = async ({ dispatch }, payload = {}) => {
    const camera = document.getElementById('camera');
    const { newEnvironment, lerp } = payload;
    if (camera) {
        const lookControls = camera.components['tt-look-controls'];
        if (lookControls) {
            const { rotation } = newEnvironment.data;
            if (rotation) {
                lookControls.setRotation(rotation.x, rotation.y, false);
                // lookControls.setRotation(rotation.x, rotation.y, lerp);
            }
        }
    }
    dispatch(
        'apps/state/update',
        {
            selector: 'zoom',
            value: newEnvironment.data.zoom || 1,
        },
        { root: true }
    );
};

// TAKE/RUNNER actions
export const start = ({ commit }) => {
    commit('setStarted', true);
};

export const togglePause = ({ commit, state }) => {
    const { paused } = state;
    commit('setPause', !paused);
};

export const transcriptPlaying = ({ commit }, value) => {
    commit('setTranscriptPlaying', value);
};

export const transcriptFinished = ({ commit }, value) => {
    commit('setTranscriptFinished', value);
};

export const back = ({ dispatch, state }) => {
    const { currentStepIndex } = state;
    if (currentStepIndex > 0) {
        dispatch('setCurrentStepIndex', currentStepIndex - 1);
    }
};

export const next = ({ dispatch, getters, state }) => {
    const { currentStepIndex } = state;
    const currentSteps = getters.getCurrentSteps();
    const currentStep = currentSteps[currentStepIndex];
    dispatch('markCompleted', { id: currentStep.id });
    if (currentStepIndex < currentSteps.length - 1) {
        dispatch('setCurrentStepIndex', currentStepIndex + 1);
    }
};

export const gotToStepById = ({ dispatch, getters, state }, { stepId }) => {
    const { currentStepIndex } = state;
    const currentSteps = getters.getCurrentSteps();
    const nextStepIndex = _.findIndex(currentSteps, { id: stepId });
    const currentStep = currentSteps[currentStepIndex];
    dispatch('markCompleted', { id: currentStep.id });
    if (nextStepIndex >= 0 && nextStepIndex < currentSteps.length) {
        dispatch('setCurrentStepIndex', nextStepIndex);
    }
};

export const markCompleted = ({ dispatch, rootState }, { id }) => {
    const { responses } = rootState.apps.state.state;
    const currentResponse = responses[id] || {};
    currentResponse.completed = true;
    responses[id] = currentResponse;
    dispatch(
        'apps/state/update',
        {
            selector: 'responses',
            value: { ...responses },
        },
        { root: true }
    );
};

export const updateResponseValue = ({ dispatch, rootState }, { stepId, valueId, value }) => {
    if (rootState.apps.context.mode === 'play') {
        dispatch(
            'apps/state/update',
            {
                selector: `responses.${stepId}.values.${valueId}`,
                value,
            },
            { root: true }
        );
    }
};

export const handleHotspotClick = () => {
    // this is a place holder for the HOTSPOT-viewer
};

export const preloadAssets = ({ state, rootState }) => {
    const { steps } = rootState.apps.state.state;
    _.forEach(steps, (step) => {
        if (step.type === 'SET_ENVIRONMENT' && step.data.src) {
            fetch(step.data.src);
        }
    });
};

export const createAvatar = async ({ dispatch }, { src, position, rotation }) => {
    const newAvatar = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        tags: '',
        title: 'Avatar',
        src,
        rotation: rotation ? rotation : new THREE.Vector3(),
        events: {
            click: {
                event: 'click',
                action: undefined,
            },
            mouseenter: {
                event: 'mouseenter',
                action: undefined,
            },
            mouseleave: {
                event: 'mouseleave',
                action: undefined,
            },
            mousedown: {
                event: 'mousedown',
                action: undefined,
            },
            mouseup: {
                event: 'mouseup',
                action: undefined,
            },
            'sound-ended': {
                event: 'sound-ended',
                action: undefined,
            },
            'sound-started': {
                event: 'sound-started',
                action: undefined,
            },
        },
        position: {
            x: position.x,
            y: position.y,
            z: position.z,
        },
        scale: {
            x: 35,
            y: 35,
            z: 35,
        },
        animation: {
            loop: false,
            duration: 3000,
            delay: 0,
            direction: 'normal',
            to: null,
        },
        type: 'avatar',
        soundSrc: 'no sound',
        action:
            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/animations/Standing-Idle.glb',
    };

    await dispatch('createEntity', { entity: newAvatar });
    return newAvatar;
};

export const createImage = async ({ dispatch }, { src, position }) => {
    const newImage = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        tags: '',
        title: 'Image',
        src,
        rotation: {
            x: 0,
            y: 0, //-1 * _.round(THREE.MathUtils.radToDeg(camera.object3D.rotation.y), 2),
            z: 0,
        },
        events: {
            click: {
                event: 'click',
                action: undefined,
            },
            mouseenter: {
                event: 'mouseenter',
                action: undefined,
            },
            mouseleave: {
                event: 'mouseleave',
                action: undefined,
            },
            mousedown: {
                event: 'mousedown',
                action: undefined,
            },
            mouseup: {
                event: 'mouseup',
                action: undefined,
            },
        },
        position: {
            x: position.x,
            y: position.y,
            z: position.z,
        },
        scale: {
            x: 35,
            y: 35,
            z: 35,
        },
        animation: {
            loop: false,
            duration: 3000,
            delay: 0,
            direction: 'normal',
            to: null,
        },
        type: 'image',
    };

    await dispatch('createEntity', { entity: newImage });
    return newImage;
};

export const updateEntity = ({ dispatch, rootState }, { stepId, entityId, newData }) => {
    let step;
    if (stepId) {
        step = _.find(rootState.apps.state.state.steps, { id: stepId });
    } else {
        step = rootState.apps.state.state.currentEnvironment;
    }
    const currentEntities = step.data.entities || {};
    const currentEntity = currentEntities[entityId];
    _.extend(currentEntity, newData);
    dispatch('updateStepDataById', {
        id: step.id,
        newData: { entities: _.cloneDeep(currentEntities) },
    });
};

export const createEntity = ({ dispatch, rootState }, { entity }) => {
    const { currentEnvironment } = rootState.apps.state.state;
    const currentEntities = _.clone(currentEnvironment.data.entities) || {};
    currentEntities[entity.id] = entity;

    dispatch('updateStepDataById', {
        id: currentEnvironment.id,
        newData: { entities: currentEntities },
    });
};

// export const translateAllTranscripts = ({ dispatch, rootState }, { id }) => {
//     const { steps, coach } = rootState.apps.state.state;

//     async function generateAudio(blob) {
//     };
//     async function convertTextToAudio(transcript, voice) {
//         const textToSpeech = await Client.Predictions.convert({
//             textToSpeech: {
//                 source: {
//                     text: transcript,
//                 },
//                 voiceId: voice,
//             },
//         });
//         const fetchResult = await fetch(textToSpeech.speech.url);
//         const audioBlob = await fetchResult.blob();
//         return audioBlob;
//     };

//     async function updateTranscript(step) {
//         if (step && step.data && step.data.transcript) {
//             const blob = await convertTextToAudio(step.data.transcript, coach.voice);
//             const url = await
//         }
//         return step;
//     };

//     const newSteps = await Promise.all(steps.map(step => updateTranscript(step)));
//     dispatch('apps/state/update', { selector: 'steps', value: newSteps }, { root: true });
// };
