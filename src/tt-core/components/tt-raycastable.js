import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-raycastable', {
    schema: {
        enabled: {
            default: true,
        },
        objectClass: {
            default: 'raycastable',
        },
    },

    update(previousData) {
        if (previousData.objectClass !== this.data.objectClass) {
            this.el.classList.remove(previousData.objectClass);
        }
        if (this.data.enabled) {
            this.el.classList.add(this.data.objectClass);
        } else {
            this.el.classList.remove(this.data.objectClass);
        }
    },
});
