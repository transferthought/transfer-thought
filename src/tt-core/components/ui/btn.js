/* global AFRAME, UI */
/**
 * Button base Component for aframe-material-collection. This is used as the base component for all the button primitives.
 * @namespace aframe-material-collection
 * @component ui-btn
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-btn', {
    schema: {
        hoverHeight: { type: 'number', default: 0.01 },
        activeHeight: { type: 'number', default: 0.05 },
        disabled: { type: 'boolean', default: false },
    },
    updateSchema() {
        // TODO: handle updates to the button state, disabled flag here.
    },
    init() {
        this.animating = false;
        this.duration = 150;
        this.mesh = this.el.getObject3D('mesh');
        // Store the current button z value for animating mouse events
        this.defaultZ = this.el.object3D.position.z;
        // register input events for interaction
        if (!this.data.disabled) {
            this.el.addEventListener('mouseenter', (e) => this.mouseEnter(e));
            this.el.addEventListener('mouseleave', (e) => this.mouseLeave(e));
            this.el.addEventListener('click', (e) => this.click(e));
        }
    },
    mouseEnter() {
        this.defaultColor = this.mesh.material.color.clone();
        this.mesh.material.color.addScalar(0.1);
    },
    mouseLeave() {
        this.mesh.material.color.copy(this.defaultColor);
    },
    click(e) {
        if (this.animating) {
            return;
        }
        this.animating = true;
        const self = this;
        const animeObject = {
            z: this.defaultZ,
        };

        AFRAME.ANIME({
            targets: animeObject,
            z: this.defaultZ + this.data.activeHeight,
            easing: 'linear',
            direction: 'alternate',
            duration: this.duration,
            update() {
                self.el.object3D.position.z = animeObject.z;
            },
            complete() {
                self.animating = false;
            },
        });
        UI.utils.preventDefault(e);
    },
});
