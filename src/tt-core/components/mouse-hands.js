/* eslint-disable */

const handOffsets = {
    empty: new THREE.Vector3(1.3, 0, 1.7),
    pistolGrip: new THREE.Vector3(0.5, 0, 0),
};

AFRAME.registerComponent('mouse-hands', {
    schema: {
        pose: { default: 'pistolGrip', type: 'string' },
    },
    init() {
        //On Init we make the hands visible by faking that a controller has been connect
        this.el.emit('controllerconnected');
        this.raycaster = document.getElementById('camera').components.raycaster;

        //listen for mouse down to trigger animation
        this.camera = document.getElementById('camera');
        this.camera.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.camera.addEventListener('mouseup', this.handleMouseUp.bind(this));

        this.handOffsetY = 0;
        this.handOffsetZ = 0;
    },
    update() {},
    tick: function() {
        //let raycasterDirection = this.raycaster.data.direction;
        try {
            this.el.setAttribute('tt-position', this.raycaster.data.direction.clone().multiplyScalar(0.75));
        } catch (error) {}

        //this.el.object3D.rotation.set(this.camera.object3D.rotation.x, this.camera.object3D.rotation.y, this.camera.object3D.rotation.z);
        this.el.object3D.lookAt(this.camera.object3D.getWorldPosition());
        // this.el.object3D.rotation.set(handOffsets.empty);
        // this.el.object3D.rotation.set(handOffsets.empty.x, handOffsets.empty.y, handOffsets.empty.z);
        const poseOffset = handOffsets[this.data.pose];
        if (poseOffset) {
            this.el.object3D.rotateX(poseOffset.x);
            this.el.object3D.rotateY(poseOffset.y);
            this.el.object3D.rotateZ(poseOffset.z);
        }

        // this.el.object3D.rotateZ(1.7 + this.handOffsetZ);
        // this.el.object3D.rotateY(-1 + this.handOffsetY);

        if (document.getElementById('rightHand').components['super-hands'].gehDragged.size > 0) {
            this.camera.setAttribute('tt-look-controls', 'enabled: false');
        } else {
            this.camera.setAttribute('tt-look-controls', 'enabled: true');
        }
    },
    handleMouseDown() {
        //We trigger an animation when clicking mouse down
        this.el.emit('triggerdown');

        //this.el.emit('gripdown');

        // this.handOffsetY = 1;
        // this.handOffsetZ = -1.7;
    },
    handleMouseUp() {
        //We trigger an animation when clicking mouse down
        this.el.emit('triggerup');

        //this.el.emit('gripup');

        // this.handOffsetY = 0;
        // this.handOffsetZ = 0;
    },
});
