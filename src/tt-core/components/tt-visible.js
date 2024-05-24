import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-visible', {
    schema: { visible: { default: true } },

    update() {
        this.el.object3D.visible = this.data.visible;
    },
    tick() {
        // eslint-disable-next-line no-undef
        TWEEN.update(TWEEN.now());
    },
});
