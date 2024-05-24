/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export const getCurrentSteps = (state, getters, rootState) => () => {
    const { steps } = rootState.apps.state.state;
    return steps;
};

export const getCurrentStep = (state, getters) => () => {
    const steps = getters.getCurrentSteps();
    const { currentStepIndex } = state;
    const clampedCurrentStepIndex = _.min([steps ? steps.length - 1 : 0, currentStepIndex]);
    if (steps && steps.length) {
        return steps[clampedCurrentStepIndex];
    }
};

export const getCurrentEnvironment = (state, getters) => () => {
    const steps = getters.getCurrentSteps();
    const { currentStepIndex } = state;
    const clampedCurrentStepIndex = _.min([steps ? steps.length - 1 : 0, currentStepIndex]);
    const currentEnvironment = _.findLast(steps, { type: 'SET_ENVIRONMENT' }, clampedCurrentStepIndex);
    return currentEnvironment;
};

export const getStepDisplayName = (state, getters) => (stepId) => {
    const steps = getters.getCurrentSteps();
    const index = _.findIndex(steps, { id: stepId });
    const step = steps[index];
    const displayName = step.name ? step.name : `Step ${index + 1}`;
    return displayName;
};
