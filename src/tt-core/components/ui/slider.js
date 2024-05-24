/* global AFRAME,TWEEN,THREE */
/**
 * Slider Component for aframe-material-collection. Includes a disabled state.
 * @namespace aframe-material-collection
 * @component ui-slider
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-slider', {
    schema: {
        value: { type: 'number', default: 0 },
        disabled: { type: 'boolean', default: false },
        progressColor: { default: '#4db6ac' },
        handleColor: { default: '#009688' },
        handleDisabledColor: { default: '#afafaf' },
        railColor: { default: '#fff' },
        handleZIndex: { type: 'number', default: 0.001 },
        intersectableClass: { default: 'intersectable' },
        width: { type: 'number', default: 0.5 },
        height: { type: 'number', default: 0.1 },
        lookControlsComponent: { default: 'look-controls' },
        handleRadius: { type: 'number', default: 0.055 },
        scrollZOffset: { type: 'number', default: 0 },
        cameraEl: { type: 'selector' },
    },
    getValue() {
        return this.scroll_perc;
    },
    init() {
        this.scroll_perc = this.data.value;
        this.width = this.data.width;
        this.height = this.data.height;
        // Setup background with mouse input to catch mouse move events when not exactly over the scroll bar.
        this.backgroundPanel = document.createElement('a-plane');
        this.backgroundPanel.setAttribute('class', `no-yoga-layout background ${this.data.intersectableClass}`);
        this.backgroundPanel.setAttribute('width', this.data.width + 1);
        this.backgroundPanel.setAttribute('height', this.data.height + 1);
        this.backgroundPanel.setAttribute('position', '0 0 -0.02');
        this.backgroundPanel.setAttribute('opacity', 0.0001);//
        this.backgroundPanel.setAttribute('transparent', true);
        this.el.appendChild(this.backgroundPanel);
        // Setup handle circle entity.
        this.handleEl = document.createElement('a-circle');
        this.handleEl.setAttribute('radius', this.data.handleRadius);
        this.handleEl.setAttribute('color', this.data.handleColor);
        this.handleEl.setAttribute('shader', 'flat');
        this.handleEl.setAttribute('ui-ripple', 'size:0.1 0.1;color:#999;fadeDelay:300;duration:500');
        this.handleEl.setAttribute('class', `${this.data.intersectableClass} no-yoga-layout`);
        this.handleEl.setAttribute('position', `${(-(this.data.width) / 2) + this.data.handleRadius} 0 ${this.data.handleZIndex}`);
        this.handleEl.setAttribute('segments', 6);
        this.el.appendChild(this.handleEl);

        // Setup rail entity.
        this.railEl = document.createElement('a-plane');
        this.railEl.setAttribute('width', (this.data.width - 0.1));
        this.railEl.setAttribute('height', '0.05');
        this.railEl.setAttribute('shader', 'flat');
        this.railEl.setAttribute('ui-rounded', 'borderRadius:0.025');
        this.railEl.setAttribute('color', this.data.railColor);
        this.railEl.setAttribute('class', `${this.data.intersectableClass} no-yoga-layout`);
        this.el.appendChild(this.railEl);
        // Wait for the rounded edge on the rail to load to clone the geometry for the
        // selected progress bar part of the rail
        this.railEl.addEventListener('rounded-loaded', () => {
            this.getRailObject(this.railEl.object3D);
            this.slide(this.scroll_perc, true);
        });
        // Pause/play camera look controls
        const playPauseCamera = (method) => {
            if (this.data.cameraEl) {
                const lookControls = this.data.cameraEl.components[this.data.lookControlsComponent];
                if (lookControls) {
                    lookControls[method]();
                }
            }
        };
        // Setup mouse move handler for scrolling and updating scroll handle.
        const mousemove = (e) => this.mouseMove(e);
        // Start scroll
        this.handleEl.addEventListener('mousedown', (e) => {
            // Pause look controls to allow scrolling
            playPauseCamera('pause');
            this.isDragging = true;
            // Store the start point offset
            this.el.emit('slide-start', this.scroll_perc);
            this.handlePos = this.handleEl.object3D.worldToLocal(e.detail.intersection ? e.detail.intersection.point : e.relatedTarget.object3D.position).x;
            this.backgroundPanel.addEventListener('ui-mousemove', mousemove);
            // Start changes
            UI.utils.isChanging(this.el.sceneEl, this.handleEl.object3D.uuid);
            // Prevent default behaviour of event
            UI.utils.preventDefault(e);
        });
        // End scroll
        const endScroll = (e) => {
            if (this.isDragging) {
                this.backgroundPanel.removeEventListener('ui-mousemove', mousemove);
                // Play look controls once scrolling is finished
                playPauseCamera('play');
                this.isDragging = false;
                // Stop changes
                this.el.emit('slide-end', this.scroll_perc);
                UI.utils.stoppedChanging(this.handleEl.object3D.uuid);
                // Prevent default behaviour of event
                UI.utils.preventDefault(e);
            }
        };
        this.backgroundPanel.addEventListener('mouseup', endScroll);
        this.backgroundPanel.addEventListener('mouseleave', endScroll);
        // // Handle clicks on rail to scroll
        this.railEl.addEventListener('mousedown', (e) => {
            UI.utils.isChanging(this.el.sceneEl, this.handleEl.object3D.uuid);
            // Pause look controls
            this.isDragging = true;
            // Reset handle pos to center of handle
            this.handlePos = 0;
            // Scroll immediately and register mouse move events.
            this.slide(this.railEl.object3D.worldToLocal(e.detail.intersection ? e.detail.intersection.point : e.relatedTarget.object3D.position).x);
            this.backgroundPanel.addEventListener('ui-mousemove', mousemove);
            this.el.emit('slide-end', this.scroll_perc);
            // Prevent default behaviour of event
            UI.utils.preventDefault(e);
        });
        this.el.slide = this.slide.bind(this);
        this.el.getValue = this.getValue.bind(this);
        this.el.railEl = this.railEl;
    },
    slide(positionX, isPerc) {
        const min = (-(this.data.width) / 2) + this.data.handleRadius;
        const max = ((this.data.width) / 2) - this.data.handleRadius;
        // Set scroll position with start point offset.
        const scroll_pos = isPerc ? (min + ((max - min) * positionX)) : THREE.Math.clamp(positionX, min, max);
        this.scroll_perc = isPerc ? positionX : ((scroll_pos - min) / (max - min));
        this.el.emit('slide', this.scroll_perc);
        this.progress.scale.set(this.scroll_perc || 0.0001, 1, 1);
        this.progress.position.set((-(this.data.width - this.data.handleRadius) / 2) + (this.scroll_perc * ((this.data.width - this.data.handleRadius) / 2)), 0, 0.0001);
        this.handleEl.setAttribute('position', /* ((this.data.width/2)+this.data.scrollPadding)+' '+*/`${scroll_pos} 0 ${this.data.scrollZOffset + 0.0005}`);
    },
    mouseMove(e) {
        if (this.isDragging) {
            const pos = this.railEl.object3D.worldToLocal(e.detail.intersection.point);
            this.slide(pos.x - this.handlePos + this.data.handleRadius);
        }
    },
    getRailObject(object) {
        // Get the rounded shape geomtery.
        object.traverse((child) => {
            if (child.geometry && child.geometry.type === 'ShapeBufferGeometry') {
                this.progress = new THREE.Mesh(child.geometry.clone(), new THREE.MeshBasicMaterial({ color: this.data.progressColor }));
                this.progress.position.set(-this.data.width / 2, 0, 0.0001);
                this.progress.scale.set(0.00001, 1, 1);
                this.el.object3D.add(this.progress);
            }
        });
    },
});
