import * as AFRAME from 'aframe';

AFRAME.registerComponent('github-api', {
    init() {
        setTimeout(() => {
            AFRAME.scenes[0].emit('fetchRepos', {});
        }, 1000);
    },
});
