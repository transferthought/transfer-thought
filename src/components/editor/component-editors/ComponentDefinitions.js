import * as _ from 'lodash';
import DefaultComponentEditor from './DefaultComponentEditor.vue';
// import EnvironmentEditor from './EnvironmentEditor.vue';
import GeometryEditor from './GeometryEditor.vue';
import EventEditor from './EventEditor.vue';

import BaseInput from '../input-controllers/BaseInput.vue';
import BooleanInput from '../input-controllers/BooleanInput.vue';
import NumberInput from '../input-controllers/NumberInput.vue';
import OptionsInput from '../input-controllers/OptionsInput.vue';
import ArrayInput from '../input-controllers/ArrayInput.vue';
import EntityIdInput from '../input-controllers/EntityIdInput.vue';
// import AssetInput from '../input-controllers/AssetInput.vue';

const Components = {};

export const environment = {
    componentType: 'environment',
    aframeComponentType: 'environment',
    display: 'Environment',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'preset',
            controller: BaseInput,
            default: 'none',
        },
        {
            name: 'lighting',
            controller: BaseInput,
            default: 'distant',
        },
        {
            name: 'fog',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'ground',
            controller: OptionsInput,
            options: ['none', 'flat', 'hills', 'canyon', 'spikes', 'noise'],
            default: 'none',
        },
        {
            name: 'skyType',
            controller: BaseInput,
            default: 'atmosphere',
        },
    ],
};

export const loadingPage = {
    componentType: 'loading-screen',
    display: 'Loading Screen',
    editor: DefaultComponentEditor,
    setEntityAttribute(entityElement, component) {
        let attributesAsString = '';
        _.map(component.attributes, (value, key) => {
            attributesAsString += `${key}:${value};`;
        });
        entityElement.setAttribute(`${this.componentType}`, attributesAsString);
    },
    attributes: [
        {
            name: 'dotsColor',
            controller: BaseInput,
            default: 'white',
        },
        {
            name: 'backgroundColor',
            controller: BaseInput,
            default: '#161822',
        },
        {
            name: 'enabled',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const camera = {
    componentType: 'camera',
    aframeComponentType: 'camera',
    display: 'Camera',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'zoom',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const wasdControls = {
    componentType: 'wasd-controls',
    aframeComponentType: 'wasd-controls',
    display: 'wasd-controls',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const lookControls = {
    componentType: 'tt-look-controls',
    aframeComponentType: 'tt-look-controls',
    display: 'Look Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'pointerLockEnabled',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'reverseMouseDrag',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'reverseTouchDrag',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'magicWindowTrackingEnabled',
            controller: BaseInput,
            default: true,
        },
    ],
};

export const orbitControls = {
    componentType: 'orbit-controls',
    aframeComponentType: 'orbit-controls',
    display: 'Orbit Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'autoRotate',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'autoRotateSpeed',
            controller: BaseInput,
            default: 2,
        },
        {
            name: 'cursor',
            controller: BaseInput,
            default: '0 0 0',
        },
        {
            name: 'dampingFactor',
            controller: BaseInput,
            default: 0.1,
        },
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'enableDamping',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'enablePan',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'enableRotate',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'enableZoom',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'initialPosition',
            controller: BaseInput,
            default: '0 0 0',
        },
        {
            name: 'keyPanSpeed',
            controller: BaseInput,
            default: 7,
        },
        {
            name: 'minAzimuthAngle',
            controller: BaseInput,
            default: Infinity,
        },
        {
            name: 'maxAzimuthAngle',
            controller: BaseInput,
            default: Infinity,
        },
        {
            name: 'maxDistance',
            controller: BaseInput,
            default: Infinity,
        },
        {
            name: 'maxPolarAngle',
            controller: BaseInput,
            default: 90,
        },
        {
            name: 'minDistance',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'minPolarAngle',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'minTargetRadius',
            controller: BaseInput,
            default: '0',
        },
        {
            name: 'maxTargetRadius',
            controller: BaseInput,
            default: Infinity,
        },
        {
            name: 'minZoom',
            controller: BaseInput,
            default: '0',
        },
        {
            name: 'maxZoom',
            controller: BaseInput,
            default: Infinity,
        },
        {
            name: 'panSpeed',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'rotateSpeed',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'screenSpacePanning',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'target',
            controller: BaseInput,
            default: '0 0 0',
        },
        {
            name: 'zoomSpeed',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'zoomToCursor',
            controller: BaseInput,
            default: false,
        },
    ],
};

export const multiTouchControls = {
    componentType: 'tt-multitouch-look-controls',
    aframeComponentType: 'tt-multitouch-look-controls',
    display: 'Multi Touch Controls',
    editor: DefaultComponentEditor,
    attributes: [
        { name: 'enabled', controller: BaseInput, default: true },
        { name: 'maxPitch', controller: BaseInput, default: '15' },
        { name: 'minPitch', controller: BaseInput, default: '-20' },
        { name: 'xrange', controller: BaseInput, default: '5' },
        { name: 'yrange', controller: BaseInput, default: '-1 1' },
        { name: 'zrange', controller: BaseInput, default: '5' },
    ],
};
export const keyboard = {
    componentType: 'super-keyboard',
    aframeComponentType: 'super-keyboard',
    display: 'Keyboard',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'hand',
            controller: BaseInput,
            default: '[cursor]',
        },
        {
            name: 'label',
            controller: BaseInput,
            default: 'Entery a label here....',
        },
        {
            name: 'labelColor',
            controller: BaseInput,
            default: '#000',
        },
        {
            name: 'show',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'model',
            controller: BaseInput,
            default: 'basic',
        },
        {
            name: 'value',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'imagePath',
            controller: BaseInput,
            default: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/keyboard/sk-basic.png',
        },
    ],
};

export const transformElement = {
    componentType: 'tt-transform-element',
    aframeComponentType: 'tt-transform-element',
    display: 'Transform Element',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'selector',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const avatar = {
    componentType: 'avatar',
    isInterface: true,
    suppress: ['gltf-model-plus', 'modify-materials'],
    display: 'Avatar',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'skin',
            attributeMap: [
                {
                    component: 'modify-materials',
                    attribute: 'albedoMap',
                    mapFunction: 'Direct',
                },
            ],
            controller: OptionsInput,
            options: [
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t2.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t3.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t4.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t5.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t6.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t7.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t8.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t9.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t10.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t11.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t12.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t13.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t14.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t15.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t16.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t17.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t18.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t19.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t20.png',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_cop.png',
            ],
            default: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/textures/male_f_t2.png',
        },
        {
            name: 'body',
            attributeMap: [
                {
                    component: 'gltf-model-plus',
                    attribute: 'src',
                    mapFunction: 'Direct',
                },
            ],
            controller: OptionsInput,
            options: [
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/tallguy.glb',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/fatguy-low.glb',
                'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/toughguy-low.glb',
            ],
            default: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/general/avatars/low-poly/males/tallguy.glb',
        },
    ],
};

