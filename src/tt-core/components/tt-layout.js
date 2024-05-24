/* eslint-disable */
const _ = require('lodash')
let positions = [];
const positionHelper = new THREE.Vector3();

/**
 * Layout component for A-Frame.
 * Some layouts adapted from http://www.vb-helper.com/tutorial_platonic_solids.html
 */
AFRAME.registerComponent('tt-layout', {
    schema: {
        angle: {
            type: 'number', default: false, min: 0, max: 360, if: { type: ['circle'] },
        },
        columns: { default: 1, min: 0, if: { type: ['box'] } },
        margin: { default: 1, min: 0, if: { type: ['box', 'line'] } },
        marginColumn: { default: 1, min: 0, if: { type: ['box'] } },
        marginRow: { default: 1, min: 0, if: { type: ['box'] } },
        orderAttribute: { default: '' },
        plane: { default: 'xy' },
        radius: { default: 1, min: 0, if: { type: ['circle', 'cube', 'dodecahedron', 'pyramid'] } },
        reverse: { default: false },
        type: {
            default: 'line',
            oneOf: ['box', 'circle', 'cube', 'dodecahedron', 'line',
                'pyramid'],
        },
        fill: { default: true, if: { type: ['circle'] } },
        align: { default: 'end', oneOf: ['start', 'center', 'end'] },
    },

    /**
   * Store initial positions in case need to reset on component removal.
   */
    init() {
        const self = this;
        const { el } = this;

        this.children = el.getChildEntities();
        this.initialPositions = [];

        this.children.forEach((childEl) => {
            if (childEl.hasLoaded) { return _getPositions(); }
            childEl.addEventListener('loaded', _getPositions);
            function _getPositions() {
                self.initialPositions.push(childEl.object3D.position.x);
                self.initialPositions.push(childEl.object3D.position.y);
                self.initialPositions.push(childEl.object3D.position.z);
            }
        });

        this.handleChildAttached = this.handleChildAttached.bind(this)
        this.handleChildDetached = this.handleChildDetached.bind(this)

        this.update = _.throttle(this.update.bind(this), 100);

        el.addEventListener('child-attached', this.handleChildAttached);
        el.addEventListener('child-detached', this.handleChildDetached);
        el.addEventListener('layoutrefresh', this.update.bind(this));
    },

    /**
   * Update child entity positions.
   */
    update(oldData) {
        const { children } = this;
        const { data } = this;
        let definedData;
        const { el } = this;
        let numChildren;
        let positionFn;

        numChildren = children.length;

        // Calculate different positions based on layout shape.
        switch (data.type) {
        case 'box': {
            positionFn = getBoxPositions;
            break;
        }
        case 'circle': {
            positionFn = getCirclePositions;
            break;
        }
        case 'cube': {
            positionFn = getCubePositions;
            break;
        }
        case 'dodecahedron': {
            positionFn = getDodecahedronPositions;
            break;
        }
        case 'pyramid': {
            positionFn = getPyramidPositions;
            break;
        }
        default: {
        // Line.
            positionFn = getLinePositions;
        }
        }

        definedData = el.getDOMAttribute('tt-layout');
        positions.length = 0;
        positions = positionFn(
            data, numChildren,
            typeof definedData === 'string'
                ? definedData.indexOf('margin') !== -1
                : 'margin' in definedData,
        );
        if (data.reverse) { positions.reverse(); }
        setPositions(children, positions, data.orderAttribute);
    },

    /**
   * Reset positions.
   */
    remove() {
        this.el.removeEventListener('child-attached', this.handleChildAttached);
        this.el.removeEventListener('child-detached', this.handleChildDetached);
        setPositions(this.children, this.initialPositions);
    },

    handleChildAttached(evt) {
    // Only update if direct child attached.
        const { el } = this;
        if (evt.detail.el.parentNode !== el) { return; }
        this.children.push(evt.detail.el);
        this.update();
    },

    handleChildDetached(evt) {
    // Only update if direct child detached.
        if (this.children.indexOf(evt.detail.el) === -1) { return; }
        this.children.splice(this.children.indexOf(evt.detail.el), 1);
        this.initialPositions.splice(this.children.indexOf(evt.detail.el), 1);
        this.update();
    },
});

/**
 * Get positions for `box` layout.
 */
function getBoxPositions(data, numChildren, marginDefined) {
    let column;
    let marginColumn;
    let marginRow;
    let offsetColumn;
    let offsetRow;
    let row;
    const rows = Math.ceil(numChildren / data.columns);

    marginColumn = data.marginColumn;
    marginRow = data.marginRow;
    if (marginDefined) {
        marginColumn = data.margin;
        marginRow = data.margin;
    }

    offsetRow = getOffsetItemIndex(data.align, rows);
    offsetColumn = getOffsetItemIndex(data.align, data.columns);

    for (row = 0; row < rows; row++) {
        for (column = 0; column < data.columns; column++) {
            positionHelper.set(0, 0, 0);
            if (data.plane.indexOf('x') === 0) {
                positionHelper.x = (column - offsetColumn) * marginColumn;
            }
            if (data.plane.indexOf('y') === 0) {
                positionHelper.y = (column - offsetColumn) * marginColumn;
            }
            if (data.plane.indexOf('y') === 1) {
                positionHelper.y = (row - offsetRow) * marginRow;
            }
            if (data.plane.indexOf('z') === 1) {
                positionHelper.z = (row - offsetRow) * marginRow;
            }
            pushPositionVec3(positionHelper);
        }
    }

    return positions;
}
module.exports.getBoxPositions = getBoxPositions;

