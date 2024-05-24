/* eslint-disable */

const initialState = {
    breathSize: "1 1 1"
};

const handlers = {
    breathSize(state, action) {
        state.breathSize = action + " " + action + " " + action;
    },
    joinRoom(state) {
        document.getElementsByTagName('a-assets')[0].insertAdjacentHTML('afterbegin', `
        <video id="forest" autoplay loop="true" crossorigin src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/video/nature/360_VR+Master+Series-low-quality.mp4"></video>
        `);
    },
};

window.tt = {};
window.tt.videoPlay = function () {
    const entity = document.querySelector('#forest');
    entity.play();
    return "Started Video";
};
window.tt.videoPause = function () {
    const entity = document.querySelector('#forest');
    entity.pause();
    return "Video paused";
};
window.tt.videoSpeed = function (newSpeed) {
    const entity = document.querySelector('#forest');
    entity.playbackRate = newSpeed;
    return "Changed video speed to " + newSpeed;
};
window.tt.breathSize = function (newSize) {
    AFRAME.scenes[0].emit('breathSize', newSize);
    return "Changed breath size to " + newSize;
};

export {
    initialState,
    handlers,
};