export const transform = {
    componentType: 'transform',
    isInterface: true,
    suppress: ['position', 'rotation', 'scale'],
    display: 'Transform',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'scale',
            attributeMap: [
                {
                    component: 'scale',
                    attribute: 'x',
                    mapFunction: 'Direct',
                },
                {
                    component: 'scale',
                    attribute: 'y',
                    mapFunction: 'Direct',
                },
                {
                    component: 'scale',
                    attribute: 'z',
                    mapFunction: 'Direct',
                },
            ],
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const position = {
    componentType: 'position',
    aframeComponentType: 'tt-position',
    display: 'Position',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'x',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'y',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'z',
            controller: NumberInput,
            default: 0,
        },
    ],
};

export const scale = {
    componentType: 'scale',
    display: 'Scale',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'x',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'y',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'z',
            controller: NumberInput,
            default: 0,
        },
    ],
};

export const rotation = {
    componentType: 'rotation',
    aframeComponentType: 'rotation',
    display: 'Rotation',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'x',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'y',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'z',
            controller: NumberInput,
            default: 0,
        },
    ],
};

export const visible = {
    componentType: 'visible',
    aframeComponentType: 'tt-visible',
    display: 'Visible',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'visible',
            controller: BaseInput,
            default: true,
        },
    ],
};

export const geometry = {
    componentType: 'geometry',
    aframeComponentType: 'geometry',
    display: 'Geometry',
    editor: GeometryEditor,
    attributes: [
        {
            name: 'primitive',
            controller: BaseInput,
            default: 'box',
        },
    ],
};

export const layout = {
    componentType: 'layout',
    aframeComponentType: 'tt-layout',
    display: 'Layout',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'type',
            controller: OptionsInput,
            options: ['line', 'box', 'circle', 'cube', 'dodecahedron'],
            default: 'line',
        },
        {
            name: 'columns',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'margin',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'marginColumn',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'marginRow',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'radius',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'angle',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'plane',
            controller: OptionsInput,
            options: ['xy', 'yz', 'xz'],
            default: 'xy',
        },
        {
            name: 'align',
            controller: OptionsInput,
            options: ['start', 'center', 'end'],
            default: 'start',
        },
        {
            name: 'reverse',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const line = {
    componentType: 'tt-meshline',
    aframeComponentType: 'tt-meshline',
    display: 'Line',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'path',
            controller: BaseInput,
            default: '0 0 0, 0 0 0',
        },
        {
            name: 'color',
            controller: BaseInput,
            default: 'white',
        },
        {
            name: 'lineWidth',
            controller: BaseInput,
            default: '10',
        },
    ],
};

export const lookAt = {
    componentType: 'tt-look-at',
    aframeComponentType: 'tt-look-at',
    display: 'Look At',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'selector',
            controller: BaseInput,
            default: '#camera',
        },
    ],
};

export const follow = {
    componentType: 'tt-follow',
    aframeComponentType: 'tt-follow',
    display: 'Follow',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'selector',
            controller: BaseInput,
            default: '#camera',
        },
        {
            name: 'delay',
            controller: BaseInput,
            default: '200',
        },
        {
            name: 'offsetX',
            controller: BaseInput,
            default: '0',
        },
        {
            name: 'offsetY',
            controller: BaseInput,
            default: '0',
        },
        {
            name: 'offsetZ',
            controller: BaseInput,
            default: '0',
        },
    ],
};

export const material = {
    componentType: 'material',
    aframeComponentType: 'material',
    display: 'Material',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
        // {
        //     name: 'preload',
        //     controller: BooleanInput,
        //     default: true,
        // },
        {
            name: 'color',
            controller: BaseInput,
            default: 'red',
        },
        {
            name: 'shader',
            controller: OptionsInput,
            options: ['standard', 'flat', 'gif', 'chromakey', 'hologram', 'liquid-portal'],
            default: 'standard',
        },
        {
            name: 'offset',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'repeat',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'wireframe',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'transparent',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'opacity',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'side',
            controller: OptionsInput,
            options: ['front', 'back', 'double'],
            default: 'front',
        },
        {
            name: 'metalness',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'roughness',
            controller: BaseInput,
            default: 0.5,
        },
    ],
};

const centerMesh = {
    componentType: 'center-mesh',
    aframeComponentType: 'tt-center-mesh',
    display: 'Center Mesh',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
    ],
};

const fitTexture = {
    componentType: 'fit-texture-component',
    aframeComponentType: 'tt-fit-texture-component',
    display: 'Fit Texture',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
    ],
};

// TODO: mouse events should be added based on raycastable, loaded should be based on something else
const defaultEvents = [
    {
        name: 'click',
        display: 'Click',
    },
    {
        name: 'mousedown',
        display: 'Mouse Down',
    },
    {
        name: 'mouseup',
        display: 'Mouse Up',
    },
    {
        name: 'mouseenter',
        display: 'Mouse Enter',
    },
    {
        name: 'mouseleave',
        display: 'Mouse Leave',
    },
    {
        name: 'loaded',
        display: 'Loaded',
    },
    {
        name: 'tick',
        display: 'Tick',
    },
    {
        name: 'hit',
        display: 'Hit',
    },
];

export const EventInputDefinition = {
    name: 'event',
    controller: OptionsInput,
    getter() {
        const events = [
            { header: 'Default' },
            ..._.map(defaultEvents, (event) => ({
                text: event.display,
                value: event.name,
            })),
        ];

        if (this.entityId) {
            const entityComponents = this.$store.getters['apps/config/getEntityComponents'](this.entityId);
            _(entityComponents).forEach((component) => {
                const componentDef = Components[component.componentType];
                if (componentDef && _.size(componentDef.events)) {
                    events.push({
                        header: componentDef.display,
                    });
                    _.forEach(componentDef.events, (event) => {
                        events.push({
                            value: event.name,
                            text: event.display,
                        });
                    });
                }
            });
        }

        return events;
    },
};

export const ComponentActionInputDefinition = {
    name: 'action',
    controller: OptionsInput,
    getter() {
        const actions = _.map(this.$store.getters['apps/actions/actionsList'], (a) => ({
            value: a.id,
            text: a.name,
        }));
        if (this.componentAttributes && this.componentAttributes.entityId) {
            const entityComponents = this.$store.getters['apps/config/getEntityComponents'](this.componentAttributes.entityId);
            _(entityComponents).forEach((component) => {
                const componentDef = Components[component.componentType];
                if (component.componentType === 'action') {
                    const { action } = component.attributes;
                    const actionDef = this.$store.getters['apps/actions/getActionById'](action);
                    actions.push({
                        value: actionDef.id,
                        text: actionDef.name,
                    });
                } else if (componentDef && _.size(componentDef.actions)) {
                    _.forEach(componentDef.actions, (action) => {
                        const value = `${this.componentAttributes.entityId}.${componentDef.aframeComponentType}.${action.function}`;
                        actions.push({
                            value,
                            text: action.display,
                        });
                    });
                }
            });
        }

        return actions;
    },
};

export const EntityIdInputDefinition = {
    name: 'entityId',
    controller: EntityIdInput,
};

export const event = {
    componentType: 'event',
    aframeComponentType: 'event',
    display: 'Event',
    editor: EventEditor,
    attributes: [
        {
            name: 'attributesOverride',
            controller: BaseInput,
            default: null,
        },
        EventInputDefinition,
        EntityIdInputDefinition,
        ComponentActionInputDefinition,
    ],
};

