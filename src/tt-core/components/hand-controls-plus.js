/* eslint-disable */
// Found at https://github.com/aframevr/assets.
const MODEL_URLS = {
    toonLeft: 'https://cdn.aframe.io/controllers/hands/leftHand.glb',
    toonRight: 'https://cdn.aframe.io/controllers/hands/rightHand.glb',
    lowPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandLow.glb',
    lowPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandLow.glb',
    highPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandHigh.glb',
    highPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandHigh.glb',
};

// Poses.
const ANIMATIONS = {
    open: 'Open',
    // point: grip active, trackpad surface active, trigger inactive.
    point: 'Point',
    // pointThumb: grip active, trigger inactive, trackpad surface inactive.
    pointThumb: 'Point + Thumb',
    // fist: grip active, trigger active, trackpad surface active.
    fist: 'Fist',
    // hold: trigger active, grip inactive.
    hold: 'Hold',
    // thumbUp: grip active, trigger active, trackpad surface inactive.
    thumbUp: 'Thumb Up',
};

// Map animation to public events for the API.
const EVENTS = {};
EVENTS[ANIMATIONS.fist] = 'grip';
EVENTS[ANIMATIONS.thumbUp] = 'pistol';
EVENTS[ANIMATIONS.point] = 'pointing';

/**
   * Hand controls component that abstracts 6DoF controls:
   *   oculus-touch-controls, vive-controls, windows-motion-controls.
   *
   * Originally meant to be a sample implementation of applications-specific controls that
   * abstracts multiple types of controllers.
   *
   * Auto-detect appropriate controller.
   * Handle common events coming from the detected vendor-specific controls.
   * Translate button events to semantic hand-related event names:
   *   (gripclose, gripopen, thumbup, thumbdown, pointup, pointdown)
   * Load hand model with gestures that are applied based on the button pressed.
   *
   * @property {string} Hand mapping (`left`, `right`).
   */
