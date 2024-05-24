/* eslint-disable */

import * as AFRAME from 'aframe';

const initialState = {
    treeSize: { x: 0.1, y: 0.1, z: 0.1 },
    growing: false,
    currentState: 'Inspect',
    newObjectPosition: { x: 0.0, y: 0.0, z: 0.0 },
};

const handlers = {
    requestNewObjectPosition(state, action) {
        state.newObjectPosition = action.position;
    },
    treeClicked(state) {
        if (state.currentState !== 'Inspect') {
            state.currentState = 'Inspect';
        }
    },
    sceneClicked(state) {

        if (state.currentState === 'Plant') {
            console.log("Planting tree");
            var el = document.createElement('a-entity');
            el.setAttribute('geometry', 'primitive: box');
            el.setAttribute('position', state.newObjectPosition.x + " " + (state.newObjectPosition.y + 2) + " " + state.newObjectPosition.z);
            document.querySelector('a-scene').appendChild(el);
        }


        if (state.currentState !== 'Explore') {
            state.currentState = 'Explore';
            console.log('Switched to Explore');
        }        
    },
    plantNewTree(state) {
        if (state.currentState !== 'Plant') {
            state.currentState = 'Plant';
            console.log('Planting mode');
        }
    },
    growTree(state, action) {
        if (state.currentState === 'Inspect') {
            state.growing = true;
            console.log('test');
            AFRAME.scenes[0].emit('growth', action);
        }
    },
    stopGrowing(state) {
        state.growing = false;
    },
    growth(state, action) {
        console.log('test2');
        const growthRate = 0.001;

        state.treeSize.x += growthRate;
        state.treeSize.y += growthRate;
        state.treeSize.z += growthRate;

        setTimeout(() => {
            if (state.growing) {
                AFRAME.scenes[0].emit('growth', action);
            }
        }, 10);
    },

};

export {
    initialState,
    handlers,
};