export const action = {
    componentType: 'action',
    display: 'Action',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'action',
            controller: OptionsInput,
            getter() {
                const actions = this.$store.getters['apps/actions/actionsList'];
                return _.map(actions, (a) => ({
                    value: a.id,
                    text: a.name,
                }));
            },
        },
    ],
};

export const cursor = {
    componentType: 'cursor',
    aframeComponentType: 'cursor',
    display: 'Cursor',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'maxDistance',
            controller: NumberInput,
            default: 30,
        },
        {
            name: 'fuse',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'rayOrigin',
            controller: BaseInput,
            default: 'mouse',
        },
    ],
};

export const crawlingCursor = {
    componentType: 'crawling-cursor',
    aframeComponentType: 'tt-crawling-cursor',
    display: 'Crawling Cursor',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'target',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'offset',
            controller: BaseInput,
            default: '0.05',
        },
    ],
};

export const text = {
    componentType: 'text',
    htmlComponentType: 'tt-text',
    aframeComponentType: 'text',
    display: 'Text',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: 'New Text',
        },
        {
            name: 'color',
            controller: BaseInput,
            default: 'white',
        },
        {
            name: 'font',
            controller: BaseInput,
            default: 'roboto',
        },
        {
            name: 'width',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'height',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'anchor',
            controller: OptionsInput,
            options: ['left', 'center', 'right', 'align'],
            default: 'center',
        },
        {
            name: 'align',
            controller: OptionsInput,
            options: ['left', 'center', 'right'],
            default: 'center',
        },
        {
            name: 'baseline',
            controller: OptionsInput,
            options: ['top', 'center', 'bottom'],
            default: 'center',
        },
        {
            name: 'wrapCount',
            controller: NumberInput,
            default: 40,
        },
    ],
};

export const textGeometry = {
    componentType: 'text-geometry',
    aframeComponentType: 'text-geometry',
    display: 'Text Geometry',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: 'New Text',
        },
        {
            name: 'font',
            controller: BaseInput,
            default: 'https://supermedium.com/superframe/components/text-geometry/examples/vaporwave/fonts/dawningOfANewDayRegular.typeface.json',
        },
        {
            name: 'height',
            controller: NumberInput,
            default: 0.05,
        },
        {
            name: 'size',
            controller: NumberInput,
            default: 0.5,
        },
        {
            name: 'bevelEnabled',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'bevelSize',
            controller: BaseInput,
            default: 0.1,
        },
        {
            name: 'bevelThickness',
            controller: BaseInput,
            default: 0.1,
        },
        {
            name: 'curveSegments',
            controller: BaseInput,
            default: 1,
        },
    ],
};

export const icon = {
    componentType: 'icon',
    aframeComponentType: 'material-design-icon',
    display: 'Icon',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'icon',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#000',
        },
        {
            size: 'size',
            controller: NumberInput,
            default: 1024,
        },
    ],
};

export const physics = {
    componentType: 'physics',
    aframeComponentType: 'physics',
    display: 'Physics',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'gravity',
            controller: NumberInput,
            default: -9.8,
        },
    ],
};

export const physicsBody = {
    componentType: 'physics-body',
    aframeComponentType: 'body',
    display: 'Physics Body',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'type',
            controller: OptionsInput,
            options: ['dynamic', 'static'],
            default: 'dynamic',
        },
        {
            name: 'shape',
            controller: OptionsInput,
            options: ['auto', 'box', 'cylinder', 'sphere', 'hull', 'none'],
            default: 'auto',
        },
        {
            name: 'mass',
            controller: NumberInput,
            default: 5,
        },
        {
            name: 'linearDamping',
            controller: NumberInput,
            default: 0.01,
        },
        {
            name: 'angularDamping',
            controller: NumberInput,
            default: 0.01,
        },
        {
            name: 'sphereRadius',
            controller: NumberInput,
            default: '0.001',
        },
    ],
};

export const dynamicBody = {
    componentType: 'dynamic-body',
    aframeComponentType: 'dynamic-body',
    display: 'Dynamic Body',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'shape',
            controller: OptionsInput,
            options: ['auto', 'box', 'cylinder', 'sphere', 'hull', 'none'],
            default: 'auto',
        },
        {
            name: 'mass',
            controller: NumberInput,
            default: 5,
        },
        {
            name: 'linearDamping',
            controller: NumberInput,
            default: 0.01,
        },
        {
            name: 'angularDamping',
            controller: NumberInput,
            default: 0.01,
        },
        {
            name: 'sphereRadius',
            controller: NumberInput,
            default: '0.001',
        },
    ],
};

export const staticBody = {
    componentType: 'static-body',
    aframeComponentType: 'static-body',
    display: 'Static Body',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'shape',
            controller: BaseInput,
            default: 'auto',
        },
        {
            name: 'sphereRadius',
            controller: NumberInput,
            default: '0.001',
        },
    ],
};

export const networkedScene = {
    componentType: 'networked-scene',
    aframeComponentType: 'networked-scene',
    display: 'Networked Scene',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'connectOnLoad',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'serverURL',
            controller: BaseInput,
            default: 'sockets.transferthought.com',
        },
        {
            name: 'room',
            controller: BaseInput,
            default: 'editor',
        },
        {
            name: 'debug',
            controller: BooleanInput,
            default: 'true',
        },
        {
            name: 'adapter',
            controller: BaseInput,
            default: 'socketio',
        },
        {
            name: 'audio',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const networkedObject = {
    componentType: 'networked',
    aframeComponentType: 'networked',
    display: 'Networked Object',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'template',
            controller: OptionsInput,
            getter() {
                const templates = this.$store.getters['apps/config/templateList'];
                return _.map(templates, (t) => ({
                    value: `#${t.id}`,
                    text: t.name,
                }));
            },
        },
        {
            name: 'attachTemplateToLocal',
            controller: BooleanInput,
            default: 'false',
        },
    ],
};

export const template = {
    componentType: 'template',
    aframeComponentType: 'template',
    display: 'Template',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'each',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'template',
            controller: OptionsInput,
            getter() {
                const templates = this.$store.getters['apps/config/templateList'];
                return _.map(templates, (t) => ({
                    value: t.id,
                    text: t.name,
                }));
            },
        },
    ],
};

export const lerp = {
    componentType: 'lerp',
    aframeComponentType: 'lerp',
    display: 'Lerp',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'properties',
            controller: BaseInput,
            default: '',
        },
    ],
};
export const aabbCollider = {
    componentType: 'aabb-collider',
    aframeComponentType: 'collider-plus',
    display: 'Bounding Box Trigger',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'hitstart',
            display: 'Hit Start',
        },
        {
            name: 'hitend',
            display: 'Hit End',
        },
        {
            name: 'hitclosest',
            display: 'Hit Closest',
        },
        {
            name: 'hitclosestclear',
            display: 'Hit Closest Clear',
        },
    ],
    attributes: [
        {
            name: 'enabled',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'collideNonVisible',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'debug',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'objects',
            controller: BaseInput,
            default: '.triggerable',
        },
    ],
};

