AFRAME.registerComponent('tt-overlay', {
    dependencies: [],
    init: function() {
        this.el.sceneEl.renderer.sortObjects = true;
        this.el.object3D.renderOrder = 100;
        if (this.el.components.material) {
            this.el.components.material.material.depthTest = false;
        }
        if (this.el.components.text) {
            this.el.components.text.material.depthTest = false;
        }
    },
});
