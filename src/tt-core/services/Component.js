import * as _ from 'lodash';
import * as UUID from 'uuid/v4';
import Components from '@/components/editor/component-editors/ComponentDefinitions';
import { effect, stop } from '@vue/reactivity';
import TemplateFactory from './Templates';
import { TemplatedEntity } from './Template';

function generateTTGUID() {
    return `TT_${UUID().replace(/-/g, '')}`;
}

export default class Component {
    constructor(scene, data) {
        this.data = _.cloneDeep(data);
        this.id = data.id;
        this.attributes = _.cloneDeep(data.attributes);
        this.componentType = data.componentType;
        this.definition = Components[data.componentType];
        this.entity = null;
        this.scene = scene;
        this.templateEntities = [];
    }

    get attributeType() {
        // Check if this component has an ECSON defintion
        // If it does return mapped AFrame component, otherwise take it at face value to support undefined parsed components
        if (this.definition && this.definition.aframeComponentType) {
            return this.definition.aframeComponentType;
        }

        return this.componentType;
    }

    setupPreloadedAssets() {
        if (!this.scene.rendered && _.isObject(this.attributes) && this.attributes.src) {
            const src = this.getAttributeValue(this.attributes.src);
            const preload = this.getAttributeValue(this.attributes.preload);
            const existingAsset = this.scene.getAssetBySrc(src);
            if (!existingAsset && (preload || _.isUndefined(preload))) {
                const data = {
                    id: generateTTGUID(),
                    assetType: 'assetItem',
                    attributes: {
                        src,
                    },
                };
                const asset = this.scene.createNewAsset(data);
                this.scene.addAsset(asset);
            }
        }
    }

    convertValueToPreloadedAsset(value) {
        const existingAsset = this.scene.getAssetBySrc(value);
        if (existingAsset) {
            return `#${existingAsset.id}`;
        }
        return value;
    }

    setEntity(entity) {
        this.entity = entity;
        this.setupPreloadedAssets();
        this.refreshStateSelectors();
        this.startSubscriptions();
    }

    startSubscriptions() {
        _.forEach(this.definition?.events, (event) => {
            this.entity.el.addEventListener(event.name, this.handleEvent.bind(this));
        });
    }

    stopSubscriptions() {
        _.forEach(this.definition?.events, (event) => {
            this.entity.el.removeEventListener(event.name, this.handleEvent.bind(this));
        });
    }

    handleEvent(e) {
        const eventComponent = _.find(this.entity.components, (component) => {
            if (component.componentType !== 'event') {
                return false;
            }
            if (component.attributes.event !== e.type) {
                return false;
            }
            return true;
        });
        if (eventComponent) {
            const attributes = eventComponent.getAttributesValue();
            this.entity.scene.emit('event', {
                entity: this.entity,
                attributes,
                value: e.detail,
                rawEvent: e,
            });
        }
    }

    refreshStateSelectors() {
        this.templateDate = { ...this.scene.state };
        if (this.observer) {
            stop(this.observer);
        }
        this.observer = effect(() => this.setAttributes(), {
            lazy: false,
        });
    }

    destroy() {
        if (this.entity && this.entity.el) {
            this.stopSubscriptions();
            this.entity.el.removeAttribute(`${this.attributeType}`);
        }
    }

    updateAttributes(attributes) {
        this.attributes = attributes;
        this.refreshStateSelectors();
    }

    getAttributesValue() {
        if (this.componentType === 'class') {
            const attributes = _.mapValues(this.attributes, (value) => this.getAttributeValue(value));
            return _.get(attributes, 'value');
        } else if (_.isObject(this.attributes)) {
            let attributeString = '';
            // TODO: this is a hack because physics component is a system that does not work with
            // setting the attribute value as an object. If we need more systems like this in the future
            // figure out a way to just run this for all systems
            if (this.componentType === 'physics') {
                _.forEach(this.attributes, (value, key) => {
                    attributeString += `${key}:${this.getAttributeValue(value)};`;
                });
                return attributeString;
            } else {
                let attributes = {};
                if (!_.isNil(this.attributes.attributesOverride)) {
                    attributes = this.getAttributeValue(this.attributes.attributesOverride);
                } else {
                    attributes = _.mapValues(this.attributes, (value) => this.getAttributeValue(value));
                }
                return attributes;
            }
        } else {
            const value = this.getAttributeValue(this.attributes);
            return value;
        }
    }

    getAttributeValue(value) {
        // do not evaluate value for template childeren
        if (this.entity.isTemplateChild()) {
            return value;
        }
        if (this.entity instanceof TemplatedEntity) {
            _.set(this.templateDate, 'template', this.entity.state);
            _.set(this.templateDate, 'index', this.entity.index);
        }
        const template = TemplateFactory.buildTemplate(value);
        const computedValue = template ? template.evaluate(this.templateDate) : value;
        return this.convertValueToPreloadedAsset(computedValue);
    }

    setAttributes() {
        if (this.componentType === 'template') {
            this.updateTemplateEntities();
        } else {
            const attributes = this.getAttributesValue();
            this.entity.el.setAttribute(`${this.attributeType}`, attributes);
        }
    }

    setAttribute(parameter) {
        // check if component attributes is referencing state and bind that instead
        if (this.componentType === 'template') {
            this.updateTemplateEntities();
        } else if (_.isObject(this.attributes) && _.has(this.attributes, parameter)) {
            const value = this.getAttributeValue(this.attributes[parameter]);
            this.entity.el.setAttribute(`${this.attributeType}`, { [parameter]: value });
        }
    }

    clone() {
        const data = _.extend({}, this.data, { id: generateTTGUID() });
        const clonedEntity = this.scene.createNewComponent(data);
        clonedEntity.childeren = _.map(this.childeren, (child) => child.clone());
        clonedEntity.components = _.map(this.components, (component) => component.clone());
        return clonedEntity;
    }

    updateTemplateEntities() {
        const template = this.scene.assetsContainer.getEntity(this.attributes.template);
        if (template) {
            const value = this.getAttributeValue(_.get(this.attributes, 'each'));
            const props = this.getAttributeValue(_.get(this.attributes, 'props'));
            // create copy of childeren to loop and remove
            const childeren = [...this.entity.childeren];
            const itemsToRemove = _.filter(childeren, (entity) => {
                if (entity instanceof TemplatedEntity) {
                    // if child is template check if it has been removed from the new value
                    const stillExists = _.find(value, { id: entity.id });
                    return !stillExists;
                }
                return false;
            });
            const [itemsToUpdate, itemsToAdd] = _.partition(value, (item) => {
                const existsAsTemplate = _.find(childeren, { id: item.id });
                return Boolean(existsAsTemplate);
            });
            _.forEach(itemsToRemove, (item) => {
                this.entity.removeEntity(item.id);
            });
            _.forEach(itemsToUpdate, (item) => {
                const template = _.find(childeren, { id: item.id });
                template.updateData(_.extend({}, item, props));
            });
            this.templateEntities = _.flatMap(itemsToAdd, (item, index) => template.createEntities(_.extend({}, item, props), index));
            // if (value && _.isArray(value)) {
            // } else {
            //     this.templateEntities = template.createEntities(_.extend({}, value, props));
            // }

            _.forEach(this.templateEntities, (entity) => {
                this.entity.addChild(entity);
            });
        }
    }
}