export const triggerable = {
    componentType: 'triggerable',
    aframeComponentType: 'tt-triggerable',
    display: 'Triggerable',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'hitstart',
            display: 'Hit Start',
        },
        {
            name: 'hitend',
            display: 'Hit End',
        },
        {
            name: 'hitclosest',
            display: 'Hit Closest',
        },
        {
            name: 'hitclosestclear',
            display: 'Hit Closest Clear',
        },
    ],
    attributes: [
        {
            name: 'object',
            controller: BaseInput,
            default: 'triggerable',
        },
        {
            name: 'dynamic',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const sphereCollider = {
    componentType: 'sphere-collider',
    aframeComponentType: 'sphere-collider',
    display: 'Sphere Collider',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const animation = {
    componentType: 'animation',
    aframeComponentType: 'animation',
    display: 'Animation',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'property',
            controller: BaseInput,
            default: 'position',
        },
        {
            name: 'from',
            controller: BaseInput,
            default: null,
        },
        {
            name: 'to',
            controller: BaseInput,
            default: null,
        },
        {
            name: 'delay',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'easing',
            controller: OptionsInput,
            options: [
                'easeInQuad',
                'easeOutQuad',
                'easeInOutQuad',
                'linear',
                'easeInCubic',
                'easeOutCubic',
                'easeInOutCubic',
                'easeInQuart',
                'easeOutQuart',
                'easeInOutQuart',
                'easeInQuint',
                'easeOutQuint',
                'easeInOutQuint',
                'easeInSine',
                'easeOutSine',
                'easeInOutSine',
                'easeInExpo',
                'easeOutExpo',
                'easeInOutExpo',
                'easeInCirc',
                'easeOutCirc',
                'easeInOutCirc',
                'easeInBack',
                'easeOutBack',
                'easeInOutBack',
                'easeInElastic',
                'easeOutElastic',
                'easeInOutElastic',
            ],
            default: 'easeInQuad',
        },
        {
            name: 'dir',
            controller: BaseInput,
            options: ['normal', 'alternate', 'reverse'],
            default: 'normal',
        },
        {
            name: 'dur',
            controller: NumberInput,
            default: 1000,
        },
        {
            name: 'loop',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'startEvents',
            controller: BaseInput,
            default: null,
        },
        {
            name: 'pauseEvents',
            controller: BaseInput,
            default: null,
        },
        {
            name: 'autoplay',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const sound = {
    componentType: 'sound',
    aframeComponentType: 'tt-sound',
    display: 'Sound',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'sound-started',
            display: 'Sound Start',
        },
        {
            name: 'sound-ended',
            display: 'Sound End',
        },
    ],
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'autoplay',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'loop',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'positional',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'volume',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'preload',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const particle = {
    componentType: 'particle-system',
    aframeComponentType: 'tt-spe-particles',
    display: 'Particles',
    editor: DefaultComponentEditor,
    actions: [
        {
            function: 'startParticles',
            display: 'Start',
        },
        {
            function: 'stopParticles',
            display: 'Stop',
        },
    ],
    attributes: [
        {
            name: 'enableInEditor',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'frustumCulled',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'texture',
            controller: BaseInput,
        },
        {
            name: 'textureFrames',
            controller: BaseInput,
            default: {
                x: 1,
                y: 1,
            },
        },
        {
            name: 'textureFrameCount',
            controller: BaseInput,
            default: -1,
        },
        {
            name: 'textureFrameLoop',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'blending',
            controller: BaseInput,
            default: 'normal',
        },
        {
            name: 'hasPerspective',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'useTransparency',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'alphaTest',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'depthWrite',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'depthTest',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'affectedByFog',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'emitterScale',
            controller: BaseInput,
            default: 100,
        },
        {
            name: 'relative',
            controller: BaseInput,
            default: 'local',
        },
        {
            name: 'particleCount',
            controller: BaseInput,
            default: 100,
        },
        {
            name: 'duration',
            controller: BaseInput,
            default: -1,
        },
        {
            name: 'distribution',
            controller: BaseInput,
            default: 'BOX',
        },
        {
            name: 'activeMultiplier',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'direction',
            controller: BaseInput,
            default: 'forward',
        },
        {
            name: 'maxAge',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'maxAgeSpread',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'positionDistribution',
            controller: BaseInput,
            default: 'NONE',
        },
        {
            name: 'positionSpread',
            controller: BaseInput,
        },
        {
            name: 'positionOffset',
            controller: BaseInput,
        },
        {
            name: 'randomizePosition',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'radius',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'radiusScale',
            controller: BaseInput,
            default: {
                x: 1,
                y: 1,
                z: 1,
            },
        },
        {
            name: 'velocityDistribution',
            controller: BaseInput,
            default: 'NONE',
        },
        {
            name: 'velocity',
            controller: BaseInput,
        },
        {
            name: 'velocitySpread',
            controller: BaseInput,
        },
        {
            name: 'randomizeVelocity',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'accelerationDistribution',
            controller: BaseInput,
            default: 'NONE',
        },
        {
            name: 'acceleration',
            controller: BaseInput,
        },
        {
            name: 'accelerationSpread',
            controller: BaseInput,
        },
        {
            name: 'randomizeAcceleration',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'drag',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'dragSpread',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'randomizeDrag',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'wiggle',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'wiggleSpread',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'rotation',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'rotationSpread',
            controller: BaseInput,
            default: 0,
        },
        {
            name: 'rotationAxis',
            controller: BaseInput,
        },
        {
            name: 'rotationAxisSpread',
            controller: BaseInput,
        },
        {
            name: 'rotationStatic',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'randomizeRotation',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'color',
            controller: BaseInput,
            default: ['#fff'],
        },
        {
            name: 'colorSpread',
            controller: BaseInput,
            default: [],
        },
        {
            name: 'randomizeColor',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'opacity',
            controller: BaseInput,
            default: [1],
        },
        {
            name: 'opacitySpread',
            controller: BaseInput,
            default: [0],
        },
        {
            name: 'randomizeOpacity',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'size',
            controller: BaseInput,
            default: [1],
        },
        {
            name: 'sizeSpread',
            controller: BaseInput,
            default: [0],
        },
        {
            name: 'randomizeSize',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'angle',
            controller: BaseInput,
            default: [0],
        },
        {
            name: 'angleSpread',
            controller: BaseInput,
            default: [0],
        },
        {
            name: 'randomizeAngle',
            controller: BaseInput,
            default: false,
        },
    ],
};

export const stats = {
    componentType: 'stats',
    aframeComponentType: 'stats',
    display: 'Performance Stats',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const superHands = {
    componentType: 'super-hands',
    aframeComponentType: 'super-hands',
    display: 'Super Hands',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'colliderEvent',
            controller: BaseInput,
            default: 'raycaster-intersection',
        },
        {
            name: 'colliderEventProperty',
            controller: BaseInput,
            default: 'els',
        },
        {
            name: 'colliderEndEvent',
            controller: BaseInput,
            default: 'raycaster-intersection-cleared',
        },
        {
            name: 'colliderEndEventProperty',
            controller: BaseInput,
            default: 'clearedEls',
        },
    ],
};

export const physicsCollider = {
    componentType: 'physics-collider',
    aframeComponentType: 'physics-collider',
    display: 'Physics Collider',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'ignoreSleep',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const collisionFilter = {
    componentType: 'collision-filter',
    aframeComponentType: 'collision-filter',
    display: 'Collision Filter',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'group',
            controller: BaseInput,
            default: 'default',
        },
        {
            name: 'collidesWith',
            controller: BaseInput,
            default: 'default',
        },
        {
            name: 'collisionForces',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const sleepy = {
    componentType: 'sleepy',
    aframeComponentType: 'sleepy',
    display: 'Sleepy Physics',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'allowSleep',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'speedLimit',
            controller: NumberInput,
            default: 0.25,
        },
        {
            name: 'delay',
            controller: NumberInput,
            default: 0.25,
        },
        {
            name: 'linearDamping',
            controller: NumberInput,
            default: 0.99,
        },
        {
            name: 'angularDamping',
            controller: NumberInput,
            default: 0.99,
        },
        {
            name: 'holdState',
            controller: BaseInput,
            default: 'grabbed',
        },
    ],
};

export const grabbable = {
    componentType: 'grabbable',
    aframeComponentType: 'grabbable',
    display: 'Grabbable',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'grab-start',
            display: 'Grab Start',
        },
        {
            name: 'grab-end',
            display: 'Grab End',
        },
    ],
    attributes: [],
};

