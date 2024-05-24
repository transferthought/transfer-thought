/* eslint-disable */

AFRAME.registerComponent('avatar-walk-detection', {
    schema: {
    },
    init() {
    },
    update() {
    },
    tick: function () {
        //handles switching between idle and walk

        //Initialize Array
        if(this.el.cachedPosition == null){
            this.el.cachedPosition = new Array(5);
            this.el.cachedPosition[0] = this.el.object3D.position.clone();
            this.el.cachedPosition[1] = this.el.object3D.position.clone();
            this.el.cachedPosition[2] = this.el.object3D.position.clone();
            this.el.cachedPosition[3] = this.el.object3D.position.clone();
            this.el.cachedPosition[4] = this.el.object3D.position.clone();
        }

        
        this.el.cachedPosition.shift();
        this.el.cachedPosition.push(this.el.object3D.position.clone());

        if(this.el.cachedPosition[0].distanceTo(this.el.cachedPosition[4]) > 0.01) {
            this.el.setAttribute("animation-mixer-new", "clip: walk");
        }
        else {
            this.el.setAttribute("animation-mixer-new", "clip: idle");
        }
    }
});

