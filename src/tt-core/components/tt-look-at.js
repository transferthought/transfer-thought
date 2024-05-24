/* eslint-disable */

const { debug } = AFRAME.utils;
const { coordinates } = AFRAME.utils;

const warn = debug('components:look-at:warn');
const isCoordinates = coordinates.isCoordinates || coordinates.isCoordinate;

delete AFRAME.components['look-at'];

/**
 * Look-at component.
 *
 * Modifies rotation to either track another entity OR do a one-time turn towards a position
 * vector.
 *
 * If tracking an object via setting the component value via a selector, look-at will register
 * a behavior to the scene to update rotation on every tick.
 */
AFRAME.registerComponent('tt-look-at', {
    schema: {
        schema: {
            selector: { default: '' },
            x: { type: 'number' },
            y: { type: 'number' },
            z: { type: 'number' },
        },

        parse(value) {
            // A static position to look at.
            if (isCoordinates(value) || typeof value === 'object') {
                return coordinates.parse(value);
            }
            // A selector to a target entity.
            return value;
        },

        stringify(data) {
            if (typeof data === 'object') {
                return coordinates.stringify(data);
            }
            return data;
        },
    },

    init() {
        this.targetEl = null;
        this.vector = new THREE.Vector3();
        this.cameraListener = AFRAME.utils.bind(this.cameraListener, this);
        this.el.addEventListener('componentinitialized', this.cameraListener);
        this.el.addEventListener('componentremoved', this.cameraListener);
    },

    /**
   * If tracking an object, this will be called on every tick.
   * If looking at a position vector, this will only be called once (until further updates).
   */
    update() {
        const self = this;
        const { selector } = self.data;
        let targetEl;

        // No longer looking at anything (i.e., look-at="").
        // if (!selector || self.data.x || self.data.x || !self.data.z)  {
        //     return self.remove();
        // }

        // // Look at a position.
        // if (typeof target === 'object') {
        //     return this.lookAt(new THREE.Vector3(self.data.x, self.data.y, self.data.z));
        // }

        // Assume target is a string.
        // Query for the element, grab its object3D, then register a behavior on the scene to
        // track the target on every tick.
        targetEl = self.el.sceneEl.querySelector(selector);
        if (!targetEl) {
            warn(`"${selector}" does not point to a valid entity to look-at`);
            return;
        }
        if (!targetEl.hasLoaded) {
            return targetEl.addEventListener('loaded', () => {
                self.beginTracking(targetEl);
            });
        }
        return self.beginTracking(targetEl);
    },

    tick: (function () {
        const self = this;

        return function (t) {
            // Track target object position. Depends on parent object keeping global transforms up
            // to state with updateMatrixWorld(). In practice, this is handled by the renderer.
            const { targetEl } = this;
            if (targetEl && targetEl.object3D) {
                const vec3 = this.getTargetPosition();
                this.lookAt(vec3);
            } else {
                const { selector } = self.data;
                let targetEl;
                targetEl = self.el.sceneEl.querySelector(selector);
                if (!targetEl.hasLoaded) {
                    return targetEl.addEventListener('loaded', () => {
                        self.beginTracking(targetEl);
                    });
                }
                self.beginTracking(targetEl);

            }
        };
    }()),

    remove() {
        this.el.removeEventListener('componentinitialized', this.cameraListener);
        this.el.removeEventListener('componentremoved', this.cameraListener);
    },

    beginTracking(targetEl) {
        this.targetEl = targetEl;
    },

    cameraListener(e) {
        if (e.detail && e.detail.name === 'camera') {
            this.update();
        }
    },

    getTargetPosition() {
        const targetWorldPosition = new THREE.Vector3();
        const sceneEl = this.el.sceneEl;
        this.targetEl.object3D.getWorldPosition(targetWorldPosition);

        // In VR or AR mode, THREE is in charge of updating the camera pose.
        // Check here if we are tracking the camera and if we are in VR mode
        if (this.targetEl.getObject3D('camera') && sceneEl.hasWebXR && (sceneEl.is('vr-mode') || sceneEl.is('ar-mode')) && sceneEl.checkHeadsetConnected()) {
            pose = sceneEl.renderer.xr.getCameraPose();
            if (pose) {
                const targetWorldQuaternion = new THREE.Quaternion();
                this.targetEl.object3D.getWorldQuaternion(targetWorldQuaternion);
                const poseMatrix = new THREE.Matrix4();
                const cameraPostion = new THREE.Vector3();
                poseMatrix.elements = pose.transform.matrix;
                poseMatrix.decompose(cameraPostion, new THREE.Quaternion(), new THREE.Vector3());
                targetWorldPosition.add(cameraPostion.applyQuaternion(targetWorldQuaternion));
            }
        }
        return targetWorldPosition;
    },

    lookAt(position) {
        const { vector } = this;
        const { object3D } = this.el;

        if (this.el.getObject3D('camera')) {
            // Flip the vector to -z, looking away from target for camera entities. When using
            // lookat from THREE camera objects, this is applied for you, but since the camera is
            // nested into a Object3D, we need to apply this manually.
            vector.subVectors(object3D.position, position).add(object3D.position);
            
        } else {
            vector.copy(position);
        }

        object3D.lookAt(vector);
    },
});
