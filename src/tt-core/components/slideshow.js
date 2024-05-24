/* eslint-disable */

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
   * Slide Show component for A-Frame.
   */
AFRAME.registerComponent('aframe-slideshow', {
    schema: {
        transitionHeight: { type: 'number', default: '2' }, // Height of the animated curve between two slides
        stepTransition: { type: 'number', default: '0.01' }, // speed of the animated transition
        slides: { type: 'array', default: [] }, // Folder of the slides assets
        startpos: { type: 'vec3', default: undefined }, // Default position for the first slides
        distBetweenSlides: { type: 'number', default: '5' }, // Distance between two slides
        nbColumns: { type: 'number', default: '5' }, // Number of columns for display arrangement
        slideYPos: { type: 'number', default: '1.6' }, // Y position of the slides
    },
    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,
    /**
     * Handles component initialization, called once when component is attached. Generally for initial setup.
     * @return {[type]} [description]
     */
    init() {
        this.hasBeenUpdated = false;
        // console.log("[AFRAME-Slideshow Component] Component initialized");
        this.initVariables();

        if (!document.querySelector('a-assets')) {
            const assets = document.createElement('a-assets');
            document.querySelector('a-scene').appendChild(assets);
        }

        this.addListeners();
        this.initSlides();
    },
    /**
     * Init the variables from the component properties
     * @return {[type]} [description]
     */
    initVariables() {
        this.registeredChildren = 0;
        this.nbChildren = parseInt(this.data.slides.length, 10);
        this.currentIndex = 0;

        if (this.data.startpos) {
            this.startpos = this.data.startpos;
        } else {
            this.startpos = new THREE.Vector3();
            this.startpos.x = -((this.data.nbColumns - 1) / 2) * this.data.distBetweenSlides;
            this.startpos.y = this.data.slideYPos;
            this.startpos.z = (((this.nbChildren / this.data.nbColumns) - 1) / 2) * this.data.distBetweenSlides;
        }

        this.oldCamParentPos = new THREE.Vector3();

        this.cameraPath = undefined;
        this.transitionHeight = this.data.transitionHeight;
        this.deltaTransition = 1;
        this.stepTransition = this.data.stepTransition;
    },
    /**
     * Handle updates on the component data
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     * @return {[type]} [description]
     */
    update() {
        if (!this.hasBeenUpdated) {
        // Skip update on initialization
            this.hasBeenUpdated = true;
        }

        // TODO: Update slides accordingly to changes made
    },
    /**
     * Add Keyboard and Oculus Touch listeners to handle slide changes
     * Also add listener on resize to adapt camera position toward slides to fit screen
     */
    addListeners() {
        const that = this;
        document.addEventListener('keydown', (event) => {
            let catched = false;
            if (event.keyCode === 39) { // Right Arrow
                that.nextSlide();
                catched = true;
            } else if (event.keyCode === 37) { // Left Arrow
                that.prevSlide();
                catched = true;
            }

            if (catched) {
                event.stopPropagation();
                event.preventDefault();
            }
        });

        function handleController(event) {
            if (document.querySelector('a-scene').is('vr-mode')) {
                return;
            }
            if (event.detail.id === 1) { // Trigger pressed
                that.nextSlide();
            } else if (event.detail.id === 2) { // Bumper pressed
                that.prevSlide();
            }
        }

        // Oculus controllers handling
        // TODO: make a general handling for all controllers
        if (document.querySelector('#right-hand')) {
            document.querySelector('#right-hand').addEventListener('buttondown', handleController);
        }
        if (document.querySelector('#left-hand')) {
            document.querySelector('#left-hand').addEventListener('buttondown', handleController);
        }

        // Handles screen resizing
        // eslint-disable-next-line func-names
        window.addEventListener('resize', function () { this.goToSlide(this.currentIndex, true); });

        // Handles entering/exiting VR mode to replace the camera to the correct position
        document.querySelector('a-scene').addEventListener('exit-vr', () => {
            document.querySelector('#cameraRig').object3D.position.copy(that.oldCamParentPos);
        });
        document.querySelector('a-scene').addEventListener('enter-vr', () => {
            that.oldCamParentPos.copy(document.querySelector('#cameraRig').object3D.position);
            document.querySelector('#cameraRig').object3D.position.set(0, 0, 0);
        });
    },
    /**
     * Create the 'aframe-slideshow-slide' components inside the slideshow, based on its properties
     * @return {[type]} [description]
     */
    initSlides() {
        // Transforming component data into arrays for video and animated slides index
        // const slidesVideo = this.data.vidSlidesIndex.split(',').map(obj => parseInt(obj, 10));
        // const slidesAnimated = this.data.animSlidesIndex.split(',').map(obj => parseInt(obj, 10));

        for (let i = 0, len = this.data.slides.length; i <= len; i += 1) {
            const entity = document.createElement('a-entity');
            entity.id = `slide${i}`;
            const animate = '';
            // if (slidesAnimated.indexOf(i) !== -1) {
            //     animate = 'animTransition: true;';
            // }

            entity.setAttribute('aframe-slideshow-slide', `src: ${this.data.slides[i]}; type: image;${animate}`);
            // if (slidesVideo.indexOf(i) !== -1) {
            //     // Creating a video slide
            //     entity.setAttribute('aframe-slideshow-slide', `src: ${this.data.slides[i]}; type: video;${animate}`);
            // } else {
            //     // Creating an image slide
            //     entity.setAttribute('aframe-slideshow-slide', `src: ${this.data.slides[i]}; type: image;${animate}`);
            // }
            this.el.appendChild(entity);
        }
    },
    /**
     * Add slide-child entity to slideshow and set its position in space (rows and columns formation)
     * Check when all slides are ready
     * @param {[type]} child [description]
     */
    addChild(child) {
        const index = Array.from(this.el.children).indexOf(child);
        const vec = new THREE.Vector3();
        vec.x = (index % this.data.nbColumns);
        vec.z = -Math.floor(index / this.data.nbColumns);
        vec.multiplyScalar(this.data.distBetweenSlides).add(this.startpos);
        vec.y = this.data.slideYPos;
        child.setAttribute('position', vec);
        this.registeredChildren += 1;
        if (this.registeredChildren >= this.nbChildren) {
            this.onSlideshowReady();
        }
    },
    /**
     * Triggered when all slides are ready, put the camera in front of the first slide or the one pinned in the URL
     * @return {[type]} [description]
     */
    onSlideshowReady() {
        document.getElementById('loaderDiv').classList.remove('make-container--visible');

        try {
            const parser = document.createElement('a');
            parser.href = location.href;
            if (parser.hash !== '' && parser.hash.indexOf('#p') !== -1) {
                const index = parseInt(parser.hash.replace('#p', ''), 10);
                this.currentIndex = (isNaN(index) ? this.currentIndex : index);
            }
        } finally {
            this.goToSlide(this.currentIndex, true);
        }
    },
    /**
     * Go to the next slide (go back to first slide after the last one)
     * @return {[type]} [description]
     */
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.registeredChildren;
        this.goToSlide(nextIndex);
        this.currentIndex = nextIndex;
    },
    /**
     * Go to previous slide (sticks to first)
     * @return {[type]} [description]
     */
    prevSlide() {
        const nextIndex = Math.max(this.currentIndex - 1, 0);
        this.goToSlide(nextIndex);
        this.currentIndex = nextIndex;
    },
    /**
     * Move the camera to slide X, put the camera to the right place (slide width fitting the screen)
     * @param  {int} index         slide Index
     * @param  {boolean} skipAnimation prevent animating between slide (for first init)
     * @return {[type]}               [description]
     */
    goToSlide(index, skipAnimation) {
        const slideChild = this.el.children[index];
        if (!slideChild) {
            return;
        }
        const { camera } = document.querySelector('a-scene');
        const camParent = document.querySelector('#cameraRig').object3D;
        const { renderer } = document.querySelector('a-scene');
        const geomSize = document.querySelector(`#${slideChild.id}`).components['aframe-slideshow-slide'].geomWidth;
        const camFov = camera.fov;
        const canvasRatio = renderer.getSize().width / renderer.getSize().height;

        const posZ = ((geomSize) / 2) / (Math.tan((camFov * Math.PI / 180) / 2)) / canvasRatio;

        const newPos = new THREE.Vector3(slideChild.object3D.position.x, 0, slideChild.object3D.position.z + posZ);
        if (slideChild.components['aframe-slideshow-slide'].data.animTransition && !skipAnimation) {
            const pointArray = [];
            pointArray.push(camParent.position.clone());
            pointArray.push(newPos.clone().sub(camParent.position).divideScalar(2).add(camParent.position)
                .add(new THREE.Vector3(0, this.transitionHeight, 0)));
            pointArray.push(newPos.clone());
            this.cameraPath = new THREE.CatmullRomCurve3(pointArray);
            this.deltaTransition = 0;
        } else {
            camParent.position.copy(newPos);
            document.querySelector('#camera').object3D.rotation.set(0, 0, 0);
            document.querySelector('#camera').components['look-controls'].el.setAttribute('rotation', '0, 0, 0');
        }
    },
    /**
     * Handles slide animation transition from X-1 to X following the assigned curve
     * @param  {float} time      global scene uptime
     * @param  {float} timeDelta time since the last frame
     * @return {[type]}           [description]
     */
    tick() {
        if (this.deltaTransition < 1) {
            const camParent = document.querySelector('#cameraRig').object3D;
            camParent.position.copy(this.cameraPath.getPointAt(this.deltaTransition));
            this.deltaTransition += this.stepTransition;// * (1000/60/timeDelta);
            if (this.deltaTransition > 1) {
                camParent.position.copy(this.cameraPath.getPointAt(1));
            }
        }
    },
    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     * @return {[type]} [description]
     */
    pause() { },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     * @return {[type]} [description]
     */
    play() { },

    /**
     * Handles component removal, called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     * @return {[type]} [description]
     */
    remove() {
    },
});

