/* eslint-disable no-param-reassign */
import _ from 'lodash';
/**
 * Migration should migrate old dollar sign format to templates
 * $someStateVariable -> {{state.someStateVariable}}
 */

function removeEntityAll(config, entityId) {
    if (config[entityId]) {
        // delete all components
        _(config)
            .filter((item) => item.entityId === entityId)
            .forEach((item) => {
                delete config[item.id];
            });
        // delete all childeren
        _(config)
            .filter((item) => item.parent === entityId)
            .forEach((item) => {
                removeEntityAll(config, item.id);
            });

        delete config[entityId];
    }
}

function runMigration(app, migrationCutOffDate, migrationFn) {
    const lastUpdatedTime = new Date(app.updatedAt);
    if (lastUpdatedTime < migrationCutOffDate) {
        migrationFn();
    }
}

function migrateMeshMaterialValues(item) {
    if (item.type === 'component' && item.componentType === 'modify-materials') {
        if (item.attributes && item.attributes.path) {
            item.attributes.albedoMap = item.attributes.path;
            delete item.attributes.path;
        }
    }
}

function migrateRaycastableValue(item) {
    if (item.type === 'component' && item.componentType === 'raycastable') {
        if (item.attributes && !_.isUndefined(item.attributes.value)) {
            item.attributes.enabled = item.attributes.value;
            delete item.attributes.value;
        }
    }
}

function migrateStateSelectorToTemplates(item) {
    if (item.type === 'component') {
        _.forOwn(item.attributes, (attribute, key) => {
            if (attribute && _.indexOf(attribute, '$') === 0) {
                const stateSelector = attribute.slice(1);
                item.attributes[key] = `{{state.${stateSelector}}}`;
            }
        });
    }
}

function removeRippleComponent(item, config) {
    if (item.type === 'component' && item.componentType === 'ui-ripple') {
        delete config[item.id];
    }
}

function migrateTransitionSphere(item, config) {
    if (item.entityId === 'TT_7882928a227a4b549c1e21996639041c' && item.type === 'component') {
        if (item.componentType === 'visible') {
            // set transition sphere to false
            item.attributes.visible = false;
        } else if (item.componentType === 'geometry') {
            // shrink transition sphere to be just around persons head
            item.attributes.radius = 5;
        }
    }
}

function migrateAvatarBox(item) {
    if (item.id === 'TT_49911841a13c417abc26a9056cda3853') {
        item.attributes = {
            primitive: 'box',
            height: '2',
            width: '0.5',
            depth: '0.5',
        };
    }
}

