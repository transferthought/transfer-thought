/* global AFRAME */
/**
 * A component shim the mouse move event for the AFRAME cursor raycaster.
 * @namespace aframe-material-collection
 * @component ui-mouse-shim
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-mouse-shim', {
    schema: {
        fps: { type: 'number', default: 45 },
    },
    init() {
        if (!this.el.components.raycaster) {
            throw 'ui-mouse-move component needs the raycaster component to be added.';
        }
        // Add support for mouse wheel
        this.el.sceneEl.renderer.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), false);
    },
    onMouseWheel(e) {
        this.emitMouseEvent('ui-mousewheel', e);
    },
    tick() {
        if (new Date().getTime() - this.lastMouseMoveTime < (1000 / this.data.fps)) return;
        this.emitMouseEvent('ui-mousemove');
        this.lastMouseMoveTime = new Date().getTime();
    },
    emitMouseEvent(eventType, event) {
        // Get current intersections from raycaster component.
        this.el.components.raycaster.intersections.forEach((intersection) => {
            if (intersection.object.el) {
                // Emit custom mouse move event ont he intersected element.
                intersection.object.el.emit(eventType, { cursorEl: this.el, intersection, evt: event });
            }
        });
    },
});
