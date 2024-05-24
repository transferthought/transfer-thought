import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-interactable', {
    schema: { value: { default: true } },

    update() {
        if (this.data.value) {
            this.el.classList.add('interactable');
        } else {
            this.el.classList.remove('interactable');
        }
    },
});
