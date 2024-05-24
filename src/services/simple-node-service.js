import _ from 'lodash';
import * as UUID from 'uuid/v4';

const { store } = window.TT;
class SimpleNodeService {
    constructor() {
        this.stateSelector = '';
    }

    // eslint-disable-next-line class-methods-use-this
    generateId() {
        return `TT_${UUID().replace(/-/g, '')}`;
    }

    getData() {
        return store.state.apps.state.state[this.stateSelector];
    }

    getNodeById(nodeId) {
        const data = this.getData();
        return data[nodeId];
    }

    addNode(newNode) {
        store.dispatch('apps/state/update', {
            selector: `${this.stateSelector}.${newNode.id}`,
            value: newNode,
        });
    }

    deleteNode(nodeId) {
        store.dispatch('apps/state/remove', {
            selector: this.stateSelector,
            filter: nodeId,
        });
    }

    async updateNodeName(nodeId, newName) {
        const node = this.getNodeById(nodeId);
        if (node) {
            await store.dispatch('apps/state/update', {
                selector: `${this.stateSelector}.${nodeId}.name`,
                value: newName,
            });
        }
    }

    async updateNodeData(nodeId, data) {
        const node = this.getNodeById(nodeId);
        if (node) {
            const existingData = node.data;
            _.extend(existingData, data);
            await store.dispatch('apps/state/update', {
                selector: `${this.stateSelector}.${nodeId}.data`,
                value: existingData,
            });
        }
    }

    getChildNodesByType(parentId, nodeType) {
        const data = this.getData();
        const children = [];
        _.forOwn(data, (node) => {
            if (node.parentId === parentId && node.type === nodeType) {
                children.push(node);
            }
        });
        return children;
    }
}

export default SimpleNodeService;
