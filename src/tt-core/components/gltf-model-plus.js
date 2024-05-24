/* eslint-disable */
import * as AFRAME from 'aframe';

// AFRAME.registerComponent('gltf-model-plus', {
//     schema: { src: {type: 'model' } },

//     init() {
//         this.model = null;
//         this.loader = new THREE.GLTFLoader();
//     },

//     update() {
//         const self = this;
//         const { el } = this;
//         const src = this.data.src;

//         if (!src) { return; }

//         this.remove();

//         this.loader.load(src, (gltfModel) => {
//             self.model = gltfModel.scene || gltfModel.scenes[0];
//             self.model.animations = gltfModel.animations;
//             el.setObject3D('mesh', self.model);
//             el.emit('model-loaded', { format: 'gltf', model: self.model });
//         }, undefined /* onProgress */, (error) => {
//             const message = (error && error.message) ? error.message : 'Failed to load glTF model';
//             warn(message);
//             el.emit('model-error', { format: 'gltf', src });
//         });
//     },

//     remove() {
//         if (!this.model) { return; }
//         this.el.removeObject3D('mesh');
//     },
// });


/**
 * glTF model loader.
 */
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( 'https://cdn.jsdelivr.net/npm/three@0.111.0/examples/js/libs/draco/gltf/' );

dracoLoader.preload();
AFRAME.registerComponent('gltf-model-plus', {
     schema: { src: {type: 'model' } },
  
    init: function () {
      this.model = null;
      this.loader = new THREE.GLTFLoader();
      this.loader.setDRACOLoader(dracoLoader);
    },
  
    update: function () {
      var self = this;
      var el = this.el;
      const src = this.data.src;
  
      if (!src) { return; }
  
      this.remove();
  
      this.loader.load(src, function gltfLoaded (gltfModel) {
        self.model = gltfModel.scene || gltfModel.scenes[0];
        self.model.animations = gltfModel.animations;
        el.setObject3D('mesh', self.model);
        el.emit('model-loaded', {format: 'gltf', model: self.model});
      }, undefined /* onProgress */, function gltfFailed (error) {
        var message = (error && error.message) ? error.message : 'Failed to load glTF model';
        el.emit('model-error', {format: 'gltf', src: src});
      });
    },
  
    remove: function () {
      if (!this.model) { return; }
      this.el.removeObject3D('mesh');
    }
  });