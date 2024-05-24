/* eslint-disable no-param-reassign */

import _ from 'lodash';
import * as UUID from 'uuid/v4';
import Components from '@/components/editor/component-editors/ComponentDefinitions';
import * as PrimitiveDefinitions from '@/components/editor/PrimitiveDefinitions';

function updateTemporaryId(item, temporaryId, permanentId) {
    if (item.type === 'entity' && item.parent === temporaryId) {
        item.parent = permanentId;
    } else if (item.type === 'component' && item.entityId === temporaryId) {
        item.entityId = permanentId;
    }
}
export const addEntity = ({ commit }, payload) => {
    const { parentEntityId, name } = payload;
    const entity = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        name,
        type: 'entity',
        parent: parentEntityId,
    };
    commit('add', { item: entity });
    return entity;
};

export const updateEntity = ({ commit }, payload) => {
    const { id, name } = payload;
    commit('update', { id, partial: { name } });
};

export const updateEntityParent = ({ commit }, payload) => {
    const { id, parent } = payload;
    commit('update', { id, partial: { parent } });
};

export const deleteEntity = ({ commit, state, dispatch }, payload) => {
    const { id } = payload;
    commit('delete', payload);
    _.forEach(state.config, (item) => {
        if (item.parent === id) {
            // delete all child entities (maybe we just move them up to parent?)
            dispatch('deleteEntity', item);
        } else if (item.entityId === id) {
            // delete any components of this entity
            commit('delete', item);
        }
    });
};

export const addComponent = ({ commit, dispatch, state }, payload) => {
    const { entityId, componentType, attributes } = payload;
    const component = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        type: 'component',
        entityId,
        componentType,
        attributes,
    };
    commit('add', { item: component });

    const componentDefinition = Components[component.componentType];
    // If component is an interface, add required components
    if (component && componentDefinition.isInterface) {
        _.forOwn(componentDefinition.suppress, (requiredComponent) => {
            const subComponent = _.find(state.config, (item) => item.entityId === component.entityId && item.componentType === requiredComponent);
            // Only add component if it doesn't already exist
            if (!subComponent) {
                dispatch('addComponent', { entityId: component.entityId, componentType: requiredComponent, attributes: {} });
            }
        });
    }
};

export const updateComponent = ({ dispatch, state }, payload) => {
    const { entityId, componentType, attributes } = payload;
    const component = _.find(state.config, (item) => item.entityId === entityId && item.componentType === componentType);
    dispatch('updateComponentById', { componentId: component.id, attributes });
};

export const updateComponentById = ({ commit, dispatch, state }, payload) => {
    const { componentId, attributes } = payload;
    const component = state.config[componentId];
    const componentDefinition = Components[component.componentType];
    if (component && componentDefinition.isInterface) {
        dispatch('mapInterface', { component, attributes });
    }
    if (component) {
        commit('update', { id: component.id, partial: { attributes } });
    }
};

export const deleteComponent = ({ commit }, payload) => {
    commit('delete', payload);
};

export const mapInterface = ({ commit, state }, payload) => {
    const { component, attributes } = payload;
    const componentDefinition = Components[component.componentType];
    _.forOwn(componentDefinition.attributes, (componentAttribute) => {
        _.forOwn(componentAttribute.attributeMap, (attributeMap) => {
            const subComponent = _.find(state.config, (item) => item.entityId === component.entityId && item.componentType === attributeMap.component);
            const subComponentAttributes = subComponent.attributes;
            subComponentAttributes[attributeMap.attribute] = attributes[componentAttribute.name];
            commit('update', { id: subComponent.id, partial: { attributes: subComponentAttributes } });
        });
    });
};

export const addPrimitive = ({ dispatch }, payload) => {
    const { parentEntityId, primitive } = payload;
    const primitiveConfigSegment = PrimitiveDefinitions[primitive];
    return dispatch('addConfigSegment', { parentId: parentEntityId, segment: primitiveConfigSegment });
};

export const clone = ({ state, dispatch, getters }, payload) => {
    const { entityId } = payload;
    const entity = state.config[entityId];
    const segment = getters.getNestedConfigByEntityId(entityId);
    return dispatch('addConfigSegment', { parentId: entity.parent, segment });
};

export const convertToTemplate = ({ state, dispatch, getters, commit }, payload) => {
    const { entityId } = payload;
    const entity = state.config[entityId];
    const template = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        name: `${entity.name} Template`,
        type: 'template',
    };
    commit('add', { item: template });
    const segment = getters.getNestedConfigByEntityId(entityId);
    return dispatch('addConfigSegment', { parentId: template.id, segment });
};

export const addConfigSegment = ({ commit }, payload) => {
    const segment = _.cloneDeep(payload.segment);
    const { parentId } = payload;
    // TODO: optimization, right now we clone the whole segment and clone it again because the following loop require mutations
    _.forOwn(segment, (item) => {
        const temporaryId = item.id;
        item.id = `TT_${UUID().replace(/-/g, '')}`;
        if (item.type === 'entity') {
            _.forOwn(segment, (nestedItem) => updateTemporaryId(nestedItem, temporaryId, item.id));
        }
        if (item.type === 'entity' && item.parent === null) {
            item.parent = parentId;
        }
    });
    const parsedSegment = _(segment)
        .mapKeys((item) => item.id)
        .cloneDeep();

    // helper function to recursively add segment starting at the top level and working down to the bottom
    function addParsedSegment(entityId) {
        const entity = parsedSegment[entityId];
        commit('add', { item: entity });

        _.forOwn(parsedSegment, (item) => {
            // add all the components for top level entity
            if (item.type === 'component' && item.entityId === entityId) {
                commit('add', { item });
            }
            // recursive call for nested entities
            if (item.parent === entityId) {
                addParsedSegment(item.id);
            }
        });
    }
    const topLevelEntity = _.find(parsedSegment, (item) => item.parent === parentId);

    // init recursive function with the top level entity id
    addParsedSegment(topLevelEntity.id);
    return topLevelEntity;
};

export const updateEntityTree = ({ commit, dispatch }, payload) => {
    const { tree, parent = null } = payload;
    _.forEach(tree, (item) => {
        if (parent !== item.parent) {
            commit('update', { id: item.id, partial: { parent } });
        }
        dispatch('updateEntityTree', { tree: item.children, parent: item.id });
    });
};

export const addAsset = ({ commit }, payload) => {
    const { entityId, componentType, attributes } = payload;
    const component = {
        id: `TT_${UUID().replace(/-/g, '')}`,
        type: 'component',
        entityId,
        componentType,
        attributes,
    };
    commit('add', { item: component });
};

export const createEntityFromTemplateId = ({ rootState }, payload) => {
    const { templateId, attributes } = payload;
    const { scene } = rootState.apps;
    if (scene) {
        return scene.createEntityFromTemplateId(templateId, attributes);
    }
    return [];
};
