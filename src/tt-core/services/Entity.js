import _ from 'lodash';
import * as AFRAME from 'aframe';
import * as UUID from 'uuid/v4';
import { reactive } from '@vue/reactivity';
import EventEmitter from './EventEmitter';

export default class Entity extends EventEmitter {
    constructor(scene, data, options = { tag: 'a-entity' }) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.data = data;
        this.options = options;
        this.scene = scene;
        this.initialize();
    }

    initialize() {
        this.parent = null;
        this.childeren = [];
        this.components = [];
        this.rendered = false;
        this.state = reactive({});
        this.el = this.createElement();
    }

    render() {
        this.renderChilderen();
        this.rendered = true;
    }

    refreshStateSelectors(change) {
        _.forEach(this.components, (component) => component.refreshStateSelectors(change));
        _.forEach(this.childeren, (child) => child.refreshStateSelectors(change));
    }

    renderChild(child) {
        this.el.appendChild(child.el);
        child.render();
    }

    renderChilderen() {
        this.childeren.forEach((child) => {
            this.renderChild(child);
        });
    }

    setParent(parent) {
        this.parent = parent;
    }

    createElement() {
        const entityElement = document.createElement(this.options.tag);
        entityElement.setAttribute('id', this.id);
        entityElement.setAttribute('data-name', this.name);
        return entityElement;
    }

    isTemplateChild() {
        if (this.parent) {
            return this.parent.isTemplate || this.parent.isTemplateChild();
        }
        return false;
    }

    addChild(entity) {
        this.childeren.push(entity);
        entity.setParent(this);
        if (this.rendered) {
            this.renderChild(entity);
            if (this.el.object3D && _.isFunction(this.el.object3D.attach)) {
                this.el.object3D.attach(entity.el.object3D);
            }
        }
    }

    addComponent(component) {
        this.components.push(component);
        component.setEntity(this);
    }

    destroy() {
        if (AFRAME.scenes[0] && AFRAME.scenes[0].object3D && AFRAME.scenes[0].object3D.gizmo) {
            AFRAME.scenes[0].object3D.gizmo.detach();
        }
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    }

    getEntity(entityId) {
        if (entityId === this.id) {
            return this;
        }

        let entity;
        _.each(this.childeren, (child) => {
            entity = child.getEntity(entityId);
            if (entity) {
                return false;
            }
            return entity;
        });
        return entity;
    }

    getComponent(componentId) {
        let component = _.find(this.components, (c) => c.id === componentId);
        if (component) {
            return component;
        }
        _.forEach(this.childeren, (child) => {
            component = child.getComponent(componentId);
            return !component;
        });
        return component;
    }

    removeEntity(entityId) {
        const index = _.findIndex(this.childeren, (child) => child.id === entityId);
        if (index > -1) {
            const entity = this.childeren[index];
            entity.destroy();
            this.childeren.splice(index, 1);
            return entity;
        }
        return _.find(this.childeren, (child) => child.removeEntity(entityId));
    }

    removeComponent(componentId) {
        const index = _.findIndex(this.components, (child) => child.id === componentId);
        if (index > -1) {
            const component = this.components[index];
            component.destroy();
            this.components.splice(index, 1);
            return component;
        }
        return _.find(this.childeren, (child) => child.removeComponent(componentId));
    }

    setState(state) {
        _.extend(this.state, {...state});
    }

    clone(state) {
        const data = _.extend({}, this.data, { id: `TT_${UUID().replace(/-/g, '')}` });
        const clonedEntity = this.scene.createNewEntity(data);
        clonedEntity.setState(state);
        _.forEach(this.childeren, (child) => {
            const clonedChild = child.clone(state);
            clonedEntity.addChild(clonedChild);
        });
        _.forEach(this.components, (component) => {
            const clonedComponent = component.clone();
            clonedEntity.addComponent(clonedComponent);
        });
        return clonedEntity;
    }
}
