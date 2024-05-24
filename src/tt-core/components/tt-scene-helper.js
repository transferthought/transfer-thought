import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-scene-helper', {
    tick(t, dt) {
        this.el.emit('tick', { t, dt });
    },
});