export const clickable = {
    componentType: 'clickable',
    aframeComponentType: 'clickable',
    display: 'Clickable',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const stretchable = {
    componentType: 'stretchable',
    aframeComponentType: 'stretchable',
    display: 'Stretchable',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const hoverable = {
    componentType: 'hoverable',
    aframeComponentType: 'hoverable',
    display: 'Hoverable',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const magneticGrabbable = {
    componentType: 'magnetic-grabbable',
    aframeComponentType: 'magnetic-grabbable',
    display: 'MagneticGrabbable',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const raycaster = {
    componentType: 'raycaster',
    aframeComponentType: 'raycaster',
    display: 'Raycaster',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'raycaster-intersection',
            display: 'Raycast Intersection',
        },
        {
            name: 'raycaster-intersection-cleared',
            display: 'Raycast Intersection Cleared',
        },
    ],
    attributes: [
        {
            name: 'objects',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'showLine',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'origin',
            controller: BaseInput,
            default: '0,0, 0',
        },
        {
            name: 'direction',
            controller: BaseInput,
            default: '0,0,-1',
        },
    ],
};

export const interactable = {
    componentType: 'interactable',
    aframeComponentType: 'tt-interactable',
    display: 'Interactable',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const raycastable = {
    componentType: 'raycastable',
    aframeComponentType: 'tt-raycastable',
    display: 'Raycastable',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'raycaster-intersected',
            display: 'Raycast Intersected',
        },
        {
            name: 'raycaster-intersected-cleared',
            display: 'Raycast Intersected Cleared',
        },
    ],
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: 'true',
        },
        {
            name: 'objectClass',
            controller: BaseInput,
            default: 'raycastable',
        },
    ],
};

export const dataTag = {
    componentType: 'data-tag',
    aframeComponentType: 'tt-data-tag',
    display: 'Data Tag',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: 'true',
        },
        {
            name: 'key',
            controller: BaseInput,
            default: null,
        },
        {
            name: 'value',
            controller: BaseInput,
            default: null,
        },
    ],
};

export const laserControls = {
    componentType: 'laser-controls',
    aframeComponentType: 'laser-controls',
    display: 'LaserControls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'hand',
            controller: OptionsInput,
            options: ['right', 'left'],
            default: 'right',
        },
    ],
};

export const handControls = {
    componentType: 'hand-controls',
    aframeComponentType: 'hand-controls-plus',
    display: 'handControls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'hand',
            controller: OptionsInput,
            options: ['right', 'left'],
            default: 'right',
        },
        {
            name: 'handModelStyle',
            controller: OptionsInput,
            options: ['lowPoly', 'highPoly', 'toon'],
            default: 'lowPoly',
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#ffcccc',
        },
    ],
};

export const oculusTouchControls = {
    componentType: 'oculus-touch-controls',
    aframeComponentType: 'oculus-touch-controls',
    display: 'Oculus Touch Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'hand',
            controller: OptionsInput,
            options: ['right', 'left'],
            default: 'right',
        },
        {
            name: 'model',
            controller: BooleanInput,
            default: 'true',
        },
    ],
    events: [
        {
            name: 'triggerdown',
            display: 'triggerdown',
        },
        {
            name: 'triggerup',
            display: 'triggerup',
        },
        {
            name: 'triggertouchstar',
            display: 'triggertouchstar',
        },
        {
            name: 'triggertouchend',
            display: 'triggertouchend',
        },
        {
            name: 'triggerchange',
            display: 'triggerchange',
        },
        {
            name: 'thumbstickdown',
            display: 'thumbstickdown',
        },
        {
            name: 'thumbstickup',
            display: 'thumbstickup',
        },
        {
            name: 'thumbsticktouchstart',
            display: 'thumbsticktouchstart',
        },
        {
            name: 'thumbsticktouchend',
            display: 'thumbsticktouchend',
        },
        {
            name: 'thumbstickchanged',
            display: 'thumbstickchanged',
        },
        {
            name: 'thumbstickmoved',
            display: 'thumbstickmoved',
        },
        {
            name: 'gripdown',
            display: 'gripdown',
        },
        {
            name: 'gripup',
            display: 'gripup',
        },
        {
            name: 'griptouchstart',
            display: 'griptouchstart',
        },
        {
            name: 'griptouchend',
            display: 'griptouchend',
        },
        {
            name: 'gripchanged',
            display: 'gripchanged',
        },
        {
            name: 'abuttondown',
            display: 'abuttondown',
        },
        {
            name: 'abuttonup',
            display: 'abuttonup',
        },
        {
            name: 'abuttontouchstart',
            display: 'abuttontouchstart',
        },
        {
            name: 'abuttontouchend',
            display: 'abuttontouchend',
        },
        {
            name: 'abuttonchanged',
            display: 'abuttonchanged',
        },
        {
            name: 'bbuttondown',
            display: 'bbuttondown',
        },
        {
            name: 'bbuttonup',
            display: 'bbuttonup',
        },
        {
            name: 'bbuttontouchstart',
            display: 'bbuttontouchstart',
        },
        {
            name: 'bbuttontouchend',
            display: 'bbuttontouchend',
        },
        {
            name: 'bbuttonchanged',
            display: 'bbuttonchanged',
        },
        {
            name: 'xbuttondown',
            display: 'xbuttondown',
        },
        {
            name: 'xbuttonup',
            display: 'xbuttonup',
        },
        {
            name: 'xbuttontouchstart',
            display: 'xbuttontouchstart',
        },
        {
            name: 'xbuttontouchend',
            display: 'xbuttontouchend',
        },
        {
            name: 'xbuttonchanged',
            display: 'xbuttonchanged',
        },
        {
            name: 'ybuttondown',
            display: 'ybuttondown',
        },
        {
            name: 'ybuttonup',
            display: 'ybuttonup',
        },
        {
            name: 'ybuttontouchstart',
            display: 'ybuttontouchstart',
        },
        {
            name: 'ybuttontouchend',
            display: 'ybuttontouchend',
        },
        {
            name: 'ybuttonchanged',
            display: 'ybuttonchanged',
        },
        {
            name: 'surfacedown',
            display: 'surfacedown',
        },
        {
            name: 'surfaceup',
            display: 'surfaceup',
        },
        {
            name: 'surfacetouchstart',
            display: 'surfacetouchstart',
        },
        {
            name: 'surfacetouchend',
            display: 'surfacetouchend',
        },
        {
            name: 'surfacechanged',
            display: 'surfacechanged',
        },
    ],
};

