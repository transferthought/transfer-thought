/* eslint-disable */
import {
    BoxGeometry,
    BufferGeometry,
    Color,
    CylinderGeometry,
    DoubleSide,
    Euler,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    OctahedronGeometry,
    PlaneGeometry,
    Quaternion,
    Raycaster,
    SphereGeometry,
    TorusGeometry,
    Vector3,
} from 'three';

const TransformControls = function(camera, domElement) {
    if (domElement === undefined) {
        console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.');
        domElement = document;
    }

    Object3D.call(this);

    this.visible = false;
    this.domElement = domElement;

    const _gizmo = new TransformControlsGizmo();
    this.add(_gizmo);

    const _plane = new TransformControlsPlane();
    this.add(_plane);

    const scope = this;

    // Define properties with getters/setter
    // Setting the defined property will automatically trigger change event
    // Defined properties are passed down to gizmo and plane

    defineProperty('camera', camera);
    defineProperty('object', undefined);
    defineProperty('enabled', true);
    defineProperty('axis', null);
    defineProperty('mode', 'translate');
    defineProperty('snapDistanceToCamera', null);
    defineProperty('translationSnap', null);
    defineProperty('rotationSnap', null);
    defineProperty('scaleSnap', null);
    defineProperty('space', 'world');
    defineProperty('size', 1);
    defineProperty('dragging', false);
    defineProperty('showX', true);
    defineProperty('showY', true);
    defineProperty('showZ', true);

    const changeEvent = { type: 'change' };
    const mouseDownEvent = { type: 'mouseDown' };
    const mouseUpEvent = { type: 'mouseUp', mode: scope.mode };
    const objectChangeEvent = { type: 'objectChange' };

    // Reusable utility variables

    const raycaster = new Raycaster();

    function intersectObjectWithRay(object, raycaster, includeInvisible) {
        const allIntersections = raycaster.intersectObject(object, true);

        for (let i = 0; i < allIntersections.length; i++) {
            if (allIntersections[i].object.visible || includeInvisible) {
                return allIntersections[i];
            }
        }

        return false;
    }

    const _tempVector = new Vector3();
    const _tempVector2 = new Vector3();
    const _tempQuaternion = new Quaternion();
    const _unit = {
        X: new Vector3(1, 0, 0),
        Y: new Vector3(0, 1, 0),
        Z: new Vector3(0, 0, 1),
    };

    const pointStart = new Vector3();
    const pointEnd = new Vector3();
    const offset = new Vector3();
    const rotationAxis = new Vector3();
    const startNorm = new Vector3();
    const endNorm = new Vector3();
    let rotationAngle = 0;

    const cameraPosition = new Vector3();
    const cameraQuaternion = new Quaternion();
    const cameraScale = new Vector3();

    const parentPosition = new Vector3();
    const parentQuaternion = new Quaternion();
    const parentQuaternionInv = new Quaternion();
    const parentScale = new Vector3();

    const worldPositionStart = new Vector3();
    const worldQuaternionStart = new Quaternion();
    const worldScaleStart = new Vector3();

    const worldPosition = new Vector3();
    const worldQuaternion = new Quaternion();
    const worldQuaternionInv = new Quaternion();
    const worldScale = new Vector3();

    const eye = new Vector3();

    const positionStart = new Vector3();
    const quaternionStart = new Quaternion();
    const scaleStart = new Vector3();

    // TODO: remove properties unused in plane and gizmo

    defineProperty('worldPosition', worldPosition);
    defineProperty('worldPositionStart', worldPositionStart);
    defineProperty('worldQuaternion', worldQuaternion);
    defineProperty('worldQuaternionStart', worldQuaternionStart);
    defineProperty('cameraPosition', cameraPosition);
    defineProperty('cameraQuaternion', cameraQuaternion);
    defineProperty('pointStart', pointStart);
    defineProperty('pointEnd', pointEnd);
    defineProperty('rotationAxis', rotationAxis);
    defineProperty('rotationAngle', rotationAngle);
    defineProperty('eye', eye);

    {
        domElement.addEventListener('pointerdown', onPointerDown);
        domElement.addEventListener('pointermove', onPointerHover);
        scope.domElement.ownerDocument.addEventListener('pointerup', onPointerUp);
    }

    this.dispose = function() {
        domElement.removeEventListener('pointerdown', onPointerDown);
        domElement.removeEventListener('pointermove', onPointerHover);
        scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
        scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);

        this.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    };

    // Set current object
    this.attach = function(object) {
        this.object = object;
        this.visible = true;

        return this;
    };

    // Detatch from object
    this.detach = function() {
        this.object = undefined;
        this.visible = false;
        this.axis = null;

        return this;
    };

    // Defined getter, setter and store for a property
    function defineProperty(propName, defaultValue) {
        let propValue = defaultValue;

        Object.defineProperty(scope, propName, {
            get() {
                return propValue !== undefined ? propValue : defaultValue;
            },

            set(value) {
                if (propValue !== value) {
                    propValue = value;
                    _plane[propName] = value;
                    _gizmo[propName] = value;

                    scope.dispatchEvent({ type: `${propName}-changed`, value });
                    scope.dispatchEvent(changeEvent);
                }
            },
        });

        scope[propName] = defaultValue;
        _plane[propName] = defaultValue;
        _gizmo[propName] = defaultValue;
    }

    // updateMatrixWorld  updates key transformation variables
    this.updateMatrixWorld = function() {
        if (this.object !== undefined) {
            this.object.updateMatrixWorld();

            if (this.object.parent === null) {
                console.error('TransformControls: The attached 3D object must be a part of the scene graph.');
            } else {
                this.object.parent.matrixWorld.decompose(parentPosition, parentQuaternion, parentScale);
            }

            this.object.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);

            parentQuaternionInv.copy(parentQuaternion).invert();
            worldQuaternionInv.copy(worldQuaternion).invert();
        }

        this.camera.updateMatrixWorld();
        this.camera.matrixWorld.decompose(cameraPosition, cameraQuaternion, cameraScale);

        eye.copy(cameraPosition)
            .sub(worldPosition)
            .normalize();

        Object3D.prototype.updateMatrixWorld.call(this);
    };

    this.pointerHover = function(pointer) {
        if (this.object === undefined || this.dragging === true) return;

        raycaster.setFromCamera(pointer, this.camera);

        const intersect = intersectObjectWithRay(_gizmo.picker[this.mode], raycaster);

        if (intersect) {
            this.axis = intersect.object.name;
        } else {
            this.axis = null;
        }
    };

    this.pointerDown = function(pointer) {
        if (this.object === undefined || this.dragging === true || pointer.button !== 0) return;

        if (this.axis !== null) {
            raycaster.setFromCamera(pointer, this.camera);

            const planeIntersect = intersectObjectWithRay(_plane, raycaster, true);

            if (planeIntersect) {
                let { space } = this;

                if (this.mode === 'scale') {
                    space = 'local';
                } else if (this.axis === 'E' || this.axis === 'XYZE' || this.axis === 'XYZ') {
                    space = 'world';
                }

                if (space === 'local' && this.mode === 'rotate') {
                    const snap = this.rotationSnap;

                    if (this.axis === 'X' && snap) this.object.rotation.x = Math.round(this.object.rotation.x / snap) * snap;
                    if (this.axis === 'Y' && snap) this.object.rotation.y = Math.round(this.object.rotation.y / snap) * snap;
                    if (this.axis === 'Z' && snap) this.object.rotation.z = Math.round(this.object.rotation.z / snap) * snap;
                }

                this.object.updateMatrixWorld();
                this.object.parent.updateMatrixWorld();

                positionStart.copy(this.object.position);
                quaternionStart.copy(this.object.quaternion);
                scaleStart.copy(this.object.scale);

                this.object.matrixWorld.decompose(worldPositionStart, worldQuaternionStart, worldScaleStart);

                pointStart.copy(planeIntersect.point).sub(worldPositionStart);
            }

            this.dragging = true;
            mouseDownEvent.mode = this.mode;
            this.dispatchEvent(mouseDownEvent);
        }
    };

    this.pointerMove = function(pointer) {
        const { axis } = this;
        const { mode } = this;
        const { object } = this;
        let { space } = this;

        if (mode === 'scale') {
            space = 'local';
        } else if (axis === 'E' || axis === 'XYZE' || axis === 'XYZ') {
            space = 'world';
        }

        if (object === undefined || axis === null || this.dragging === false || pointer.button !== -1) return;

        raycaster.setFromCamera(pointer, this.camera);

        const planeIntersect = intersectObjectWithRay(_plane, raycaster, true);

        if (!planeIntersect) return;

        pointEnd.copy(planeIntersect.point).sub(worldPositionStart);

        offset.copy(pointEnd).sub(pointStart);

        if (space === 'local' && axis !== 'XYZ') {
            offset.applyQuaternion(worldQuaternionInv);
        }

        if (axis.indexOf('X') === -1) offset.x = 0;
        if (axis.indexOf('Y') === -1) offset.y = 0;
        if (axis.indexOf('Z') === -1) offset.z = 0;

        if (space === 'local' && axis !== 'XYZ') {
            offset.applyQuaternion(quaternionStart).divide(parentScale);
        } else {
            offset.applyQuaternion(parentQuaternionInv).divide(parentScale);
        }

        object.position.copy(offset).add(positionStart);

        // Apply translation snap
        if (this.snapDistanceToCamera) {
            const startDistanceToCamera = cameraPosition.distanceTo(worldPositionStart);
            const currentDistanceToCamera = cameraPosition.distanceTo(worldPosition);
            const ratio = startDistanceToCamera / currentDistanceToCamera;
            object.position.multiplyScalar(ratio);
        }
        this.children.forEach((child) => {
            child.lookAt(0, 0, 0);
        });
        this.dispatchEvent(changeEvent);
        this.dispatchEvent(objectChangeEvent);
    };

    this.pointerUp = function(pointer) {
        if (pointer.button !== 0) return;

        if (this.dragging && this.axis !== null) {
            mouseUpEvent.mode = this.mode;
            this.dispatchEvent(mouseUpEvent);
        }

        this.dragging = false;
        this.axis = null;
    };

    // normalize mouse / touch pointer and remap {x,y} to view space.

    function getPointer(event) {
        if (scope.domElement.ownerDocument.pointerLockElement) {
            return {
                x: 0,
                y: 0,
                button: event.button,
            };
        }

        const pointer = event.changedTouches ? event.changedTouches[0] : event;

        const rect = domElement.getBoundingClientRect();

        return {
            x: ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
            y: (-(pointer.clientY - rect.top) / rect.height) * 2 + 1,
            button: event.button,
        };
    }

    // mouse / touch event handlers

    function onPointerHover(event) {
        if (!scope.enabled) return;

        switch (event.pointerType) {
            case 'mouse':
            case 'pen':
                scope.pointerHover(getPointer(event));
                break;
        }
    }

    function onPointerDown(event) {
        if (!scope.enabled) return;

        scope.domElement.style.touchAction = 'none'; // disable touch scroll
        scope.domElement.ownerDocument.addEventListener('pointermove', onPointerMove);

        scope.pointerHover(getPointer(event));
        scope.pointerDown(getPointer(event));
    }

    function onPointerMove(event) {
        if (!scope.enabled) return;
        scope.pointerMove(getPointer(event));
    }

    function onPointerUp(event) {
        if (!scope.enabled) return;

        scope.domElement.style.touchAction = '';
        scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);

        scope.pointerUp(getPointer(event));
    }

    // TODO: deprecate

    this.getMode = function() {
        return scope.mode;
    };

    (this.setSnapDistanceToCamera = function(snapDistanceToCamera) {
        scope.snapDistanceToCamera = snapDistanceToCamera;
    }),
        (this.setMode = function(mode) {
            scope.mode = mode;
        });

    this.setTranslationSnap = function(translationSnap) {
        scope.translationSnap = translationSnap;
    };

    this.setRotationSnap = function(rotationSnap) {
        scope.rotationSnap = rotationSnap;
    };

    this.setScaleSnap = function(scaleSnap) {
        scope.scaleSnap = scaleSnap;
    };

    this.setSize = function(size) {
        scope.size = size;
    };

    this.setSpace = function(space) {
        scope.space = space;
    };

    this.update = function() {
        console.warn('THREE.TransformControls: update function has no more functionality and therefore has been deprecated.');
    };
};

