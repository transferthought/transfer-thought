/* global AFRAME,THREE */
/**
 * Modal Component for aframe-material-collection.
 * @namespace aframe-material-collection
 * @component ui-modal
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-modal', {
    schema: {
        modal: { type: 'selector' },
        main: { type: 'selector' },
    },
    init() {
        if (this.data.modal && this.data.main) {
            // Get the modal panel to be able to animate its scale on open/close.
            this.modalPanel = document.querySelector(this.data.modal.getAttribute('ui-panel'));

            this.mainComponents = this.data.main.components;
            this.modalComponents = this.data.modal.components;
            // Pause rendering of modal until opened.
            if (this.modalComponents && this.modalComponents['ui-renderer']) {
                this.modalComponents['ui-renderer'].pause();
            }
            // Setup close listeners for anything with the class close-modal.
            const close_buttons = this.data.modal.querySelectorAll('.close-modal');
            for (let i = 0; i < close_buttons.length; i++) {
                const close_button = close_buttons[i];
                close_button.addEventListener('mousedown', () => {
                    this.close();
                });
            }
            // Add click handler for opening the modal, pause the main render screen and play the modal renderer
            this.openModal = this.open.bind(this);
            this.el.addEventListener('mousedown', this.openModal);
            this.data.main.modal = this;

            // Expose methods to open/close the modal.
            this.el.open = this.open.bind(this);
            this.el.close = this.close.bind(this);
        }
    },
    remove() {
        this.el.removeEventListener('mousedown', this.openModal);
    },
    open() {
        if (this.mainComponents && this.mainComponents['ui-renderer']) {
            this.mainComponents['ui-renderer'].pauseRender();
            this.tweenModalScale(0.0000001, 1);
            this.modalComponents['ui-renderer'].play();
        }
    },
    close() {
        // Pause the modal rendering and play the main rendering again.
        this.modalComponents['ui-renderer'].pause();
        this.mainComponents['ui-renderer'].play();
        this.mainComponents['ui-renderer'].playRender();
        this.tweenModalScale(1, 0.0000001)
            .then(() => {
                this.el.sceneEl.emit('modal-closed');
            });
    },
    tweenModalScale(from, to) {
        return new Promise((r) => {
            const _this = this;
            new TWEEN.Tween({ x: from })
                .to({ x: to }, 250)
                .onUpdate(function () {
                    if (_this.modalPanel) _this.modalPanel.setAttribute('scale', `${this.x} ${this.x} ${this.x}`);
                })
                .onComplete(r)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        });
    },
});
