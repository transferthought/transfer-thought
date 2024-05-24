import _ from 'lodash';
// eslint-disable-next-line import/prefer-default-export
export const createAppStatePlugin = () => (store) => {
    const watchCurrentStepFn = () => {
        try {
            const { steps } = store.state.apps.state.state;
            const { currentStepIndex } = store.state.steps;
            const index = _.min([steps ? steps.length - 1 : 0, currentStepIndex]);
            const currentStep = steps[index];
            return currentStep;
        } catch (e) {
            return null;
        }
    };
    const watchCurrentStepUpdateFn = async () => {
        const { steps, currentStep, currentEnvironment } = store.state.apps.state.state;
        const { currentStepIndex } = store.state.steps;
        const index = _.min([steps ? steps.length - 1 : 0, currentStepIndex]);
        const newStep = steps[index];
        const newEnvironment = _.findLast(steps, { type: 'SET_ENVIRONMENT' }, currentStepIndex);

        const previousStep = _.clone(currentStep);
        const previousEnvironment = _.clone(currentEnvironment);

        const payload = {
            newStep,
            newEnvironment,
            previousStep,
            previousEnvironment,
        };
        if (currentStepIndex !== null) {
            await store.dispatch('steps/handleStepExit', payload, { root: true });
            await store.dispatch('steps/updateCurrentStep', payload, { root: true });
            await store.dispatch('steps/handleStepEntry', payload, { root: true });
        }
    };

    store.watch(watchCurrentStepFn, watchCurrentStepUpdateFn, { deep: true });
};