TransformControls.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: TransformControls,

    isTransformControls: true,
});

var TransformControlsGizmo = function() {
    Object3D.call(this);

    this.type = 'TransformControlsGizmo';

    // shared materials

    const gizmoMaterial = new MeshBasicMaterial({
        depthTest: false,
        depthWrite: false,
        transparent: true,
        side: DoubleSide,
        fog: false,
        toneMapped: false,
    });

    const gizmoLineMaterial = new LineBasicMaterial({
        depthTest: false,
        depthWrite: false,
        transparent: true,
        linewidth: 1,
        fog: false,
        toneMapped: false,
    });

    // Make unique material for each axis/color

    const matInvisible = gizmoMaterial.clone();
    matInvisible.opacity = 0.15;

    const matHelper = gizmoMaterial.clone();
    matHelper.opacity = 0.33;

    const matRed = gizmoMaterial.clone();
    matRed.color.set(0xff0000);

    const matGreen = gizmoMaterial.clone();
    matGreen.color.set(0x00ff00);

    const matBlue = gizmoMaterial.clone();
    matBlue.color.set(0x0000ff);

    const matWhiteTransparent = gizmoMaterial.clone();
    matWhiteTransparent.opacity = 0.05;

    const matYellowTransparent = matWhiteTransparent.clone();
    matYellowTransparent.color.set(0xffff00);

    const matCyanTransparent = matWhiteTransparent.clone();
    matCyanTransparent.color.set(0x00ffff);

    const matMagentaTransparent = matWhiteTransparent.clone();
    matMagentaTransparent.color.set(0xff00ff);

    const matYellow = gizmoMaterial.clone();
    matYellow.color.set(0xffff00);

    const matLineRed = gizmoLineMaterial.clone();
    matLineRed.color.set(0xff0000);

    const matLineGreen = gizmoLineMaterial.clone();
    matLineGreen.color.set(0x00ff00);

    const matLineBlue = gizmoLineMaterial.clone();
    matLineBlue.color.set(0x0000ff);

    const matLineCyan = gizmoLineMaterial.clone();
    matLineCyan.color.set(0x00ffff);

    const matLineMagenta = gizmoLineMaterial.clone();
    matLineMagenta.color.set(0xff00ff);

    const matLineYellow = gizmoLineMaterial.clone();
    matLineYellow.color.set(0xffff00);

    const matLineGray = gizmoLineMaterial.clone();
    matLineGray.color.set(0x787878);

    const matLineYellowTransparent = matLineYellow.clone();
    matLineYellowTransparent.opacity = 0.25;

    // reusable geometry

    const arrowGeometry = new CylinderGeometry(0, 0.05, 0.2, 12, 1, false);

    const scaleHandleGeometry = new BoxGeometry(0.125, 0.125, 0.125);

    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 2, 0, 0], 3));

    const points = [];
    points.push(new THREE.Vector3(-1, -1, 0));
    points.push(new THREE.Vector3(1, -1, 0));
    points.push(new THREE.Vector3(1, 1, 0));
    points.push(new THREE.Vector3(-1, 1, 0));
    points.push(new THREE.Vector3(-1, -1, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
        color: 0x000000,
        dashSize: 0.1,
        gapSize: 0.05,
    });
    const dottedLine = new Line(geometry, material);
    dottedLine.computeLineDistances();

    const CircleGeometry = function(radius, arc) {
        const geometry = new BufferGeometry();
        const vertices = [];

        for (let i = 0; i <= 64 * arc; ++i) {
            vertices.push(0, Math.cos((i / 32) * Math.PI) * radius, Math.sin((i / 32) * Math.PI) * radius);
        }

        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

        return geometry;
    };

    // Special geometry for transform helper. If scaled with position vector it spans from [0,0,0] to position

    const TranslateHelperGeometry = function() {
        const geometry = new BufferGeometry();

        geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 1, 1], 3));

        return geometry;
    };

    // Gizmo definitions - custom hierarchy definitions for setupGizmo() function

    const gizmoTranslate = {
        // X: [
        //     [new Mesh(arrowGeometry, matRed), [1, 0, 0], [0, 0, -Math.PI / 2], null, 'fwd'],
        //     [new Mesh(arrowGeometry, matRed), [1, 0, 0], [0, 0, Math.PI / 2], null, 'bwd'],
        //     [new Line(lineGeometry, matLineRed)],
        // ],
        // Y: [
        //     [new Mesh(arrowGeometry, matGreen), [0, 1, 0], null, null, 'fwd'],
        //     [new Mesh(arrowGeometry, matGreen), [0, 1, 0], [Math.PI, 0, 0], null, 'bwd'],
        //     [new Line(lineGeometry, matLineGreen), null, [0, 0, Math.PI / 2]],
        // ],
        // Z: [
        //     [new Mesh(arrowGeometry, matBlue), [0, 0, 1], [Math.PI / 2, 0, 0], null, 'fwd'],
        //     [new Mesh(arrowGeometry, matBlue), [0, 0, 1], [-Math.PI / 2, 0, 0], null, 'bwd'],
        //     [new Line(lineGeometry, matLineBlue), null, [0, -Math.PI / 2, 0]],
        // ],
        XYZ: [[new Mesh(new PlaneGeometry(2, 2), matWhiteTransparent.clone()), [0, 0, 0]], [dottedLine]],
        // XY: [
        //     [new Mesh(new PlaneGeometry(0.295, 0.295), matYellowTransparent.clone()), [0.15, 0.15, 0]],
        //     [new Line(lineGeometry, matLineYellow), [0.18, 0.3, 0], null, [0.125, 1, 1]],
        //     [new Line(lineGeometry, matLineYellow), [0.3, 0.18, 0], [0, 0, Math.PI / 2], [0.125, 1, 1]],
        // ],
        // YZ: [
        //     [new Mesh(new PlaneGeometry(0.295, 0.295), matCyanTransparent.clone()), [0, 0.15, 0.15], [0, Math.PI / 2, 0]],
        //     [new Line(lineGeometry, matLineCyan), [0, 0.18, 0.3], [0, 0, Math.PI / 2], [0.125, 1, 1]],
        //     [new Line(lineGeometry, matLineCyan), [0, 0.3, 0.18], [0, -Math.PI / 2, 0], [0.125, 1, 1]],
        // ],
        // XZ: [
        //     [new Mesh(new PlaneGeometry(0.295, 0.295), matMagentaTransparent.clone()), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]],
        //     [new Line(lineGeometry, matLineMagenta), [0.18, 0, 0.3], null, [0.125, 1, 1]],
        //     [new Line(lineGeometry, matLineMagenta), [0.3, 0, 0.18], [0, -Math.PI / 2, 0], [0.125, 1, 1]],
        // ],
    };

    const pickerTranslate = {
        XYZ: [[new Mesh(new PlaneGeometry(2, 2), matInvisible)]],
    };

    const helperTranslate = {
        START: [[new Mesh(new OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']],
        END: [[new Mesh(new OctahedronGeometry(0.01, 2), matHelper), null, null, null, 'helper']],
        DELTA: [[new Line(TranslateHelperGeometry(), matHelper), null, null, null, 'helper']],
        // X: [
        //     [new Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper'],
        // ],
        // Y: [
        //     [new Line(lineGeometry, matHelper.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper'],
        // ],
        // Z: [
        //     [new Line(lineGeometry, matHelper.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], 'helper'],
        // ],
    };

    const gizmoRotate = {
        X: [[new Line(CircleGeometry(1, 0.5), matLineRed)], [new Mesh(new OctahedronGeometry(0.04, 0), matRed), [0, 0, 0.99], null, [1, 3, 1]]],
        Y: [
            [new Line(CircleGeometry(1, 0.5), matLineGreen), null, [0, 0, -Math.PI / 2]],
            [new Mesh(new OctahedronGeometry(0.04, 0), matGreen), [0, 0, 0.99], null, [3, 1, 1]],
        ],
        Z: [
            [new Line(CircleGeometry(1, 0.5), matLineBlue), null, [0, Math.PI / 2, 0]],
            [new Mesh(new OctahedronGeometry(0.04, 0), matBlue), [0.99, 0, 0], null, [1, 3, 1]],
        ],
        E: [
            [new Line(CircleGeometry(1.25, 1), matLineYellowTransparent), null, [0, Math.PI / 2, 0]],
            [new Mesh(new CylinderGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent), [1.17, 0, 0], [0, 0, -Math.PI / 2], [1, 1, 0.001]],
            [new Mesh(new CylinderGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent), [-1.17, 0, 0], [0, 0, Math.PI / 2], [1, 1, 0.001]],
            [new Mesh(new CylinderGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent), [0, -1.17, 0], [Math.PI, 0, 0], [1, 1, 0.001]],
            [new Mesh(new CylinderGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent), [0, 1.17, 0], [0, 0, 0], [1, 1, 0.001]],
        ],
        XYZE: [[new Line(CircleGeometry(1, 1), matLineGray), null, [0, Math.PI / 2, 0]]],
    };

    const helperRotate = {
        AXIS: [[new Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']],
    };

    const pickerRotate = {
        X: [[new Mesh(new TorusGeometry(1, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]],
        Y: [[new Mesh(new TorusGeometry(1, 0.1, 4, 24), matInvisible), [0, 0, 0], [Math.PI / 2, 0, 0]]],
        Z: [[new Mesh(new TorusGeometry(1, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, 0, -Math.PI / 2]]],
        E: [[new Mesh(new TorusGeometry(1.25, 0.1, 2, 24), matInvisible)]],
        XYZE: [[new Mesh(new SphereGeometry(0.7, 10, 8), matInvisible)]],
    };

    const gizmoScale = {
        X: [
            [new Mesh(scaleHandleGeometry, matRed), [0.8, 0, 0], [0, 0, -Math.PI / 2]],
            [new Line(lineGeometry, matLineRed), null, null, [0.8, 1, 1]],
        ],
        Y: [
            [new Mesh(scaleHandleGeometry, matGreen), [0, 0.8, 0]],
            [new Line(lineGeometry, matLineGreen), null, [0, 0, Math.PI / 2], [0.8, 1, 1]],
        ],
        Z: [
            [new Mesh(scaleHandleGeometry, matBlue), [0, 0, 0.8], [Math.PI / 2, 0, 0]],
            [new Line(lineGeometry, matLineBlue), null, [0, -Math.PI / 2, 0], [0.8, 1, 1]],
        ],
        XY: [
            [new Mesh(scaleHandleGeometry, matYellowTransparent), [0.85, 0.85, 0], null, [2, 2, 0.2]],
            [new Line(lineGeometry, matLineYellow), [0.855, 0.98, 0], null, [0.125, 1, 1]],
            [new Line(lineGeometry, matLineYellow), [0.98, 0.855, 0], [0, 0, Math.PI / 2], [0.125, 1, 1]],
        ],
        YZ: [
            [new Mesh(scaleHandleGeometry, matCyanTransparent), [0, 0.85, 0.85], null, [0.2, 2, 2]],
            [new Line(lineGeometry, matLineCyan), [0, 0.855, 0.98], [0, 0, Math.PI / 2], [0.125, 1, 1]],
            [new Line(lineGeometry, matLineCyan), [0, 0.98, 0.855], [0, -Math.PI / 2, 0], [0.125, 1, 1]],
        ],
        XZ: [
            [new Mesh(scaleHandleGeometry, matMagentaTransparent), [0.85, 0, 0.85], null, [2, 0.2, 2]],
            [new Line(lineGeometry, matLineMagenta), [0.855, 0, 0.98], null, [0.125, 1, 1]],
            [new Line(lineGeometry, matLineMagenta), [0.98, 0, 0.855], [0, -Math.PI / 2, 0], [0.125, 1, 1]],
        ],
        XYZX: [[new Mesh(new BoxGeometry(0.125, 0.125, 0.125), matWhiteTransparent.clone()), [1.1, 0, 0]]],
        XYZY: [[new Mesh(new BoxGeometry(0.125, 0.125, 0.125), matWhiteTransparent.clone()), [0, 1.1, 0]]],
        XYZZ: [[new Mesh(new BoxGeometry(0.125, 0.125, 0.125), matWhiteTransparent.clone()), [0, 0, 1.1]]],
    };

    const pickerScale = {
        X: [[new Mesh(new CylinderGeometry(0.2, 0, 0.8, 4, 1, false), matInvisible), [0.5, 0, 0], [0, 0, -Math.PI / 2]]],
        Y: [[new Mesh(new CylinderGeometry(0.2, 0, 0.8, 4, 1, false), matInvisible), [0, 0.5, 0]]],
        Z: [[new Mesh(new CylinderGeometry(0.2, 0, 0.8, 4, 1, false), matInvisible), [0, 0, 0.5], [Math.PI / 2, 0, 0]]],
        XY: [[new Mesh(scaleHandleGeometry, matInvisible), [0.85, 0.85, 0], null, [3, 3, 0.2]]],
        YZ: [[new Mesh(scaleHandleGeometry, matInvisible), [0, 0.85, 0.85], null, [0.2, 3, 3]]],
        XZ: [[new Mesh(scaleHandleGeometry, matInvisible), [0.85, 0, 0.85], null, [3, 0.2, 3]]],
        XYZX: [[new Mesh(new BoxGeometry(0.2, 0.2, 0.2), matInvisible), [1.1, 0, 0]]],
        XYZY: [[new Mesh(new BoxGeometry(0.2, 0.2, 0.2), matInvisible), [0, 1.1, 0]]],
        XYZZ: [[new Mesh(new BoxGeometry(0.2, 0.2, 0.2), matInvisible), [0, 0, 1.1]]],
    };

    const helperScale = {
        X: [[new Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']],
        Y: [[new Line(lineGeometry, matHelper.clone()), [0, -1e3, 0], [0, 0, Math.PI / 2], [1e6, 1, 1], 'helper']],
        Z: [[new Line(lineGeometry, matHelper.clone()), [0, 0, -1e3], [0, -Math.PI / 2, 0], [1e6, 1, 1], 'helper']],
    };

    // Creates an Object3D with gizmos described in custom hierarchy definition.

    const setupGizmo = function(gizmoMap) {
        const gizmo = new Object3D();

        for (const name in gizmoMap) {
            for (let i = gizmoMap[name].length; i--; ) {
                const object = gizmoMap[name][i][0].clone();
                const position = gizmoMap[name][i][1];
                const rotation = gizmoMap[name][i][2];
                const scale = gizmoMap[name][i][3];
                const tag = gizmoMap[name][i][4];

                // name and tag properties are essential for picking and updating logic.
                object.name = name;
                object.tag = tag;

                if (position) {
                    object.position.set(position[0], position[1], position[2]);
                }

                if (rotation) {
                    object.rotation.set(rotation[0], rotation[1], rotation[2]);
                }

                if (scale) {
                    object.scale.set(scale[0], scale[1], scale[2]);
                }

                object.updateMatrix();

                const tempGeometry = object.geometry.clone();
                tempGeometry.applyMatrix4(object.matrix);
                object.geometry = tempGeometry;
                object.renderOrder = Infinity;

                object.position.set(0, 0, 0);
                object.rotation.set(0, 0, 0);
                object.scale.set(1, 1, 1);

                gizmo.add(object);
            }
        }

        return gizmo;
    };

    // Reusable utility variables

    const tempVector = new Vector3(0, 0, 0);
    const tempEuler = new Euler();
    const alignVector = new Vector3(0, 1, 0);
    const zeroVector = new Vector3(0, 0, 0);
    const lookAtMatrix = new Matrix4();
    const tempQuaternion = new Quaternion();
    const tempQuaternion2 = new Quaternion();
    const identityQuaternion = new Quaternion();

    const unitX = new Vector3(1, 0, 0);
    const unitY = new Vector3(0, 1, 0);
    const unitZ = new Vector3(0, 0, 1);

    // Gizmo creation

    this.gizmo = {};
    this.picker = {};
    this.helper = {};

    this.add((this.gizmo.translate = setupGizmo(gizmoTranslate)));
    this.add((this.gizmo.rotate = setupGizmo(gizmoRotate)));
    this.add((this.gizmo.scale = setupGizmo(gizmoScale)));
    this.add((this.picker.translate = setupGizmo(pickerTranslate)));
    this.add((this.picker.rotate = setupGizmo(pickerRotate)));
    this.add((this.picker.scale = setupGizmo(pickerScale)));
    this.add((this.helper.translate = setupGizmo(helperTranslate)));
    this.add((this.helper.rotate = setupGizmo(helperRotate)));
    this.add((this.helper.scale = setupGizmo(helperScale)));

    // Pickers should be hidden always

    this.picker.translate.visible = false;
    this.picker.rotate.visible = false;
    this.picker.scale.visible = false;

    // updateMatrixWorld will update transformations and appearance of individual handles

    this.updateMatrixWorld = function() {
        let { space } = this;

        if (this.mode === 'scale') space = 'local'; // scale always oriented to local rotation

        const quaternion = space === 'local' ? this.worldQuaternion : identityQuaternion;

        // Show only gizmos for current transform mode

        this.gizmo.translate.visible = this.mode === 'translate';
        this.gizmo.rotate.visible = this.mode === 'rotate';
        this.gizmo.scale.visible = this.mode === 'scale';

        this.helper.translate.visible = this.mode === 'translate';
        this.helper.rotate.visible = this.mode === 'rotate';
        this.helper.scale.visible = this.mode === 'scale';

        let handles = [];
        handles = handles.concat(this.picker[this.mode].children);
        handles = handles.concat(this.gizmo[this.mode].children);
        handles = handles.concat(this.helper[this.mode].children);

        for (let i = 0; i < handles.length; i++) {
            var handle = handles[i];

            // hide aligned to camera

            handle.visible = true;
            // handle.rotation.set(0, 0, 0);
            handle.position.copy(this.worldPosition);

            var factor;

            if (this.camera.isOrthographicCamera) {
                factor = (this.camera.top - this.camera.bottom) / this.camera.zoom;
            } else {
                factor =
                    this.worldPosition.distanceTo(this.cameraPosition) * Math.min((1.9 * Math.tan((Math.PI * this.camera.fov) / 360)) / this.camera.zoom, 7);
            }

            // TODO dynamicly set the size based on bounding box of selected element
            if (this.object && this.object.scale) {
                // const mesh = this.object.el.getObject3D('mesh');
                // if (mesh && mesh.geometry) {
                //     mesh.geometry.computeBoundingBox();
                //     const boundingBox = mesh.geometry.boundingBox;
                //     const xLength = Math.abs(boundingBox.max.x - boundingBox.min.x);
                //     const yLength = Math.abs(boundingBox.max.y - boundingBox.min.y);
                //     const zLength = Math.abs(boundingBox.max.z - boundingBox.min.z);
                //     console.log('LENGTHS', xLength, yLength, zLength, xLength * yLength);
                // }
                // debugger;
                // factor = Math.pow(this.object.scale.x, 2.4) / (2 * factor);
                // handle.scale.set(1, 1, 1).multiplyScalar((factor * this.size) / 40);
                // handle.scale.set(1, 1, 1).multiplyScalar(factor * this.size);
                // handle.scale.set(1, 1, 1).multiplyScalar((factor * this.size) / 7);
                // factor = this.object.scale.x - factor / 6;

                // mess with this multiplier, should get smaller as the object gets closer
                // const multiplier = 0.55;
                // const multiplierMin = Math.min(0.3, factor / 10);
                // const multiplierMax = Math.max(multiplierMin);
                const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
                // const multiplier = clamp(this.object.scale.x / factor, 0.3, 0.6);

                const ratio = this.object.scale.x / 20;
                const multiplier = clamp(ratio * 0.6, 0.3, 0.55);

                // handle.scale.set(1, 1, 1).multiplyScalar(this.object.scale.x * multiplier * this.size);
                handle.scale.set(1, 1, 1).multiplyScalar((factor * this.size) / 7);
            } else {
                handle.scale.set(1, 1, 1).multiplyScalar((factor * this.size) / 7);
            }

            // TODO: simplify helpers and consider decoupling from gizmo

            if (handle.tag === 'helper') {
                handle.visible = false;

                if (handle.name === 'AXIS') {
                    handle.position.copy(this.worldPositionStart);
                    handle.visible = !!this.axis;

                    if (this.axis === 'X') {
                        tempQuaternion.setFromEuler(tempEuler.set(0, 0, 0));
                        handle.quaternion.copy(quaternion).multiply(tempQuaternion);

                        if (
                            Math.abs(
                                alignVector
                                    .copy(unitX)
                                    .applyQuaternion(quaternion)
                                    .dot(this.eye)
                            ) > 0.9
                        ) {
                            handle.visible = false;
                        }
                    }

                    if (this.axis === 'Y') {
                        tempQuaternion.setFromEuler(tempEuler.set(0, 0, Math.PI / 2));
                        handle.quaternion.copy(quaternion).multiply(tempQuaternion);

                        if (
                            Math.abs(
                                alignVector
                                    .copy(unitY)
                                    .applyQuaternion(quaternion)
                                    .dot(this.eye)
                            ) > 0.9
                        ) {
                            handle.visible = false;
                        }
                    }

                    if (this.axis === 'Z') {
                        tempQuaternion.setFromEuler(tempEuler.set(0, Math.PI / 2, 0));
                        handle.quaternion.copy(quaternion).multiply(tempQuaternion);

                        if (
                            Math.abs(
                                alignVector
                                    .copy(unitZ)
                                    .applyQuaternion(quaternion)
                                    .dot(this.eye)
                            ) > 0.9
                        ) {
                            handle.visible = false;
                        }
                    }

                    if (this.axis === 'XYZE') {
                        tempQuaternion.setFromEuler(tempEuler.set(0, Math.PI / 2, 0));
                        alignVector.copy(this.rotationAxis);
                        handle.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(zeroVector, alignVector, unitY));
                        handle.quaternion.multiply(tempQuaternion);
                        handle.visible = this.dragging;
                    }

                    if (this.axis === 'E') {
                        handle.visible = false;
                    }
                } else if (handle.name === 'START') {
                    handle.position.copy(this.worldPositionStart);
                    handle.visible = this.dragging;
                } else if (handle.name === 'END') {
                    handle.position.copy(this.worldPosition);
                    handle.visible = this.dragging;
                } else if (handle.name === 'DELTA') {
                    handle.position.copy(this.worldPositionStart);
                    handle.quaternion.copy(this.worldQuaternionStart);
                    tempVector
                        .set(1e-10, 1e-10, 1e-10)
                        .add(this.worldPositionStart)
                        .sub(this.worldPosition)
                        .multiplyScalar(-1);
                    tempVector.applyQuaternion(this.worldQuaternionStart.clone().invert());
                    handle.scale.copy(tempVector);
                    handle.visible = this.dragging;
                } else {
                    handle.quaternion.copy(quaternion);

                    if (this.dragging) {
                        handle.position.copy(this.worldPositionStart);
                    } else {
                        handle.position.copy(this.worldPosition);
                    }

                    if (this.axis) {
                        handle.visible = this.axis.search(handle.name) !== -1;
                    }
                }

                // If updating helper, skip rest of the loop
                continue;
            }

            // Align handles to current local or world rotation

            // handle.quaternion.copy(quaternion);

            if (this.mode === 'translate' || this.mode === 'scale') {
                // Hide translate and scale axis facing the camera

                const AXIS_HIDE_TRESHOLD = 0.99;
                const PLANE_HIDE_TRESHOLD = 0.2;
                const AXIS_FLIP_TRESHOLD = 0.0;

                if (handle.name === 'X' || handle.name === 'XYZX') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitX)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) > AXIS_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                if (handle.name === 'Y' || handle.name === 'XYZY') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitY)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) > AXIS_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                if (handle.name === 'Z' || handle.name === 'XYZZ') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitZ)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) > AXIS_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                if (handle.name === 'XY') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitZ)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) < PLANE_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                if (handle.name === 'YZ') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitX)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) < PLANE_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                if (handle.name === 'XZ') {
                    if (
                        Math.abs(
                            alignVector
                                .copy(unitY)
                                .applyQuaternion(quaternion)
                                .dot(this.eye)
                        ) < PLANE_HIDE_TRESHOLD
                    ) {
                        handle.scale.set(1e-10, 1e-10, 1e-10);
                        handle.visible = false;
                    }
                }

                // Flip translate and scale axis ocluded behind another axis

                if (handle.name.search('X') !== -1) {
                    if (
                        alignVector
                            .copy(unitX)
                            .applyQuaternion(quaternion)
                            .dot(this.eye) < AXIS_FLIP_TRESHOLD
                    ) {
                        if (handle.tag === 'fwd') {
                            handle.visible = false;
                        } else {
                            handle.scale.x *= -1;
                        }
                    } else if (handle.tag === 'bwd') {
                        handle.visible = false;
                    }
                }

                if (handle.name.search('Y') !== -1) {
                    if (
                        alignVector
                            .copy(unitY)
                            .applyQuaternion(quaternion)
                            .dot(this.eye) < AXIS_FLIP_TRESHOLD
                    ) {
                        if (handle.tag === 'fwd') {
                            handle.visible = false;
                        } else {
                            handle.scale.y *= -1;
                        }
                    } else if (handle.tag === 'bwd') {
                        handle.visible = false;
                    }
                }

                if (handle.name.search('Z') !== -1) {
                    if (
                        alignVector
                            .copy(unitZ)
                            .applyQuaternion(quaternion)
                            .dot(this.eye) < AXIS_FLIP_TRESHOLD
                    ) {
                        if (handle.tag === 'fwd') {
                            handle.visible = false;
                        } else {
                            handle.scale.z *= -1;
                        }
                    } else if (handle.tag === 'bwd') {
                        handle.visible = false;
                    }
                }
            } else if (this.mode === 'rotate') {
                // Align handles to current local or world rotation

                tempQuaternion2.copy(quaternion);
                alignVector.copy(this.eye).applyQuaternion(tempQuaternion.copy(quaternion).invert());

                if (handle.name.search('E') !== -1) {
                    handle.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(this.eye, zeroVector, unitY));
                }

                if (handle.name === 'X') {
                    tempQuaternion.setFromAxisAngle(unitX, Math.atan2(-alignVector.y, alignVector.z));
                    tempQuaternion.multiplyQuaternions(tempQuaternion2, tempQuaternion);
                    handle.quaternion.copy(tempQuaternion);
                }

                if (handle.name === 'Y') {
                    tempQuaternion.setFromAxisAngle(unitY, Math.atan2(alignVector.x, alignVector.z));
                    tempQuaternion.multiplyQuaternions(tempQuaternion2, tempQuaternion);
                    handle.quaternion.copy(tempQuaternion);
                }

                if (handle.name === 'Z') {
                    tempQuaternion.setFromAxisAngle(unitZ, Math.atan2(alignVector.y, alignVector.x));
                    tempQuaternion.multiplyQuaternions(tempQuaternion2, tempQuaternion);
                    handle.quaternion.copy(tempQuaternion);
                }
            }

            // Hide disabled axes
            handle.visible = handle.visible && (handle.name.indexOf('X') === -1 || this.showX);
            handle.visible = handle.visible && (handle.name.indexOf('Y') === -1 || this.showY);
            handle.visible = handle.visible && (handle.name.indexOf('Z') === -1 || this.showZ);
            handle.visible = handle.visible && (handle.name.indexOf('E') === -1 || (this.showX && this.showY && this.showZ));

            // highlight selected axis

            handle.material._opacity = handle.material._opacity || handle.material.opacity;
            handle.material._color = handle.material._color || handle.material.color.clone();

            handle.material.color.copy(handle.material._color);
            handle.material.opacity = handle.material._opacity;

            if (!this.enabled) {
                handle.material.opacity *= 0.5;
                handle.material.color.lerp(new Color(1, 1, 1), 0.5);
            } else if (this.axis) {
                if (handle.name === this.axis) {
                    handle.lookAt(0, 0, 0);
                    // handle.material.opacity = 1.0;
                    // handle.material.color.lerp(new Color(1, 1, 1), 0.5);
                } else if (this.axis.split('').some((a) => handle.name === a)) {
                    handle.material.opacity = 1.0;
                    handle.material.color.lerp(new Color(1, 1, 1), 0.5);
                } else {
                    handle.material.opacity *= 0.25;
                    handle.material.color.lerp(new Color(1, 1, 1), 0.5);
                }
            }
        }

        Object3D.prototype.updateMatrixWorld.call(this);
    };
};

