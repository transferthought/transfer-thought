/* eslint-disable */

AFRAME.registerComponent('tt-follow', {
    schema: {
        enabled: { default: true },
        selector: { default: '' },
        delay: { type: 'number', default: 200 },
        offsetX: { type: 'number', default: 0 },
        offsetY: { type: 'number', default: 0 },
        offsetZ: { type: 'number', default: 0 },
        triggerStartFollowThreshold: { type: 'number', default: 1.5 },
        triggerStopFollowThreshold: { type: 'number', default: 0.25 },
    },

    init() {
        this.offsetPosition = new THREE.Vector3();
        const { sceneEl } = this.el;
        sceneEl.addEventListener('enter-vr', this.update.bind(this));
        sceneEl.addEventListener('exit-vr', () => {
            this.isFollowing = true;
        });
    },

    update() {
        const self = this;
        const { selector } = self.data;
        let targetEl;
        targetEl = self.el.sceneEl.querySelector(selector);
        if (!targetEl) {
            warn(`"${selector}" does not point to a valid entity to look-at`);
            return;
        }
        this.offsetPosition.set(this.data.offsetX || 0, this.data.offsetY || 0, this.data.offsetZ || 0);
        if (!targetEl.hasLoaded) {
            return targetEl.addEventListener('loaded', () => {
                self.beginTracking(targetEl);
            });
        }
        return self.beginTracking(targetEl);
    },

    beginTracking(targetEl) {
        this.isFollowing = true;
        this.targetEl = targetEl;
    },

    tock(t, dt) {
        if (this.data.enabled && this.targetEl && this.targetEl.object3D) {
            this.trackTarget(t, dt);
        }
    },

    trackTarget(t, dt) {
        // TODO: support world to local functions. This will make sure items that are childeren can properly follow a target without having cary over position from it's parent
        // Right now getWorldPosition is not working correctly because there are NaN values in object3d.matrix (not sure why/how to fix)
        const { targetEl } = this;
        var sceneEl = this.el.sceneEl;

        const followPosition = new THREE.Vector3();
        const targetWorldQuaternion = new THREE.Quaternion();
        const offsetClone = this.offsetPosition.clone();

        targetEl.object3D.getWorldPosition(followPosition);
        targetEl.object3D.getWorldQuaternion(targetWorldQuaternion);
        // In VR or AR mode, THREE is in charge of updating the camera pose.
        // Check here if we are tracking the camera and if we are in VR mode
        if (this.targetEl.getObject3D('camera') && sceneEl.hasWebXR && (sceneEl.is('vr-mode') || sceneEl.is('ar-mode')) && sceneEl.checkHeadsetConnected()) {
            pose = sceneEl.renderer.xr.getCameraPose();
            if (pose) {
                const poseMatrix = new THREE.Matrix4();
                const cameraPostion = new THREE.Vector3();
                const cameraRotation = new THREE.Quaternion();
                poseMatrix.elements = pose.transform.matrix;
                poseMatrix.decompose(cameraPostion, cameraRotation, new THREE.Vector3());
                followPosition.add(cameraPostion.applyQuaternion(targetWorldQuaternion));
                targetWorldQuaternion.multiply(cameraRotation);
            }
        }

        // note this could probably just watch the target position and just update once
        offsetClone.applyQuaternion(targetWorldQuaternion);
        followPosition.add(offsetClone);

        if (this.isFollowing) {
            if (this.data.delay > 0) {
                this.el.object3D.position.lerp(followPosition, dt / this.data.delay);
            } else {
                this.el.object3D.position.copy(followPosition);
            }
        }
        this.checkThresholds(followPosition);
    },
    checkThresholds(followPosition) {
        if (this.el.sceneEl.is('vr-mode')) {
            if (this.isFollowing) {
                // check if ideal camera point is within the triggerStopFollowThreshold
                const cameraPointDistanceToFollowTarget = this.el.object3D.position.distanceToSquared(followPosition);
                if (cameraPointDistanceToFollowTarget < Math.pow(this.data.triggerStopFollowThreshold, 2)) {
                    this.isFollowing = false;
                }
            } else {
                // check if ideal camera point is outside the triggerStartFollowThreshold
                const cameraPointDistanceToFollowTarget = this.el.object3D.position.distanceToSquared(followPosition);
                if (cameraPointDistanceToFollowTarget > Math.pow(this.data.triggerStartFollowThreshold, 2)) {
                    this.isFollowing = true;
                }
            }
        }
    },
});