/**
 * Get positions for `circle` layout.
 */
function getCirclePositions(data, numChildren) {
    let i;
    let rad;

    for (i = 0; i < numChildren; i++) {
        rad;

        if (isNaN(data.angle)) {
            rad = i * (2 * Math.PI) / numChildren;
        } else {
            rad = i * data.angle * 0.01745329252; // Angle to radian.
        }

        positionHelper.set(0, 0, 0);
        if (data.plane.indexOf('x') === 0) {
            positionHelper.x = data.radius * Math.cos(rad);
        }
        if (data.plane.indexOf('y') === 0) {
            positionHelper.y = data.radius * Math.cos(rad);
        }
        if (data.plane.indexOf('y') === 1) {
            positionHelper.y = data.radius * Math.sin(rad);
        }
        if (data.plane.indexOf('z') === 1) {
            positionHelper.z = data.radius * Math.sin(rad);
        }
        pushPositionVec3(positionHelper);
    }
    return positions;
}
module.exports.getCirclePositions = getCirclePositions;

/**
 * Get positions for `line` layout.
 * TODO: 3D margins.
 */
function getLinePositions(data, numChildren) {
    data.columns = numChildren;
    return getBoxPositions(data, numChildren, true);
}
module.exports.getLinePositions = getLinePositions;

/**
 * Get positions for `cube` layout.
 */
function getCubePositions(data, numChildren) {
    pushPositions(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        -1, 0, 0,
        0, -1, 0,
        0, 0, -1,
    );
    scalePositions(data.radius / 2);
    return positions;
}
module.exports.getCubePositions = getCubePositions;

/**
 * Get positions for `dodecahedron` layout.
 */
function getDodecahedronPositions(data, numChildren) {
    const PHI = (1 + Math.sqrt(5)) / 2;
    const B = 1 / PHI;
    const C = 2 - PHI;
    const NB = -1 * B;
    const NC = -1 * C;
    pushPositions(
        -1, C, 0,
        -1, NC, 0,
        0, -1, C,
        0, -1, NC,
        0, 1, C,
        0, 1, NC,
        1, C, 0,
        1, NC, 0,
        B, B, B,
        B, B, NB,
        B, NB, B,
        B, NB, NB,
        C, 0, 1,
        C, 0, -1,
        NB, B, B,
        NB, B, NB,
        NB, NB, B,
        NB, NB, NB,
        NC, 0, 1,
        NC, 0, -1,
    );
    scalePositions(data.radius / 2);
    return positions;
}
module.exports.getDodecahedronPositions = getDodecahedronPositions;

/**
 * Get positions for `pyramid` layout.
 */
function getPyramidPositions(data, numChildren) {
    const SQRT_3 = Math.sqrt(3);
    const NEG_SQRT_1_3 = -1 / Math.sqrt(3);
    const DBL_SQRT_2_3 = 2 * Math.sqrt(2 / 3);
    pushPositions(
        0, 0, SQRT_3 + NEG_SQRT_1_3,
        -1, 0, NEG_SQRT_1_3,
        1, 0, NEG_SQRT_1_3,
        0, DBL_SQRT_2_3, 0,
    );
    scalePositions(data.radius / 2);
    return positions;
}
module.exports.getPyramidPositions = getPyramidPositions;

/**
 * Return the item index in a given list to calculate offsets from
 *
 * @param {string} align - One of `'start'`, `'center'`, `'end'`
 * @param {integer} numItems - Total number of items
 */
function getOffsetItemIndex(align, numItems) {
    switch (align) {
    case 'start':
        return numItems - 1;
    case 'center':
        return (numItems - 1) / 2;
    case 'end':
        return 0;
    }
}

/**
 * Multiply all coordinates by a scale factor and add translate.
 *
 * @params {array} positions - Array of coordinates in array form.
 * @returns {array} positions
 */
function scalePositions(scale) {
    let i;
    for (i = 0; i < positions.length; i++) {
        positions[i] = positions[i] * scale;
    }
}

/**
 * Set position on child entities.
 *
 * @param {array} els - Child entities to set.
 * @param {array} positions - Array of coordinates.
 */
function setPositions(els, positions, orderAttribute) {
    let value;
    let i;
    let orderIndex;

    // Allow for controlling order explicitly since DOM order does not have as much
    // meaning in A-Frame.
    if (orderAttribute) {
        for (i = 0; i < els.length; i++) {
            value = els[i].getAttribute(orderAttribute);
            if (value === null || value === undefined) { continue; }
            orderIndex = parseInt(value, 10) * 3;
            els[i].object3D.position.set(positions[orderIndex], positions[orderIndex + 1],
                positions[orderIndex + 2]);
        }
        return;
    }

    for (i = 0; i < positions.length; i += 3) {
        if (!els[i / 3]) { return; }
        els[i / 3].object3D.position.set(positions[i], positions[i + 1], positions[i + 2]);
    }
}

function pushPositions() {
    let i;
    for (i = 0; i < arguments.length; i++) {
        positions.push(i);
    }
}

function pushPositionVec3(vec3) {
    positions.push(vec3.x);
    positions.push(vec3.y);
    positions.push(vec3.z);
}
