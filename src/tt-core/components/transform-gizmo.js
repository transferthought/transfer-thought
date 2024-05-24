/* eslint-disable */
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

AFRAME.registerComponent('transform-gizmo', {
    schema: {
        default: 1,
    },

    init() {
        var transformElement = this.el;
        
        setTimeout(function () {
            var control = new TransformControls(AFRAME.scenes[0].camera , AFRAME.scenes[0].renderer.domElement );
    
            control.attach( transformElement.getObject3D('mesh') );
            AFRAME.scenes[0].object3D.add( control );
        }, 1000);

    },

});