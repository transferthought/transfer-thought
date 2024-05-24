/* eslint-disable */

AFRAME.registerComponent('remove-in-seconds', {
    schema: {
        default: 1,
    },

    init() {
        setTimeout(this.destroy.bind(this), this.data * 1000);
    },

    destroy() {
        const { el } = this;
        el.parentNode.removeChild(el);
    },
});
