/* eslint-disable */

import * as AFRAME from 'aframe';

AFRAME.registerSystem('material-design-icon', {
    schema: {
        timeout: { type: 'number', default: 2500 },
    },

    cache: {},
    promises: {},

    loaded: false,
    promise: null,

    draw(data) {
        const key = [data.icon, data.color, data.size].join('-');
        if (!this.cache[key]) {
            const { size } = data;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const fontSize = 800 / (1024 / size);
            const position = size / 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = data.color;
            ctx.font = `${fontSize}px Material Icons`;
            ctx.fillText(data.icon, position, position);

            this.cache[key] = canvas.toDataURL();
        }

        return this.cache[key];
    },

    isStylesheetLoaded() {
        if (this.loaded) {
            return Promise.resolve();
        }

        if (this.isMaterialDesignIconsAvailable()) {
            this.onLoaded();
            return Promise.resolve();
        }

        if (!this.promise) {
            this.promise = new Promise((resolve) => {
                if (this.canCheckDocumentFonts()) {
                    const func = () => {
                        if (this.isMaterialDesignIconsAvailable()) {
                            document.fonts.removeEventListener('loadingdone', func);
                            this.onLoaded(resolve);
                        }
                    };
                    document.fonts.addEventListener('loadingdone', func);
                } else {
                    console.warn(`aframe-material-design-icons: Unable to determine when Material Icons stylesheet is loaded. Drawing fonts after ${this.data.timeout} seconds`);
                    console.warn('aframe-material-design-icons: You can change the timeout by adding "font-awesome="timeout: $timeout" to your a-scene');

                    window.setTimeout(() => {
                        this.onLoaded(resolve);
                    }, this.data.timeout);
                }
            });
        }

        return this.promise;
    },

    isMaterialDesignIconsAvailable() {
        return this.canCheckDocumentFonts() && document.fonts.check('1px Material Icons');
    },

    canCheckDocumentFonts() {
        return typeof document.fonts !== 'undefined' && document.fonts.check;
    },

    onLoaded(resolve) {
        this.el.emit('font-awesome.loaded');
        this.loaded = true;

        if (resolve) {
            resolve();
        }
    },
});

AFRAME.registerComponent('material-design-icon', {
    schema: {
        icon: { type: 'string' },
        color: { default: '#000', type: 'string' },
        size: { default: '1024', type: 'number' },
        visibleWhenDrawn: { default: 'true', type: 'boolean' },
    },

    update() {
        this.system.isStylesheetLoaded().then(() => {
            const result = this.system.draw(this.data);
            this.el.setAttribute('material', {src: result});
            this.el.emit('font-awesome.drawn');
        });
    },
});