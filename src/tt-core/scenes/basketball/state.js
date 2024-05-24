/* eslint-disable */

const initialState = {
    currentState: 'Inspect',
    newObjectPosition: { x: 0.0, y: 0.0, z: 0.0 },
};
const handlers = {
    birdView(scene) {
        scene.updateComponent("camera-container", "position", {x: 0, y:10, z:0});
        //let currentRotation = scene.getComponent("camera-container", "rotation").attributes;
        //currentRotation.z += 45;
        //scene.updateComponent("camera-container", "rotation", currentRotation);
        console.log("Birds Eye View");        
        scene.state.currentState = 'Plant';

        //Tried setting rotation directly on ThreeJS level - didn't work
        //document.querySelector('#camera-container').object3D.rotation.z = 90;

    },
    playerView(scene) {
        scene.updateComponent("camera-container", "position", {x: 0, y:1, z:0});
        scene.state.currentState = 'Inspect';
        console.log("Players View");
       
    },
    rotatePlayer(scene) {
        let currentRotation = scene.getComponent("BasketballPlayer", "rotation").attributes;
        currentRotation.y += 45;
        scene.updateComponent("BasketballPlayer", "rotation", currentRotation);
        console.log("RotatePlayer");
    },
    requestNewObjectPosition(scene, action) {
        scene.state.newObjectPosition = action.position;
    }, 
    createPlayer(scene) {
        /*
        //This is the old method for creating an entity - Use Scene API
        var el = document.createElement('a-entity');
        el.setAttribute('geometry', 'primitive: box');
        el.setAttribute('position', state.newObjectPosition.x + " " + (state.newObjectPosition.y + 2) + " " + state.newObjectPosition.z);
        document.querySelector('a-scene').appendChild(el);    
        */

        //New Method
        //entityData = {}
        //scene.createEntity
        //componentData = {}
        //scene.createComponent
    },  
};

export {
    initialState,
    handlers,
};
