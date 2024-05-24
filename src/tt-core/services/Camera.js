import Entity from './Entity';

export default class Camera extends Entity {
    constructor(scene, data) {
        super(scene, data);

        this.el.setAttribute('camera', '');
        // this.el.setAttribute('cursor', 'rayOrigin: mouse');
    }
}
