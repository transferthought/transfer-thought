import _ from 'lodash';
import * as UUID from 'uuid/v4';
import Entity from './Entity';

// TODO: implement templted entity instead of just cloning an entity
export class TemplatedEntity extends Entity {
    constructor(template, entity, state = {}, index) {
        const id = entity.parent.isTemplate && state.id ? state.id : `TT_${UUID().replace(/-/g, '')}`;
        const data = _.extend({}, entity.data, { id });
        super(entity.scene, data);
        this.template = template;
        this.entity = entity;
        this.setState(state);
        this.index = index;
        _.forEach(this.entity.childeren, (child) => {
            const childTempletedEntity = new TemplatedEntity(template, child, state, index);
            this.addChild(childTempletedEntity);
        });
        _.forEach(this.entity.components, (component) => {
            const clonedComponent = component.clone();
            this.addComponent(clonedComponent);
        });
    }
    updateData(state) {
        this.setState(_.cloneDeep(state));
        
        _.forEach(this.childeren, (child) => {
            child.updateData(state);
        });
    }
}

export default class Template extends Entity {
    constructor(scene, data, options = { tag: 'template' }) {
        super(scene, data, options);
    }

    initialize() {
        super.initialize();
        this.isTemplate = true;
    }

    renderChild(child) {
        this.el.content.appendChild(child.el);
        child.render();
    }

    renderChilderen() {
        this.childeren.forEach((child) => {
            // TODO: is this needed
            child.el.flushToDOM();
            this.renderChild(child);
        });
    }

    createEntities(props, index) {
        return _.map(this.childeren, (entity) => new TemplatedEntity(this, entity, props, index));
    }
}
