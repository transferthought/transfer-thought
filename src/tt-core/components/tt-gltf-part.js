/* eslint-disable */
const _ = require('lodash');

AFRAME.registerComponent('tt-gltf-part', {
    schema: {
        name: { default: '' },
    },

    /**
     * Store initial positions in case need to reset on component removal.
     */
    init() {
        const self = this;
        const { el } = this;
        const { parentEl, sceneEl } = el;
        this.loaded = false;

        this.children = el.getChildEntities();

        this.handleChildAttached = this.handleChildAttached.bind(this);
        this.handleChildDetached = this.handleChildDetached.bind(this);

        this.update = _.throttle(this.update.bind(this), 20);

        el.addEventListener('child-attached', this.handleChildAttached);
        el.addEventListener('child-detached', this.handleChildDetached);
        el.addEventListener('layoutrefresh', this.update.bind(this));
        sceneEl.addEventListener('enter-vr', this.update.bind(this));

        // Wait for model to load.
        parentEl.addEventListener('model-loaded', () => {
            self.loaded = true;
            self.gltfPart = parentEl.object3D.getObjectByName(self.data.name);
            if (self.gltfPart) {
                self.initialPosition = self.gltfPart.position.clone();
                self.initialQuaternion = self.gltfPart.quaternion.clone();
                self.initialScale = self.gltfPart.scale.clone();
            }
            self.update();
        });
    },

    tick() {
        if (!this.loaded || !this.gltfPart) {
            return;
        }
        this.gltfPart.visible = this.el.object3D.visible;

        // AFRAME vectors
        const position = this.initialPosition.clone();
        position.add(this.el.object3D.position);
        this.gltfPart.position.copy(position);

        const quaternion = this.initialQuaternion.clone();
        quaternion.multiply(this.el.object3D.quaternion);
        this.gltfPart.quaternion.copy(quaternion);

        this.gltfPart.scale.copy(this.el.object3D.scale);
    },

    /**
     * Update child entity positions.
     */
    update(oldData) {
        if (!this.loaded) {
            return;
        }
        const self = this;
        const { el } = this;
        const { parentEl } = el;
        if (parentEl && parentEl.object3D) {
            if (this.gltfPart) {
                // update parents
                this.children.forEach((child) => {
                    self.gltfPart.add(child.object3D);
                });
            }
        }
    },

    handleComponentUpdate(e) {
        if (e.detail && e.detail.name === 'visible') {
            this.update();
        }
    },
    /**
     * Reset positions.
     */
    remove() {
        this.el.removeEventListener('child-attached', this.handleChildAttached);
        this.el.removeEventListener('child-detached', this.handleChildDetached);
    },

    handleChildAttached(evt) {
        const { el } = this;
        if (evt.detail.el.parentNode !== el) {
            return;
        }
        this.children.push(evt.detail.el);
        this.update();
    },

    handleChildDetached(evt) {
        // Only update if direct child detached.
        if (this.children.indexOf(evt.detail.el) === -1) {
            return;
        }
        this.children.splice(this.children.indexOf(evt.detail.el), 1);
        this.update();
    },
});