TransformControlsGizmo.prototype = Object.assign(Object.create(Object3D.prototype), {
    constructor: TransformControlsGizmo,

    isTransformControlsGizmo: true,
});

var TransformControlsPlane = function() {
    Mesh.call(
        this,
        new PlaneGeometry(100000, 100000, 2, 2),
        new MeshBasicMaterial({
            visible: false,
            wireframe: true,
            side: DoubleSide,
            transparent: true,
            opacity: 0.1,
            toneMapped: false,
        })
    );

    this.type = 'TransformControlsPlane';

    const unitX = new Vector3(1, 0, 0);
    const unitY = new Vector3(0, 1, 0);
    const unitZ = new Vector3(0, 0, 1);

    const tempVector = new Vector3();
    const dirVector = new Vector3();
    const alignVector = new Vector3();
    const tempMatrix = new Matrix4();
    const identityQuaternion = new Quaternion();

    this.updateMatrixWorld = function() {
        let { space } = this;

        this.position.copy(this.worldPosition);

        if (this.mode === 'scale') space = 'local'; // scale always oriented to local rotation

        unitX.set(1, 0, 0).applyQuaternion(space === 'local' ? this.worldQuaternion : identityQuaternion);
        unitY.set(0, 1, 0).applyQuaternion(space === 'local' ? this.worldQuaternion : identityQuaternion);
        unitZ.set(0, 0, 1).applyQuaternion(space === 'local' ? this.worldQuaternion : identityQuaternion);

        // Align the plane for current transform mode, axis and space.

        alignVector.copy(unitY);

        switch (this.mode) {
            case 'translate':
            case 'scale':
                switch (this.axis) {
                    case 'X':
                        alignVector.copy(this.eye).cross(unitX);
                        dirVector.copy(unitX).cross(alignVector);
                        break;
                    case 'Y':
                        alignVector.copy(this.eye).cross(unitY);
                        dirVector.copy(unitY).cross(alignVector);
                        break;
                    case 'Z':
                        alignVector.copy(this.eye).cross(unitZ);
                        dirVector.copy(unitZ).cross(alignVector);
                        break;
                    case 'XY':
                        dirVector.copy(unitZ);
                        break;
                    case 'YZ':
                        dirVector.copy(unitX);
                        break;
                    case 'XZ':
                        alignVector.copy(unitZ);
                        dirVector.copy(unitY);
                        break;
                    case 'XYZ':
                    case 'E':
                        dirVector.set(0, 0, 0);
                        break;
                }

                break;
            case 'rotate':
            default:
                // special case for rotate
                dirVector.set(0, 0, 0);
        }

        if (dirVector.length() === 0) {
            // If in rotate mode, make the plane parallel to camera
            this.quaternion.copy(this.cameraQuaternion);
        } else {
            tempMatrix.lookAt(tempVector.set(0, 0, 0), dirVector, alignVector);

            this.quaternion.setFromRotationMatrix(tempMatrix);
        }

        Object3D.prototype.updateMatrixWorld.call(this);
    };
};

TransformControlsPlane.prototype = Object.assign(Object.create(Mesh.prototype), {
    constructor: TransformControlsPlane,

    isTransformControlsPlane: true,
});

export { TransformControls, TransformControlsGizmo, TransformControlsPlane };
