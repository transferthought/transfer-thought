/* eslint-disable */

AFRAME.registerComponent('avatar-animation-loader', {
    schema: {
        idleAnimation: { type: 'string' },
        walkAnimation: { type: 'string' },
        pointAnimation: { type: 'string' },
        emoteAnimation: { type: 'string' },      
    },
    init() {
        // Wait for model to load.
        this.el.addEventListener('model-loaded', () => {
            // Grab the mesh / scene.
            const obj = this.el.getObject3D('mesh');
            
            const gltfLoader = new THREE.GLTFLoader();

            //First Load all animations that exist
            gltfLoader.load(
                this.data.idleAnimation,
                //'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/avatars/MiConv.com__Shuffling.glb',
                (gltf) => {
                    //Add animation to animations array
                    this.el.object3D.children[0].animations.pop();
                    gltf.animations[0].name = "idle";
                    this.el.object3D.children[0].animations.push(gltf.animations[0]);
                    //Reinitialize animation mixer
                    this.el.components["animation-mixer-new"].init();
                });
            if(this.data.walkAnimation) {
                gltfLoader.load(
                    this.data.walkAnimation,
                    (gltf) => {
                        //Add animation to animations array
                        gltf.animations[0].name = "walk";
                        this.el.object3D.children[0].animations.push(gltf.animations[0]);
                        //Reinitialize animation mixer
                        this.el.components["animation-mixer-new"].init();
                    });   
            }
            if(this.data.pointAnimation) {
                gltfLoader.load(
                    this.data.pointAnimation,
                    (gltf) => {
                        //Add animation to animations array
                        gltf.animations[0].name = "point";
                        this.el.object3D.children[0].animations.push(gltf.animations[0]);
                        //Reinitialize animation mixer
                        this.el.components["animation-mixer-new"].init();
                    });   
            }
            if(this.data.emoteAnimation) {
                gltfLoader.load(
                    this.data.emoteAnimation,
                    (gltf) => {
                        gltf.animations[0].name = "emote";
                        this.el.object3D.children[0].animations.push(gltf.animations[0]);
                        //Reinitialize animation mixer
                        this.el.components["animation-mixer-new"].init();
                        console.log(this.el.object3D.children[0])
                    });   
            }
        });
    },
    update() {
        //Exit if no model found
        if(this.el.getObject3D('mesh') == null) {
          return;
        }
    },
});

