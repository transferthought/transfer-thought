/* global AFRAME */
/**
 * A component to render the UI to a flat plane, removing the objects from the scene and rendering them separately to a
 * render target.
 * @namespace aframe-material-collection
 * @component ui-renderer
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-renderer', {
    schema: {
        uiPanel: { type: 'selector' },
        lookControlsEl: { type: 'selector' },
        lookControlsComponent: { default: 'look-controls' },
        panelPosition: { type: 'vec3', default: { x: 0, y: 1.6, z: -1 } },
        panelSize: { type: 'vec2', default: { x: 6, y: 3 } },
        renderResolution: { type: 'vec2', default: { x: 2048, y: 1024 } },
        debugRaycaster: { type: 'boolean', default: false },
        fps: { type: 'number', default: 60 },
        intersectableClass: { default: 'intersectable' },
        debug: { type: 'boolean', default: false },
        initDelay: { type: 'int', default: 0 },
    },
    init() {
        this.setupBackDrop();
        if (!this.data.uiPanel) {
            this.meshEl = this.setupUIPanel();
        } else {
            this.meshEl = this.data.uiPanel;
        }
        // Remove this object from the scene to be rendered separately.
        this.el.object3D.parent.remove(this.el.object3D);
        // Setup fixed camera nd render target.
        this.camera = new THREE.PerspectiveCamera(100, 2, 0.1, 1000);
        // Setup render target
        this.renderTarget = new THREE.WebGLRenderTarget(this.data.renderResolution.x, this.data.renderResolution.y, { antialias: true });
        // Set the texture to the ui panel mesh.
        this.meshEl.getObject3D('mesh').material.map = this.renderTarget.texture;
        // emit ready event for anythng wanting to use this texture.
        this.meshEl.emit('texture-ready', this.renderTarget.texture);
        // Listen for change events to enable rendering.
        this.stoppedRendering = false;
        this.isRendering = true;
        // Listen for change events to enable/disable rendering
        this.el.sceneEl.addEventListener('ui-changing', () => {
            // console.log(JSON.stringify(new Date()),'ui-changing');
            this.stoppedRendering = false;
            this.isRendering = true;
        });
        this.el.sceneEl.addEventListener('ui-changing-stopped', () => {
            // console.log(JSON.stringify(new Date()),'ui-changing-stopped');
            this.isRendering = false;
        });
        // Setup raycaster for relaying mouse/keyboard events
        this.raycaster = new THREE.Raycaster();
        this.helper = new THREE.Mesh(new THREE.SphereGeometry(0.01), new THREE.MeshBasicMaterial({ color: '#ff0000' }));
        // Add cursor helper to object
        if (this.data.debugRaycaster) this.el.object3D.add(this.helper);
        // Set last render time
        this.lastRenderTime = 0;
        this.isFrozen = false;

        // Expose methods to the element to pause/play the renderer.
        this.el.pauseRender = this.pauseRender.bind(this);
        this.el.playRender = this.playRender.bind(this);
        this.isReady = false;
        setTimeout(() => { this.isReady = true; }, this.data.initDelay);
    },
    pauseRender(time) {
        return this.playRender(time, true);
    },
    playRender(time, isPaused) {
        const _this = this;
        return new Promise((resolve) => {
            if (_this.isFrozen === isPaused || _this.isAnimatingBackground) return resolve();
            _this.isAnimatingBackground = true;
            if (!_this.isFrozen) this.backdrop.setAttribute('scale', '1 1 1');
            const fromScale = _this.isFrozen ? 0.9 : 0.000001;
            const toScale = _this.isFrozen ? 0.000001 : 0.9;
            const duration = _this.isFrozen ? time || 350 : time || 500;
            if (_this.isFrozen) {
                _this.isFrozen = isPaused;
                _this.play();
            }
            UI.utils.isChanging(_this.el.sceneEl, _this.backdrop.uuid);
            new TWEEN.Tween({ x: fromScale })
                .to({ x: toScale }, duration)
                .onUpdate(function () {
                    _this.backdrop.setAttribute('opacity', this.x);
                })
                .onComplete(() => {
                    _this.isFrozen = isPaused;
                    _this.isAnimatingBackground = false;
                    if (_this.isFrozen) {
                        _this.pause();
                    } else {
                        this.backdrop.setAttribute('scale', '0.000001 0.000001 0.000001');
                    }
                    // Stop changes
                    UI.utils.stoppedChanging(this.backdrop.uuid);
                    resolve();
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        });
    },
    setupBackDrop() {
        this.backdrop = document.createElement('a-plane');
        this.backdrop.setAttribute('transparent', true);
        this.backdrop.setAttribute('opacity', 0.000001);
        this.backdrop.setAttribute('color', '#000');
        this.backdrop.setAttribute('shader', 'flat');
        this.backdrop.setAttribute('position', { x: 0, y: 0, z: -0.2 });
        this.backdrop.setAttribute('width', 1);
        this.backdrop.setAttribute('height', 1);
        this.backdrop.setAttribute('scale', '0.000001 0.000001 0.000001');
        this.el.appendChild(this.backdrop);
    },
    play() {
        this.lastMouseMoveTime = 0;
        // Register event listeners
        // Mousedown and mouseup do not have the correct intersection point. Use last mouse move event if available instead.
        // TODO: raise issue with aframe / submit PR;
        this.click = (e) => this.mouseEvent('click', this.lastMoveEvent || e);
        this.mousedown = (e) => this.mouseEvent('mousedown', this.lastMoveEvent || e);
        this.mouseup = (e) => this.mouseEvent('mouseup', this.lastMoveEvent || e);
        this.mousewheel = (e) => this.mouseEvent('ui-mousewheel', e.detail.evt);
        this.mousemove = (e) => {
            // Save mousemove event for mousedown/mouseup events.
            this.lastMoveEvent = e;
            this.mouseEvent('ui-mousemove', e);
        };
        this.meshEl.addEventListener('mousedown', this.mousedown);
        this.meshEl.addEventListener('mouseup', this.mouseup);
        this.meshEl.addEventListener('click', this.click);
        this.meshEl.addEventListener('ui-mousemove', this.mousemove);
        this.meshEl.addEventListener('ui-mousewheel', this.mousewheel);
    },
    pause() {
        this.meshEl.removeEventListener('mousedown', this.mousedown);
        this.meshEl.removeEventListener('mouseup', this.mouseup);
        this.meshEl.removeEventListener('click', this.click);
        this.meshEl.removeEventListener('ui-mousemove', this.mousemove);
        this.meshEl.removeEventListener('ui-mousewheel', this.mousewheel);
    },
    setupUIPanel() {
        const uiPanel = document.createElement('a-plane');
        uiPanel.setAttribute('position', this.data.panelPosition);
        uiPanel.setAttribute('width', this.data.panelSize.x);
        uiPanel.setAttribute('height', this.data.panelSize.y);
        this.el.sceneEl.appendChild(uiPanel);
        return uiPanel;
    },
    mouseEvent(type, e) {
        let mouse = { x: 0, y: 0 };
        if (e.detail.intersection) {
            const localPoint = this.meshEl.object3D.worldToLocal(e.detail.intersection.point.clone());

            mouse = {
                x: localPoint.x / this.meshEl.getAttribute('width') * 2,
                y: localPoint.y / this.meshEl.getAttribute('height') * 2,
            };
        }
        if (type === 'ui-mousewheel' && e.detail.evt) {
            mouse.deltaY = e.detail.deltaY;
            mouse.deltaX = e.detail.deltaX;
        }
        if (type === 'mousedown' && this.lookControlsEl && this.lookControlsEl.components['look-controls']) {
            this.lookControlsEl.components[this.data.lookControlsComponent].pause();
        }
        if (type === 'mouseup' && this.lookControlsEl && this.lookControlsEl.components['look-controls']) {
            this.lookControlsEl.components[this.data.lookControlsComponent].play();
        }
        this.raycastIntersections(e, mouse, type);
    },
    raycastIntersections(e, mouse, type) {
        if (!this.camera) return;
        // console.log(mouse);
        this.raycaster.setFromCamera(mouse, this.camera);
        // this.helper.setDirection(this.raycaster.ray.direction);
        const intersections = this.raycaster.intersectObjects(this.el.object3D.children, true);
        this.prevIntersectionEls = this.prevIntersectionEls || [];
        const intersectionEls = [];
        if (intersections.length && this.data.debugRaycaster) {
            let intersectionPoint = intersections[0].point;
            if (intersections[0].object === this.helper && intersections.length > 1) {
                intersectionPoint = intersections[1].point;
            }
            this.helper.position.copy(intersectionPoint);
            this.helper.position.x -= 0.03;
        }
        let defaultPrevented = false;
        for (let i = 0; i < intersections.length; i++) {
            const intersection = intersections[i];
            // Only emit events on objecst with an element attached
            if (intersection.object.el && intersection.object.el.classList.contains(this.data.intersectableClass)) {
                const currentEvent = { intersection, evt: e, preventDefault: () => { defaultPrevented = true; } };
                // If this is the first time weve seen this element then emit the mouseenter event.
                if (this.prevIntersectionEls.indexOf(intersection.object.el) === -1 && !defaultPrevented) {
                    intersection.object.el.emit('mouseenter', currentEvent);
                }
                // Emit the mouse event received
                if (!defaultPrevented || type === 'ui-mousewheel') {
                    intersection.object.el.emit(type, currentEvent);
                }
                // Store the intersection on the element.
                intersection.object.el.intersection = intersection;
                // Add the current el to the list to check against previous intersection els.
                intersectionEls.push(intersection.object.el);
            }
        }
        // Find any intersections that have disappeared to emit the mouse leave event.
        for (let i = 0; i < this.prevIntersectionEls.length; i++) {
            const intersectionEl = this.prevIntersectionEls[i];
            if (intersectionEls.indexOf(intersectionEl) === -1) {
                intersectionEl.emit('mouseleave', { intersection: intersectionEl.intersection });
            }
        }
        // Store the current intersected elements for the next iteration.
        this.prevIntersectionEls = intersectionEls;
    },
    tick(delta) {
        if (this.isFrozen || this.stoppedRendering || !this.isReady) return;
        if (delta - this.lastRenderTime < (1000 / this.data.fps) && this.isRendering) return;
        this.el.object3D.traverse((child) => {
            child.updateMatrixWorld();
        });

        const { renderer } = this.el.sceneEl;
        const vrModeEnabled = renderer.vr.enabled;
        renderer.vr.enabled = false;
        renderer.render(this.el.object3D, this.camera, this.renderTarget);
        renderer.vr.enabled = vrModeEnabled;
        this.lastRenderTime = delta;
        if (!this.isRendering) {
            this.stoppedRendering = true;
        }
    },
});
