/* global AFRAME,TWEEN,THREE */
/**
 * Toast Component for aframe-material-collection.
 * @namespace aframe-material-collection
 * @component ui-toast
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-toast', {
    schema: {
        toastEl: { type: 'selector' },
        message: { default: 'Hello from toast!' },
    },
    init() {
        this.originalPosition = this.data.toastEl.getAttribute('position').clone();
        this.el.addEventListener('mousedown', () => {
            if (this.closeTween) this.closeTween.stop();
            UI.utils.isChanging(this.el.sceneEl, this.data.toastEl.object3D.uuid);
            this.data.toastEl.setAttribute('visible', true);
            this.data.toastEl.setAttribute('text-value', UI.utils.shorten(this.data.message, 85));
            const _this = this;
            new TWEEN.Tween({ x: this.originalPosition.x, y: this.originalPosition.y - 0.1, z: this.originalPosition.z })
                .to(this.originalPosition, 350)
                .onUpdate(function () {
                    _this.data.toastEl.setAttribute('position', this);
                })
                .onComplete(() => {
                    // Stop changes
                    this.closeTween = new TWEEN.Tween({ x: 0.8 })
                        .delay(2000)
                        .to({ x: 0.0001 }, 350)
                        .onUpdate(function () {
                            _this.data.toastEl.setAttribute('opacity', this.x);
                        })
                        .onComplete(() => {
                            this.data.toastEl.setAttribute('visible', false);
                            UI.utils.stoppedChanging(this.data.toastEl.object3D.uuid);
                        })
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
            new TWEEN.Tween({ x: 0.0001 })
                .to({ x: 0.8 }, 350)
                .onUpdate(function () {
                    _this.data.toastEl.setAttribute('opacity', this.x);
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        });
    },
});
