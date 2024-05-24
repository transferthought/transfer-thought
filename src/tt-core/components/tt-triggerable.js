import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-triggerable', {
    schema: {
        enabled: { default: true },
        object: { default: 'triggerable' },
        dynamic: { default: false },
    },

    update(previousData) {
        if (this.data.object !== previousData.object) {
            this.el.classList.remove(previousData.object);
        }
        if (this.data.dynamic) {
            this.el.setAttribute('data-aabb-collider-dynamic');
        } else {
            this.el.removeAttribute('data-aabb-collider-dynamic');
        }
        if (this.data.enabled) {
            this.el.classList.add(this.data.object);
        } else {
            this.el.classList.remove(this.data.object);
        }
    },
});
