/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* global AFRAME,TWEEN, UI */
/**
 * Radio Component for aframe-material-collection. Resets other radio buttons siblings and includes a disabled state.
 * @namespace aframe-material-collection
 * @component ui-radio
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-radio', {
    schema: {
        value: { default: '' },
        selected: { type: 'boolean', default: false },
        selectedColor: { default: '#4a61dd' },
        selectedRadius: { type: 'number', default: 0.045 },
        unselectedColor: { default: '#5f5f5f' },
        disabledColor: { default: '#afafaf' },
        disabled: { type: 'boolean', default: false },
        intersectableClass: { default: 'intersectable' },
        width: { type: 'number', default: 0.15 },
        height: { type: 'number', default: 0.15 },
    },
    init() {
        this.width = 0.15;
        this.height = 0.15;
        this.container = document.createElement('a-entity');
        this.container.setAttribute('class', 'no-yoga-layout');
        this.el.appendChild(this.container);
        // Create center circle for checked state.
        this.filled_circle = document.createElement('a-circle');
        this.filled_circle.setAttribute('radius', this.data.selectedRadius);
        this.filled_circle.setAttribute('scale', '0 0 0');
        this.filled_circle.setAttribute('color', this.data.disabled ? this.data.disabledColor : this.data.selectedColor);
        this.filled_circle.setAttribute('shader', 'flat');
        this.filled_circle.setAttribute('class', 'no-yoga-layout');
        // this.filled_circle.setAttribute('segments', 32);
        this.el.appendChild(this.filled_circle);

        // Create a ring for bounding circle
        this.ring = document.createElement('a-ring');
        this.ring.setAttribute('radius-inner', this.data.selectedRadius + 0.01);
        this.ring.setAttribute('radius-outer', this.data.selectedRadius + 0.02);
        // this.ring.setAttribute('scale', '0 0 0');
        // this.ring.setAttribute('color', this.data.disabled ? this.data.disabledColor : this.data.selectedColor);
        this.ring.setAttribute('shader', 'flat');
        this.ring.setAttribute('class', 'no-yoga-layout');
        this.ring.setAttribute('segments', 6);
        this.el.appendChild(this.ring);
        // Create backing for getting click events.
        const backing = document.createElement('a-circle');
        backing.setAttribute('radius', this.data.selectedRadius);
        backing.setAttribute('position', '0 0 -0.002');
        backing.setAttribute('class', `${this.data.intersectableClass} no-yoga-layout`);
        backing.setAttribute('shader', 'flat');
        backing.setAttribute('segments', 6);
        backing.setAttribute('opacity', 0.0001);
        backing.setAttribute('transparent', true);
        this.el.appendChild(backing);
        // Set this if it is checked.
        if (this.data.selected) {
            this.click();
        }
        // TODO: need to add play/pause methods for registering/unregistering events.
        if (!this.data.disabled) {
            this.el.addEventListener('mousedown', (e) => this.click(e));
        }
    },
    deselect() {
        // Deselect this radio with a scale animation on the circle.
        this.el.setAttribute('selected', false);
        const self = this;
        // Start changes
        UI.utils.isChanging(this.el.sceneEl, this.filled_circle.object3D.uuid);
        new TWEEN.Tween({ x: 1 })
            .to({ x: 0.000001 }, 200)
            .onUpdate(function () {
                self.filled_circle.object3D.scale.set(this._object.x, this._object.x, this._object.x);
            })
            .onComplete(() => {
                // Stop changes
                UI.utils.stoppedChanging(self.filled_circle.object3D.uuid);
                this.isRippling = false;
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    },
    click() {
        // Get all other radio siblings and reset their state if they are selected.
        [].slice.call(this.el.parentNode.querySelectorAll('a-entity,a-ring,a-ui-radio')).filter((el) => el !== this.el).forEach((ring) => {
            if (ring.components['ui-radio'] && ring.getAttribute('selected') === 'true') {
                ring.components['ui-radio'].deselect();
            }
        });
        // Emit the current selected value
        this.el.emit('ui-radio-changed', this.data.value);
        // Set this radio's selected state.
        this.el.setAttribute('selected', true);
        // Throttle animations.
        if (this.isSelecting) return;
        this.isSelecting = true;
        const self = this;
        // Start changes
        UI.utils.isChanging(this.el.sceneEl, this.filled_circle.object3D.uuid);
        new TWEEN.Tween({ x: 0.000001 })
            .to({ x: 1 }, 250)
            .onUpdate(function () {
                self.filled_circle.object3D.scale.set(this._object.x, this._object.x, this._object.x);
            })
            .onComplete(() => {
                // Stop changes
                UI.utils.stoppedChanging(this.filled_circle.object3D.uuid);
                this.isSelecting = false;
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    },
    line(isVertical) {
        // Create horizontal/vertical line.
        const line = document.createElement('a-plane');
        line.setAttribute('width', isVertical ? 0.01 : 0.105);
        line.setAttribute('height', isVertical ? 0.105 : 0.01);
        line.setAttribute('class', 'no-yoga-layout');
        line.setAttribute('shader', 'flat');
        return line;
    },
});