export const handTrackingControls = {
    componentType: 'hand-tracking-controls',
    aframeComponentType: 'hand-tracking-controls',
    display: 'HandTrackingControls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'hand',
            controller: OptionsInput,
            options: ['right', 'left'],
            default: 'right',
        },
        {
            name: 'modelStyle',
            controller: OptionsInput,
            options: ['dots', 'mesh'],
            default: 'mesh',
        },
        {
            name: 'modelColor',
            controller: BaseInput,
            default: '#ffcccc',
        },
    ],
};

export const mesh = {
    componentType: 'gltf-model-plus',
    aframeComponentType: 'gltf-model-plus',
    display: 'mesh',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const gltfPart = {
    componentType: 'gltf-part',
    aframeComponentType: 'tt-gltf-part',
    display: 'GLTF Part',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'name',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const meshMaterial = {
    componentType: 'modify-materials',
    aframeComponentType: 'modify-materials',
    display: 'Mesh Material',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'albedoMap',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'normalMap',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'metalnessMap',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'roughnessMap',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'emmisveMap',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'metalness',
            controller: NumberInput,
            default: '0',
        },
        {
            name: 'roughness',
            controller: NumberInput,
            default: '1',
        },
        {
            name: 'flipY',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'repeatX',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'repeatY',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const avatarAnimationLoader = {
    componentType: 'avatar-animation-loader',
    aframeComponentType: 'avatar-animation-loader',
    display: 'Avatar Animation Loader',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'idleAnimation',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'walkAnimation',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'pointAnimation',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'emoteAnimation',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const avatarWalkDetection = {
    componentType: 'avatar-walk-detection',
    aframeComponentType: 'avatar-walk-detection',
    display: 'Avatar Walk Detection',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const light = {
    componentType: 'light',
    aframeComponentType: 'light',
    display: 'Light',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'type',
            controller: BaseInput,
            default: 'directional',
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#fff',
        },
        {
            name: 'intensity',
            controller: NumberInput,
            default: 1.0,
        },
    ],
};

export const htmlEmbed = {
    componentType: 'htmlembed',
    aframeComponentType: 'htmlembed',
    display: 'HTML Embed',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const renderTag = {
    componentType: 'render-tag',
    display: 'Render Tag',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: 'TTPanel',
        },
    ],
};

export const overlay = {
    componentType: 'overlay',
    aframeComponentType: 'tt-overlay',
    display: 'Overlay',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const entityClass = {
    componentType: 'class',
    display: 'Class',
    editor: DefaultComponentEditor,
    setEntityAttribute(entityElement, component) {
        entityElement.setAttribute(`${this.componentType}`, component.attributes.value);
    },
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const paging = {
    componentType: 'ui-paging',
    display: 'Paging',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'buttonScale',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'nextButtonText',
            controller: BaseInput,
            default: 'Next',
        },
        {
            name: 'previousButtonText',
            controller: BaseInput,
            default: 'Previous',
        },
        {
            name: 'intersectableClass',
            controller: BaseInput,
            default: 'interactable',
        },
    ],
};
export const button = {
    componentType: 'ui-btn',
    display: 'Button',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const checkbox = {
    componentType: 'ui-checkbox',
    display: 'Checkbox',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'change',
            display: 'Change',
        },
    ],
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'disabled',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const radio = {
    componentType: 'ui-radio',
    display: 'Radio',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'disabled',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const input = {
    componentType: 'ui-input-text',
    display: 'Input',
    editor: DefaultComponentEditor,
    events: [
        {
            name: 'change',
            display: 'Change',
        },
    ],
    attributes: [
        {
            name: 'value',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'disabled',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'width',
            controller: BaseInput,
            default: 1,
        },
        {
            name: 'height',
            controller: BaseInput,
            default: 0.2,
        },
        {
            name: 'placeHolder',
            controller: BaseInput,
            default: 'Text...',
        },
    ],
};

export const rounded = {
    componentType: 'ui-rounded',
    display: 'Rounded',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const size = {
    componentType: 'size',
    htmlComponentType: 'tt-size',
    display: 'Size',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'height',
            controller: NumberInput,
            default: 100,
        },
        {
            name: 'width',
            controller: NumberInput,
            default: 100,
        },
    ],
};

export const animationMixer = {
    componentType: 'animation-mixer',
    aframeComponentType: 'animation-mixer-new',
    display: 'Animation Mixer',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'animationSrc',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'clip',
            controller: BaseInput,
            default: '*',
        },
        {
            name: 'autoPlay',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'loop',
            controller: OptionsInput,
            options: ['once', 'repeat', 'pingpong'],
            default: 'repeat',
        },
        {
            name: 'crossFadeDuration',
            controller: NumberInput,
            default: 0.3,
        },
        {
            name: 'subClips',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'timeScale',
            controller: NumberInput,
            default: 1,
        },
    ],
    actions: [
        {
            function: 'playAction',
            display: 'play',
        },
    ],
};

export const link = {
    componentType: 'link',
    aframeComponentType: 'link',
    display: 'Link',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'href',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'title',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'image',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const placeObject = {
    componentType: 'place-object',
    aframeComponentType: 'place-object',
    display: 'Place Object',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: false,
        },
        {
            name: 'entityId',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'snap',
            controller: NumberInput,
            default: 0.5,
        },
        {
            name: 'offset',
            controller: NumberInput,
            default: 0.5,
        },
    ],
};

export const twoWayMotion = {
    componentType: 'twoway-motion',
    aframeComponentType: 'twoway-motion',
    display: 'Two-way Motion',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'speed',
            controller: NumberInput,
            default: 40,
        },
        {
            name: 'threshold',
            controller: NumberInput,
            default: -40,
        },
    ],
};

export const glow = {
    componentType: 'glow',
    aframeComponentType: 'glow',
    display: 'Glow Effect',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BaseInput,
            default: true,
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#FFFFF0',
        },
        {
            name: 'c',
            controller: NumberInput,
            default: 1,
            min: 0,
            max: 1,
        },
        {
            name: 'p',
            controller: NumberInput,
            default: 1.4,
            min: 1,
            max: 6,
        },
        {
            name: 'scale',
            controller: NumberInput,
            default: 2,
        },
    ],
};

export const teleportControls = {
    componentType: 'teleport-controls',
    aframeComponentType: 'teleport-controls',
    display: 'Teleport Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'cameraRig',
            controller: BaseInput,
            default: '#cameraRig',
        },
        {
            name: 'teleportOrigin',
            controller: BaseInput,
            default: '#camera',
        },
        {
            name: 'startEvents',
            controller: BaseInput,
            default: 'starttouch',
        },
        {
            name: 'endEvents',
            controller: BaseInput,
            default: 'endtouch',
        },
    ],
};