/**
   * Slide component for A-Frame SlideShow.
   */
AFRAME.registerComponent('aframe-slideshow-slide', {
    schema: {
        src: { type: 'string', default: '' },
        type: { type: 'string', default: 'image' },
    },
    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,
    /**
     * Handles component initialization, called once when component is attached. Generally for initial setup.
     * @return {[type]} [description]
     */
    init() {
        // console.log("[AFRAME-Slideshow-Slide Component] Component initialized", this.data.src);
        this.assetId = `${this.data.type}_${this.el.id}`;

        let assetFile;
        // Check component type and create appropriate asset
        if (this.data.type === 'image') {
            assetFile = document.createElement('img');
            assetFile.setAttribute('id', this.assetId);
            assetFile.addEventListener('load', this.createBox.bind(this));
            assetFile.setAttribute('src', this.data.src);
            assetFile.setAttribute('crossorigin', 'anonymous');
            document.querySelector('a-assets').appendChild(assetFile);
        } else if (this.data.type === 'video') {
            assetFile = document.createElement('video');
            assetFile.setAttribute('id', this.assetId);
            assetFile.setAttribute('src', this.data.src);
            assetFile.setAttribute('crossorigin', 'anonymous');
            assetFile.setAttribute('autoplay', 'autoplay');
            assetFile.setAttribute('loop', true);
            assetFile.setAttribute('muted', 'true');
            assetFile.muted = true;
            document.querySelector('a-assets').appendChild(assetFile);
            this.createBox();
        }
    },
    /**
     * Create an a-box component containing the entity asset
     */
    createBox() {
        this.width = 1024;
        this.height = 512;
        this.geomHeight = 2;
        this.geomWidth = this.geomHeight * (this.width / this.height);

        const box = document.createElement('a-box');
        box.setAttribute('material', `shader: flat; src: #${this.assetId}`);
        box.setAttribute('depth', 0.05);
        box.setAttribute('height', this.geomHeight);
        box.setAttribute('width', this.geomWidth);
        this.el.appendChild(box);

        this.el.parentEl.components['aframe-slideshow'].addChild(this.el);
    },
    /**
     * Handle updates on the component data
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     * @return {[type]} [description]
     */
    update() {
    },
    /**
     * Handles component, called on each animation frame
     * @param  {float} time      global scene uptime
     * @param  {float} timeDelta time since the last frame
     * @return {[type]}           [description]
     */
    tick() {
    },
    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     * @return {[type]} [description]
     */
    pause() { },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     * @return {[type]} [description]
     */
    play() { },

    /**
     * Handles component removal, called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     * @return {[type]} [description]
     */
    remove() {
    },
});
