/* global AFRAME,THREE */
/**
 * Rounded borders Component for aframe-material-collection. Expects an a-plane entity.
 * @namespace aframe-material-collection
 * @component ui-border
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-border', {
    schema: {
        borderRadius: { type: 'number', default: 0.01 },
        curveSegments: { type: 'int', default: 5 },
        borderWidth: { type: 'number', default: 0.008 },
        color: { default: '#5f5f5f' },
        numberOfPoints: { type: 'int', default: 180 },
    },
    init() {
        const mesh = this.el.getObject3D('mesh');
        const roundedRectShape = new THREE.Shape();
        this.roundedRect(roundedRectShape,
            mesh.geometry.parameters.width,
            mesh.geometry.parameters.height,
            this.data.borderRadius);
        this.roundedRect(roundedRectShape,
            mesh.geometry.parameters.width - this.data.borderWidth * 2,
            mesh.geometry.parameters.height - this.data.borderWidth * 2,
            this.data.borderRadius, true);

        this.el.setObject3D('mesh', new THREE.Mesh(new THREE.ShapeGeometry(roundedRectShape, this.data.curveSegments), new THREE.MeshBasicMaterial({ color: this.data.color })));
    },
    roundedRect(ctx, width, height, radius, isHole) {
        const x = -width / 2; const
            y = -height / 2;
        // Draw the Rounded rectangle shape centered in the object - from three.js shapes example.
        let shapeCtx;
        if (isHole) {
            shapeCtx = ctx;
            ctx = new THREE.Path();
        }
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        if (isHole) {
            shapeCtx.holes.push(ctx);
        }
    },
});
