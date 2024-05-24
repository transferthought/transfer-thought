/* eslint-disable */
import _ from 'lodash';
function normalizeValue(value, fromMin, fromMax) {
    // First, normalize the input value to a range between 0 and 1
    const normalizedValue = (value - fromMin) / (fromMax - fromMin);
    return normalizedValue;
}

AFRAME.registerComponent('tt-transform-element', {
    schema: {
        enabled: { default: true },
        selector: { default: '' },
    },
    init() {
        this.cameraEl = document.getElementById('camera');
        this.raycaster = new THREE.Raycaster();
        this.checkForElement = _.throttle(this.checkForElement, 500, { leading: true }); // throttle call so we are not constantly checking for an element if it will never exist
    },
    update() {
        const self = this;
        const { selector } = self.data;
        this.checkForElement();
    },

    checkForElement() {
        // if (this.targetEl) {
        //     return;
        // }
        const { selector } = this.data;

        this.targetEl = document.querySelector(selector) || null;

        // if (this.targetEl) {
        //     this.observer = new MutationObserver((mutations) => {
        //         mutations.forEach((mutation) => {
        //             if (mutation.removedNodes.length > 0 && Array.from(mutation.removedNodes).includes(targetNode)) {
        //                 // Node has been removed
        //                 console.log('Node with ID ' + elementId + ' removed.');

        //                 // Delete reference to the node
        //                 this.targetEl = null;

        //                 // Disconnect the observer since we no longer need it
        //                 this.observer.disconnect();
        //             }
        //         });
        //     });
        // }
    },

    tick(t, dt) {
        this.checkForElement();
        if (this.targetEl) {
            const camera = this.cameraEl.getObject3D('camera');
            // Get 2D screen position
            const screenPosition = this.el.object3D.position.clone();
            screenPosition.project(camera);

            // no need to check collisions yet?
            // Set the raycaster
            // this.raycaster.setFromCamera(screenPosition, camera);
            // const intersects = this.raycaster.intersectObjects(this.el.sceneEl.object3D.children, true);

            // // No intersect found
            // if (intersects.length === 0) {
            //     this.targetEl.classList.add('visible');
            // } else {
            //     // Get the distance of the intersection and the distance of the point
            //     const intersectionDistance = intersects[0].distance;
            //     const pointDistance = this.el.object3D.position.distanceTo(camera.position);

            //     // Intersection is close than the point
            //     if (intersectionDistance < pointDistance) {
            //         // Hide
            //         this.targetEl.classList.remove('visible');
            //     }
            //     // Intersection is further than the point
            //     else {
            //         // Show
            //         this.targetEl.classList.add('visible');
            //     }
            // }

            const renderer = this.el.sceneEl.renderer;

            // Get the canvas width and height
            const canvasWidth = renderer.domElement.width;
            const canvasHeight = renderer.domElement.height;

            const translateX = normalizeValue(screenPosition.x, -1, 1) * canvasWidth * 0.5;
            const translateY = normalizeValue(screenPosition.y, -1, 1) * canvasHeight * 0.5;
            this.targetEl.style.transform = `translateX(${translateX}px) translateY(${canvasHeight / 2 - translateY}px)`;

            if (translateX > 0 && translateX < canvasWidth / 2 && translateY > 0 && translateY < canvasHeight / 2) {
                this.targetEl.classList.add('visible');
            } else {
                this.targetEl.classList.remove('visible');
            }

            // this.targetEl.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        } else {
            this.checkForElement();
        }
    },
});
