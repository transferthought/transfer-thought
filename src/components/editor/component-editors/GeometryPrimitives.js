import BaseInput from '../input-controllers/BaseInput.vue';
import BooleanInput from '../input-controllers/BooleanInput.vue';
import NumberInput from '../input-controllers/NumberInput.vue';

export const box = {
    name: 'box',
    properties: [
        {
            name: 'height',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'width',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'depth',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const cylinder = {
    name: 'cylinder',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'height',
            controller: NumberInput,
            default: 2,
        },
        {
            name: 'segmentsRadial',
            controller: NumberInput,
            default: 36,
        },
        {
            name: 'segmentsHeight',
            controller: NumberInput,
            default: 18,
        },
        {
            name: 'openEnded',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'thetaStart',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'thetaLength',
            controller: NumberInput,
            default: 360,
        },
    ],
};

export const triangle = {
    name: 'triangle',
    properties: [
        {
            name: 'vertexA',
            controller: BaseInput,
            default: '0 0.5 0',
        },
        {
            name: 'vertexB',
            controller: BaseInput,
            default: '-0.5 -0.5 0',
        },
        {
            name: 'vertexC',
            controller: BaseInput,
            default: '0.5 -0.5 0',
        },
    ],
};

export const circle = {
    name: 'circle',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const cone = {
    name: 'cone',
    properties: [
        {
            name: 'height',
            controller: NumberInput,
            default: 2,
        },
        {
            name: 'openEnded',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'radiusBottom',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'radiusTop',
            controller: NumberInput,
            default: 0,
        },
    ],
};

export const dodecahedron = {
    name: 'dodecahedron',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const octahedron = {
    name: 'octahedron',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const plane = {
    name: 'plane',
    properties: [
        {
            name: 'height',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'width',
            controller: NumberInput,
            default: 1,
        },

    ],
};

export const ring = {
    name: 'ring',
    properties: [
        {
            name: 'radiusInner',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'radiusOuter',
            controller: NumberInput,
            default: 2,
        },
    ],
};

export const sphere = {
    name: 'sphere',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'segmentsWidth',
            controller: NumberInput,
            default: 18,
        },
        {
            name: 'segmentsHeight',
            controller: NumberInput,
            default: 36,
        },
        {
            name: 'phiStart',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'phiLength',
            controller: NumberInput,
            default: 360,
        },
        {
            name: 'thetaStart',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'thetaLength',
            controller: NumberInput,
            default: 360,
        },
    ],
};

export const tetrahedron = {
    name: 'tetrahedron',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const torus = {
    name: 'torus',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'radiusTubular',
            controller: NumberInput,
            default: 0.02,
        },

    ],
};

export const torusKnot = {
    name: 'torusKnot',
    properties: [
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'radiusTubular',
            controller: NumberInput,
            default: 0.02,
        },

    ],
};

export const PrimitiveList = [
    'box',
    'circle',
    'cone',
    'dodecahedron',
    'octahedron',
    'plane',
    'ring',
    'sphere',
    'tetrahedron',
    'torus',
    'torusKnot',
];

export default {
    box,
    cylinder,
    triangle,
    circle,
    cone,
    dodecahedron,
    octahedron,
    plane,
    ring,
    sphere,
    tetrahedron,
    torus,
    torusKnot,
};