AFRAME.registerComponent('hand-controls-plus', {
    schema: {
        color: { default: 'white', type: 'color' },
        hand: { default: 'left' },
        handModelStyle: { default: 'lowPoly', oneOf: ['lowPoly', 'highPoly', 'toon'] },
    },

    init() {
        const self = this;
        const { el } = this;
        // Current pose.
        this.gesture = ANIMATIONS.open;
        // Active buttons populated by events provided by the attached controls.
        this.pressedButtons = {};
        this.touchedButtons = {};
        this.loader = new THREE.GLTFLoader();
        this.loader.setCrossOrigin('anonymous');

        this.onGripDown = function () { self.handleButton('grip', 'down'); };
        this.onGripUp = function () { self.handleButton('grip', 'up'); };
        this.onTrackpadDown = function () { self.handleButton('trackpad', 'down'); };
        this.onTrackpadUp = function () { self.handleButton('trackpad', 'up'); };
        this.onTrackpadTouchStart = function () { self.handleButton('trackpad', 'touchstart'); };
        this.onTrackpadTouchEnd = function () { self.handleButton('trackpad', 'touchend'); };
        this.onTriggerDown = function () { self.handleButton('trigger', 'down'); };
        this.onTriggerUp = function () { self.handleButton('trigger', 'up'); };
        this.onTriggerTouchStart = function () { self.handleButton('trigger', 'touchstart'); };
        this.onTriggerTouchEnd = function () { self.handleButton('trigger', 'touchend'); };
        this.onGripTouchStart = function () { self.handleButton('grip', 'touchstart'); };
        this.onGripTouchEnd = function () { self.handleButton('grip', 'touchend'); };
        this.onThumbstickDown = function () { self.handleButton('thumbstick', 'down'); };
        this.onThumbstickUp = function () { self.handleButton('thumbstick', 'up'); };
        this.onAorXTouchStart = function () { self.handleButton('AorX', 'touchstart'); };
        this.onAorXTouchEnd = function () { self.handleButton('AorX', 'touchend'); };
        this.onBorYTouchStart = function () { self.handleButton('BorY', 'touchstart'); };
        this.onBorYTouchEnd = function () { self.handleButton('BorY', 'touchend'); };
        this.onSurfaceTouchStart = function () { self.handleButton('surface', 'touchstart'); };
        this.onSurfaceTouchEnd = function () { self.handleButton('surface', 'touchend'); };
        this.onControllerConnected = this.onControllerConnected.bind(this);
        this.onControllerDisconnected = this.onControllerDisconnected.bind(this);

        el.addEventListener('controllerconnected', this.onControllerConnected);
        el.addEventListener('controllerdisconnected', this.onControllerDisconnected);

        // Hidden by default.
        el.object3D.visible = false;
    },

    play() {
        this.addEventListeners();
    },

    pause() {
        this.removeEventListeners();
    },

    tick(time, delta) {
        const mesh = this.el.getObject3D('mesh');

        if (!mesh || !mesh.mixer) { return; }

        mesh.mixer.update(delta / 1000);
    },

    onControllerConnected() {
        this.el.object3D.visible = true;
    },

    onControllerDisconnected() {
        this.el.object3D.visible = false;
    },

    addEventListeners() {
        const { el } = this;
        el.addEventListener('gripdown', this.onGripDown);
        el.addEventListener('gripup', this.onGripUp);
        el.addEventListener('trackpaddown', this.onTrackpadDown);
        el.addEventListener('trackpadup', this.onTrackpadUp);
        el.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
        el.addEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
        el.addEventListener('triggerdown', this.onTriggerDown);
        el.addEventListener('triggerup', this.onTriggerUp);
        el.addEventListener('triggertouchstart', this.onTriggerTouchStart);
        el.addEventListener('triggertouchend', this.onTriggerTouchEnd);
        el.addEventListener('griptouchstart', this.onGripTouchStart);
        el.addEventListener('griptouchend', this.onGripTouchEnd);
        el.addEventListener('thumbstickdown', this.onThumbstickDown);
        el.addEventListener('thumbstickup', this.onThumbstickUp);
        el.addEventListener('abuttontouchstart', this.onAorXTouchStart);
        el.addEventListener('abuttontouchend', this.onAorXTouchEnd);
        el.addEventListener('bbuttontouchstart', this.onBorYTouchStart);
        el.addEventListener('bbuttontouchend', this.onBorYTouchEnd);
        el.addEventListener('xbuttontouchstart', this.onAorXTouchStart);
        el.addEventListener('xbuttontouchend', this.onAorXTouchEnd);
        el.addEventListener('ybuttontouchstart', this.onBorYTouchStart);
        el.addEventListener('ybuttontouchend', this.onBorYTouchEnd);
        el.addEventListener('surfacetouchstart', this.onSurfaceTouchStart);
        el.addEventListener('surfacetouchend', this.onSurfaceTouchEnd);
    },

    removeEventListeners() {
        const { el } = this;
        el.removeEventListener('gripdown', this.onGripDown);
        el.removeEventListener('gripup', this.onGripUp);
        el.removeEventListener('trackpaddown', this.onTrackpadDown);
        el.removeEventListener('trackpadup', this.onTrackpadUp);
        el.removeEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
        el.removeEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
        el.removeEventListener('triggerdown', this.onTriggerDown);
        el.removeEventListener('triggerup', this.onTriggerUp);
        el.removeEventListener('triggertouchstart', this.onTriggerTouchStart);
        el.removeEventListener('triggertouchend', this.onTriggerTouchEnd);
        el.removeEventListener('griptouchstart', this.onGripTouchStart);
        el.removeEventListener('griptouchend', this.onGripTouchEnd);
        el.removeEventListener('thumbstickdown', this.onThumbstickDown);
        el.removeEventListener('thumbstickup', this.onThumbstickUp);
        el.removeEventListener('abuttontouchstart', this.onAorXTouchStart);
        el.removeEventListener('abuttontouchend', this.onAorXTouchEnd);
        el.removeEventListener('bbuttontouchstart', this.onBorYTouchStart);
        el.removeEventListener('bbuttontouchend', this.onBorYTouchEnd);
        el.removeEventListener('xbuttontouchstart', this.onAorXTouchStart);
        el.removeEventListener('xbuttontouchend', this.onAorXTouchEnd);
        el.removeEventListener('ybuttontouchstart', this.onBorYTouchStart);
        el.removeEventListener('ybuttontouchend', this.onBorYTouchEnd);
        el.removeEventListener('surfacetouchstart', this.onSurfaceTouchStart);
        el.removeEventListener('surfacetouchend', this.onSurfaceTouchEnd);
    },

    /**
     * Update handler. More like the `init` handler since the only property is the hand, and
     * that won't be changing much.
     */
    update(previousHand) {
        let controlConfiguration;
        const { el } = this;
        const { hand } = this.data;
        const { handModelStyle } = this.data;
        const handColor = this.data.color;
        const self = this;

        // Get common configuration to abstract different vendor controls.
        controlConfiguration = {
            hand,
            model: false,
        };

        // Set model.
        if (hand !== previousHand) {
            const handmodelUrl = MODEL_URLS[handModelStyle + hand.charAt(0).toUpperCase() + hand.slice(1)];
            this.loader.load(handmodelUrl, (gltf) => {
                const mesh = gltf.scene.children[0];
                const handModelOrientation = hand === 'left' ? Math.PI / 2 : -Math.PI / 2;
                mesh.mixer = new THREE.AnimationMixer(mesh);
                self.clips = gltf.animations;
                el.setObject3D('mesh', mesh);

                const handMaterial = mesh.children[1].material;
                handMaterial.color = new THREE.Color(handColor);
                mesh.position.set(0, 0, 0);
                mesh.rotation.set(0, 0, handModelOrientation);
                el.setAttribute('magicleap-controls', controlConfiguration);
                el.setAttribute('vive-controls', controlConfiguration);
                el.setAttribute('oculus-touch-controls', controlConfiguration);
                el.setAttribute('windows-motion-controls', controlConfiguration);
            });
        }
    },

    remove() {
        this.el.removeObject3D('mesh');
    },

    /**
     * Play model animation, based on which button was pressed and which kind of event.
     *
     * 1. Process buttons.
     * 2. Determine gesture (this.determineGesture()).
     * 3. Animation gesture (this.animationGesture()).
     * 4. Emit gesture events (this.emitGestureEvents()).
     *
     * @param {string} button - Name of the button.
     * @param {string} evt - Type of event for the button (i.e., down/up/touchstart/touchend).
     */
    handleButton(button, evt) {
        let lastGesture;
        const isPressed = evt === 'down';
        const isTouched = evt === 'touchstart';

        // Update objects.
        if (evt.indexOf('touch') === 0) {
        // Update touch object.
            if (isTouched === this.touchedButtons[button]) { return; }
            this.touchedButtons[button] = isTouched;
        } else {
        // Update button object.
            if (isPressed === this.pressedButtons[button]) { return; }
            this.pressedButtons[button] = isPressed;
        }

        // Determine the gesture.
        lastGesture = this.gesture;
        this.gesture = this.determineGesture();

        // Same gesture.
        if (this.gesture === lastGesture) { return; }
        // Animate gesture.
        this.animateGesture(this.gesture, lastGesture);

        // Emit events.
        this.emitGestureEvents(this.gesture, lastGesture);
    },

    /**
     * Determine which pose hand should be in considering active and touched buttons.
     */
    determineGesture() {
        let gesture;
        const isGripActive = this.pressedButtons.grip;
        const isSurfaceActive = this.pressedButtons.surface || this.touchedButtons.surface;
        const isTrackpadActive = this.pressedButtons.trackpad || this.touchedButtons.trackpad;
        const isTriggerActive = this.pressedButtons.trigger || this.touchedButtons.trigger;
        const isABXYActive = this.touchedButtons.AorX || this.touchedButtons.BorY;
        const isVive = isViveController(this.el.components['tracked-controls']);

        // Works well with Oculus Touch and Windows Motion Controls, but Vive needs tweaks.
        if (isVive) {
            if (isGripActive || isTriggerActive) {
                gesture = ANIMATIONS.fist;
            } else if (isTrackpadActive) {
                gesture = ANIMATIONS.point;
            }
        } else if (isGripActive) {
            if (isSurfaceActive || isABXYActive || isTrackpadActive) {
                gesture = isTriggerActive ? ANIMATIONS.fist : ANIMATIONS.point;
            } else {
                gesture = isTriggerActive ? ANIMATIONS.thumbUp : ANIMATIONS.pointThumb;
            }
        } else if (isTriggerActive) {
            gesture = ANIMATIONS.hold;
        }

        return gesture;
    },

    /**
     * Play corresponding clip to a gesture
     */
    getClip(gesture) {
        let clip;
        let i;
        for (i = 0; i < this.clips.length; i++) {
            clip = this.clips[i];
            if (clip.name !== gesture) { continue; }
            return clip;
        }
    },

    /**
     * Play gesture animation.
     *
     * @param {string} gesture - Which pose to animate to. If absent, then animate to open.
     * @param {string} lastGesture - Previous gesture, to reverse back to open if needed.
     */
    animateGesture(gesture, lastGesture) {
        if (gesture) {
            this.playAnimation(gesture || ANIMATIONS.open, lastGesture, false);
            return;
        }

        // If no gesture, then reverse the current gesture back to open pose.
        this.playAnimation(lastGesture, lastGesture, true);
    },

    /**
     * Emit `hand-controls`-specific events.
     */
    emitGestureEvents(gesture, lastGesture) {
        const { el } = this;
        let eventName;

        if (lastGesture === gesture) { return; }

        // Emit event for lastGesture not inactive.
        eventName = getGestureEventName(lastGesture, false);
        if (eventName) { el.emit(eventName); }

        // Emit event for current gesture now active.
        eventName = getGestureEventName(gesture, true);
        if (eventName) { el.emit(eventName); }
    },

    /**
    * Play hand animation based on button state.
    *
    * @param {string} gesture - Name of the animation as specified by the model.
    * @param {string} lastGesture - Previous pose.
    * @param {boolean} reverse - Whether animation should play in reverse.
    */
    playAnimation(gesture, lastGesture, reverse) {
        let clip;
        let fromAction;
        const mesh = this.el.getObject3D('mesh');
        let toAction;

        if (!mesh) { return; }

        // Stop all current animations.
        mesh.mixer.stopAllAction();

        // Grab clip action.
        clip = this.getClip(gesture);
        toAction = mesh.mixer.clipAction(clip);
        toAction.clampWhenFinished = true;
        toAction.loop = THREE.LoopRepeat;
        toAction.repetitions = 0;
        toAction.timeScale = reverse ? -1 : 1;
        toAction.time = reverse ? clip.duration : 0;
        toAction.weight = 1;

        // No gesture to gesture or gesture to no gesture.
        if (!lastGesture || gesture === lastGesture) {
        // Stop all current animations.
            mesh.mixer.stopAllAction();
            // Play animation.
            toAction.play();
            return;
        }

        // Animate or crossfade from gesture to gesture.
        clip = this.getClip(lastGesture);
        fromAction = mesh.mixer.clipAction(clip);
        fromAction.weight = 0.15;
        fromAction.play();
        toAction.play();
        fromAction.crossFadeTo(toAction, 0.15, true);
    },
});

/**
   * Suffix gestures based on toggle state (e.g., open/close, up/down, start/end).
   *
   * @param {string} gesture
   * @param {boolean} active
   */
function getGestureEventName(gesture, active) {
    let eventName;

    if (!gesture) { return; }

    eventName = EVENTS[gesture];
    if (eventName === 'grip') {
        return eventName + (active ? 'close' : 'open');
    }
    if (eventName === 'point') {
        return eventName + (active ? 'up' : 'down');
    }
    if (eventName === 'pointing' || eventName === 'pistol') {
        return eventName + (active ? 'start' : 'end');
    }
}

function isViveController(trackedControls) {
    const controller = trackedControls && trackedControls.controller;
    const isVive = controller && (controller.id && controller.id.indexOf('OpenVR ') === 0
      || (controller.profiles
       && controller.profiles[0]
       && controller.profiles[0] === 'htc-vive-controller-mv'));
    return isVive;
}
