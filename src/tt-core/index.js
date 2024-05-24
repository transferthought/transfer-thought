import 'aframe';
import TWEEN from '@tweenjs/tween.js';
import 'aframe-environment-component';
import 'aframe-slice9-component';
import 'aframe-render-order-component';
import 'aframe-proxy-event-component';
import 'aframe-layout-component';
import 'aframe-particle-system-component';
import 'aframe-charts-component';
import 'networked-aframe';
import 'aframe-text-geometry-component';
// delete AFRAME.components['grabbable']; // need this so superhands grabbable works
// import 'super-hands';
import 'aframe-physics-system';
import 'aframe-event-set-component';
import 'aframe-aabb-collider-component';
import 'aframe-physics-extras';
import 'aframe-cursor-teleport-component';
import 'aframe-teleport-controls';
import 'aframe-extras';
import 'aframe-look-at-component';
import 'aframe-svg-extruder';
import 'aframe-shaderfrog-component';
import 'aframe-chromakey-material';
import 'aframe-hologram-shader';
import 'aframe-liquid-portal-shader';
import 'aframe-fireball-component';
import 'aframe-image-portal';
import 'aframe-portals';
import 'aframe-plot-component';
import 'aframe-stereo-component';
import 'aframe-fps-counter-component';
import 'aframe-csg-meshs';
import 'aframe-fractal-component';
import 'aframe-audioanalyser-component';
import 'aframe-resonance-audio-component';
import 'aframe-super-keyboard';
import 'aframe-orbit-controls';

import './components';
import './systems';
import SceneManager from './services/scene-manager';
import SceneParser from './services/scene-parser';

window.TWEEN = TWEEN;
const Core = {};
Core.SceneManager = SceneManager;
Core.SceneParser = SceneParser;
Core.getDefaultConfig = async function getDefaultConfig(name = 'editor_basic') {
    // eslint-disable-next-line prefer-template
    const { scene } = await import(/* webpackChunkName: "scene" */ './scenes/' + name);
    return SceneParser.parseSceneToJson(scene);
};
export default Core;
