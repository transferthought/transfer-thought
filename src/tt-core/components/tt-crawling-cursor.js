/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Crawling Cursor component for A-Frame.
 */
AFRAME.registerComponent('tt-crawling-cursor', 
{
    dependencies: ['raycaster'],
    schema: 
    {
        target: { type: "selector" },
        // How far above the intersection point does the cursor hover? (Default 5cm)
        offset: { type: "number", default: 0.05, },
        // The minimum amount of time that must pass before the cursor may be redrawn, in ms.
        interval: { type: "int", default: 0, },
        enabled: { type: "boolean", default: true }

    },
    multiple: false,
    init: function() 
    {
        // Keep track of the number of intersecting objects
        this.intersecting = 0;
        // Keep track of the time of the previous update
        this.lastUpdate = 0;

        // Init the cursor if not explicitly specified
        if (this.data.target === null) 
        {
            this.data.target = document.querySelector("a-cursor");
            if (this.data.target === null) 
            {
                console.warn("Please put a-cursor in a document");
            }
        }

        // Function to reposition the cursor
        this.positionCursor = function(intersection)
        {
            if (intersection !== null)
            {
                // a matrix which represents item's movement, rotation and scale on global world
                var mat = intersection.object.matrixWorld;
                // remove parallel movement from the matrix
                mat.setPosition(new THREE.Vector3(0, 0, 0));
        
                // change local normal into global normal
                var global_normal = intersection.face.normal.clone().applyMatrix4(mat).normalize();
        
                // look at target coordinate = intersection coordinate + global normal vector
                var lookAtTarget = new THREE.Vector3().addVectors(intersection.point, global_normal);
                this.data.target.object3D.lookAt(lookAtTarget);
        
                // cursor coordinate = intersection coordinate + normal vector * offset
                var cursorPosition = new THREE.Vector3().addVectors(intersection.point, global_normal.multiplyScalar(this.data.offset));
                this.data.target.setAttribute("position", cursorPosition);
            }
        }

        // Create event listeners to catch intersections
        this.intersectListener = e =>
        {
            this.intersecting = this.data.enabled ? this.el.components.raycaster.intersectedEls.length: 0;
            this.data.target.object3D.visible = this.intersecting > 0;
        };
        this.el.addEventListener("raycaster-intersection", this.intersectListener);
        this.el.addEventListener("raycaster-intersection-cleared", this.intersectListener);
    },
    tick: function(time, delta)
    {
        // Only position the cursor if intersecting at least 1
        if (this.intersecting > 0 && time - this.lastUpdate > this.data.interval)
        {
            this.lastUpdate = time;
            this.positionCursor(this.el.components.raycaster.getIntersection
            (
                this.el
                    .components
                    .raycaster
                    .intersectedEls
                    .find(el => this.data.target !== el && !el.classList.contains("ignore-ray"))
            ));
        }
    },
    remove: function () 
    {  
        // Remove event listeners
        this.el.removeEventListener("raycaster-intersection", this.intersectListener);
        this.el.removeEventListener("raycaster-intersection-cleared", this.intersectListener);
    }
});