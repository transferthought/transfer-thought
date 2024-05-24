import _ from 'lodash';

function getEntityList(config, parentId = null) {
    let entities = [];
    _.forOwn(config, (item) => {
        if (item && item.type === 'entity') {
            if (item.parent === parentId) {
                entities.push(item);
                entities = entities.concat(getEntityList(config, item.id));
            }
        }
    });
    return entities;
}

function getChilderenList(config, parentId = null) {
    const children = [];
    _.forOwn(config, (item) => {
        if (item && item.type === 'entity') {
            if (item.parent === parentId) {
                const entity = _.cloneDeep(item);
                entity.children = getChilderenList(config, entity.id);
                children.push(entity);
            }
        } else if (item && item.type === 'template') {
            // render on same level as scene
            if (!parentId) {
                const entity = _.cloneDeep(item);
                entity.children = getChilderenList(config, entity.id);
                children.push(entity);
            }
        }
    });
    return children;
}

function getTemplates(config) {
    const templates = [];
    _.forOwn(config, (item) => {
        if (item && item.type === 'template') {
            const template = _.cloneDeep(item);
            template.children = getChilderenList(config, template.id);
            templates.push(template);
        }
    });
    return templates;
}

export const getChildEntities = (state) => (parentId) => getEntityList(state.config, parentId);

export const getEntityComponents = (state) => (entityId) => {
    const components = [];
    _.forOwn(state.config, (item) => {
        if (item && item.type === 'component') {
            if (item.entityId === entityId) {
                components.push(item);
            }
        }
    });
    return components;
};
export const getNestedConfigByEntityId = (state, getters) => (entityId) => {
    const nestedConfig = {};
    const parentEntity = _.clone(state.config[entityId]);
    parentEntity.parent = null;
    const entities = [parentEntity, ...getters.getChildEntities(entityId)];
    _.forEach(entities, (entity) => {
        const components = getters.getEntityComponents(entity.id);
        _.forEach(components, (component) => {
            nestedConfig[component.id] = component;
        });
        nestedConfig[entity.id] = entity;
    });
    return nestedConfig;
};
export const entityList = (state) => getChilderenList(state.config);
export const assetList = (state) => getTemplates(state.config);
export const templateList = (state) => getTemplates(state.config);
export const flattenedEntityList = (state) => {
    const entities = [];
    _.forOwn(state.config, (item) => {
        if (item && item.type === 'entity') {
            const entity = _.cloneDeep(item);
            entities.push(entity);
        }
    });
    return entities;
};
