/* eslint-disable */

AFRAME.registerComponent('place-object', {
  schema: {
    enabled: { default: false},
    entityId: { type: 'string' },
    snap: { default: 0.5},
    offset: { default: 0.5},
  },
	init: function () {
    this.raycaster = this.el.components.raycaster;
  },

  tick: function () {
    if (!this.data.enabled) { return; }  // Not in object place mode.

    if (!this.raycaster) { return; }  // Not intersecting.

    let intersections = this.raycaster.intersections;
    if (!intersections[0]) { return; }
    /*
    if (AFRAME.scenes[0].systems.state.state.currentState === 'Plant') {
        console.log(intersection.point);
        AFRAME.scenes[0].emit('requestNewObjectPosition', { position: intersection.point });
    }
    */
    if(this.data.entityId == null || this.data.entityId == ""){return;}

    var settings = {snap: {x: this.data.snap, y: this.data.snap, z: this.data.snap}, offset: {x: this.data.offset, y: this.data.offset, z: this.data.offset}};
    var intersectionPoint = intersections[0].point;
    var snappedPoint = {}; 
    snappedPoint.x = Math.floor(intersectionPoint.x / settings.snap.x) * settings.snap.x + settings.offset.x;
    snappedPoint.y = Math.floor(intersectionPoint.y / settings.snap.y) * settings.snap.y + settings.offset.y;
    snappedPoint.z = Math.floor(intersectionPoint.z / settings.snap.z) * settings.snap.z + settings.offset.z;

    document.querySelector('#' + this.data.entityId).object3D.position.set(snappedPoint.x, snappedPoint.y, snappedPoint.z);

    //document.querySelector('#' + this.data.entityId).object3D.position.set(intersections[0].point.x, intersections[0].point.y, intersections[0].point.z);
    


    console.log(intersections[0].point);
  }
});