/* eslint-disable */

AFRAME.registerComponent('tt-fit-texture-component', {
    schema: {
        enabled: { default: true },
    },
    dependencies: ['geometry', 'material'],

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function() {
        if (this.data === false) return;

        var el = this.el;
        var self = this;
        if (self.dimensions) {
            // If texture has already been loaded, and `fit-texture` was reset.
            self.applyTransformation();
        } else {
            var textureLoaded = function(e) {
                var w = e.detail.texture.image.videoWidth || e.detail.texture.image.width;

                var h = e.detail.texture.image.videoHeight || e.detail.texture.image.height;

                // Don't apply transformation on incomplete info
                if (h === 0 || w === 0) return;

                // Save dimensions for later updates to `fit-texture`, see above.
                self.dimensions = { w: w, h: h };

                self.applyTransformation();
            };
            el.addEventListener('materialvideoloadeddata', textureLoaded);
            el.addEventListener('materialtextureloaded', textureLoaded);
        }
    },

    applyTransformation: function() {
        var el = this.el;
        var geometry = el.getAttribute('geometry');

        // Use self.dimension data from previous texture/video loaded events
        var widthHeightRatio = this.dimensions.h / this.dimensions.w;

        const obj = this.el.getObject3D('mesh');
        obj.scale
            .set(geometry.width, geometry.width * widthHeightRatio, 1)
            .normalize()
            .multiplyScalar(2);
        // if (geometry.width && geometry.height) {
        //     console.warn(
        //         'Using `fit-texture` component on an element with both width and height. Therefore keeping width and changing height to fit the texture. If you want to manually set both width and height, set `fit-texture="false"`. '
        //     );
        // }]

        // if (geometry.width) {
        // } else if (geometry.height) {
        //     el.setAttribute('width', geometry.height / widthHeightRatio);
        // } else {
        //     // Neither width nor height is set.
        //     var tempWidth = 1.0;
        //     el.setAttribute('width', '' + tempWidth);
        //     el.setAttribute('height', tempWidth * widthHeightRatio);
        // }
    },
});
