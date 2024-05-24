/* eslint-disable */
/* global AFRAME,THREE */
/**
 * Scroll Pane for aframe-material-collection. Expects
 * @namespace aframe-material-collection
 * @component ui-scroll-pane
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-scroll-pane', {
    schema: {
        height: { type: 'number', default: 0.8 },
        width: { type: 'number', default: 1.8 },
        scrollPadding: { type: 'number', default: 0.05 },
        scrollZOffset: { type: 'number', default: 0 },
        scrollHandleColor: { default: '#009688' },
        intersectableClass: { default: 'interactable' },
        cameraEl: { type: 'selector' },
        lookControlsComponent: { default: 'look-controls' },
    },
    init() {
        // Setup scroll bar and panel backing.
        this.setupElements();
        // Grab content container.
        this.container = this.el.querySelector('.container');
        if (typeof this.container === 'undefined') {
            throw 'ui-scroll-pane needs an entity inside it with the class "container" - <a-entity class="container"></a-entity>';
        }
        // Setup scroll bar.
        this.scrollBarWidth = this.rail.getAttribute('width');
        this.container.setAttribute('position', `${-this.data.width / 2} ${this.data.height / 2} 0`);
        this.rail.setAttribute('position', `${(this.data.width / 2) + this.data.scrollPadding} 0 ${this.data.scrollZOffset + 0.0002}`);
        this.handle.setAttribute('position', `${(this.data.width / 2) + this.data.scrollPadding} 0 ${this.data.scrollZOffset + 0.0005}`);
        this.el.sceneEl.renderer.localClippingEnabled = true;

        // Setup content clips.
        this.content_clips = [
            new THREE.Plane(new THREE.Vector3(0, 1, 0), (this.data.height / 2)),
            new THREE.Plane(new THREE.Vector3(0, -1, 0), (this.data.height / 2)),
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), (this.data.width / 2)),
            new THREE.Plane(new THREE.Vector3(1, 0, 0), (this.data.width / 2)),
        ];
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
        const mousemove = e => this.mouseMove(e);
        // Start scroll
        this.handle.addEventListener('mousedown', (e) => {
            // Pause look controls to allow scrolling
            playPauseCamera('pause');
            this.isDragging = true;
            // Store the start point offset
            this.handlePos = this.handle.object3D.worldToLocal(e.detail.intersection.point).y;
            this.backgroundPanel.addEventListener('ui-mousemove', mousemove);
            // Start changes
            UI.utils.isChanging(this.el.sceneEl, this.handle.object3D.uuid);
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
                UI.utils.stoppedChanging(this.handle.object3D.uuid);
                // Prevent default behaviour of event
                UI.utils.preventDefault(e);
            }
        };
        this.backgroundPanel.addEventListener('mouseup', endScroll);
        this.backgroundPanel.addEventListener('mouseleave', endScroll);
        // // Handle clicks on rail to scroll
        this.rail.addEventListener('mousedown', (e) => {
            UI.utils.isChanging(this.el.sceneEl, this.handle.object3D.uuid);
            // Pause look controls
            this.isDragging = true;
            // Reset handle pos to center of handle
            this.handlePos = 0;
            // Scroll immediately and register mouse move events.
            this.scroll(this.rail.object3D.worldToLocal(e.detail.intersection.point).y);
            this.backgroundPanel.addEventListener('ui-mousemove', mousemove);
            // Prevent default behaviour of event
            UI.utils.preventDefault(e);
        });

        // Setup content clips after the scene is loaded to be able to access all entity materials

        // update content clips world positions from this current element.

        this.updateContent();
        this.el.emit('scroll-pane-loaded');
        this.setupMouseWheelScroll();

        // Expose methods to the element to update/set the content of the scroll pane.
        this.el.setContent = this.setContent.bind(this);
        this.el.updateContent = this.updateContent.bind(this);
        this.el.scroll = this.scroll.bind(this);
    },
    updateContentClips() {
        this.el.sceneEl.object3D.updateMatrixWorld();
        // update content clips world positions from this current element.
        this.content_clips[0].set(new THREE.Vector3(0, 1, 0), (this.data.height / 2));
        this.content_clips[1].set(new THREE.Vector3(0, -1, 0), (this.data.height / 2));
        this.content_clips[2].set(new THREE.Vector3(-1, 0, 0), (this.data.width / 2));
        this.content_clips[3].set(new THREE.Vector3(1, 0, 0), (this.data.width / 2));
        // this.el.sceneEl.object3D.updateMatrixWorld();
        this.content_clips[0].applyMatrix4(this.el.object3D.matrixWorld);
        this.content_clips[1].applyMatrix4(this.el.object3D.matrixWorld);
        this.content_clips[2].applyMatrix4(this.el.object3D.matrixWorld);
        this.content_clips[3].applyMatrix4(this.el.object3D.matrixWorld);
    },
    setContent(body, noAutoReload) {
        if (this.container) {
            // Remove all children in the container and all yoga nodes
            while (this.container.firstChild) {
                const child = this.container.firstChild;
                if (this.container.yoga_node && child.yoga_node) {
                    this.container.yoga_node.removeChild(child.yoga_node);
                }
                if (child.object3D) {
                    UI.utils.clearObject(child.object3D);
                }
                this.container.removeChild(child);
                this.container.firstChild = null;
            }
            // Set the content in the scroll pane.
            return new Promise((resolve) => {
                const loadedWrapper = document.createElement('a-entity');
                loadedWrapper.setAttribute('visible', false);
                loadedWrapper.insertAdjacentHTML('afterbegin', body);
                loadedWrapper.addEventListener('loaded', (e) => {
                    // Trigger an update to redraw scrollbars and fire change events.
                    if (!noAutoReload) this.updateContent();
                    resolve(loadedWrapper);
                    loadedWrapper.setAttribute('visible', true);
                });
                this.container.appendChild(loadedWrapper);
            });
        }
    },
    updateContent(should_not_scroll) {
        this.updateContentClips();
        this.currentUuid = THREE.Math.generateUUID();
        UI.utils.isChanging(this.el.sceneEl, this.currentUuid);
        this.setChildClips();
        if (typeof Yoga !== 'undefined') this.initialiseYoga(this.container, this.data.width * 100);
        this.container.yoga_node.calculateLayout(this.data.width * 100, 'auto', Yoga.DIRECTION_LTR);
        this.content_height = Number.NEGATIVE_INFINITY;
        if (typeof Yoga !== 'undefined') this.updateYoga(this.container);

        this.handleSize = THREE.Math.clamp((this.data.height / this.content_height), 0.1, 1);
        this.handle.setAttribute('width', this.handleSize === 1 ? 0.01 : 0.1);
        this.rail.setAttribute('width', this.handleSize === 1 ? 0.01 : 0.1);
        this.rail.setAttribute('color', this.handleSize === 1 ? '#efefef' : '#fff');
        this.handle.setAttribute('height', this.data.height * this.handleSize);
        if (!should_not_scroll) {
            this.container.object3D.position.y = this.data.height / 2;
            this.handle.setAttribute('position', `${(this.data.width / 2) + this.data.scrollPadding} ${(this.data.height - (this.data.height * this.handleSize)) / 2} ${this.data.scrollZOffset + 0.0005}`);
        }
    },
    mouseMove(e) {
        if (this.isDragging) {
            const pos = this.rail.object3D.worldToLocal(e.detail.intersection.point);
            this.scroll(pos.y - this.handlePos);
        }
    },
    scroll(positionY) {
        const min = (-this.data.height / 2) + (this.data.height * this.handleSize) / 2;
        const max = (this.data.height / 2) - (this.data.height * this.handleSize) / 2;
        // Set scroll position with start point offset.
        const scroll_pos = THREE.Math.clamp(positionY, min, max);
        const scroll_perc = this.handleSize === 1 ? 0 : 1 - ((scroll_pos - min) / (max - min));
        this.container.object3D.position.y = ((this.content_height - this.data.height) * scroll_perc) + (this.data.height / 2);
        this.handle.setAttribute('position', `${(this.data.width / 2) + this.data.scrollPadding} ${scroll_pos} ${this.data.scrollZOffset + 0.0005}`);
    },
    setupMouseWheelScroll() {
        this.backgroundPanel.addEventListener('ui-mousewheel', (e) => {
            if (this.handleSize !== 1) {
                // Start changes
                UI.utils.isChanging(this.el.sceneEl, this.el.object3D.uuid);
                this.scroll(this.handle.getAttribute('position').y + (e.detail.evt.deltaY < 0 ? 0.1 : -0.1));
                // Stop changes
                UI.utils.stoppedChanging(this.el.object3D.uuid);
                UI.utils.preventDefault(e);
            }
        });
    },
    setupElements() {
        // Setup background with mouse input to catch mouse move events when not exactly over the scroll bar.
        this.backgroundPanel = document.createElement('a-plane');
        this.backgroundPanel.setAttribute('class', `background ${this.data.intersectableClass}`);
        this.backgroundPanel.setAttribute('width', this.data.width + 1);
        this.backgroundPanel.setAttribute('height', this.data.height + 1);
        this.backgroundPanel.setAttribute('position', '0 0 -0.013');
        this.backgroundPanel.setAttribute('opacity', 0.0001);//
        this.backgroundPanel.setAttribute('transparent', true);

        this.el.appendChild(this.backgroundPanel);

        // Add scroll bar rail.
        this.rail = document.createElement('a-plane');
        this.rail.setAttribute('class', `rail ${this.data.intersectableClass}`);
        this.rail.setAttribute('width', 0.1);
        this.rail.setAttribute('height', this.data.height);
        this.rail.setAttribute('shader', 'flat');
        this.el.appendChild(this.rail);

        // Add scroll bar handle.
        this.handle = document.createElement('a-plane');
        this.handle.setAttribute('class', `handle ${this.data.intersectableClass}`);
        this.handle.setAttribute('width', 0.1);
        this.handle.setAttribute('height', this.data.height);
        this.handle.setAttribute('color', this.data.scrollHandleColor);
        this.handle.setAttribute('shader', 'flat');
        this.el.appendChild(this.handle);
    },
    setupYogaNode(node, width, height, properties) {
        // Parse yoga properties and call the yoga methods to setup this layout node.
        if (!properties.hasOwnProperty('setWidth'))node.setWidth(width);
        if (!properties.hasOwnProperty('setHeight'))node.setHeight(height);
        for (const method in properties) {
            if (properties.hasOwnProperty(method) && method.indexOf('Edge') === -1) {
                if (['setMarginLeft', 'setMarginPercentLeft', 'setPaddingLeft', 'setBorderLeft', 'setPositionLeft', 'setPositionPercentLeft']
                    .indexOf(method) > -1) {
                    node[method](Yoga.EDGE_LEFT, properties[method]);
                } else if (['setMarginRight', 'setMarginPercentRight', 'setPaddingRight', 'setBorderRight', 'setPositionRight', 'setPositionPercentRight']
                    .indexOf(method) > -1) {
                    node[method](Yoga.EDGE_RIGHT, properties[method]);
                } else if (['setMarginTop', 'setMarginPercentTop', 'setPaddingTop', 'setBorderTop', 'setPositionTop', 'setPositionPercentTop']
                    .indexOf(method) > -1) {
                    node[method](Yoga.EDGE_TOP, properties[method]);
                } else if (['setMarginBottom', 'setMarginPercentBottom', 'setPaddingBottom', 'setBorderBottom', 'setPositionBottom', 'setPositionPercentBottom']
                    .indexOf(method) > -1) {
                    node[method](Yoga.EDGE_BOTTOM, properties[method]);
                } else if (['setMargin', 'setMarginPercent', 'setPadding', 'setBorder', 'setPosition', 'setPositionPercent']
                    .indexOf(method) > -1) {
                    node[method](Yoga.EDGE_ALL, properties[method]);
                } else if (method.indexOf('setMarginAuto') > -1) {
                    const side = method.replace('setMarginAuto', '');
                    switch (side) {
                    case '':
                        node[method](Yoga.EDGE_ALL);
                        break;
                    case 'Left':
                        node[method](Yoga.EDGE_LEFT);
                        break;
                    case 'Right':
                        node[method](Yoga.EDGE_RIGHT);
                        break;
                    case 'Top':
                        node[method](Yoga.EDGE_TOP);
                        break;
                    case 'Bottom':
                        node[method](Yoga.EDGE_BOTTOM);
                        break;
                    }
                } else if (['setWidthAuto', 'setHeightAuto']
                    .indexOf(method) > -1) {
                    node[method]();
                } else {
                    node[method](properties[method]);
                }
            }
        }
    },
    initialiseYoga(parent) {
        // Traverse the tree and setup Yoga layout nodes with default settings
        // or settings specified in the elements yoga properties component.
        parent = parent || this.container;
        // Automatically detect the entity width / height by the element tagname.
        let width = 0; let
            height = 0;
        const geo = parent.getAttribute('geometry');
        switch (parent.tagName) {
        case 'A-TEXT':
        case 'A-TRIANGLE':
        case 'A-UI-TEXT-INPUT':
        case 'A-UI-NUMBER-INPUT':
        case 'A-UI-INT-INPUT':
        case 'A-UI-INPUT-TEXT':
        case 'A-UI-PASSWORD-INPUT':
            width = parent.getAttribute('width');
            height = parent.getAttribute('height');
            break;
        case 'A-UI-BUTTON':
        case 'A-PLANE':
        case 'A-ENTITY':
            width = Number(geo ? geo.width : parent.getAttribute('width'));
            height = Number(geo ? geo.height : parent.getAttribute('height'));
            break;
        case 'A-UI-FAB-BUTTON':
        case 'A-UI-FAB-BUTTON-SMALL':
        case 'A-CIRCLE':
            width = Number(geo ? geo.radius * 2 : (parent.getAttribute('radius') || 0) * 2);
            height = width;
            break;
        case 'A-RING':
            width = Number(geo ? geo['radius-outer'] * 2 : (parent.getAttribute('radius-outer') || 0) * 2);
            height = width;
            break;
        case 'A-UI-SLIDER':
        case 'A-UI-NUMBER':
        case 'A-UI-SWITCH':
        case 'A-UI-CHECKBOX':
        case 'A-UI-RADIO':
            const componentName = parent.tagName.substr(2).toLowerCase();
            width = parent.getAttribute(componentName).width;
            height = parent.getAttribute(componentName).height;
            break;
        }

        if (!parent.yoga_node) {
            parent.yoga_node = Yoga.Node.create();
            const ui_yoga = parent.getAttribute('ui-yoga');
            if (ui_yoga && parent.getYogaProperties) {
                this.setupYogaNode(parent.yoga_node, width ? width * 100 : 'auto', height ? height * 100 : 'auto',
                    parent.getYogaProperties());
            } else {
                parent.yoga_node.setWidth(width ? width * 100 : 'auto');
                parent.yoga_node.setHeight(height ? height * 100 : 'auto');
                parent.yoga_node.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
                parent.yoga_node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
                parent.yoga_node.setAlignContent(Yoga.ALIGN_AUTO);
                parent.yoga_node.setFlexWrap(Yoga.WRAP_WRAP);
            }
            // Add the yoga node to the Yoga tree.
            if (parent.parentElement && parent.parentElement.yoga_node) {
                // Default margin if none set;
                if (!ui_yoga) {
                    parent.yoga_node.setMargin(Yoga.EDGE_RIGHT, 5);
                    parent.yoga_node.setMargin(Yoga.EDGE_BOTTOM, 5);
                }
                parent.parentElement.yoga_node.insertChild(parent.yoga_node, parent.parentElement.yoga_node.getChildCount());
            } else {
                // Default root padding if none set;
                if (!ui_yoga) {
                    parent.yoga_node.setPadding(Yoga.EDGE_ALL, 2);
                }
            }
        }
        for (let i = 0; i < parent.childNodes.length; i++) {
            const child = parent.childNodes[i];
            if (child.nodeType === 1) {
                if (child.classList.contains('no-yoga-layout')) {
                    return;
                }
                this.initialiseYoga(child);
            }
        }
    },
    updateYoga(parent) {
        // Update the entity positions from the Yoga layout.
        for (let i = 0; i < parent.childNodes.length; i++) {
            const child = parent.childNodes[i];
            if (child.nodeType === 1) {
                if (child.classList.contains('no-yoga-layout')) {
                    return;
                }
                let position;
                if (child.tagName === 'A-ENTITY') {
                    position = {
                        x: (child.yoga_node.getComputedLeft() / 100),
                        y: (child.yoga_node.getComputedTop() / 100),
                    };
                } else {
                    position = {
                        x: (child.yoga_node.getComputedLeft() / 100) + (child.yoga_node.getComputedWidth() / 200),
                        y: (child.yoga_node.getComputedTop() / 100) + (child.yoga_node.getComputedHeight() / 200),
                    };
                }
                const highest = (child.yoga_node.getComputedTop() / 100) + (child.yoga_node.getComputedHeight() / 100);
                if (highest > this.content_height) {
                    this.content_height = highest;
                }
                child.setAttribute('position', `${position.x} ${-position.y} 0.0001`);// +child.getAttribute('position').z);
            }
            this.updateYoga(child);
        }
    },

    setChildClips(parent) {
        // Traverse the entity tree inside the content container and add content clips to each material found.
        parent = parent || this.container;
        for (let i = 0; i < parent.childNodes.length; i++) {
            const child = parent.childNodes[i];
            // if (child.nodeType === 1) {
            child._content_clips = this.content_clips;
            const traverse = () => {
                if (child.object3D) {
                    child.object3D.traverse((object) => {
                        if (object.material) {
                            // Add shader chunks to be able to clip shader materials - needed for <a-text> entities.
                            if (object.material.isRawShaderMaterial) {
                                object.material.onBeforeCompile = function (shader) {
                                    // const vertexParts = shader.vertexShader.split('\n');
                                    // const vertexMainIndex = vertexParts.indexOf('void main(void) {');
                                    // vertexParts.splice(vertexMainIndex, 0, '#include <clipping_planes_pars_vertex>');
                                    // vertexParts.splice(vertexMainIndex + 2, 0, '#include <begin_vertex>');
                                    // vertexParts.splice(vertexParts.length - 2, 0, '#include <project_vertex>');
                                    // vertexParts.splice(vertexParts.length - 2, 0, '#include <clipping_planes_vertex>');
                                    // shader.vertexShader = vertexParts.join('\n');
                                    // const fragmentParts = shader.fragmentShader.split('\n');
                                    // const fragmentMainIndex = fragmentParts.indexOf('void main() {');
                                    // fragmentParts.splice(fragmentMainIndex, 0, '#include <clipping_planes_pars_fragment>');
                                    // fragmentParts.splice(fragmentMainIndex + 2, 0, '#include <clipping_planes_fragment>');
                                    // shader.fragmentShader = fragmentParts.join('\n');
                                };
                                object.material.clipping = true;
                            }
                            // Set the content clipping planes.
                            object.material.clippingPlanes = this.content_clips;
                            object.material.clipShadows = true;
                            object.material.needsUpdate = true;
                        }
                    });
                }
            };
            // Wait for next tick - exokit required this.
            setTimeout(() => {
                if (child.getAttribute) {
                    const text = child.getAttribute('text');

                    if (text) {
                        // Wait for the font to load first.
                        child.addEventListener('textfontset', () => {
                            clearTimeout(this.fontRenderTimeout);
                            this.fontRenderTimeout = setTimeout(() => UI.utils.stoppedChanging(this.currentUuid), 500);
                            traverse();
                        });
                    } else {
                        traverse();
                    }
                }
            }, 0);
            // }
            // Recurse
            this.setChildClips(child);
        }
    },
});
