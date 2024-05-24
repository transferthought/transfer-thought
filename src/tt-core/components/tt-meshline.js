if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

var ml = require('three.meshline');
THREE.MeshLine = ml.MeshLine;
THREE.MeshLineMaterial = ml.MeshLineMaterial;

// HACK for THREE rc 125
THREE.MeshLine.prototype.setGeometry = function(g, c) {
	// as the input geometry are mutated we store them
	// for later retreival when necessary (declaritive architectures)
	this._geometry = g;
	if (g instanceof THREE.BufferGeometry) {
		this.setPoints(g.getAttribute("position").array, c);
	} else {
		this.setPoints(g, c);
	}
}


AFRAME.registerComponent('tt-meshline', {
  schema: {
    color: { default: '#000' },
    lineWidth: { default: 10 },
    lineWidthStyler: { default: '' },
    sizeAttenuation: { default: 0 },
    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],
      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(AFRAME.utils.coordinates.parse);
      },
      // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(AFRAME.utils.coordinates.stringify).join(',');
      }
    }
  },
  
  init: function () {
    this.resolution = new THREE.Vector2 ( window.innerWidth, window.innerHeight ) ;
    
    var sceneEl = this.el.sceneEl;
    sceneEl.addEventListener( 'render-target-loaded', this.do_update.bind(this) );
    sceneEl.addEventListener( 'render-target-loaded', this.addlisteners.bind(this) );
  
    
  /*
    if (sceneEl.hasLoaded) {
  
      console.log('has loaded');
      this.do_update(); //never happens ?
  
    } else {
  
      sceneEl.addEventListener('render-target-loaded', this.do_update.bind(this));
  
      }
  */
  },
  
  addlisteners: function () {
  
    //var canvas = this.el.sceneEl.canvas;
  
    // canvas does not fire resize events, need window
    window.addEventListener( 'resize', this.do_update.bind (this) );
    
    //console.log( canvas );
    //this.do_update() ;
  
  },
  
  do_update: function () {
  
    var canvas = this.el.sceneEl.canvas;
    this.resolution.set( canvas.width,  canvas.height );
    //console.log( this.resolution );
    this.update();

  },
  
  update: function () {
    //cannot use canvas here because it is not created yet at init time
    //console.log("canvas res:");
    //console.log(this.resolution);
    var material = new THREE.MeshLineMaterial({
      color: new THREE.Color(this.data.color),
      resolution: this.resolution,
      sizeAttenuation: this.data.sizeAttenuation,
      lineWidth: this.data.lineWidth
    });
  
    var vertices = [];
    
    this.data.path.forEach(function (vec3) {
      vertices.push(vec3.x || 0, vec3.y || 0, vec3.z || 0);
    });
    
    var widthFn = (
      typeof this.data.lineWidthStyler === 'string' &&
      this.data.lineWidthStyler.length > 0
    ) ? new Function('p', 'return ' + this.data.lineWidthStyler)
      : function() { return 1; };
    //? try {var w = widthFn(0);} catch(e) {warn(e);}
    var line = new THREE.MeshLine();
    line.setGeometry(new Float32Array(vertices), widthFn);
    
    this.el.setObject3D('mesh', new THREE.Mesh(line.geometry, material));
  },
  
  remove: function () {
    this.el.removeObject3D('mesh');
  }
});