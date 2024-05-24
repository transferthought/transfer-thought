/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import * as UUID from 'uuid/v4';

import _ from 'lodash';

const ignoreAttributeList = ['id', 'name'];
const ignoreElementList = ['#text'];

function generateTTGUID() {
    return `TT_${UUID().replace(/-/g, '')}`;
}

class SceneParser {
    parseSceneToJson(htmlString) {
        const sceneConfig = {};
        // create dom representation of HTML string so we can use dom helper functions
        const html = new DOMParser().parseFromString(htmlString, 'text/html');
        // html is entire document we need grab the scene from the body
        const sceneElements = _.filter(Array.from(html.body.childNodes), (node) => node.nodeName === 'A-SCENE');
        // assume the scene is the first child and only child
        const sceneElement = sceneElements.length === 1 && sceneElements[0];
        if (sceneElement) {
            this.parseElementIntoConfig(sceneElement, null, sceneConfig);
            this.parseElementsIntoConfig(sceneElement.childNodes, sceneElement.id, sceneConfig);
        }
        return sceneConfig;
    }

    parseElementsIntoConfig(elements, parentId, sceneConfig) {
        elements.forEach((element) => {
            if (element.nodeName === 'A-ASSETS') {
                this.parseAssetsIntoConfig(element.childNodes, sceneConfig);
            } else {
                this.parseElementIntoConfig(element, parentId, sceneConfig);
                if (element.childNodes.length) {
                    this.parseElementsIntoConfig(element.childNodes, element.id, sceneConfig);
                }
            }
        });
    }

    parseElementIntoConfig(element, parentId, sceneConfig) {
        if (!_.includes(ignoreElementList, element.nodeName)) {
            element.id = element.id || generateTTGUID();
            sceneConfig[element.id] = {
                id: element.id,
                name: element.attributes.name ? element.attributes.name.value : '',
                type: 'entity',
                parent: parentId,
            };
            this.parseElementAttributes(element, sceneConfig);
        }
    }

    parseElementAttributes(element, sceneConfig) {
        _.forEach(element.attributes, (attribute) => {
            if (!_.includes(ignoreAttributeList, attribute.name)) {
                const componentId = generateTTGUID();
                sceneConfig[componentId] = {
                    id: componentId,
                    type: 'component',
                    componentType: attribute.name,
                    entityId: element.id,
                    attributes: this.convertAttributeValueToObject(attribute.value),
                };
            }
        });
    }

    convertAttributeValueToObject(attributeValue) {
        if (_.isObject(attributeValue)
        || !attributeValue.length
        || attributeValue.indexOf(',') > -1
        || attributeValue.indexOf(' ') < 0
        || attributeValue.indexOf('===') > -1) {
            if (attributeValue === 'true') {
                return true;
            } if (attributeValue === 'false') {
                return false;
            }
            return attributeValue;
        }
        const parsedValue = {};

        const keyValuePairList = attributeValue.split(';');
        keyValuePairList.forEach((keyValuePair) => {
            if (keyValuePair.length) {
                if (keyValuePair.indexOf(':') > -1) {
                    const [key, value] = keyValuePair.split(': ');
                    // trim the key value to get rid of any white space before creating the key
                    if (value === 'true') {
                        parsedValue[key.trim()] = true;
                    } else if (value === 'false') {
                        parsedValue[key.trim()] = false;
                    } else {
                        parsedValue[key.trim()] = value;
                    }
                } else {
                    const [x, y, z] = keyValuePair.split(' ');
                    parsedValue.x = x;
                    parsedValue.y = y;
                    parsedValue.z = z;
                }
            }
        });

        return parsedValue;
    }

    parseAssetsIntoConfig(assets, sceneConfig) {
        assets.forEach((asset) => {
            const assetTypeMap = {
                'A-ASSET-ITEM': 'assetItem',
                'A-MIXIN': 'mixin',
                IMG: 'img',
                VIDEO: 'video',
                AUDIO: 'audio',
                TEMPLATE: 'template',
                'A-ENTITY': 'entity',
            };
            const assetType = assetTypeMap[asset.nodeName];
            if (assetType) {
                asset.id = asset.id || generateTTGUID();
                sceneConfig[asset.id] = {
                    id: asset.id,
                    type: 'asset',
                    assetType,
                    attributes: {},
                };

                _.forEach(asset.attributes, (attribute) => {
                    if (!_.includes(ignoreAttributeList, attribute.name)) {
                        sceneConfig[asset.id].attributes[attribute.name] = attribute.value;
                    }
                });
            }
        });
    }
}

export default new SceneParser();
