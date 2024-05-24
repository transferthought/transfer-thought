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
    selectWorker(state, action) {
        state.workerModel = '#' + action.worker;
        const entity = document.querySelector('#Worker');        
        const parent = entity.parentElement;
        parent.removeChild(entity);
        const entityElement = document.createElement('a-entity');
        entityElement.setAttribute('id', "Worker");
        entityElement.setAttribute('bind__gltf-model', "workerModel");
        entityElement.setAttribute('position', "0 0 -4");
        entityElement.setAttribute('animation-mixer-new', "");
        parent.appendChild(entityElement);
    },
};

export {
    initialState,
    handlers,
};
