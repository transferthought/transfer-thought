import _ from 'lodash';
import { allComponentEvents } from '@/components/editor/component-editors/ComponentDefinitions';
import { reactive } from '@vue/reactivity';
import Entity from './Entity';
import Component from './Component';
import Camera from './Camera';
import Asset from './Asset';
import Template from './Template';

export default class Scene extends Entity {
    constructor(containerEl, initialState = { state: {} }) {
        super(null, { id: 'scene' });
        this.containerEl = containerEl;
        this.state = reactive(_.cloneDeep(initialState));
        this.assetsBySrc = {};

        // create assets container
        this.assetsContainer = this.createNewEntity({ id: 'aframe-assets' }, { tag: 'a-assets' });
        this.assetsContainer.el.setAttribute('timeout', '600000');
        this.addChild(this.assetsContainer);
    }

    addAsset(asset) {
        this.assetsContainer.addChild(asset);
        if (asset.attributes && asset.attributes.src) {
            _.set(this.assetsBySrc, asset.attributes.src, asset);
        }
    }

    getAssetBySrc(src) {
        return _.get(this.assetsBySrc, src);
    }

    render() {
        this.containerEl.appendChild(this.el);
        this.renderChilderen();
        this.rendered = true;
        this.startSubscriptions();
    }

    startSubscriptions() {
        _.forEach(allComponentEvents, (eventType) => {
            this.el.addEventListener(eventType, (e) => {
                const entity = this.getEntity(e.target.id);
                if (entity && _.size(entity.components)) {
                    const eventComponents = _.filter(entity.components, (component) => {
                        if (component.componentType !== 'event') {
                            return false;
                        }
                        if (component.attributes.event !== eventType) {
                            return false;
                        }
                        return true;
                    });

                    if (eventComponents && eventComponents.length) {
                        eventComponents.forEach((eventComponent) => {
                            const attributes = eventComponent.getAttributesValue();
                            this.emit('event', {
                                entity,
                                attributes,
                                value: e.detail,
                                rawEvent: e,
                            });
                        });
                    }
                }
            });
        });
        this.el.addEventListener('loaded', () => {
            this.emit('loaded');
        });
        this.el.addEventListener('tick', (options) => {
            this.emit('tick', options.detail);
        });
        this.el.addEventListener('click', (event) => {
            this.emit('click', event);
        });
        this.el.addEventListener('enter-vr', () => {
            this.emit('enter-vr');
        });
        this.el.addEventListener('exit-vr', () => {
            this.emit('exit-vr');
        });
    }

    resetState(state, namespace = 'state') {
        this.state[namespace] = _.cloneDeep(state);
        this.refreshStateSelectors();
    }

    updateState(change, namespace = 'state') {
        const { selector, value } = change;
        _.set(this.state[namespace], `${selector}`, _.cloneDeep(value));
    }

    createElement() {
        // create the scene element so all the entities can be appended to this element
        const sceneElement = document.createElement('a-scene');
        // the scene entity will be the only entity without a parent
        sceneElement.setAttribute('id', this.id);
        sceneElement.setAttribute('debug', false);
        sceneElement.setAttribute('tt-scene-helper', true);
        sceneElement.setAttribute('vr-mode-ui', 'enterVRButton: #TTVRButton; enterARButton: #TTARButton');

        sceneElement.setAttribute('screenshot', {
            width: 512,
            height: 512,
        });

        // sceneElement.setAttribute('physics', 'restitution: 0.9;');
        return sceneElement;
    }

    reparent(entityId, newParentId) {
        const entity = this.getEntity(entityId);
        const newParent = this.getEntity(newParentId);
        entity.parent.removeEntity(entity.id);
        newParent.addChild(entity);
    }

    createNewEntity(data, options) {
        return new Entity(this, data, options);
    }

    createNewComponent(item) {
        return new Component(this, item);
    }

    createNewAsset(item) {
        return new Asset(this, item);
    }

    createNewTemplate(item) {
        return new Template(this, item);
    }

    createNewCamera(item) {
        return new Camera(this, item);
    }

    createEntityFromTemplateId(templateId, attributes) {
        const template = this.assetsContainer.getEntity(templateId);
        const entities = template.createEntities(attributes);

        _.forEach(entities, (entity) => {
            this.addChild(entity);
        });

        return entities;
    }
}