export const cursorTeleport = {
    componentType: 'cursor-teleport',
    aframeComponentType: 'cursor-teleport',
    display: 'Cursor Teleport',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'cameraRig',
            controller: BaseInput,
            default: '#cameraRig',
        },
        {
            name: 'cameraHead',
            controller: BaseInput,
            default: '#camera',
        },
        {
            name: 'collisionEntities',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'ignoreEntities',
            controller: BaseInput,
            default: '[event]',
        },
    ],
};

export const teleportExtras = {
    componentType: 'teleport-extras',
    aframeComponentType: 'teleport-extras',
    display: 'teleport-extras',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const slideshow = {
    componentType: 'slideshow',
    aframeComponentType: 'aframe-slideshow',
    display: 'SlideShow',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'slides',
            controller: ArrayInput,
            default: [],
        },
    ],
};

export const checkpoint = {
    componentType: 'checkpoint',
    aframeComponentType: 'checkpoint',
    display: 'Checkpoint',
    editor: DefaultComponentEditor,
    actions: [
        {
            function: 'fire',
            display: 'goTo',
        },
    ],
    attributes: [],
};

export const checkpointControls = {
    componentType: 'checkpoint-controls',
    aframeComponentType: 'checkpoint-controls',
    display: 'Checkpoint Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'mode',
            controller: OptionsInput,
            options: ['teleport', 'animate'],
            default: 'teleport',
        },
        {
            name: 'animateSpeed',
            controller: NumberInput,
            default: 3.0,
        },
    ],
};

export const movementControls = {
    componentType: 'movement-controls',
    aframeComponentType: 'movement-controls',
    display: 'Movement Controls',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'speed',
            controller: NumberInput,
            default: 0.3,
        },
        {
            name: 'fly',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'constrainToNavMesh',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'camera',
            controller: BaseInput,
            default: '#camera',
        },
    ],
};

// AR.js

export const arjs = {
    componentType: 'arjs',
    aframeComponentType: 'arjs',
    display: 'AR',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'trackingMethod',
            controller: BaseInput,
            default: 'best',
        },
    ],
};

export const arjsAnchor = {
    componentType: 'arjs-anchor',
    aframeComponentType: 'arjs-anchor',
    display: 'AR Anchor',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'type',
            controller: OptionsInput,
            options: ['pattern', 'barcode', 'unknown', 'nft'],
            default: 'pattern',
        },
        {
            name: 'preset',
            controller: OptionsInput,
            options: ['hiro', 'kanji', 'area', 'barcode'],
            default: 'hiro',
        },
        {
            name: 'barcodeValue',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'size',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'patternUrl',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'minConfidence',
            controller: NumberInput,
            default: 0.6,
        },
        {
            name: 'smooth',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'smoothCount',
            controller: NumberInput,
            default: 5,
        },
        {
            name: 'smoothTolerance',
            controller: NumberInput,
            default: 0.01,
        },
        {
            name: 'smoothThreshold',
            controller: NumberInput,
            default: 2,
        },
    ],
};

export const arjsHitTesting = {
    componentType: 'arjs-hit-testing',
    aframeComponentType: 'arjs-hit-testing',
    display: 'AR Hit Testing',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const gpsCamera = {
    componentType: 'gps-camera',
    aframeComponentType: 'gps-camera',
    display: 'GPS Camera',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const gpsEntityPlace = {
    componentType: 'gps-entity-place',
    aframeComponentType: 'gps-entity-place',
    display: 'GPS Entity Place',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'latitude',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'longitude',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const mouseHands = {
    componentType: 'mouse-hands',
    aframeComponentType: 'mouse-hands',
    display: 'Mouse Hands',
    editor: DefaultComponentEditor,
    attributes: [],
};

export const svgExtruder = {
    componentType: 'svg',
    aframeComponentType: 'svg',
    display: 'SVG Extruder',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: BaseInput,
        },
        {
            name: 'proportionalScale',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'extrude',
            controller: NumberInput,
            default: 0.1,
        },
        {
            name: 'zFactor',
            controller: NumberInput,
            default: 0.005,
        },
        {
            name: 'overrideColor',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const shaderFrog = {
    componentType: 'shader-frog',
    aframeComponentType: 'shader-frog',
    display: 'Shader Frog',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'name',
            controller: OptionsInput,
            options: [
                'Cool_Tiles_Shader',
                'Cosmic_Shader',
                'Disco_Shader',
                'Electric_Shader',
                'Flowing_Circles_Shader',
                'Goo_Shader',
                'Green_Dance_Shader',
                'Jelly_Shader',
                'Marching_Ants_Shader',
                'Ova_Shader',
                'Polkadot_Shader',
                'Psycho_Shader',
                'Sun_Shader',
                'Thruster_Shader',
                'CS1_Shader',
            ],
            default: 'Flowing_Circles_Shader',
        },
    ],
};

export const fireball = {
    componentType: 'fireball',
    aframeComponentType: 'fireball',
    display: 'Fireball',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'brightness',
            controller: NumberInput,
            default: 1.5,
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#ffaa55',
        },
        {
            name: 'opacity',
            controller: NumberInput,
            default: 1.0,
        },
        {
            name: 'scale',
            controller: NumberInput,
            default: 1.0,
        },
        {
            name: 'speed',
            controller: NumberInput,
            default: 0.1,
        },
    ],
};

export const imagePortal = {
    componentType: 'image-portal',
    aframeComponentType: 'image-portal',
    display: 'Image Portal',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'autoReparent',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'renderOrder',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'debug',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const portal = {
    componentType: 'portal',
    aframeComponentType: 'portal',
    display: 'Portal',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'destination',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'width',
            controller: NumberInput,
            default: 2,
        },
        {
            name: 'height',
            controller: NumberInput,
            default: 3,
        },
        {
            name: 'maxRecursion',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'teleportCooldown',
            controller: NumberInput,
            default: 100,
        },
        {
            name: 'enableTeleport',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const plot = {
    componentType: 'plot',
    aframeComponentType: 'plot',
    display: 'Plot',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'function',
            controller: BaseInput,
            default: '0',
        },
        {
            name: 'order',
            controller: NumberInput,
            default: 32,
        },
        {
            name: 'label_text',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'show_function',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'show_axes',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'bounds',
            controller: BaseInput,
            default: '-1 1 -1 1 -1 1',
        },
        {
            name: 'show_zero_planes',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'show_bounding_box',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'show_grid',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'grid_x_scale',
            controller: NumberInput,
            default: 0.1,
        },
        {
            name: 'grid_y_scale',
            controller: NumberInput,
            default: 0.1,
        },
        {
            name: 'color',
            controller: BaseInput,
            default: '#AAA',
        },
        {
            name: 'animate',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const stereocam = {
    componentType: 'stereocam',
    aframeComponentType: 'stereocam',
    display: 'Stereo Cam',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'eye',
            controller: OptionsInput,
            options: ['left', 'right'],
            default: 'left',
        },
    ],
};

export const stereo = {
    componentType: 'stereo',
    aframeComponentType: 'stereo',
    display: 'Stereo',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'eye',
            controller: OptionsInput,
            options: ['left', 'right'],
            default: 'left',
        },
        {
            name: 'mode',
            controller: OptionsInput,
            options: ['full', 'half'],
            default: 'full',
        },
        {
            name: 'split',
            controller: OptionsInput,
            options: ['horizontal', 'vertical'],
            default: 'horizontal',
        },
        {
            name: 'playOnClick',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const fpsCounter = {
    componentType: 'fps-counter',
    aframeComponentType: 'fps-counter',
    display: 'FPS Counter',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'enabled',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'for90fps',
            controller: BooleanInput,
            default: true,
        },
    ],
};

