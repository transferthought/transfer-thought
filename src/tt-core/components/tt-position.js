import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-position', {
    schema: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
    },

    update() {
        const { object3D } = this.el;
        const { data } = this;
        object3D.position.set(data.x, data.y, data.z);
    },

    remove() {
        // Pretty much for mixins.
        this.el.object3D.position.set(0, 0, 0);
    },
});
