/* eslint-disable */

AFRAME.registerComponent('tt-center-mesh', {
    schema: {
        enabled: { default: true },
    },

    init() {
        this.mesh = this.el.getObject3D('mesh');
    },

    update() {},
    tick() {
        this.centerMesh();
    },
    centerMesh() {
        if (this.mesh && this.mesh.geometry) {
            if (this.centeredGeometryId !== this.mesh.geometry.uuid) {
                this.mesh.geometry.computeBoundingBox();
                const offsetX = -this.mesh.geometry.boundingBox.max.x / 2;
                const offsetY = -this.mesh.geometry.boundingBox.max.y / 2;
                const offsetZ = -this.mesh.geometry.boundingBox.max.z / 2;
                this.mesh.geometry.translate(offsetX, offsetY, offsetZ);
                this.centeredGeometryId = this.mesh.geometry.uuid;
            }
        }
    },
});