function addInformationPoint(app) {
    _.extend(app.config, {
        TT_16c974d38c564bbc8422c7ec7ccb6577: {
            id: 'TT_16c974d38c564bbc8422c7ec7ccb6577',
            type: 'component',
            entityId: 'TT_2d180e0786df4192ada7a7d1953b462c',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_9852e07982ee42e597447427072d825a: {
            id: 'TT_9852e07982ee42e597447427072d825a',
            type: 'component',
            entityId: 'TT_2d180e0786df4192ada7a7d1953b462c',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_a46e13cc7da9408f938d8f80ac9dfe92: {
            id: 'TT_a46e13cc7da9408f938d8f80ac9dfe92',
            type: 'component',
            entityId: 'TT_2d180e0786df4192ada7a7d1953b462c',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_38ef65ea05164ab681c6fe33c8ce3fd6: {
            id: 'TT_38ef65ea05164ab681c6fe33c8ce3fd6',
            type: 'component',
            entityId: 'TT_2d180e0786df4192ada7a7d1953b462c',
            componentType: 'template',
            attributes: {
                each: '{{state.currentEnvironment.data.information}}',
                template: 'TT_eed0334917f04081a322230b1534940e',
            },
        },
        TT_2d180e0786df4192ada7a7d1953b462c: {
            id: 'TT_2d180e0786df4192ada7a7d1953b462c',
            name: 'InfoPointContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_eed0334917f04081a322230b1534940e: {
            id: 'TT_eed0334917f04081a322230b1534940e',
            name: 'InformationPoint Template',
            type: 'template',
        },
        TT_2815a7fb22d14a389859d36993e9eb6d: {
            id: 'TT_2815a7fb22d14a389859d36993e9eb6d',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '.2',
            },
        },
        TT_a96316c0add14c47aaf644c8111a87b7: {
            id: 'TT_a96316c0add14c47aaf644c8111a87b7',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'visible',
            attributes: {
                visible: 'true',
            },
        },
        TT_79b242959b904087a21fb4d0dcc7bc47: {
            id: 'TT_79b242959b904087a21fb4d0dcc7bc47',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'position',
            attributes: {
                x: '{{template.position.x}}',
                y: '{{template.position.y}}',
                z: '{{template.position.z}}',
            },
        },
        TT_ce57200986844fa99d10e917f5aaa35b: {
            id: 'TT_ce57200986844fa99d10e917f5aaa35b',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_2137311b4e3e4d69897c1e68175191bd: {
            id: 'TT_2137311b4e3e4d69897c1e68175191bd',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'material',
            attributes: {
                color: '#fafafa',
                shader: 'standard',
                wireframe: false,
                transparent: true,
                opacity: '0',
            },
        },
        TT_58dec6f30c404cc9abbaa1ed6c2bc153: {
            id: 'TT_58dec6f30c404cc9abbaa1ed6c2bc153',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_7da79a1215dc4edaba271c7da9e84fa5: {
            id: 'TT_7da79a1215dc4edaba271c7da9e84fa5',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'scale',
            attributes: {
                x: '{{template.scale.x}}',
                y: '{{template.scale.y}}',
                z: '{{template.scale.z}}',
            },
        },
        TT_3526eb704a9b4a0aafa2debc9b00a0fc: {
            id: 'TT_3526eb704a9b4a0aafa2debc9b00a0fc',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'class',
            attributes: {
                value: 'hotspot',
            },
        },
        TT_0998675b39974cf89e08410b267b7082: {
            id: 'TT_0998675b39974cf89e08410b267b7082',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_9eb556c7ab1a4c66994ebf543a4556db: {
            id: 'TT_9eb556c7ab1a4c66994ebf543a4556db',
            type: 'component',
            entityId: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            componentType: 'tt-transform-element',
            attributes: {
                enabled: true,
                selector: "{{'#vue-' + template.id}}",
            },
        },
        TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2: {
            id: 'TT_2c3a013a6a8b4a3cac8fb11a09c9d1e2',
            name: 'InformationPoint',
            type: 'entity',
            parent: 'TT_eed0334917f04081a322230b1534940e',
        },
    });
}

function addFitToTexture(app) {
    _.extend(app.config, {
        TT_1e949842cebc4a3793c151148cbf1fe0: {
            id: 'TT_1e949842cebc4a3793c151148cbf1fe0',
            type: 'component',
            entityId: 'TT_3895921b02464871a84b684a50d2bdd0',
            componentType: 'fit-texture-component',
            attributes: {
                enabled: true,
            },
        },
    });
}

function addMultiTouch(app) {
    _.extend(app.config, {
        TT_1ec6ca5f9f77483591954e3e8c093c95: {
            id: 'TT_1ec6ca5f9f77483591954e3e8c093c95',
            type: 'component',
            entityId: 'camera',
            componentType: 'tt-multitouch-look-controls',
            attributes: {
                enabled: true,
                maxPitch: '15',
                minPitch: '-20',
                xrange: '-1 1',
                yrange: '-1 1',
                zrange: '-1 1',
            },
        },
    });
}

function addOverlayContainer(app) {
    _.extend(app.config, {
        TT_8bddf7df619a4676b44d00020b9af8f9: {
            id: 'TT_8bddf7df619a4676b44d00020b9af8f9',
            type: 'component',
            entityId: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            componentType: 'visible',
            attributes: {
                visible: '{{!!state.slots.overlay.src}}',
            },
        },
        TT_67bdf04cf9df472c91b8c908757e8c68: {
            id: 'TT_67bdf04cf9df472c91b8c908757e8c68',
            type: 'component',
            entityId: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_3e66650051b24ce68c32ec36e6668be8: {
            id: 'TT_3e66650051b24ce68c32ec36e6668be8',
            type: 'component',
            entityId: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_8ab86b1e144641a08b5e7b0754c31b33: {
            id: 'TT_8ab86b1e144641a08b5e7b0754c31b33',
            type: 'component',
            entityId: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#camera',
                offsetX: '0',
                offsetY: '0',
                offsetZ: '{{AFRAME.utils.device.isMobile() ? -3 : -2}}',
            },
        },
        TT_aa84d08f7a2f44798b6c58fb8bbb22a3: {
            id: 'TT_aa84d08f7a2f44798b6c58fb8bbb22a3',
            type: 'component',
            entityId: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_e1083d6d82ed49029ed573a90600e7a6: {
            id: 'TT_e1083d6d82ed49029ed573a90600e7a6',
            name: 'OverlayContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_f93b2b43b1ff428fba9ccca7d0617dc3: {
            id: 'TT_f93b2b43b1ff428fba9ccca7d0617dc3',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '1.8',
                width: '1.8',
            },
        },
        TT_0d6878e02e0d45f6be052ee7a552ed1d: {
            id: 'TT_0d6878e02e0d45f6be052ee7a552ed1d',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'visible',
            attributes: {
                visible: '{{!!state.slots.overlay.src}}',
            },
        },
        TT_b8fef56cc1c140e8bdaf67ffb6cc8425: {
            id: 'TT_b8fef56cc1c140e8bdaf67ffb6cc8425',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '0',
                z: 0,
            },
        },
        TT_6ae38f866ea5482fa740e275a29800f2: {
            id: 'TT_6ae38f866ea5482fa740e275a29800f2',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_f09b407d4fe6450c892c91b558e4ce8c: {
            id: 'TT_f09b407d4fe6450c892c91b558e4ce8c',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'flat',
                src: '{{state.slots.overlay.src + "?image-overlay"}}',
                transparent: true,
            },
        },
        TT_0c5bfe0d37124e58815c2740aac169e0: {
            id: 'TT_0c5bfe0d37124e58815c2740aac169e0',
            type: 'component',
            entityId: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            componentType: 'raycastable',
            attributes: {
                enabled: '{{!!state.slots.overlay.src}}',
                objectClass: 'raycastable',
            },
        },
        TT_e1a465183afa4a8fb1491e6453f093b1: {
            id: 'TT_e1a465183afa4a8fb1491e6453f093b1',
            name: 'Image',
            type: 'entity',
            parent: 'TT_e1083d6d82ed49029ed573a90600e7a6',
        },
        TT_8f783cbcc62443aeb1f1d2db54a43998: {
            id: 'TT_8f783cbcc62443aeb1f1d2db54a43998',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_dd8eab5de53c4006a98edecf9f4848fe: {
            id: 'TT_dd8eab5de53c4006a98edecf9f4848fe',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'position',
            attributes: {
                x: '0.8',
                y: '1',
                z: '0.02',
            },
        },
        TT_69f19181540a455881ac63f67c1da7b1: {
            id: 'TT_69f19181540a455881ac63f67c1da7b1',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_6c1a754c1e244932a3bbb5531432c1a1: {
            id: 'TT_6c1a754c1e244932a3bbb5531432c1a1',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'scale',
            attributes: {
                x: 1,
                y: 1,
                z: 1,
            },
        },
        TT_fcb1ff18d8814856a16106217e6e3e19: {
            id: 'TT_fcb1ff18d8814856a16106217e6e3e19',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '.3',
                width: '.3',
            },
        },
        TT_7e20561561c74ae9b88c0614481419ae: {
            id: 'TT_7e20561561c74ae9b88c0614481419ae',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'ui-btn',
            attributes: {
                width: 1.5,
                height: 1,
            },
        },
        TT_facb311338364f10bc23b9e72ea62c67: {
            id: 'TT_facb311338364f10bc23b9e72ea62c67',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'material',
            attributes: {
                src: '',
                color: 'black',
                shader: 'flat',
                wireframe: false,
                transparent: false,
            },
        },
        TT_0d6707ec863340b88f0a400692c0ca2a: {
            id: 'TT_0d6707ec863340b88f0a400692c0ca2a',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_2a97fc06c8e042c6955296402499bc5c: {
            id: 'TT_2a97fc06c8e042c6955296402499bc5c',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TT_a7d4467d909f49c9b0de786af6dd0e0c',
                overlaySrc: 'tet',
            },
        },
        TT_eb907edd011843039230f9ae2269d6e8: {
            id: 'TT_eb907edd011843039230f9ae2269d6e8',
            type: 'component',
            entityId: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_c7a378efcb104a8dbad6ea027dfb364f: {
            id: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
            name: 'Button',
            type: 'entity',
            parent: 'TT_e1083d6d82ed49029ed573a90600e7a6',
        },
        TT_00f889c600f74d4b90ef9f7a3fd90cfc: {
            id: 'TT_00f889c600f74d4b90ef9f7a3fd90cfc',
            type: 'component',
            entityId: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_a50d61b4c0b64bf09f0d1dd78407c426: {
            id: 'TT_a50d61b4c0b64bf09f0d1dd78407c426',
            type: 'component',
            entityId: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_e59c5debe632442289ef655d1ee26352: {
            id: 'TT_e59c5debe632442289ef655d1ee26352',
            type: 'component',
            entityId: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_8d7eab2a3e2b4fe48c756a9ac884ceb0: {
            id: 'TT_8d7eab2a3e2b4fe48c756a9ac884ceb0',
            type: 'component',
            entityId: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            componentType: 'text',
            attributes: {
                value: 'Close',
                color: 'white',
                font: 'roboto',
                width: 1,
                height: 1,
                align: 'center',
            },
        },
        TT_b012e27be36145aa95cd7cd20c86f5df: {
            id: 'TT_b012e27be36145aa95cd7cd20c86f5df',
            type: 'component',
            entityId: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            componentType: 'scale',
            attributes: {
                x: '2',
                y: '2',
                z: '1',
            },
        },
        TT_a2123c20726c46f9807d8e4f23b61ee5: {
            id: 'TT_a2123c20726c46f9807d8e4f23b61ee5',
            name: 'Text',
            type: 'entity',
            parent: 'TT_c7a378efcb104a8dbad6ea027dfb364f',
        },
    });

    _.extend(app.state, {
        slots: {
            overlay: {
                src: null,
            },
        },
    });
}

function addClipboard(app) {
    _.extend(app.config, {
        TT_5651d561a8c34d2995c9a9c23291e351: {
            id: 'TT_5651d561a8c34d2995c9a9c23291e351',
            name: 'ClipboardContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_6f5b450a424e4023b11ce23d8da0990e: {
            id: 'TT_6f5b450a424e4023b11ce23d8da0990e',
            type: 'component',
            entityId: 'TT_5651d561a8c34d2995c9a9c23291e351',
            componentType: 'visible',
            attributes: {
                visible: 'true',
            },
        },
        TT_21bd3f8e4d364badb67ed3e01af683bf: {
            id: 'TT_21bd3f8e4d364badb67ed3e01af683bf',
            type: 'component',
            entityId: 'TT_5651d561a8c34d2995c9a9c23291e351',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_816a6078645046d5b0c1697ab6f1725d: {
            id: 'TT_816a6078645046d5b0c1697ab6f1725d',
            type: 'component',
            entityId: 'TT_5651d561a8c34d2995c9a9c23291e351',
            componentType: 'rotation',
            attributes: {
                x: '0',
                y: 0,
                z: 0,
            },
        },
        TT_bc0d7986707f49298854da2027135eab: {
            id: 'TT_bc0d7986707f49298854da2027135eab',
            name: 'PageButton Template',
            type: 'template',
        },
        TT_a4f9685d86e94265872eef31bb09f7b6: {
            id: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            name: 'PageButton',
            type: 'entity',
            parent: 'TT_bc0d7986707f49298854da2027135eab',
        },
        TT_3919b42dcef94de7b7f9f6c706e617fa: {
            id: 'TT_3919b42dcef94de7b7f9f6c706e617fa',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_1441265f62c54b6fa432c6c1fcce1206: {
            id: 'TT_1441265f62c54b6fa432c6c1fcce1206',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_df24c5175c134618b0cdfdfa2061fd99: {
            id: 'TT_df24c5175c134618b0cdfdfa2061fd99',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_a6925a61710440a3a197b7a13e2931ee: {
            id: 'TT_a6925a61710440a3a197b7a13e2931ee',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.1',
                width: '0.1',
            },
        },
        TT_fae72ba9607243ba87e8b2a072615970: {
            id: 'TT_fae72ba9607243ba87e8b2a072615970',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'text',
            attributes: {
                value: '{{index + 1}}',
                color: "{{index === state.currentEnvironment.data.clipboard[0].currentPage ? 'red': 'black'}}",
                font: 'roboto',
                width: '2',
                height: 1,
                anchor: 'center',
                align: 'center',
                baseline: 'center',
                wrapCount: 40,
            },
        },
        TT_66fcd8aecc9b4cfa81f7869a04ae2b74: {
            id: 'TT_66fcd8aecc9b4cfa81f7869a04ae2b74',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TT_826abbffc5314a41af72c30e1b6a99cb',
                pageIndex: '{{index}}',
            },
        },
        TT_537ca0eaf5ad4299aa437c82d8160f73: {
            id: 'TT_537ca0eaf5ad4299aa437c82d8160f73',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_99515a22a0944fa59105e989c96cc35a: {
            id: 'TT_99515a22a0944fa59105e989c96cc35a',
            type: 'component',
            entityId: 'TT_a4f9685d86e94265872eef31bb09f7b6',
            componentType: 'material',
            attributes: {
                src: '',
                color: 'white',
                shader: 'standard',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: '0',
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_4667e616c3874425b3da108f0856d735: {
            id: 'TT_4667e616c3874425b3da108f0856d735',
            name: 'ClipboardContainer Template',
            type: 'template',
        },
        TT_a607bcbbcfc5419daa3578a4631fcf28: {
            id: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            name: 'ClipboardContainer',
            type: 'entity',
            parent: 'TT_4667e616c3874425b3da108f0856d735',
        },
        TT_cbc669c740f94efb9bc320bd1a321dd9: {
            id: 'TT_cbc669c740f94efb9bc320bd1a321dd9',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'visible',
            attributes: {
                visible: '{{template.visible && template.pages && template.pages.length}}',
            },
        },
        TT_7a61e53b532d40e9a0b46d37b5965e87: {
            id: 'TT_7a61e53b532d40e9a0b46d37b5965e87',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_f0fb64feda524f44b4a257070d2409d6: {
            id: 'TT_f0fb64feda524f44b4a257070d2409d6',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'rotation',
            attributes: {
                x: '0',
                y: 0,
                z: 0,
            },
        },
        TT_5b582255435e43489ad4e96aaed540e0: {
            id: 'TT_5b582255435e43489ad4e96aaed540e0',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#camera',
                offsetX: '0',
                offsetY: '0.25',
                offsetZ: '-2',
                delay: '-1',
            },
        },
        TT_1cf98b5207484084ab9df444d86d918f: {
            id: 'TT_1cf98b5207484084ab9df444d86d918f',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_975f844d16dc4e18af7527ea7f2217b3: {
            id: 'TT_975f844d16dc4e18af7527ea7f2217b3',
            type: 'component',
            entityId: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
            componentType: 'scale',
            attributes: {
                x: '0.75',
                y: '.75',
                z: '.75',
            },
        },
        TT_e68c428933d34750a9faca71ff4ea384: {
            id: 'TT_e68c428933d34750a9faca71ff4ea384',
            name: 'ClipboardImage',
            type: 'entity',
            parent: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
        },
        TT_703f5304da044e06a35759a367faf84e: {
            id: 'TT_703f5304da044e06a35759a367faf84e',
            type: 'component',
            entityId: 'TT_e68c428933d34750a9faca71ff4ea384',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_9c6f0a9d21cb4b2493733fe59ef7e38b: {
            id: 'TT_9c6f0a9d21cb4b2493733fe59ef7e38b',
            type: 'component',
            entityId: 'TT_e68c428933d34750a9faca71ff4ea384',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_500d53c188d74f64b1a3d2b3ecfa71ba: {
            id: 'TT_500d53c188d74f64b1a3d2b3ecfa71ba',
            type: 'component',
            entityId: 'TT_e68c428933d34750a9faca71ff4ea384',
            componentType: 'rotation',
            attributes: {
                x: '-20',
                y: 0,
                z: 0,
            },
        },
        TT_34ceabf3a6aa47aaa5100aa52ad4c867: {
            id: 'TT_34ceabf3a6aa47aaa5100aa52ad4c867',
            type: 'component',
            entityId: 'TT_e68c428933d34750a9faca71ff4ea384',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '3',
                width: '2',
            },
        },
        TT_03bc961094854f35ace1d0226f6fdb74: {
            id: 'TT_03bc961094854f35ace1d0226f6fdb74',
            type: 'component',
            entityId: 'TT_e68c428933d34750a9faca71ff4ea384',
            componentType: 'material',
            attributes: {
                src: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/blank+clipboard.png',
                color: '',
                shader: 'standard',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: 1,
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_9b33fa51945441de81a3db98b4f7ba57: {
            id: 'TT_9b33fa51945441de81a3db98b4f7ba57',
            name: 'ContentContainer',
            type: 'entity',
            parent: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
        },
        TT_9a51da3c522e49b8aa7d0bec4a88e1f8: {
            id: 'TT_9a51da3c522e49b8aa7d0bec4a88e1f8',
            type: 'component',
            entityId: 'TT_9b33fa51945441de81a3db98b4f7ba57',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_16b7cc57436c429cb225e98e66b02878: {
            id: 'TT_16b7cc57436c429cb225e98e66b02878',
            type: 'component',
            entityId: 'TT_9b33fa51945441de81a3db98b4f7ba57',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_6c60acb0c1194b9d98b9434098437074: {
            id: 'TT_6c60acb0c1194b9d98b9434098437074',
            type: 'component',
            entityId: 'TT_9b33fa51945441de81a3db98b4f7ba57',
            componentType: 'rotation',
            attributes: {
                x: '-20',
                y: 0,
                z: 0,
            },
        },
        TT_59d1032912c241ddb7aa26b6d2d73624: {
            id: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            name: 'Header',
            type: 'entity',
            parent: 'TT_9b33fa51945441de81a3db98b4f7ba57',
        },
        TT_6b654f9fdf544d1897813f77aacc6c0a: {
            id: 'TT_6b654f9fdf544d1897813f77aacc6c0a',
            type: 'component',
            entityId: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_666b5f678c4a4a32bd6fd05dd05b131b: {
            id: 'TT_666b5f678c4a4a32bd6fd05dd05b131b',
            type: 'component',
            entityId: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '0.9',
                z: '0.1',
            },
        },
        TT_bdb44b07ef3740a89f70006644cb5988: {
            id: 'TT_bdb44b07ef3740a89f70006644cb5988',
            type: 'component',
            entityId: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_f76b3f7711204fbea2fe5216d43c3e21: {
            id: 'TT_f76b3f7711204fbea2fe5216d43c3e21',
            type: 'component',
            entityId: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            componentType: 'text',
            attributes: {
                value: '{{template.pages[template.currentPage].header}}',
                color: 'black',
                font: 'exo2bold',
                width: '1.6',
                height: '1',
                anchor: 'center',
                align: 'center',
                baseline: 'top',
                wrapCount: '20',
            },
        },
        TT_dafe7b1b4ad7493bb8064ca5f70e9ed8: {
            id: 'TT_dafe7b1b4ad7493bb8064ca5f70e9ed8',
            type: 'component',
            entityId: 'TT_59d1032912c241ddb7aa26b6d2d73624',
            componentType: 'scale',
            attributes: {
                x: '1',
                y: '1',
                z: '1',
            },
        },
        TT_1a1c4858480d400c9faddc7b19828fd5: {
            id: 'TT_1a1c4858480d400c9faddc7b19828fd5',
            name: 'Body',
            type: 'entity',
            parent: 'TT_9b33fa51945441de81a3db98b4f7ba57',
        },
        TT_bf51a64fb77b4b86bbcd42c278b275a8: {
            id: 'TT_bf51a64fb77b4b86bbcd42c278b275a8',
            type: 'component',
            entityId: 'TT_1a1c4858480d400c9faddc7b19828fd5',
            componentType: 'visible',
            attributes: {
                visible: "{{template.pages[template.currentPage].type === 'text'}}",
            },
        },
        TT_eb1477fb91fe41beb2f08dc30c803c9f: {
            id: 'TT_eb1477fb91fe41beb2f08dc30c803c9f',
            type: 'component',
            entityId: 'TT_1a1c4858480d400c9faddc7b19828fd5',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '0.45',
                z: '0.1',
            },
        },
        TT_fd4380e7fb944d1fa0c2b49ca66f5fa5: {
            id: 'TT_fd4380e7fb944d1fa0c2b49ca66f5fa5',
            type: 'component',
            entityId: 'TT_1a1c4858480d400c9faddc7b19828fd5',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_5980eeed99c240eaad512b6814d3b219: {
            id: 'TT_5980eeed99c240eaad512b6814d3b219',
            type: 'component',
            entityId: 'TT_1a1c4858480d400c9faddc7b19828fd5',
            componentType: 'text',
            attributes: {
                value: '{{template.pages[template.currentPage].body}}',
                color: 'black',
                font: 'roboto',
                width: '1.5',
                height: 1,
                anchor: 'center',
                align: 'left',
                baseline: 'top',
                wrapCount: '25',
            },
        },
        TT_9a46dd7aa3d64f25b9731ed913b4584a: {
            id: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            name: 'PageButtonsContainer',
            type: 'entity',
            parent: 'TT_9b33fa51945441de81a3db98b4f7ba57',
        },
        TT_3868ebfa18774ed8b3cebf37d44a7eb2: {
            id: 'TT_3868ebfa18774ed8b3cebf37d44a7eb2',
            type: 'component',
            entityId: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_96b32614b57648f4a5f4be527a58c131: {
            id: 'TT_96b32614b57648f4a5f4be527a58c131',
            type: 'component',
            entityId: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '-1.1',
                z: '0.1',
            },
        },
        TT_9e073bf72281458499fe4a3496881ecf: {
            id: 'TT_9e073bf72281458499fe4a3496881ecf',
            type: 'component',
            entityId: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_755611d3665342f182e3ccb4475f2903: {
            id: 'TT_755611d3665342f182e3ccb4475f2903',
            type: 'component',
            entityId: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            componentType: 'layout',
            attributes: {
                type: 'line',
                columns: '1',
                margin: '.2',
                marginColumn: '1',
                marginRow: '11',
                radius: 1,
                angle: false,
                plane: 'xy',
                align: 'center',
                reverse: false,
            },
        },
        TT_235d809aab5e43ae845c91c3189a3a0f: {
            id: 'TT_235d809aab5e43ae845c91c3189a3a0f',
            type: 'component',
            entityId: 'TT_9a46dd7aa3d64f25b9731ed913b4584a',
            componentType: 'template',
            attributes: {
                each: '{{template.pages}}',
                template: 'TT_bc0d7986707f49298854da2027135eab',
            },
        },
        TT_dc887e654fc74c5a91cabf99ce8df1a4: {
            id: 'TT_dc887e654fc74c5a91cabf99ce8df1a4',
            type: 'component',
            entityId: 'TT_5651d561a8c34d2995c9a9c23291e351',
            componentType: 'template',
            attributes: {
                each: '{{state.currentEnvironment.data.clipboard}}',
                template: 'TT_4667e616c3874425b3da108f0856d735',
            },
        },
        TT_90e61440a193483082bc43e3e9ea9fc5: {
            id: 'TT_90e61440a193483082bc43e3e9ea9fc5',
            type: 'component',
            entityId: 'TT_36b4420758174b4181119f4f35dcddd9',
            componentType: 'visible',
            attributes: {
                visible: "{{template.pages[template.currentPage].type === 'image'}}",
            },
        },
        TT_8bb7ce43521c4c308d1e41687f4f8ea4: {
            id: 'TT_8bb7ce43521c4c308d1e41687f4f8ea4',
            type: 'component',
            entityId: 'TT_36b4420758174b4181119f4f35dcddd9',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '-0.15',
                z: '0.01',
            },
        },
        TT_9f9f51e3e6424dd79f85bb09b52eb923: {
            id: 'TT_9f9f51e3e6424dd79f85bb09b52eb923',
            type: 'component',
            entityId: 'TT_36b4420758174b4181119f4f35dcddd9',
            componentType: 'rotation',
            attributes: {
                x: '0',
                y: 0,
                z: 0,
            },
        },
        TT_2e9b24c33c67478089d5fbd26799b945: {
            id: 'TT_2e9b24c33c67478089d5fbd26799b945',
            type: 'component',
            entityId: 'TT_36b4420758174b4181119f4f35dcddd9',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '1.7',
                width: '1.4',
            },
        },
        TT_b3f19504fdd3465f8146b8d522fcda18: {
            id: 'TT_b3f19504fdd3465f8146b8d522fcda18',
            type: 'component',
            entityId: 'TT_36b4420758174b4181119f4f35dcddd9',
            componentType: 'material',
            attributes: {
                src: '{{template.pages[template.currentPage].src}}',
                color: '',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: 1,
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_36b4420758174b4181119f4f35dcddd9: {
            id: 'TT_36b4420758174b4181119f4f35dcddd9',
            name: 'PageImage',
            type: 'entity',
            parent: 'TT_9b33fa51945441de81a3db98b4f7ba57',
        },
        TT_5c28fb9872a8429ea3df4eb9ea208008: {
            id: 'TT_5c28fb9872a8429ea3df4eb9ea208008',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_43014b0991484fe898118db26287f1c7: {
            id: 'TT_43014b0991484fe898118db26287f1c7',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'position',
            attributes: {
                x: '0.8',
                y: '1',
                z: '0.02',
            },
        },
        TT_e78346113c0e4576add96478b2db6e75: {
            id: 'TT_e78346113c0e4576add96478b2db6e75',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_4312d0884c1b463d81e6654e06ee4203: {
            id: 'TT_4312d0884c1b463d81e6654e06ee4203',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'scale',
            attributes: {
                x: 1,
                y: 1,
                z: 1,
            },
        },
        TT_512ded522a154649a274a23abd1533e9: {
            id: 'TT_512ded522a154649a274a23abd1533e9',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '.3',
                width: '.3',
            },
        },
        TT_7adb9cb277fa4baeb4bb7332e0b936a8: {
            id: 'TT_7adb9cb277fa4baeb4bb7332e0b936a8',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'ui-btn',
            attributes: {
                width: 1.5,
                height: 1,
            },
        },
        TT_dd49d38d5b194958ac22622b0194755b: {
            id: 'TT_dd49d38d5b194958ac22622b0194755b',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'material',
            attributes: {
                src: '',
                color: 'black',
                shader: 'flat',
                wireframe: false,
                transparent: false,
            },
        },
        TT_1f383a217f30460888093770f392d4ca: {
            id: 'TT_1f383a217f30460888093770f392d4ca',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_d7f4575db0d44dd9874df260b75e55f4: {
            id: 'TT_d7f4575db0d44dd9874df260b75e55f4',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TT_22e26867c36946fab55d68f8e04de6cd',
                overlaySrc: 'tet',
            },
        },
        TT_2d4945dd04434a9b90741b0f78d631d2: {
            id: 'TT_2d4945dd04434a9b90741b0f78d631d2',
            type: 'component',
            entityId: 'TT_cd8680c36149472182b60898a1c0aac5',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_cd8680c36149472182b60898a1c0aac5: {
            id: 'TT_cd8680c36149472182b60898a1c0aac5',
            name: 'Button',
            type: 'entity',
            parent: 'TT_a607bcbbcfc5419daa3578a4631fcf28',
        },
        TT_d99ae8ee5a924834a5c095402cd235a0: {
            id: 'TT_d99ae8ee5a924834a5c095402cd235a0',
            type: 'component',
            entityId: 'TT_c3b316404e044f8695868361394938c2',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_9f3cc8a7c89944c6858fa1cf02757fe2: {
            id: 'TT_9f3cc8a7c89944c6858fa1cf02757fe2',
            type: 'component',
            entityId: 'TT_c3b316404e044f8695868361394938c2',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_d4db59cca4314cc888caa6870750b2e0: {
            id: 'TT_d4db59cca4314cc888caa6870750b2e0',
            type: 'component',
            entityId: 'TT_c3b316404e044f8695868361394938c2',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_64cbc39fa74f474e9b404f5d1dcb87e6: {
            id: 'TT_64cbc39fa74f474e9b404f5d1dcb87e6',
            type: 'component',
            entityId: 'TT_c3b316404e044f8695868361394938c2',
            componentType: 'text',
            attributes: {
                value: 'Close',
                color: 'white',
                font: 'roboto',
                width: 1,
                height: 1,
                align: 'center',
            },
        },
        TT_e2382aef127a46bf992457667d9104cc: {
            id: 'TT_e2382aef127a46bf992457667d9104cc',
            type: 'component',
            entityId: 'TT_c3b316404e044f8695868361394938c2',
            componentType: 'scale',
            attributes: {
                x: '2',
                y: '2',
                z: '1',
            },
        },
        TT_c3b316404e044f8695868361394938c2: {
            id: 'TT_c3b316404e044f8695868361394938c2',
            name: 'Text',
            type: 'entity',
            parent: 'TT_cd8680c36149472182b60898a1c0aac5',
        },
    });

    // Remove the close button
    _.unset(app.config, [
        'TT_2a812576745243a7913f8ce526e9f768',
        'TT_7cd2bdb7d2c947e8ab5f1bd742679612',
        'TT_02a469abae3843ceb8245bb2c1b02084',
        'TT_be267b5d8ab445cf80a531dc6da4c9cf',
        'TT_52fe807d3ead4a29a7649107ebbf32a6',
        'TT_1ac75de116054888b2b374327e6d9c73',
        'TT_48d91ee9e5ea4978b5af91dbd788226a',
        'TT_c380aeae20ab495e9be608511270b2f7',
        'TT_274cdc8b7db14cb6b292cf5c1e9b9387',
        'TT_df30b2c38e4a4f8d8f72aeea52eb72fd',
        'TT_c21cfe3583174ab4a1e619840ec4166c',
        'TT_f942571f686942eb8ed4ddd7aed6af36',
        'TT_52e0f589c014408ea87608a37992182a',
        'TT_47757fe37d084495a89b617a91838a23',
        'TT_2f2e13502ba04da68feea31072054b36',
        'TT_0251be0f06074c28883e40004aad4085',
        'TT_d272b5c842204e2cad88d00cb580633c',
    ]);

    _.extend(app.actions, {
        TT_826abbffc5314a41af72c30e1b6a99cb: {
            id: 'TT_826abbffc5314a41af72c30e1b6a99cb',
            name: 'UpdateClipboardPage',
            type: 'custom',
            code:
                "// enter action code below\nStore.dispatch('apps/state/update', {\n        'selector': 'currentEnvironment.data.clipboard[0].currentPage',\n        'value': Arguments[0]\n    });",
            watch: false,
            argumentDefinitions: [
                {
                    label: 'Page Index',
                    name: 'pageIndex',
                    controller: 'BaseInput',
                },
            ],
        },
        TT_22e26867c36946fab55d68f8e04de6cd: {
            id: 'TT_22e26867c36946fab55d68f8e04de6cd',
            name: 'CloseClipboard',
            type: 'custom',
            code:
                "// enter action code below\n\nStore.dispatch('apps/state/update', {\n        'selector': 'currentEnvironment.data.clipboard[0].visible',\n        'value': false\n    });",
            watch: false,
        },
    });
}

function migrateAvatarAnimation(app) {
    // migrate template src
    _.forOwn(app.config, (item) => {
        if (item.id === 'TT_a07b1604923e46c2b2cf5af4240853a8') {
            item.attributes.animationSrc = '{{template.action}}';
        }
    });
    // migrate state
    _.forOwn(app?.state?.steps, (step) => {
        _.forOwn(step?.data?.entities, (entity) => {
            if (entity.type === 'avatar' && _.isString(entity.animation)) {
                entity.action = entity.animation;
                entity.animation = {
                    loop: false,
                    duration: 3000,
                    delay: 0,
                    direction: 'normal',
                    to: null,
                };
            }
        });
    });
}

function addKeyboard(app) {
    _.extend(app.config, {
        TT_f60064548b5049c8a3c283f1b578cef2: {
            id: 'TT_f60064548b5049c8a3c283f1b578cef2',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_efc833c66a8b498088dbdd63ea29fc6b: {
            id: 'TT_efc833c66a8b498088dbdd63ea29fc6b',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '-1',
            },
        },
        TT_87d6ca4e52ed41a89f15c02d4d953e5c: {
            id: 'TT_87d6ca4e52ed41a89f15c02d4d953e5c',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_d505c75ce2c547119d234c347d5e42de: {
            id: 'TT_d505c75ce2c547119d234c347d5e42de',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'material',
            attributes: {
                color: 'red',
                shader: 'flat',
            },
        },
        TT_1615997311594c2cb9c7022e88ca2b8b: {
            id: 'TT_1615997311594c2cb9c7022e88ca2b8b',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'super-keyboard',
            attributes: {
                imagePath: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/keyboard',
                hand: '#none',
                label: 'Enter label here',
                labelColor: '#000',
                show: 'false',
                model: 'numpad',
            },
        },
        TT_4d386c88a7bd482fa3eb6d8745a63d3f: {
            id: 'TT_4d386c88a7bd482fa3eb6d8745a63d3f',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#camera',
                delay: '200',
                offsetX: '0',
                offsetY: '0',
                offsetZ: '-1',
            },
        },
        TT_7c90abf3ebeb4cd99735ce5ab89d4c1b: {
            id: 'TT_7c90abf3ebeb4cd99735ce5ab89d4c1b',
            type: 'component',
            entityId: 'TT_31eedb494b124c089198da37a689f52e',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_31eedb494b124c089198da37a689f52e: {
            id: 'TT_31eedb494b124c089198da37a689f52e',
            name: 'Keyboard',
            type: 'entity',
            parent: 'scene',
        },
    });
}

function addCoachToToolbar() {
    _.extend(app.config, {
        TT_0704676b9e194d2cab5aecb8f6141d8b: {
            id: 'TT_0704676b9e194d2cab5aecb8f6141d8b',
            type: 'component',
            entityId: 'TT_1e23f8e864e741ac90ac966328e133b1',
            componentType: 'visible',
            attributes: {
                visible: '{{steps.transcriptPlaying}}',
            },
        },
        TT_e31046cf9aee469b9925590ed1ad5e1b: {
            id: 'TT_e31046cf9aee469b9925590ed1ad5e1b',
            type: 'component',
            entityId: 'TT_1e23f8e864e741ac90ac966328e133b1',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '2',
                z: 0,
            },
        },
        TT_bb2fe4cd1bf141bfa9062d4e05dce4d6: {
            id: 'TT_bb2fe4cd1bf141bfa9062d4e05dce4d6',
            type: 'component',
            entityId: 'TT_1e23f8e864e741ac90ac966328e133b1',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_62f873d18488433ead4f7cf99ff2a417: {
            id: 'TT_62f873d18488433ead4f7cf99ff2a417',
            type: 'component',
            entityId: 'TT_1e23f8e864e741ac90ac966328e133b1',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: 1,
            },
        },
        TT_8b99fbbd6ac142ac9ba03e1c756dc671: {
            id: 'TT_8b99fbbd6ac142ac9ba03e1c756dc671',
            type: 'component',
            entityId: 'TT_1e23f8e864e741ac90ac966328e133b1',
            componentType: 'material',
            attributes: {
                src: '{{state.coach.src}}',
                color: 'white',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: 1,
                side: 'double',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_1e23f8e864e741ac90ac966328e133b1: {
            id: 'TT_1e23f8e864e741ac90ac966328e133b1',
            name: 'Coach',
            type: 'entity',
            parent: 'TT_7329f3e36600440daa429497ae99e8a4',
        },
        TT_3c31d8d70c0f4064952f4c040762d303: {
            id: 'TT_3c31d8d70c0f4064952f4c040762d303',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '1.03',
            },
        },
        TT_a96bee31ab124092a67f2d74475940a2: {
            id: 'TT_a96bee31ab124092a67f2d74475940a2',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_60d2909ac8cd4ab49c802f2e8f9ae742: {
            id: 'TT_60d2909ac8cd4ab49c802f2e8f9ae742',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '-0.02',
            },
        },
        TT_de9567d1274240238ca92960270b4653: {
            id: 'TT_de9567d1274240238ca92960270b4653',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_1faa6333ae9a4ee4808a0f9ca6dd5d5b: {
            id: 'TT_1faa6333ae9a4ee4808a0f9ca6dd5d5b',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'material',
            attributes: {
                color: 'white',
                shader: 'flat',
            },
        },
        TT_61028aba6e1b47e3abef265dd64d01c0: {
            id: 'TT_61028aba6e1b47e3abef265dd64d01c0',
            type: 'component',
            entityId: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            componentType: 'animation',
            attributes: {
                enabled: true,
                property: 'scale',
                from: '1 1 1',
                to: '1.05 1.05 1.05',
                delay: 0,
                easing: 'easeInOutQuad',
                dir: 'alternate',
                dur: '500',
                loop: true,
                startEvents: null,
                pauseEvents: null,
                autoplay: true,
            },
        },
        TT_15fc6251f6a24e309f61799e4b2fc4b8: {
            id: 'TT_15fc6251f6a24e309f61799e4b2fc4b8',
            name: 'Circle',
            type: 'entity',
            parent: 'TT_1e23f8e864e741ac90ac966328e133b1',
        },
    });
}

function addToolbar(app) {
    removeEntityAll(app.config, 'TT_7329f3e36600440daa429497ae99e8a4');
    _.extend(app.config, {
        TT_4f8f0c718cf0470491aa0649e4c07f95: {
            id: 'TT_4f8f0c718cf0470491aa0649e4c07f95',
            type: 'component',
            entityId: 'TT_7329f3e36600440daa429497ae99e8a4',
            componentType: 'visible',
            attributes: {
                visible: '{{steps.started && appContext.inVRMode}}',
            },
        },
        TT_4cbe83dc4e134d4abed3213987224cf6: {
            id: 'TT_4cbe83dc4e134d4abed3213987224cf6',
            type: 'component',
            entityId: 'TT_7329f3e36600440daa429497ae99e8a4',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '-2',
                z: '-2',
            },
        },
        TT_bef703c7780d4948b1a02e048e39bb68: {
            id: 'TT_bef703c7780d4948b1a02e048e39bb68',
            type: 'component',
            entityId: 'TT_7329f3e36600440daa429497ae99e8a4',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_e2460d10028d4b8c8355d7a6979c32d6: {
            id: 'TT_e2460d10028d4b8c8355d7a6979c32d6',
            type: 'component',
            entityId: 'TT_7329f3e36600440daa429497ae99e8a4',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_7329f3e36600440daa429497ae99e8a4: {
            id: 'TT_7329f3e36600440daa429497ae99e8a4',
            name: 'ToolbarContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_cee1610953e44b308a8dfa7cc9086f0e: {
            id: 'TT_cee1610953e44b308a8dfa7cc9086f0e',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'geometry',
            attributes: {
                primitive: 'cone',
                height: '.5',
                openEnded: false,
                radiusBottom: '.02',
                radiusTop: '.02',
            },
        },
        TT_697101434f4d49b2b613e07b8591a534: {
            id: 'TT_697101434f4d49b2b613e07b8591a534',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'visible',
            attributes: {
                visible: 'false',
            },
        },
        TT_b3770165c9ba42bbae9d8f1d70ea1f3d: {
            id: 'TT_b3770165c9ba42bbae9d8f1d70ea1f3d',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '0',
                z: 0,
            },
        },
        TT_a50c75cae4154242bf488d9ba956ef01: {
            id: 'TT_a50c75cae4154242bf488d9ba956ef01',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'rotation',
            attributes: {
                x: '0',
                y: '0',
                z: '90',
            },
        },
        TT_c6c2d1375ccd4288b59ab78f7c7ef477: {
            id: 'TT_c6c2d1375ccd4288b59ab78f7c7ef477',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'material',
            attributes: {
                color: '#fafafa',
                shader: 'flat',
                opacity: '0.75',
                transparent: true,
            },
        },
        TT_ca01be487a34436697177d4760879f3b: {
            id: 'TT_ca01be487a34436697177d4760879f3b',
            type: 'component',
            entityId: 'TT_2b3e84d278cf4d28af71d9a846598845',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_2b3e84d278cf4d28af71d9a846598845: {
            id: 'TT_2b3e84d278cf4d28af71d9a846598845',
            name: 'Grabber',
            type: 'entity',
            parent: 'TT_7329f3e36600440daa429497ae99e8a4',
        },
        TT_158ff00eb484457fa6fa3c569b91229d: {
            id: 'TT_158ff00eb484457fa6fa3c569b91229d',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_36806b37a08244ba9da4df6ef06cab4b: {
            id: 'TT_36806b37a08244ba9da4df6ef06cab4b',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_fa5f7f9daf3a4ef7bb979af9571edc8e: {
            id: 'TT_fa5f7f9daf3a4ef7bb979af9571edc8e',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_0395c34e761f4771846882a24dfad765: {
            id: 'TT_0395c34e761f4771846882a24dfad765',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.3',
                width: '3',
            },
        },
        TT_2362e0706c5341f1b5c2466948c5947f: {
            id: 'TT_2362e0706c5341f1b5c2466948c5947f',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'material',
            attributes: {
                src: '',
                color: '#163033',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: false,
                opacity: '1',
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_9d4d5cacb70a459cb3acb14c6d813e83: {
            id: 'TT_9d4d5cacb70a459cb3acb14c6d813e83',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_9d0b07fa01a34cab89e4c3df1e7d176e: {
            id: 'TT_9d0b07fa01a34cab89e4c3df1e7d176e',
            type: 'component',
            entityId: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#TT_2b3e84d278cf4d28af71d9a846598845',
                delay: '0',
                offsetX: '0',
                offsetY: '0',
                offsetZ: '3',
            },
        },
        TT_6219e1593b6143c79e52c9048a40ed2a: {
            id: 'TT_6219e1593b6143c79e52c9048a40ed2a',
            name: 'ToolbarPanel',
            type: 'entity',
            parent: 'TT_7329f3e36600440daa429497ae99e8a4',
        },
        TT_ff438d9b10d7473ba58e31ec801a1dc3: {
            id: 'TT_ff438d9b10d7473ba58e31ec801a1dc3',
            type: 'component',
            entityId: 'TT_16a406b56eb14545bc5cf5803e087a30',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_6b59343980574d668118c938ab95da0c: {
            id: 'TT_6b59343980574d668118c938ab95da0c',
            type: 'component',
            entityId: 'TT_16a406b56eb14545bc5cf5803e087a30',
            componentType: 'position',
            attributes: {
                x: '-1.3',
                y: 0,
                z: '0.02',
            },
        },
        TT_0d618bc4bd574c3a9d4de5d9ed8c7514: {
            id: 'TT_0d618bc4bd574c3a9d4de5d9ed8c7514',
            type: 'component',
            entityId: 'TT_16a406b56eb14545bc5cf5803e087a30',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_579e7edb70b34938b014e883f107ac29: {
            id: 'TT_579e7edb70b34938b014e883f107ac29',
            type: 'component',
            entityId: 'TT_16a406b56eb14545bc5cf5803e087a30',
            componentType: 'layout',
            attributes: {
                type: 'line',
                columns: '1',
                margin: '.3',
                marginColumn: '1',
                marginRow: 1,
                radius: 1,
                angle: false,
                plane: 'xy',
                align: 'end',
                reverse: false,
            },
        },
        TT_16a406b56eb14545bc5cf5803e087a30: {
            id: 'TT_16a406b56eb14545bc5cf5803e087a30',
            name: 'Left',
            type: 'entity',
            parent: 'TT_6219e1593b6143c79e52c9048a40ed2a',
        },
        TT_3521e43a40ef4de5a652b21467d30524: {
            id: 'TT_3521e43a40ef4de5a652b21467d30524',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '0.1',
            },
        },
        TT_8161b3f3f4c441229897b9181259a942: {
            id: 'TT_8161b3f3f4c441229897b9181259a942',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_3a10935f1f224546b8292d62b7885cad: {
            id: 'TT_3a10935f1f224546b8292d62b7885cad',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_7d23d2ff3c394e389cbdfb56803a5956: {
            id: 'TT_7d23d2ff3c394e389cbdfb56803a5956',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_ea579427bdd54d748428527e76ae5d31: {
            id: 'TT_ea579427bdd54d748428527e76ae5d31',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'material',
            attributes: {
                color: '#2B4349',
                shader: 'flat',
                transparent: false,
                opacity: '1',
                wireframe: false,
            },
        },
        TT_ed4014f6088a429d8b2bb6f7b40157cb: {
            id: 'TT_ed4014f6088a429d8b2bb6f7b40157cb',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TT_a79310d0814c41b5a6dd197f9dd11053',
            },
        },
        TT_8712d42d90b049fdb0e2d5f7e3e3056d: {
            id: 'TT_8712d42d90b049fdb0e2d5f7e3e3056d',
            type: 'component',
            entityId: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_4a1fb06bf46045b5b1a5956567a44f76: {
            id: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
            name: 'Clipboard',
            type: 'entity',
            parent: 'TT_16a406b56eb14545bc5cf5803e087a30',
        },
        TT_1cdaeb550600402fa5c1acfb58bb8ef7: {
            id: 'TT_1cdaeb550600402fa5c1acfb58bb8ef7',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_10c5edaeff844315a16f8bb85f23db66: {
            id: 'TT_10c5edaeff844315a16f8bb85f23db66',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0.001',
            },
        },
        TT_94827d2e3a744589b3245965dab06cc8: {
            id: 'TT_94827d2e3a744589b3245965dab06cc8',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_19039f0b4a0d4710a2080cc3a9767355: {
            id: 'TT_19039f0b4a0d4710a2080cc3a9767355',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'icon',
            attributes: {
                icon: 'assignment',
                color: '{{state.currentEnvironment.data.clipboard[0].visible ? "#1E85AA" : "white"}}',
                undefined: 1024,
            },
        },
        TT_36baf8dba3b346dc9f4591f397a7ccd8: {
            id: 'TT_36baf8dba3b346dc9f4591f397a7ccd8',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.15',
                width: '0.15',
            },
        },
        TT_cc1cbd67168942909d013c46ebacdd15: {
            id: 'TT_cc1cbd67168942909d013c46ebacdd15',
            type: 'component',
            entityId: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            componentType: 'material',
            attributes: {
                src: '',
                color: 'white',
                shader: 'standard',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: '1',
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_61673e463cfc4196bad25c0cd98b29b4: {
            id: 'TT_61673e463cfc4196bad25c0cd98b29b4',
            name: 'Icon',
            type: 'entity',
            parent: 'TT_4a1fb06bf46045b5b1a5956567a44f76',
        },
        TT_6b5f063c37ea453ab20fcad7e2ece5c7: {
            id: 'TT_6b5f063c37ea453ab20fcad7e2ece5c7',
            type: 'component',
            entityId: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_981b03dfb1f6461c84a226b8673e2bec: {
            id: 'TT_981b03dfb1f6461c84a226b8673e2bec',
            type: 'component',
            entityId: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
            componentType: 'position',
            attributes: {
                x: '1.3',
                y: 0,
                z: '0.02',
            },
        },
        TT_66150cd99fff463096d50541d347c0aa: {
            id: 'TT_66150cd99fff463096d50541d347c0aa',
            type: 'component',
            entityId: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_f3c7c29f57c849a6980753bb87dc144a: {
            id: 'TT_f3c7c29f57c849a6980753bb87dc144a',
            type: 'component',
            entityId: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
            componentType: 'layout',
            attributes: {
                type: 'line',
                columns: 1,
                margin: '0.3',
                marginColumn: 1,
                marginRow: 1,
                radius: 1,
                angle: false,
                plane: 'xy',
                align: 'start',
                reverse: false,
            },
        },
        TT_60d0c5dcc85f4b019dc134451c02b48d: {
            id: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
            name: 'Right',
            type: 'entity',
            parent: 'TT_6219e1593b6143c79e52c9048a40ed2a',
        },
        TT_cb202ffec1314597bd395c58ff893c96: {
            id: 'TT_cb202ffec1314597bd395c58ff893c96',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '0.1',
            },
        },
        TT_f39226bd2a874474b4caab88cee49d61: {
            id: 'TT_f39226bd2a874474b4caab88cee49d61',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_9b1ee010fd284f71b1766a75b62fc1c0: {
            id: 'TT_9b1ee010fd284f71b1766a75b62fc1c0',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_24e1155ee9ce4a939140c6429d03c582: {
            id: 'TT_24e1155ee9ce4a939140c6429d03c582',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_3ea20f963f6f46b0b4dcf57f8918ee0d: {
            id: 'TT_3ea20f963f6f46b0b4dcf57f8918ee0d',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'material',
            attributes: {
                color: '#2B4349',
                shader: 'flat',
                transparent: false,
                opacity: '1',
            },
        },
        TT_2e34b6b6a7494c969923fd42a6693923: {
            id: 'TT_2e34b6b6a7494c969923fd42a6693923',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TT_81a5c74f5c5b45a3bd5c88a9af5a0219',
            },
        },
        TT_9817b93c4b7e46bd86694120438babda: {
            id: 'TT_9817b93c4b7e46bd86694120438babda',
            type: 'component',
            entityId: 'TT_458833f90d504776913d6fb5864798bb',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_458833f90d504776913d6fb5864798bb: {
            id: 'TT_458833f90d504776913d6fb5864798bb',
            name: 'ExitVRContainer',
            type: 'entity',
            parent: 'TT_60d0c5dcc85f4b019dc134451c02b48d',
        },
        TT_5f8edd83ba85431dabfd0915dc40a784: {
            id: 'TT_5f8edd83ba85431dabfd0915dc40a784',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.15',
                width: '0.15',
            },
        },
        TT_aa855672aaae4049a4c88665c927b1d9: {
            id: 'TT_aa855672aaae4049a4c88665c927b1d9',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_0fd02b409d324e848967afff5d291f20: {
            id: 'TT_0fd02b409d324e848967afff5d291f20',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0.001',
            },
        },
        TT_b6e339ca9d90462f9bfead64bb43285a: {
            id: 'TT_b6e339ca9d90462f9bfead64bb43285a',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_86f140cf88e84935bac1b044c4f335a1: {
            id: 'TT_86f140cf88e84935bac1b044c4f335a1',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'standard',
                transparent: true,
                opacity: '1',
            },
        },
        TT_8103a17b0172466690a4b9dd4088d200: {
            id: 'TT_8103a17b0172466690a4b9dd4088d200',
            type: 'component',
            entityId: 'TT_c92e2cb756744111ad0cba6425eabd12',
            componentType: 'icon',
            attributes: {
                icon: 'cancel_presentation',
                color: '#fff',
                undefined: 1024,
            },
        },
        TT_c92e2cb756744111ad0cba6425eabd12: {
            id: 'TT_c92e2cb756744111ad0cba6425eabd12',
            name: 'ExitVRIcon',
            type: 'entity',
            parent: 'TT_458833f90d504776913d6fb5864798bb',
        },
        TT_3c6f5166f8f64deb9501b6f6a487e5fa: {
            id: 'TT_3c6f5166f8f64deb9501b6f6a487e5fa',
            type: 'component',
            entityId: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
            componentType: 'visible',
            attributes: {
                visible: 'true',
            },
        },
        TT_b3bc71c6721c4229b89ff6dcfc422bf6: {
            id: 'TT_b3bc71c6721c4229b89ff6dcfc422bf6',
            type: 'component',
            entityId: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
            componentType: 'position',
            attributes: {
                x: '0',
                y: 0,
                z: '0.02',
            },
        },
        TT_0a2f1393ac08466da4a161c9fbf5e26f: {
            id: 'TT_0a2f1393ac08466da4a161c9fbf5e26f',
            type: 'component',
            entityId: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_90a625e347ea415ba9dc827f85895d3c: {
            id: 'TT_90a625e347ea415ba9dc827f85895d3c',
            type: 'component',
            entityId: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
            componentType: 'layout',
            attributes: {
                type: 'line',
                columns: 1,
                margin: '0.3',
                marginColumn: 1,
                marginRow: 1,
                radius: 1,
                angle: false,
                plane: 'xy',
                align: 'center',
                reverse: false,
            },
        },
        TT_bcd7febec45c4766a5b1d7b5b0d108dd: {
            id: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
            name: 'Middle',
            type: 'entity',
            parent: 'TT_6219e1593b6143c79e52c9048a40ed2a',
        },
        TT_01cb1a24b5314b02b5018cba5768fe34: {
            id: 'TT_01cb1a24b5314b02b5018cba5768fe34',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '0.1',
            },
        },
        TT_10d2eff2dd594f678e428cb8605cf317: {
            id: 'TT_10d2eff2dd594f678e428cb8605cf317',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_90399171927a4c96b4529ea2237607b0: {
            id: 'TT_90399171927a4c96b4529ea2237607b0',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_f6270f8be7c04a4a80d83c257501a594: {
            id: 'TT_f6270f8be7c04a4a80d83c257501a594',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_c8b0e25eac8343beb837a4a4e3bb40a7: {
            id: 'TT_c8b0e25eac8343beb837a4a4e3bb40a7',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'material',
            attributes: {
                color: '#2B4349',
                shader: 'flat',
                transparent: false,
                opacity: '1',
            },
        },
        TT_d7532f068c244fe9a7facd451d9ba5eb: {
            id: 'TT_d7532f068c244fe9a7facd451d9ba5eb',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'GoToPreviousStep',
            },
        },
        TT_a2e3f1986f034c2b9620ddb4a35ad3bc: {
            id: 'TT_a2e3f1986f034c2b9620ddb4a35ad3bc',
            type: 'component',
            entityId: 'TT_583bebdd193746829b6d559e21ebb950',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_583bebdd193746829b6d559e21ebb950: {
            id: 'TT_583bebdd193746829b6d559e21ebb950',
            name: 'Previous',
            type: 'entity',
            parent: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
        },
        TT_f3ef4e319a064675aa8f81e23add99f9: {
            id: 'TT_f3ef4e319a064675aa8f81e23add99f9',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.15',
                width: '0.15',
            },
        },
        TT_edcb9ea1a7d140fdae2c75623fbcec40: {
            id: 'TT_edcb9ea1a7d140fdae2c75623fbcec40',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_60826d2ab7cb4132b6844e4dcdf79a4c: {
            id: 'TT_60826d2ab7cb4132b6844e4dcdf79a4c',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0.001',
            },
        },
        TT_84f4c375e48c46c198321fa7acd1834e: {
            id: 'TT_84f4c375e48c46c198321fa7acd1834e',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_07858eea55a04b6b93d8fb9f6ada98ba: {
            id: 'TT_07858eea55a04b6b93d8fb9f6ada98ba',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'standard',
                transparent: true,
                opacity: '1',
            },
        },
        TT_fc26c4a9bed145ccbfdf2cb3948f839e: {
            id: 'TT_fc26c4a9bed145ccbfdf2cb3948f839e',
            type: 'component',
            entityId: 'TT_da09638e85c449d4b525ba91f4aad14a',
            componentType: 'icon',
            attributes: {
                icon: 'skip_previous',
                color: '#fff',
                undefined: 1024,
            },
        },
        TT_da09638e85c449d4b525ba91f4aad14a: {
            id: 'TT_da09638e85c449d4b525ba91f4aad14a',
            name: 'Previous',
            type: 'entity',
            parent: 'TT_583bebdd193746829b6d559e21ebb950',
        },
        TT_a6913fe9edd1401aadea1437dbf64e61: {
            id: 'TT_a6913fe9edd1401aadea1437dbf64e61',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '0.1',
            },
        },
        TT_7a48840f9c1e4454b7896117ff0b06a9: {
            id: 'TT_7a48840f9c1e4454b7896117ff0b06a9',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'visible',
            attributes: {
                visible: 'true',
            },
        },
        TT_ce9482107c1047a3aa15d7b7a6e47c11: {
            id: 'TT_ce9482107c1047a3aa15d7b7a6e47c11',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_523d0b06d14a453a8e1f0f7520dfd4f3: {
            id: 'TT_523d0b06d14a453a8e1f0f7520dfd4f3',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_dbce47590e104f578241c5c7f6632e50: {
            id: 'TT_dbce47590e104f578241c5c7f6632e50',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'material',
            attributes: {
                color: '#2B4349',
                shader: 'flat',
                transparent: false,
                opacity: '1',
            },
        },
        TT_696ffc37639949f78441dfc881cff205: {
            id: 'TT_696ffc37639949f78441dfc881cff205',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'TogglePlaySimulation',
            },
        },
        TT_2554a31ed0784da5b3a4c05bb9d23ae9: {
            id: 'TT_2554a31ed0784da5b3a4c05bb9d23ae9',
            type: 'component',
            entityId: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_44386a83b7b9410c83c8bd3af6033c92: {
            id: 'TT_44386a83b7b9410c83c8bd3af6033c92',
            name: 'Play',
            type: 'entity',
            parent: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
        },
        TT_19849c350ab944859bcd91cf45954828: {
            id: 'TT_19849c350ab944859bcd91cf45954828',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.15',
                width: '0.15',
            },
        },
        TT_4b6a9e6a3613483c9cf7b19724983981: {
            id: 'TT_4b6a9e6a3613483c9cf7b19724983981',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'visible',
            attributes: {
                visible: 'true',
            },
        },
        TT_368febc491314e52a46111f5da7d952a: {
            id: 'TT_368febc491314e52a46111f5da7d952a',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0.001',
            },
        },
        TT_d833a0bf7cb2437e82a83f9e848f5ff9: {
            id: 'TT_d833a0bf7cb2437e82a83f9e848f5ff9',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_d70b605d83b043e0969f3a57635bc065: {
            id: 'TT_d70b605d83b043e0969f3a57635bc065',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'standard',
                transparent: true,
                opacity: '1',
            },
        },
        TT_a4480eb8f0b94564807a0e29ba5864ef: {
            id: 'TT_a4480eb8f0b94564807a0e29ba5864ef',
            type: 'component',
            entityId: 'TT_65f41892e1714f4fbddd742ae701a569',
            componentType: 'icon',
            attributes: {
                icon: '{{steps.paused ? "play_arrow" : "pause"}}',
                color: '#fff',
                undefined: 1024,
            },
        },
        TT_65f41892e1714f4fbddd742ae701a569: {
            id: 'TT_65f41892e1714f4fbddd742ae701a569',
            name: 'Play',
            type: 'entity',
            parent: 'TT_44386a83b7b9410c83c8bd3af6033c92',
        },
        TT_3fc05cdb88504a6497a1e80d185695e9: {
            id: 'TT_3fc05cdb88504a6497a1e80d185695e9',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '0.1',
            },
        },
        TT_621f7fe23d504b51bef0aa03512f3429: {
            id: 'TT_621f7fe23d504b51bef0aa03512f3429',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_5a078ce50e854bafa740ef4945620181: {
            id: 'TT_5a078ce50e854bafa740ef4945620181',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_86b3bd89565b4b00a0e0ebe5626163b1: {
            id: 'TT_86b3bd89565b4b00a0e0ebe5626163b1',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_6751ecd15ae34a92a685723d7b801d6e: {
            id: 'TT_6751ecd15ae34a92a685723d7b801d6e',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'material',
            attributes: {
                color: '#2B4349',
                shader: 'flat',
                transparent: false,
                opacity: '1',
            },
        },
        TT_89679e13305c42eabfdf787c8a95d8fe: {
            id: 'TT_89679e13305c42eabfdf787c8a95d8fe',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'event',
            attributes: {
                attributesOverride: null,
                event: 'click',
                action: 'GoToNextStep',
            },
        },
        TT_0a8121b903334a53bf10aaac60f10fa2: {
            id: 'TT_0a8121b903334a53bf10aaac60f10fa2',
            type: 'component',
            entityId: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_8d91cae616d142dda7c70cb5113e61e8: {
            id: 'TT_8d91cae616d142dda7c70cb5113e61e8',
            name: 'Next',
            type: 'entity',
            parent: 'TT_bcd7febec45c4766a5b1d7b5b0d108dd',
        },
        TT_a47c3c7faf3b492da23e7b58dbea5a32: {
            id: 'TT_a47c3c7faf3b492da23e7b58dbea5a32',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '0.15',
                width: '0.15',
            },
        },
        TT_4fc08309560a43508c103da146c80a41: {
            id: 'TT_4fc08309560a43508c103da146c80a41',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_33ac443756154bdc90f8cc04c5683301: {
            id: 'TT_33ac443756154bdc90f8cc04c5683301',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0.001',
            },
        },
        TT_c7f317cd6815487d9f5d4f2d6b410362: {
            id: 'TT_c7f317cd6815487d9f5d4f2d6b410362',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_68f819f56c9a4b78aecc983d1f72e1e7: {
            id: 'TT_68f819f56c9a4b78aecc983d1f72e1e7',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'standard',
                transparent: true,
                opacity: '1',
            },
        },
        TT_1af104f9898c455b8b4693432d512397: {
            id: 'TT_1af104f9898c455b8b4693432d512397',
            type: 'component',
            entityId: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            componentType: 'icon',
            attributes: {
                icon: 'skip_next',
                color: '#fff',
                undefined: 1024,
            },
        },
        TT_e1037c9201ce4eb8b9e36bd52a755d90: {
            id: 'TT_e1037c9201ce4eb8b9e36bd52a755d90',
            name: 'Next',
            type: 'entity',
            parent: 'TT_8d91cae616d142dda7c70cb5113e61e8',
        },
    });

    _.extend(app.actions, {
        TT_a79310d0814c41b5a6dd197f9dd11053: {
            id: 'TT_a79310d0814c41b5a6dd197f9dd11053',
            name: 'ToggleClipboard',
            type: 'custom',
            code:
                "// enter action code below\n\nconst {currentEnvironment} = Store.state.apps.state.state;\n\nif (currentEnvironment && currentEnvironment.data && currentEnvironment.data.clipboard && currentEnvironment.data.clipboard[0]) {\n    const isClipbopardVisible = currentEnvironment.data.clipboard[0].visible\n    \n    Store.dispatch('apps/state/update', {\n            'selector': 'currentEnvironment.data.clipboard[0].visible',\n            'value': !isClipbopardVisible\n        });\n}",
            watch: false,
        },
        TT_81a5c74f5c5b45a3bd5c88a9af5a0219: {
            id: 'TT_81a5c74f5c5b45a3bd5c88a9af5a0219',
            name: 'Exit VR',
            type: 'custom',
            code: "// enter action code below\n\nconst sceneEl = document.querySelector('a-scene');\nif (sceneEl.is('vr-mode')) sceneEl.exitVR();",
            watch: false,
        },
    });
}

function addPictureChoicePanel(app) {
    _.extend(app.config, {
        TT_df5cc960860e45aab84c89fa4497004a: {
            id: 'TT_df5cc960860e45aab84c89fa4497004a',
            type: 'component',
            entityId: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            componentType: 'visible',
            attributes: {
                visible: 'false',
            },
        },
        TT_07365e9dac60450caad2ef6679bea0b1: {
            id: 'TT_07365e9dac60450caad2ef6679bea0b1',
            type: 'component',
            entityId: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_231ea6332f7340f4bfd4fc03777595cc: {
            id: 'TT_231ea6332f7340f4bfd4fc03777595cc',
            type: 'component',
            entityId: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_83111d6a22574f18b0ce8824deda8b04: {
            id: 'TT_83111d6a22574f18b0ce8824deda8b04',
            type: 'component',
            entityId: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#camera',
                delay: '200',
                offsetX: '0',
                offsetY: '0',
                offsetZ: '-2',
            },
        },
        TT_f8633039febd427ab6f51017b4d0d7c1: {
            id: 'TT_f8633039febd427ab6f51017b4d0d7c1',
            type: 'component',
            entityId: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_a399df5cd9e243f0a40a69d6d10f06a0: {
            id: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
            name: 'PictureChoiceContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_4931dead1d3b4cc9bc24a36b25e60353: {
            id: 'TT_4931dead1d3b4cc9bc24a36b25e60353',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_4dcdb33a243c45e8b635dab816bc89db: {
            id: 'TT_4dcdb33a243c45e8b635dab816bc89db',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_d561c32e166d404689ae71d468273434: {
            id: 'TT_d561c32e166d404689ae71d468273434',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_a0f22f2ab3544f2b838d7d1fbfef8d6d: {
            id: 'TT_a0f22f2ab3544f2b838d7d1fbfef8d6d',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '2',
                width: '3',
            },
        },
        TT_40392b1c58c44b7d8e56c88727040088: {
            id: 'TT_40392b1c58c44b7d8e56c88727040088',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'material',
            attributes: {
                src: '',
                color: '#163033',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: false,
                opacity: 1,
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_96401d8c44664ee780be6d62e1256c86: {
            id: 'TT_96401d8c44664ee780be6d62e1256c86',
            type: 'component',
            entityId: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_4ec194a0df2e4a9e88d848e31de13324: {
            id: 'TT_4ec194a0df2e4a9e88d848e31de13324',
            name: 'Panel',
            type: 'entity',
            parent: 'TT_a399df5cd9e243f0a40a69d6d10f06a0',
        },
        TT_b4b7a241a1c345179dda1deaf8ec9f52: {
            id: 'TT_b4b7a241a1c345179dda1deaf8ec9f52',
            type: 'component',
            entityId: 'TT_c776320487fe4651bd06e0f50147d748',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_d1cf5d6bf1334c819fc3ede5c332ef8d: {
            id: 'TT_d1cf5d6bf1334c819fc3ede5c332ef8d',
            type: 'component',
            entityId: 'TT_c776320487fe4651bd06e0f50147d748',
            componentType: 'position',
            attributes: {
                x: '1.4',
                y: '.82',
                z: 0,
            },
        },
        TT_76b142b77a9947eaaa470d83326d4935: {
            id: 'TT_76b142b77a9947eaaa470d83326d4935',
            type: 'component',
            entityId: 'TT_c776320487fe4651bd06e0f50147d748',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_8d99df4d53fd4292951d27947f1be7f0: {
            id: 'TT_8d99df4d53fd4292951d27947f1be7f0',
            type: 'component',
            entityId: 'TT_c776320487fe4651bd06e0f50147d748',
            componentType: 'text',
            attributes: {
                value: '{{state.currentStep.data.title}}',
                color: 'white',
                font: 'roboto',
                width: '2.8',
                height: '3',
                anchor: 'right',
                align: 'left',
                baseline: 'center',
                wrapCount: '40',
            },
        },
        TT_c776320487fe4651bd06e0f50147d748: {
            id: 'TT_c776320487fe4651bd06e0f50147d748',
            name: 'Title',
            type: 'entity',
            parent: 'TT_4ec194a0df2e4a9e88d848e31de13324',
        },
        TT_aac70a41ab0348b6a606b281031ad2e8: {
            id: 'TT_aac70a41ab0348b6a606b281031ad2e8',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_d6126bce8f0e4ec1b30f1f1b8822882a: {
            id: 'TT_d6126bce8f0e4ec1b30f1f1b8822882a',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'position',
            attributes: {
                x: '-1',
                y: '0.15',
                z: '0.011',
            },
        },
        TT_63469936e29b417a9f2c843469c64745: {
            id: 'TT_63469936e29b417a9f2c843469c64745',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'rotation',
            attributes: {
                x: '0',
                y: '0',
                z: '0',
            },
        },
        TT_0ac271cb21994bb6af989f817bb32f52: {
            id: 'TT_0ac271cb21994bb6af989f817bb32f52',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'layout',
            attributes: {
                type: 'line',
                columns: '3',
                margin: '1',
                marginColumn: '2',
                marginRow: '2',
                radius: 1,
                angle: false,
                plane: 'xy',
                align: 'end',
                reverse: false,
            },
        },
        TT_1fd7716b560d4d389b99874f4d603323: {
            id: 'TT_1fd7716b560d4d389b99874f4d603323',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'scale',
            attributes: {
                x: '1',
                y: '1',
                z: '1',
            },
        },
        TT_de98e9975fc74e788a8a54c48041e0f1: {
            id: 'TT_de98e9975fc74e788a8a54c48041e0f1',
            type: 'component',
            entityId: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            componentType: 'template',
            attributes: {
                each: '{{state.currentStep.data.options}}',
                template: 'TT_776fbd3006fc47bdafc6b4d85bf64e69',
            },
        },
        TT_70fd21a91861416f9ca9ef7a3a2c3dce: {
            id: 'TT_70fd21a91861416f9ca9ef7a3a2c3dce',
            name: 'OptionListContainer',
            type: 'entity',
            parent: 'TT_4ec194a0df2e4a9e88d848e31de13324',
        },
        TT_31f442a5c2584473991f7f50dab2150d: {
            id: 'TT_31f442a5c2584473991f7f50dab2150d',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_9759c126092b4fdaadb69808a7c0b753: {
            id: 'TT_9759c126092b4fdaadb69808a7c0b753',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'position',
            attributes: {
                x: '1.2',
                y: '-0.8',
                z: '0.01',
            },
        },
        TT_cade1eaf35434ce39a29c951ddca94ba: {
            id: 'TT_cade1eaf35434ce39a29c951ddca94ba',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_a03c8d9d4259426f80a6448db3483973: {
            id: 'TT_a03c8d9d4259426f80a6448db3483973',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'scale',
            attributes: {
                x: 1,
                y: 1,
                z: 1,
            },
        },
        TT_ebf59eb449fa4e22b262df53f95a86f8: {
            id: 'TT_ebf59eb449fa4e22b262df53f95a86f8',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '.3',
                width: '.5',
            },
        },
        TT_e2d641355b944aaf9364ef9b7243d931: {
            id: 'TT_e2d641355b944aaf9364ef9b7243d931',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'ui-btn',
            attributes: {
                width: 1.5,
                height: 1,
            },
        },
        TT_b301fd0cb1184a01a836981b670aa8d5: {
            id: 'TT_b301fd0cb1184a01a836981b670aa8d5',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'material',
            attributes: {
                src: '',
                color: '#118AB2',
                shader: 'flat',
                wireframe: false,
                transparent: false,
            },
        },
        TT_494c4e4045ae4a39ad616eabce5364f1: {
            id: 'TT_494c4e4045ae4a39ad616eabce5364f1',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_abb880a168624191a2a32081a0827b47: {
            id: 'TT_abb880a168624191a2a32081a0827b47',
            type: 'component',
            entityId: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            componentType: 'raycastable',
            attributes: {
                enabled: 'true',
                objectClass: 'raycastable',
            },
        },
        TT_ab6f64df410a44da9540a8b1d63f7cc4: {
            id: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
            name: 'SubmitButton',
            type: 'entity',
            parent: 'TT_4ec194a0df2e4a9e88d848e31de13324',
        },
        TT_1c0ba958fc274be18197ed5bf7e62263: {
            id: 'TT_1c0ba958fc274be18197ed5bf7e62263',
            type: 'component',
            entityId: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_a0850b9d03a243d596cc829beaf90916: {
            id: 'TT_a0850b9d03a243d596cc829beaf90916',
            type: 'component',
            entityId: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_8c2eb607aaa34a82b73836598621bfc6: {
            id: 'TT_8c2eb607aaa34a82b73836598621bfc6',
            type: 'component',
            entityId: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_d8f304cf3416460b874c02178608ce47: {
            id: 'TT_d8f304cf3416460b874c02178608ce47',
            type: 'component',
            entityId: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            componentType: 'text',
            attributes: {
                value: 'Submit',
                color: 'white',
                font: 'roboto',
                width: 1,
                height: 1,
                align: 'center',
            },
        },
        TT_9d704054b0694c21ab36c1d4ddd74f1a: {
            id: 'TT_9d704054b0694c21ab36c1d4ddd74f1a',
            type: 'component',
            entityId: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            componentType: 'scale',
            attributes: {
                x: '2',
                y: '2',
                z: '1',
            },
        },
        TT_27b6f9451a4241c0a58c14a1b22dc0cf: {
            id: 'TT_27b6f9451a4241c0a58c14a1b22dc0cf',
            name: 'Text',
            type: 'entity',
            parent: 'TT_ab6f64df410a44da9540a8b1d63f7cc4',
        },

        TT_776fbd3006fc47bdafc6b4d85bf64e69: {
            id: 'TT_776fbd3006fc47bdafc6b4d85bf64e69',
            name: 'OptionContainer Template',
            type: 'template',
        },
        TT_968367d7d02340959c524778c9c0350d: {
            id: 'TT_968367d7d02340959c524778c9c0350d',
            type: 'component',
            entityId: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_cffc5ce3efe74b49adf43863b3b5088a: {
            id: 'TT_cffc5ce3efe74b49adf43863b3b5088a',
            type: 'component',
            entityId: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_b4c4631f3dfc4ae5ab77697d9ac9e6a6: {
            id: 'TT_b4c4631f3dfc4ae5ab77697d9ac9e6a6',
            type: 'component',
            entityId: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_120f780cbf9b4153bd441647c54474b0: {
            id: 'TT_120f780cbf9b4153bd441647c54474b0',
            type: 'component',
            entityId: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
            componentType: 'scale',
            attributes: {
                x: '0.75',
                y: '0.75',
                z: '0.75',
            },
        },
        TT_6b27bcbbc44446a898b6e78e2129dff3: {
            id: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
            name: 'OptionContainer',
            type: 'entity',
            parent: 'TT_776fbd3006fc47bdafc6b4d85bf64e69',
        },
        TT_fa9ffd0f2b424b63a349e2248dfac5a8: {
            id: 'TT_fa9ffd0f2b424b63a349e2248dfac5a8',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_098a23ab24d849869e6c3e4246435367: {
            id: 'TT_098a23ab24d849869e6c3e4246435367',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'position',
            attributes: {
                x: '0',
                y: '0',
                z: '0.01',
            },
        },
        TT_27885887f0e440839ffd1398598215de: {
            id: 'TT_27885887f0e440839ffd1398598215de',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_06e6bf865ecb454bba51c3e7b253c107: {
            id: 'TT_06e6bf865ecb454bba51c3e7b253c107',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'material',
            attributes: {
                src: '{{template.src}}',
                color: '',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: true,
                opacity: 1,
                side: 'double',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_fe3070efcc37489eb3c7f4c75d67ed1f: {
            id: 'TT_fe3070efcc37489eb3c7f4c75d67ed1f',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '1',
                width: '1',
            },
        },
        TT_63f8558c06be4959857187c4ab20ffb1: {
            id: 'TT_63f8558c06be4959857187c4ab20ffb1',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'class',
            attributes: {
                value: 'raycastable picture-option',
            },
        },
        TT_7332a4ac0667420eaaedef4000d0744b: {
            id: 'TT_7332a4ac0667420eaaedef4000d0744b',
            type: 'component',
            entityId: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            componentType: 'data-tag',
            attributes: {
                enabled: 'true',
                key: 'index',
                value: '{{template.idex}}',
            },
        },
        TT_785a7cb0cc0343aead6a8fc0544b3eb7: {
            id: 'TT_785a7cb0cc0343aead6a8fc0544b3eb7',
            name: 'OptionImage',
            type: 'entity',
            parent: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
        },
        TT_a24fe331d41445b1a545008ef4f19018: {
            id: 'TT_a24fe331d41445b1a545008ef4f19018',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_0a700ed204f045f2a3f7b751abcf52d7: {
            id: 'TT_0a700ed204f045f2a3f7b751abcf52d7',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_3c5278b768714b25b8d33d1475b5ebeb: {
            id: 'TT_3c5278b768714b25b8d33d1475b5ebeb',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_5aa433d3e2e14567bd84deaa0d5fd10a: {
            id: 'TT_5aa433d3e2e14567bd84deaa0d5fd10a',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'geometry',
            attributes: {
                primitive: 'plane',
                height: '1.05',
                width: '1.05',
            },
        },
        TT_129c60176b25495cb0a04e6095db739c: {
            id: 'TT_129c60176b25495cb0a04e6095db739c',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'ui-rounded',
            attributes: {},
        },
        TT_b8d2f7d44ffb423b92e07d7e9c62b286: {
            id: 'TT_b8d2f7d44ffb423b92e07d7e9c62b286',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'material',
            attributes: {
                src: '',
                color: '{{false ? "#118AB2" : "black"}}',
                shader: 'flat',
                offset: '',
                repeat: '',
                wireframe: false,
                transparent: false,
                opacity: 1,
                side: 'front',
                metalness: 0,
                roughness: 0.5,
            },
        },
        TT_2474289dc02d4be9b2482633f230b5aa: {
            id: 'TT_2474289dc02d4be9b2482633f230b5aa',
            type: 'component',
            entityId: 'TT_23a90c3271e2496cb6223937bae335e3',
            componentType: 'class',
            attributes: {
                value: 'selection-ring',
            },
        },
        TT_23a90c3271e2496cb6223937bae335e3: {
            id: 'TT_23a90c3271e2496cb6223937bae335e3',
            name: 'SelectionRing',
            type: 'entity',
            parent: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
        },
        TT_6b3b05f70c2145119e904804b9490373: {
            id: 'TT_6b3b05f70c2145119e904804b9490373',
            type: 'component',
            entityId: 'TT_ef96822670234d5da55e53dd78eb03c7',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_b8840bf0405140cdb1e95af74a30af08: {
            id: 'TT_b8840bf0405140cdb1e95af74a30af08',
            type: 'component',
            entityId: 'TT_ef96822670234d5da55e53dd78eb03c7',
            componentType: 'position',
            attributes: {
                x: '0.5',
                y: '-0.6',
                z: 0,
            },
        },
        TT_6a4869b53f9f41e3ac258cd3c2d934f2: {
            id: 'TT_6a4869b53f9f41e3ac258cd3c2d934f2',
            type: 'component',
            entityId: 'TT_ef96822670234d5da55e53dd78eb03c7',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_6ebc01a425d74ea2b7a2ea9a6a64f567: {
            id: 'TT_6ebc01a425d74ea2b7a2ea9a6a64f567',
            type: 'component',
            entityId: 'TT_ef96822670234d5da55e53dd78eb03c7',
            componentType: 'text',
            attributes: {
                value: '{{template.value}}',
                color: 'white',
                font: 'roboto',
                width: '0.9',
                height: '0.5',
                anchor: 'right',
                align: 'left',
                baseline: 'top',
                wrapCount: '20',
            },
        },
        TT_ef96822670234d5da55e53dd78eb03c7: {
            id: 'TT_ef96822670234d5da55e53dd78eb03c7',
            name: 'Title',
            type: 'entity',
            parent: 'TT_6b27bcbbc44446a898b6e78e2129dff3',
        },
    });
}
function addIntroScreen(app) {
    _.extend(app.config, {
        TT_2c9de85d66da48c6971618e901067177: {
            id: 'TT_2c9de85d66da48c6971618e901067177',
            type: 'component',
            entityId: 'TT_5a31667513114f1e8163561781bc6eb8',
            componentType: 'visible',
            attributes: {
                visible: '{{appContext.inVRMode}}',
            },
        },
        TT_dce4193613e4473798698f56e2ed6548: {
            id: 'TT_dce4193613e4473798698f56e2ed6548',
            type: 'component',
            entityId: 'TT_5a31667513114f1e8163561781bc6eb8',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_53c92054f7bb4dd98841d2aabbc70219: {
            id: 'TT_53c92054f7bb4dd98841d2aabbc70219',
            type: 'component',
            entityId: 'TT_5a31667513114f1e8163561781bc6eb8',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_e667c2d37522449ea389f0e81ed7dfab: {
            id: 'TT_e667c2d37522449ea389f0e81ed7dfab',
            type: 'component',
            entityId: 'TT_5a31667513114f1e8163561781bc6eb8',
            componentType: 'tt-follow',
            attributes: {
                enabled: true,
                selector: '#camera',
                delay: '-1',
                offsetX: '0',
                offsetY: '0',
                offsetZ: '-2',
            },
        },
        TT_59e2389b4b524e409815f6b5f90debc6: {
            id: 'TT_59e2389b4b524e409815f6b5f90debc6',
            type: 'component',
            entityId: 'TT_5a31667513114f1e8163561781bc6eb8',
            componentType: 'tt-look-at',
            attributes: {
                selector: '#camera',
            },
        },
        TT_5a31667513114f1e8163561781bc6eb8: {
            id: 'TT_5a31667513114f1e8163561781bc6eb8',
            name: 'IntroContainer',
            type: 'entity',
            parent: 'scene',
        },
        TT_307051cc1e1f4d648bcf2ecd2f5edb4c: {
            id: 'TT_307051cc1e1f4d648bcf2ecd2f5edb4c',
            type: 'component',
            entityId: 'TT_8309cce772784133be7435e9a216d0d1',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_7425409b2ee545d0a85ccec45abf9820: {
            id: 'TT_7425409b2ee545d0a85ccec45abf9820',
            type: 'component',
            entityId: 'TT_8309cce772784133be7435e9a216d0d1',
            componentType: 'position',
            attributes: {
                x: 0,
                y: '.5',
                z: 0,
            },
        },
        TT_6cceccf22f3b430f8b963ef64ead8c4c: {
            id: 'TT_6cceccf22f3b430f8b963ef64ead8c4c',
            type: 'component',
            entityId: 'TT_8309cce772784133be7435e9a216d0d1',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_1a1a00f2387e45aebbbee98d481c2f79: {
            id: 'TT_1a1a00f2387e45aebbbee98d481c2f79',
            type: 'component',
            entityId: 'TT_8309cce772784133be7435e9a216d0d1',
            componentType: 'text',
            attributes: {
                value: 'Play',
                color: 'white',
                font: 'roboto',
                width: '5',
                height: '5',
                anchor: 'center',
                align: 'center',
                baseline: 'center',
                wrapCount: 40,
            },
        },
        TT_8309cce772784133be7435e9a216d0d1: {
            id: 'TT_8309cce772784133be7435e9a216d0d1',
            name: 'Title',
            type: 'entity',
            parent: 'TT_5a31667513114f1e8163561781bc6eb8',
        },
        TT_6c7e26f3980b4b528a204e60a986a21d: {
            id: 'TT_6c7e26f3980b4b528a204e60a986a21d',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'geometry',
            attributes: {
                primitive: 'circle',
                radius: '.5',
            },
        },
        TT_a4625a3c7103438eae34184ca3ee3b05: {
            id: 'TT_a4625a3c7103438eae34184ca3ee3b05',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'visible',
            attributes: {
                visible: true,
            },
        },
        TT_167e7d4db9f74ebe8cd9a56c38db3eed: {
            id: 'TT_167e7d4db9f74ebe8cd9a56c38db3eed',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'position',
            attributes: {
                x: 0,
                y: 0,
                z: '0',
            },
        },
        TT_8722003ccc67482dbaf7462b2e5ce52b: {
            id: 'TT_8722003ccc67482dbaf7462b2e5ce52b',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'rotation',
            attributes: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        TT_06f6124b11e24456b851505c54ca31cc: {
            id: 'TT_06f6124b11e24456b851505c54ca31cc',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'material',
            attributes: {
                color: '',
                shader: 'standard',
                transparent: true,
                opacity: '1',
            },
        },
        TT_27ed494cbc3c41709f8f923a1fbb9f38: {
            id: 'TT_27ed494cbc3c41709f8f923a1fbb9f38',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'icon',
            attributes: {
                icon: 'play_circle',
                color: '#fff',
                undefined: 1024,
            },
        },
        TT_bee9bfe02676446a97741ad3f1ad8580: {
            id: 'TT_bee9bfe02676446a97741ad3f1ad8580',
            type: 'component',
            entityId: 'TT_d631761906ed436d840e322e2805dc6a',
            componentType: 'raycastable',
            attributes: {
                enabled: '{{appContext.inVRMode}}',
                objectClass: 'raycastable',
            },
        },
        TT_d631761906ed436d840e322e2805dc6a: {
            id: 'TT_d631761906ed436d840e322e2805dc6a',
            name: 'Play',
            type: 'entity',
            parent: 'TT_5a31667513114f1e8163561781bc6eb8',
        },
    });
}

function runConfigMigrations(app) {
    _.forOwn(app.config, (item) => {
        runMigration(app, new Date('05/01/2021'), migrateStateSelectorToTemplates.bind(null, item, app.config));
        runMigration(app, new Date('05/01/2021'), migrateMeshMaterialValues.bind(null, item, app.config));
        runMigration(app, new Date('05/01/2021'), removeRippleComponent.bind(null, item, app.config));
        runMigration(app, new Date('05/04/2021'), migrateRaycastableValue.bind(null, item, app.config));
        runMigration(app, new Date('11/16/2023'), migrateTransitionSphere.bind(null, item, app.config));
        runMigration(app, new Date('11/17/2023'), migrateAvatarBox.bind(null, item, app.config));
    });
}

function migrateStoreReferencesToBeChildOfApp(action) {
    const stringsToMap = {
        'appState/': 'apps/state/',
        'config/': 'apps/config/',
        'actions/': 'apps/actions/',
        'state.config.config': 'state.apps.config.config',
        'state.appsstate.appsState': 'state.apps.state.state',
        'state.actions.actions': 'state.apps.actions.actions',
    };
    _.forOwn(stringsToMap, (value, key) => {
        if (action.code && action.code.indexOf(key) > -1) {
            action.code = action.code.replaceAll(key, value);
        }
    });
}
function migrateAppCallsToApps(action) {
    const stringsToMap = {
        'state.app.': 'state.apps.',
        'app/': 'apps/',
    };
    _.forOwn(stringsToMap, (value, key) => {
        if (action.code && action.code.indexOf(key) > -1) {
            action.code = action.code.replaceAll(key, value);
        }
    });
}

function runActionsMigrations(app) {
    _.forOwn(app.actions, (item) => {
        runMigration(app, new Date('05/01/2021'), migrateStoreReferencesToBeChildOfApp.bind(null, item, app.actions));
        runMigration(app, new Date('11/14/2023'), migrateAppCallsToApps.bind(null, item, app.actions));
    });
}

export default function runMigrations(app) {
    if (app?.state?.haltMigrations) {
        return;
    }

    runConfigMigrations(app);
    runActionsMigrations(app);

    runMigration(app, new Date(), addClipboard.bind(null, app));
    runMigration(app, new Date(), addOverlayContainer.bind(null, app));
    runMigration(app, new Date(), addMultiTouch.bind(null, app));
    runMigration(app, new Date(), addKeyboard.bind(null, app));
    runMigration(app, new Date(), addToolbar.bind(null, app));
    runMigration(app, new Date(), addPictureChoicePanel.bind(null, app));
    runMigration(app, new Date(), addIntroScreen.bind(null, app));
    runMigration(app, new Date(), addInformationPoint.bind(null, app));
    runMigration(app, new Date(), addFitToTexture.bind(null, app));
    runMigration(app, new Date(), migrateAvatarAnimation.bind(null, app));
}
