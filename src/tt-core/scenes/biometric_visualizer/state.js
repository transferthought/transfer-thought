/* eslint-disable */

const initialState = {
    breathSize: "1 1 1"
};

const handlers = {
    breathSize(state, action) {
        state.breathSize = action + " " + action + " " + action;       
    },
};

window.tt = {};
window.tt.videoSpeed = function (newSpeed) {
    const entity = document.querySelector('#forest');
    entity.playbackRate = newSpeed;
};
window.tt.breathSize = function (newSize) {
    AFRAME.scenes[0].emit('breathSize', newSize);
};

export {
    initialState,
    handlers,
};
