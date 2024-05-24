'use strict';

const THREE = AFRAME.THREE;
const clamp = THREE.MathUtils.clamp;

AFRAME.registerComponent('tt-multitouch-look-controls', {
    schema: {
        enabled: { default: true },
    },

    init() {
        this.removeEventListeners();

        /*
     On desktop mode, just downgrade ourselves to a normal look-control
     */
        if (!AFRAME.utils.device.isMobile()) {
            this.data.enabled = false;
            this.setEnabled(false);
            this.pause();
        } else {
            this.zoom = 1;

            //this.bindMethods();
            this.setEnabled(this.data.enabled);

            // Attach listeners to pause myself on enter-vr and resume myself on exit-vr
            this.el.sceneEl.addEventListener('enter-vr', this.handleEnterVRMobile.bind(this));
            this.el.sceneEl.addEventListener('exit-vr', this.handleExitVRMobile.bind(this));
        }
    },

    handleEnterVRMobile(e) {
        this.setEnabled(false);
        this.pause();
    },
    handleExitVRMobile(e) {
        this.setEnabled(true);
        this.play();
    },

    play() {
        this.addEventListeners();
    },

    pause() {
        this.removeEventListeners();
    },

    /*
     * setEnabled just turns on the hand grab cursor.
     */
    setEnabled(enabled) {
        const sceneEl = this.el.sceneEl;

        function enableGrabCursor() {
            sceneEl.canvas.classList.add('a-grab-cursor');
        }
        function disableGrabCursor() {
            sceneEl.canvas.classList.remove('a-grab-cursor');
        }

        if (!sceneEl.canvas) {
            if (enabled) {
                sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
            } else {
                sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
            }
        } else {
            if (enabled) {
                enableGrabCursor();
            } else {
                disableGrabCursor();
            }
        }
    },

    remove() {
        this.pause();
    },

    bindMethods() {
        this.onTouchStart = bind(this.onTouchStart, this);
        this.onTouchMove = bind(this.onTouchMove, this);
        this.onTouchEnd = bind(this.onTouchEnd, this);
    },

    addEventListeners() {
        const sceneEl = this.el.sceneEl;
        const canvasEl = sceneEl.canvas;

        // I think this is a more intuitive order to apply rotations for the look camera
        // It means you first look left or right, then lower your chin.
        // The default XYZ order means you lower your chin first, then look left or right (like a cow...)
        this.el.object3D.rotation.order = 'YXZ';

        // listen for canvas to load.
        if (!canvasEl) {
            sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
            return;
        }

        // Touch events
        canvasEl.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
    },

    removeEventListeners() {
        const canvasEl = this.el.sceneEl?.canvas;
        if (!canvasEl) {
            return;
        }

        // Touch events
        canvasEl.removeEventListener('touchstart', this.onTouchStart.bind(this));
        canvasEl.removeEventListener('touchmove', this.onTouchMove.bind(this));
        canvasEl.removeEventListener('touchend', this.onTouchEnd.bind(this));

        this.el.object3D.rotation.order = 'XYZ';
    },

    onTouchStart(e) {
        if (e.targetTouches.length == 1) {
            this.touchStart = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY,
            };
            this.touchStarted = true;
        } else if (e.targetTouches.length == 2) {
            this.touchStart = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY,
            };
        } else {
            return;
        }
    },

    onTouchMove(e) {
        const canvas = this.el.sceneEl.canvas;

        if (e.targetTouches.length == 1) {
            const deltaY = (2 * Math.PI * (e.targetTouches[0].pageX - this.touchStart.x)) / canvas.clientWidth;
            const deltaX = (2 * Math.PI * (e.targetTouches[0].pageY - this.touchStart.y)) / canvas.clientHeight;

            if (Math.abs(deltaX) > 1.5 || Math.abs(deltaY) > 1.5) return;

            this.touchStart = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY,
                dist: undefined,
            };
        } else if (e.targetTouches.length == 2) {
            // Handle the dolly motion. We will look at movement of the mid-point between the two touches.
            const px = (e.targetTouches[0].pageX + e.targetTouches[1].pageX) / 2;
            const py = (e.targetTouches[0].pageY + e.targetTouches[1].pageY) / 2;
            const dist = Math.sqrt((e.targetTouches[0].pageX - e.targetTouches[1].pageX) ** 2 + (e.targetTouches[0].pageY - e.targetTouches[1].pageY) ** 2);

            if (!isFinite(this.touchStart.dist)) this.touchStart.dist = dist;

            const minScreenDim = Math.min(canvas.clientWidth, canvas.clientHeight);
            const maxDist = Math.sqrt(minScreenDim ** 2 + minScreenDim ** 2);

            const deltaX = (2 * Math.PI * (px - this.touchStart.x)) / canvas.clientWidth;
            const deltaY = (2 * Math.PI * (py - this.touchStart.y)) / canvas.clientHeight;
            const deltaDist = (2 * Math.PI * (dist - this.touchStart.dist)) / maxDist;

            if (Math.abs(deltaX) > 1.5 || Math.abs(deltaY) > 1.5) return;

            this.zoom += deltaDist;

            TT.store.dispatch('apps/state/update', {
                selector: 'zoom',
                value: clamp(this.zoom || 1, 0.5, 4),
            });

            this.touchStart = {
                x: px,
                y: py,
                dist: dist,
            };
        } else if (e.targetTouches.length > 2) {
            // 3-finger gestures not supported
        } else {
            // No touches?!
            console.warn('Strange to get here but touches.length==0');
        }
    },

    onTouchEnd(e) {
        this.touchStarted = false;

        // this event also fires when we drop from multiple finers down to just 1 finger remaining.
        // In this case, lets' update touchStart to that finger pos, intead of the mipoint between two fingers.
        if (e.targetTouches.length == 1) {
            this.touchStart = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY,
            };
            this.touchStarted = true;
        }
    },
});
