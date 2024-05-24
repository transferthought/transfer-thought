/* eslint-disable */

const initialState = {
    selectedEnvironment: 'forest',
    workerModel: '#Spanner1',
};

const handlers = {
    selectEnvironment(state, action) {
        console.log(action);
        state.selectedEnvironment = action.environment;
    },
};

export {
    initialState,
    handlers,
};
