/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* global THREE */

import * as AFRAME from 'aframe';

const fileLoader = new THREE.FileLoader();
const imageLoader = new THREE.ImageLoader();
const audioLoader = new THREE.AudioLoader();

fileLoader.setResponseType('text');

/**
 * Preload using XHRLoader for any type of asset.
 */
class TTAssetItem extends AFRAME.ANode {
    constructor() {
        super();
        this.data = null;
        this.isAssetItem = true;
    }

    async connectedCallback() {
        const src = this.getAttribute('src');
        const result = await fetch(src, { method: 'HEAD' });
        const resultData = await result.blob();
        const loader = getLoader(resultData);
        loader.setCrossOrigin('anonymous');
        loader.load(
            src,
            (response) => {
                this.data = response;
                /*
              Workaround for a Chrome bug. If another XHR is sent to the same url before the
              previous one closes, the second request never finishes.
              setTimeout finishes the first request and lets the logic triggered by load open
              subsequent requests.
              setTimeout can be removed once the fix for the bug below ships:
            */
                setTimeout(() => {
                    AFRAME.ANode.prototype.load.call(this);
                });
            },
            (xhr) => {
                this.emit('progress', {
                    loadedBytes: xhr.loaded,
                    totalBytes: xhr.total,
                    xhr,
                });
            },
            (xhr) => {
                this.emit('error', { xhr });
            }
        );
    }
}

function getLoader(result) {
    if (result && result.type) {
        if (result.type.indexOf('image') > -1) {
            return imageLoader;
        }
        if (result.type.indexOf('audio') > -1) {
            return audioLoader;
        }
        if (result.type.indexOf('binary') > -1 || result.type.indexOf('octet') > -1 || result.type.indexOf('application/x-www-form-urlencoded') > -1) {
            fileLoader.setResponseType('arraybuffer');
            return fileLoader;
        }
    }
    return fileLoader;
}

window.customElements.define('tt-asset-item', TTAssetItem);
