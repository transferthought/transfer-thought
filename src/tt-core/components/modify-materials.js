/* eslint-disable */

AFRAME.registerComponent('modify-materials', {
    schema: {
        albedoMap: { type: 'string' },
        normalMap: { type: 'string' },
        metalnessMap: { type: 'string' },
        roughnessMap: { type: 'string' },
        metalness: { default: 0, type: 'number' },
        roughness: { default: 1, type: 'number' },
        flipY: { type: 'boolean' },
        repeatX: { default: 1, type: 'number' },
        repeatY: { default: 1, type: 'number' },
    },
    init() {
        this.albedoMap = null;
        this.normalMap = null;
        this.metalnessMap = null;
        this.roughnessMap = null;

        this.loadMaterials();
        // Wait for model to load.
        this.el.addEventListener('model-loaded', this.applyMaterials.bind(this));
    },
    update() {
        this.loadMaterials();
    },
    loadMaterials() {
        let flipY = this.data.flipY;

        if (this.data.albedoMap) {
            this.albedoMap = new THREE.TextureLoader().load(this.data.albedoMap, this.applyMaterials.bind(this));
            this.albedoMap.flipY = flipY;
        }
        if (this.data.normalMap) {
            this.normalMap = new THREE.TextureLoader().load(this.data.normalMap, this.applyMaterials.bind(this));
            this.normalMap.flipY = flipY;
        }
        if (this.data.metalnessMap) {
            (this.metalnessMap = new THREE.TextureLoader().load(this.data.metalnessMap)), this.applyMaterials.bind(this);
            this.metalnessMap.flipY = flipY;
        }
        if (this.data.roughnessMap) {
            this.roughnessMap = new THREE.TextureLoader().load(this.data.roughnessMap, this.applyMaterials.bind(this));
            this.roughnessMap.flipY = flipY;
        }
    },
    applyMaterials() {
        //Exit if no model found
        if (this.el.getObject3D('mesh') == null) {
            return;
        }
        let metalness = this.data.metalness;
        let roughness = this.data.roughness;
        let repeatX = this.data.repeatX;
        let repeatY = this.data.repeatY;
        // Grab the mesh / scene.
        const obj = this.el.getObject3D('mesh');
        // Go over the submeshes and modify materials we want.
        let iterator = 0;
        if (obj) {
            obj.traverse((node) => {
                if (node.isMesh) {
                    if (this.albedoMap) {
                        node.material.map = this.albedoMap;
                        node.material.map.wrapS = THREE.RepeatWrapping;
                        node.material.map.wrapT = THREE.RepeatWrapping;
                        node.material.map.repeat.set(repeatX, repeatY);
                    }
                    if (this.normalMap) {
                        node.material.normalMap = this.normalMap;
                        node.material.normalMap.wrapS = THREE.RepeatWrapping;
                        node.material.normalMap.wrapT = THREE.RepeatWrapping;
                        node.material.normalMap.repeat.set(repeatX, repeatY);
                    }
                    if (this.metalnessMap) {
                        node.material.metalnessMap = this.metalnessMap;
                    }
                    if (this.roughnessMap) {
                        node.material.roughnessMap = this.roughnessMap;
                    }

                    node.material.metalness = metalness;
                    node.material.roughness = roughness;
                    node.material.needsUpdate = true;
                }
            });
        }
    },
});

AFRAME.registerComponent('raycastable', {});
