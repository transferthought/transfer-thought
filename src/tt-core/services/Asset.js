import _ from 'lodash';
import Entity from './Entity';

export default class Asset extends Entity {
    constructor(scene, data) {
        super(scene, data);
        this.attributes = data.attributes;
    }

    createElement() {
        // create the scene element so all the entities can be appended to this element
        const assetEl = document.createElement('tt-asset-item');
        assetEl.setAttribute('id', this.id);
        assetEl.setAttribute('crossorigin', 'anonymous');
        _.forOwn(this.data.attributes, (attributeValue, attributeName) => {
            assetEl.setAttribute(attributeName, attributeValue);
        });
        return assetEl;
    }
}
