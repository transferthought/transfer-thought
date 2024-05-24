import * as AFRAME from 'aframe';

AFRAME.registerComponent('tt-data-tag', {
    schema: {
        enabled: {
            default: true,
        },
        key: {
            default: null,
        },
        value: {
            default: null,
        },
    },

    update(previousData) {
        if (previousData.key) {
            delete this.el.dataset[previousData.key];
        }
        if (this.data.enabled && this.data.key && this.data.value) {
            this.el.dataset[this.data.key] = this.data.value;
        }
    },
});
