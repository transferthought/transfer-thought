/* eslint-disable  */

// Copyright 2018 harlyq
// MIT license

// A-frame component for the Shader Particle Engine
const SPE = require('./lib/SPE.js');

const toVector3 = a => new THREE.Vector3(a.x, a.y, a.z);
const toColor = a => new THREE.Color(a);
const toVector2 = a => new THREE.Vector2(a.x, a.y);
const parseFloatArray = a => (typeof a === 'string' ? a.split(',').map(y => parseFloat(y)) : a);
const degToRad = a => parseFloat(a) / 180 * Math.PI;
const radToDeg = a => parseFloat(a) * 180 / Math.PI;

let uniqueEmitterID = 1;

AFRAME.registerComponent('tt-spe-particles', {
    schema: {
        enableInEditor: {
            default: false,
            description: 'enable the emitter while the editor is active (i.e. while scene is paused)',
        },
        enabled: {
            default: true,
            description: 'enable/disable the emitter',
        },
        frustumCulled: {
            default: false,
            description: 'enable/disable frustum culling',
        },

        // GROUP ATTRIBUTES
        texture: {
            type: 'map',
            description: 'texture to be used for each particle, may be a spritesheet',
        },
        textureFrames: {
            type: 'vec2',
            default: { x: 1, y: 1 },
            description: 'x and y frames for a spritesheet. each particle will transition through every frame of the spritesheet over its lifetime (see textureFramesLoop)',
        },
        textureFrameCount: {
            type: 'int',
            default: -1,
            description: 'number of frames in the spritesheet, negative numbers default to textureFrames.x * textureFrames.y',
        },
        textureFrameLoop: {
            type: 'int',
            default: 1,
            description: 'number of times the spritesheet should be looped over the lifetime of a particle',
        },
        // maxParticleCount: {
        //   default: 1000,
        //   description: "maximum number of particles for all emitters in this group (currently only one emitter per group)",
        // },
        blending: {
            default: 'normal',
            oneOf: ['no', 'normal', 'additive', 'subtractive', 'multiply', 'custom'],
            description: 'blending mode, when drawing particles',
            parse: x => (x || 'no').toLowerCase(),
        },
        hasPerspective: {
            default: true,
            description: 'if true, particles will be larger the closer they are to the camera. setting this to false cancels the effect of emitterScale',
        },
        useTransparency: {
            default: true,
            description: 'should the particles be rendered with transparency?',
        },
        alphaTest: {
            default: 0,
            min: 0,
            max: 1,
            description: 'alpha values below the alphaTest threshold are considered invisible',
        },
        depthWrite: {
            default: false,
            description: 'if true, particles write their depth into the depth buffer. this should be false if we use transparent particles',
        },
        depthTest: {
            default: true,
            description: "if true, don't render a particle's pixels if something is closer in the depth buffer",
        },
        affectedByFog: {
            default: true,
            description: 'if true, the particles are affected by THREE js fog',
        },
        emitterScale: {
            default: 100,
            description: 'global scaling factor for all particles from the emitter',
        },

        // EMITTER ATTRIBUTES
        relative: {
            default: 'local',
            oneOf: ['local', 'world'],
            description: 'world relative particles move relative to the world, while local particles move relative to the emitter (i.e. if the emitter moves, all particles move with it)',
            parse: x => (x || 'local').toLowerCase(),
        },
        particleCount: {
            type: 'int',
            default: 100,
            description: 'maximum number of particles for this emitter',
        },
        duration: {
            default: -1,
            description: 'duration of the emitter (seconds), if less than 0 then continuously emit particles',
        },
        distribution: {
            default: 'BOX',
            oneOf: ['BOX', 'SPHERE', 'DISC'],
            description: "distribution for particle positions, velocities and acceleration. will be overriden by specific '...Distribution' attributes",
            parse: x => (x || 'BOX').toUpperCase(),
        },
        activeMultiplier: {
            default: 1,
            min: 0,
            description: 'multiply the rate of particles emission, if larger than 1 then the particles will be emitted in bursts. note, very large numbers will emit all particles at once',
        },
        direction: {
            default: 'forward',
            oneOf: ['forward', 'backward'],
            description: 'make the emitter operate forward or backward in time',
            parse: x => (x || 'forward').toLowerCase(),
        },
        maxAge: {
            default: 1,
            description: 'maximum age of a particle before reusing',
        },
        maxAgeSpread: {
            default: 0,
            description: "variance for the 'maxAge' attribute",
        },
        positionDistribution: {
            default: 'NONE',
            oneOf: ['NONE', 'BOX', 'SPHERE', 'DISC'],
            description: 'distribution of particle positions, disc and sphere will use the radius attributes. For box particles emit at 0,0,0, for sphere they emit on the surface of the sphere and for disc on the edge of a 2D disc on the XY plane',
            parse: x => (x || 'NONE').toUpperCase(),
        },
        positionSpread: {
            type: 'vec3',
            description: 'particles are positioned within +- of these local bounds. for sphere and disc distributions only the x axis is used',
        },
        positionOffset: {
            type: 'vec3',
            description: 'fixed offset to the apply to the emitter relative to its parent entity',
        },
        randomizePosition: {
            default: false,
            description: 'if true, re-randomize position when re-spawning a particle, can incur a performance hit',
        },
        radius: {
            default: 1,
            min: 0,
            description: 'radius of the disc or sphere emitter (ignored for box). note radius of 0 will prevent velocity and acceleration if they use a sphere or disc distribution',
        },
        radiusScale: {
            type: 'vec3',
            default: { x: 1, y: 1, z: 1 },
            description: 'scales the emitter for sphere and disc shapes to form oblongs and ellipses',
        },
        velocityDistribution: {
            default: 'NONE',
            oneOf: ['NONE', 'BOX', 'SPHERE', 'DISC'],
            description: "distribution of particle velocities, for disc and sphere, only the x component will be used. if set to NONE use the 'distribution' attribute for velocityDistribution",
            parse: x => (x || 'NONE').toUpperCase(),
        },
        velocity: {
            type: 'vec3',
            description: 'for sphere and disc distributions, only the x axis is used',
        },
        velocitySpread: {
            type: 'vec3',
            description: 'variance for the velocity',
        },
        randomizeVelocity: {
            default: false,
            description: 'if true, re-randomize velocity when re-spawning a particle, can incur a performance hit',
        },
        accelerationDistribution: {
            default: 'NONE',
            oneOf: ['NONE', 'BOX', 'SPHERE', 'DISC'],
            description: "distribution of particle acceleration, for disc and sphere, only the x component will be used. if set to NONE use the 'distribution' attribute for accelerationDistribution",
            parse: x => (x || 'NONE').toUpperCase(),
        },
        acceleration: {
            type: 'vec3',
            description: 'for sphere and disc distributions, only the x axis is used',
        },
        accelerationSpread: {
            type: 'vec3',
            description: "spread of the particle's acceleration. for sphere and disc distributions, only the x axis is used",
        },
        randomizeAcceleration: {
            default: false,
            description: 'if true, re-randomize acceleration when re-spawning a particle, can incur a performance hit',
        },
        drag: {
            default: 0,
            min: 0,
            max: 1,
            description: "apply resistance to moving the particle, 0 is no resistance, 1 is full resistance, particle will stop moving at half of it's maxAge",
        },
        dragSpread: {
            default: 0,
            description: 'spread to apply to the drag attribute',
        },
        randomizeDrag: {
            default: false,
            description: 'if true, re-randomize drag when re-spawning a particle, can incur a performance hit',
        },
        wiggle: {
            default: 0,
            description: 'extra distance the particle moves over its lifetime',
        },
        wiggleSpread: {
            default: 0,
            description: '+- spread for the wiggle attribute',
        },
        rotation: {
            default: 0,
            description: 'rotation in degrees',
            parse: x => degToRad(x),
            stringify: x => radToDeg(x),
        },
        rotationSpread: {
            default: 0,
            description: 'rotation variance in degrees',
            parse: x => degToRad(x),
            stringify: x => radToDeg(x),
        },
        rotationAxis: {
            type: 'vec3',
            description: 'local axis when using rotation',
        },
        rotationAxisSpread: {
            type: 'vec3',
            description: 'variance in the axis of rotation',
        },
        rotationStatic: {
            default: false,
            description: "if true, the particles are fixed at their initial rotation value. if false, the particle will rotate from 0 to the 'rotation' value",
        },
        // rotationPivot: {
        //   default: {x: Number.MAX_VALUE, y: Number.MAX_VALUE, z: Number.MAX_VALUE, },
        //   description: "if set rotate about this pivot, otherwise rotate about the emitter",
        // },
        randomizeRotation: {
            default: false,
            description: 'if true, re-randomize rotation when re-spawning a particle, can incur a performance hit',
        },
        color: {
            type: 'array',
            default: ['#fff'],
            description: "array of colors over the particle's lifetime, max 4 elements",
        },
        colorSpread: {
            type: 'array',
            default: [],
            description: 'spread to apply to colors, spread an array of vec3 (r g b) with 0 for no spread. note the spread will be re-applied through-out the lifetime of the particle',
            parse: x => (typeof x === 'string' ? x.split(',').map(AFRAME.utils.coordinates.parse) : x),
            stringify: x => x.map(AFRAME.utils.coordinates.stringify).join(','),
        },
        randomizeColor: {
            default: false,
            description: 'if true, re-randomize colour when re-spawning a particle, can incur a performance hit',
        },
        opacity: {
            type: 'array',
            default: [1],
            description: "opacity over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        opacitySpread: {
            type: 'array',
            default: [0],
            description: "spread in opacity over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        randomizeOpacity: {
            default: false,
            description: 'if true, re-randomize opacity when re-spawning a particle, can incur a performance hit',
        },
        size: {
            type: 'array',
            default: [1],
            description: "array of sizes over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        sizeSpread: {
            type: 'array',
            default: [0],
            description: "spread in size over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        randomizeSize: {
            default: false,
            description: 'if true, re-randomize size when re-spawning a particle, can incur a performance hit',
        },
        angle: {
            type: 'array',
            default: [0],
            description: "2D rotation of the particle over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        angleSpread: {
            type: 'array',
            default: [0],
            description: "spread in angle over the particle's lifetime, max 4 elements",
            parse: parseFloatArray,
        },
        randomizeAngle: {
            default: false,
            description: 'if true, re-randomize angle when re-spawning a particle, can incur a performance hit',
        },
    },

    multiple: true,

    init() {
        this.particleGroup = null;
        this.referenceEl = null;
        this.pauseTickId = undefined;
        this.emitterID = uniqueEmitterID++;
        this.pauseTick = this.pauseTick.bind(this);
        this.defaultTexture = new THREE.DataTexture(new Uint8Array(3).fill(255), 1, 1, THREE.RGBFormat);
        this.defaultTexture.needsUpdate = true;
    },

    update(oldData) {
    // don't recreate the effect if just changing enabled or enableInEditor
        const delta = diff(oldData, this.data);
        if (Object.keys(delta).some(x => !['enabled', 'enableInEditor'].includes(x))) {
            this.removeParticleSystem();
            this.addParticleSystem();
        }

        if (this.data.enabled) {
            this.startParticles();
        } else {
            this.stopParticles();
        }

        // HACK - assume editor is up if isPlaying on this component is false
        if (!this.isPlaying && this.data.enableInEditor) {
            this.setupPauseTick();
        } else {
            this.shutdownPauseTick();
        }
    },

    remove() {
        this.removeParticleSystem();
    },

    tick(time, timeDelta) {
        this.tickParticleSystem(timeDelta);
    },

    pause() {
        this.setupPauseTick();
    },

    play() {
        this.shutdownPauseTick();
    },

    setupPauseTick() {
        if (!this.pauseTickId && this.data.enableInEditor) {
            this.pauseTick(true);
        }
    },

    shutdownPauseTick() {
        if (this.pauseTickId) {
            clearTimeout(this.pauseTickId);
            this.pauseTickId = undefined;
        }
    },

    pauseTick() {
        this.tickParticleSystem(33);
        this.pauseTickId = setTimeout(this.pauseTick, 33);
    },

    tickParticleSystem(dt) {
        if (this.data.relative === 'world') {
            const newPosition = toVector3(this.data.positionOffset).applyMatrix4(this.el.object3D.matrixWorld);
            this.particleGroup.emitters[0].position.value = newPosition;
        }

        this.particleGroup.tick(dt / 1000);
    },

    addParticleSystem() {
        const { data } = this;
        const textureLoader = new THREE.TextureLoader();
        const particleTexture = data.texture ? textureLoader.load(data.texture) : this.defaultTexture;

        let blending = data.blending || 'No';
        blending = `${blending.charAt(0).toUpperCase() + blending.substring(1).toLowerCase()}Blending`;
        if (!(blending in THREE)) console.error(`unknown blending mode "${data.blending}"`);

        console.assert(this.particleGroup === null);
        const groupOptions = {
            texture: {
                value: particleTexture,
                frames: toVector2(data.textureFrames),
                frameCount: data.textureFrameCount >= 0 ? data.textureFrameCount : undefined,
                loop: data.textureFrameLoop,
            },
            maxParticleCount: data.particleCount, // data.maxParticleCount,
            blending: THREE[blending],
            hasPerspective: data.hasPerspective,
            transparent: data.useTransparency,
            alphaTest: data.alphaTest,
            depthWrite: data.depthWrite,
            depthTest: data.depthTest,
            fog: data.affectedByFog,
            scale: data.emitterScale,
        };
        this.particleGroup = new SPE.Group(groupOptions);

        const emitterOptions = {
            type: SPE.distributions[data.distribution in SPE.distributions ? data.distribution : 'BOX'],
            particleCount: data.particleCount,
            duration: data.duration >= 0 ? data.duration : null,
            // isStatic: true,
            activeMultiplier: data.activeMultiplier,
            direction: data.direction === 'forward' ? 1 : -1,
            maxAge: {
                value: data.maxAge,
                spread: data.maxAgeSpread,
            },
            position: {
                value: data.relative === 'World' ? toVector3(this.data.positionOffset).applyMatrix4(this.el.object3D.matrixWorld) : toVector3(data.positionOffset).applyMatrix4(this.el.object3D.matrix),
                radius: data.radius,
                radiusScale: toVector3(data.radiusScale),
                spread: toVector3(data.positionSpread),
                distribution: SPE.distributions[data.positionDistribution in SPE.distributions ? data.positionDistribution : data.distribution], // default to the base distribution
                randomise: data.randomizePosition,
            },
            velocity: {
                value: toVector3(data.velocity),
                spread: toVector3(data.velocitySpread),
                distribution: SPE.distributions[data.velocityDistribution in SPE.distributions ? data.velocityDistribution : data.distribution], // default to the base distribution
                randomise: data.randomizeVelocity,
            },
            acceleration: {
                value: toVector3(data.acceleration),
                spread: toVector3(data.accelerationSpread),
                distribution: SPE.distributions[data.accelerationDistribution in SPE.distributions ? data.accelerationDistribution : data.distribution], // default to the base distribution
                randomise: data.randomizeAcceleration,
            },
            drag: {
                value: data.drag,
                spread: data.dragSpread,
                randomise: data.randomizeDrag,
            },
            wiggle: {
                value: data.wiggle,
                spread: data.wiggleSpread,
            },
            rotation: {
                axis: toVector3(data.rotationAxis),
                axisSpread: toVector3(data.rotationAxisSpread),
                angle: data.rotation,
                angleSpread: data.rotationSpread,
                static: data.rotationStatic,
                // center: data.rotationPivot,
                randomise: data.randomizeRotation,
            },
            color: {
                value: data.color.length > 0 ? data.color.map(x => toColor(x)) : [toColor('#fff')],
                spread: data.colorSpread.length > 0 ? data.colorSpread.map(x => toVector3(x)) : undefined, // doesn't accept an empty array
                randomise: data.randomizeColor,
            },
            opacity: {
                value: data.opacity,
                spread: data.opacitySpread,
                randomise: data.randomizeOpacity,
            },
            size: {
                value: data.size,
                spread: data.sizeSpread,
                randomise: data.randomizeSize,
            },
            angle: {
                value: data.angle,
                spread: data.angleSpread,
                randomise: data.randomizeAngle,
            },
        };
        const emitter = new SPE.Emitter(emitterOptions);

        this.particleGroup.addEmitter(emitter);
        this.particleGroup.mesh.frustumCulled = data.frustumCulled; // TODO verify this

        // World emitters are parented to the world and we set their position each frame.
        // Local emitters are parented to the DOM entity
        this.referenceEl = data.relative === 'world' ? this.el.sceneEl : this.el;
        this.referenceEl.setObject3D(this.getEmitterName(), this.particleGroup.mesh);
    },

    removeParticleSystem() {
        if (this.particleGroup) {
            this.referenceEl.removeObject3D(this.getEmitterName());
            this.particleGroup = null;
        }
    },

    startParticles() {
        this.particleGroup.emitters.forEach(em => em.enable());
    },

    stopParticles() {
        this.particleGroup.emitters.forEach(em => em.disable());
    },

    getEmitterName() {
        return `spe-particles${this.emitterID}`;
    },
});

// Use a custom diff because AFRAME.utils.diff() does not correctly diff arrays (https://github.com/aframevr/aframe/issues/3591)
function diff(a, b) {
    const delta = {};
    const keys = Object.keys(a);
    for (const k in b) {
        if (!keys.includes[k]) { keys.push(k); }
    }

    for (const k of keys) {
        const av = a[k];
        const bv = b[k];
        const isObj = av && bv && ((av.constructor == Object && bv.constructor === Object)
      || (Array.isArray(av) && Array.isArray(bv)));

        if ((isObj && !AFRAME.utils.deepEqual(av, bv)) || (!isObj && av !== bv)) {
            delta[k] = bv;
        }
    }

    return delta;
}