export const csgMeshs = {
    componentType: 'csg-meshs',
    aframeComponentType: 'csg-meshs',
    display: 'CSG Meshs',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'union',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'subtract',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'intersect',
            controller: BaseInput,
            default: '',
        },
    ],
};

export const fractal = {
    componentType: 'fractal',
    aframeComponentType: 'fractal',
    display: 'Fractal',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'audioSource',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'fftSize',
            controller: NumberInput,
            default: 256,
        },
        {
            name: 'points',
            controller: NumberInput,
            default: 100,
        },
        {
            name: 'pointSize',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'detail',
            controller: NumberInput,
            default: 100,
        },
        {
            name: 'scale',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'logValues',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'x',
            controller: BaseInput,
            default: 't',
        },
        {
            name: 'y',
            controller: BaseInput,
            default: 't',
        },
        {
            name: 'z',
            controller: BaseInput,
            default: 't',
        },
    ],
};

export const audioanalyser = {
    componentType: 'audioanalyser',
    aframeComponentType: 'tt-audioanalyser',
    display: 'Audioanalyser',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'beatDetectionDecay',
            controller: NumberInput,
            default: 0.99,
        },
        {
            name: 'beatDetectionMinVolume',
            controller: NumberInput,
            default: 15,
        },
        {
            name: 'beatDetectionThrottle',
            controller: NumberInput,
            default: 250,
        },
        {
            name: 'cache',
            controller: BooleanInput,
            default: false,
        },
        {
            name: 'enableBeatDetection',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'enableLevels',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'enableVolume',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'enableWaveform',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'fftSize',
            controller: NumberInput,
            default: 2048,
        },
        {
            name: 'smoothingTimeConstant',
            controller: NumberInput,
            default: 0.8,
        },
        {
            name: 'unique',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const lipSync = {
    componentType: 'lipsync',
    aframeComponentType: 'tt-lipsync',
    display: 'Lip Sync',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'analyserEl',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'multiplier',
            controller: NumberInput,
            default: 1,
        },
    ],
};

export const resonanceAudioRoom = {
    componentType: 'resonance-audio-room',
    aframeComponentType: 'resonance-audio-room',
    display: 'Resonance Audio Room',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'width',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'height',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'depth',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'ambisonicOrder',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'speedOfSound',
            controller: NumberInput,
            default: 343,
        },
        {
            name: 'left',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'right',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'front',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'back',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'down',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'up',
            controller: OptionsInput,
            options: [
                'transparent',
                'acoustic-ceiling-tiles',
                'brick-bare',
                'brick-painted',
                'concrete-block-coarse',
                'concrete-block-painted',
                'curtain-heavy',
                'fiber-glass-insulation',
                'glass-thin',
                'glass-thick',
                'grass',
                'linoleum-on-concrete',
                'marble',
                'metal',
                'parquet-on-concrete',
                'plaster-smooth',
                'plywood-panel',
                'polished-concrete-or-tile',
                'sheetrock',
                'water-or-ice-surface',
                'wood-ceiling',
                'wood-panel',
                'uniform',
            ],
            default: 'brick-bare',
        },
        {
            name: 'visualize',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const resonanceAudioRoomSrc = {
    componentType: 'resonance-audio-room-src',
    aframeComponentType: 'resonance-audio-room-src',
    display: 'Resonance Audio Room Source',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'room',
            controller: BaseInput,
            default: 'el.parentNode',
        },
        {
            name: 'loop',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'autoplay',
            controller: BooleanInput,
            default: true,
        },
        {
            name: 'gain',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'maxDistance',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'minDistance',
            controller: NumberInput,
            default: 1,
        },
        {
            name: 'directivityPattern',
            controller: BaseInput,
            default: '0 1',
        },
        {
            name: 'sourceWidth',
            controller: NumberInput,
            default: 0,
        },
        {
            name: 'rolloff',
            controller: OptionsInput,
            options: ['logarithmic', 'linear', 'none'],
            default: 'logarithmic',
        },
        {
            name: 'position',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'rotation',
            controller: BaseInput,
            default: '',
        },
        {
            name: 'visualize',
            controller: BooleanInput,
            default: false,
        },
    ],
};

export const fbxModel = {
    componentType: 'fbx-model',
    aframeComponentType: 'fbx-model',
    display: 'FBX Model',
    editor: DefaultComponentEditor,
    attributes: [
        {
            name: 'src',
            controller: BaseInput,
            default: '',
        },
    ],
};

const components = [
    fbxModel,
    resonanceAudioRoom,
    resonanceAudioRoomSrc,
    audioanalyser,
    lipSync,
    csgMeshs,
    fpsCounter,
    stereo,
    stereocam,
    plot,
    imagePortal,
    fireball,
    shaderFrog,
    svgExtruder,
    arjs,
    arjsAnchor,
    arjsHitTesting,
    gpsCamera,
    gpsEntityPlace,
    mouseHands,
    environment,
    loadingPage,
    networkedScene,
    networkedObject,
    template,
    camera,
    wasdControls,
    lookControls,
    orbitControls,
    multiTouchControls,
    keyboard,
    transformElement,
    avatar,
    avatarAnimationLoader,
    avatarWalkDetection,
    transform,
    position,
    line,
    rotation,
    scale,
    geometry,
    layout,
    follow,
    lookAt,
    material,
    action,
    event,
    cursor,
    crawlingCursor,
    centerMesh,
    fitTexture,
    visible,
    text,
    textGeometry,
    icon,
    physics,
    physicsBody,
    lerp,
    aabbCollider,
    triggerable,
    sphereCollider,
    animation,
    sound,
    particle,
    superHands,
    stats,
    physicsCollider,
    collisionFilter,
    sleepy,
    grabbable,
    clickable,
    stretchable,
    hoverable,
    raycaster,
    interactable,
    laserControls,
    raycastable,
    dataTag,
    oculusTouchControls,
    handControls,
    handTrackingControls,
    mesh,
    gltfPart,
    meshMaterial,
    light,
    htmlEmbed,
    overlay,
    size,
    button,
    paging,
    checkbox,
    radio,
    input,
    rounded,
    entityClass,
    animationMixer,
    link,
    placeObject,
    twoWayMotion,
    magneticGrabbable,
    glow,
    teleportControls,
    movementControls,
    checkpointControls,
    checkpoint,
    teleportExtras,
    cursorTeleport,
    slideshow,
];

export const ComponentList = _.map(components, (component) => ({
    text: component.display,
    value: component.componentType,
}));
export const allComponentEvents = _(defaultEvents)
    .concat(
        _.flatMap(components, (c) => {
            if (c.events && _.size(c.events)) {
                return c.events;
            }
            return [];
        })
    )
    .map((e) => e.name)
    .uniq()
    .value();

_.forEach(components, (component) => {
    Components[component.componentType] = component;
});

export default Components;
