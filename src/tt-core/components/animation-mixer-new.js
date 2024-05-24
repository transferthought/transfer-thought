/* eslint-disable */

/**
 * animation-mixer
 *
 * Player for animation clips. Intended to be compatible with any model format that supports
 * skeletal or morph animations through THREE.AnimationMixer.
 * See: https://threejs.org/docs/?q=animation#Reference/Animation/AnimationMixer
 */
const LoopMode = {
    once: THREE.LoopOnce,
    repeat: THREE.LoopRepeat,
    pingpong: THREE.LoopPingPong,
};

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape(s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
function wildcardToRegExp(s) {
    return new RegExp(
        `^${s
            .split(/\*+/)
            .map(regExpEscape)
            .join('.*')}$`
    );
}

AFRAME.registerComponent('animation-mixer-new', {
    schema: {
        animationSrc: { type: 'model' },
        autoPlay: { default: false },
        clip: { default: '*' },
        duration: { default: 0 },
        clampWhenFinished: { default: false, type: 'boolean' },
        crossFadeDuration: { default: 0 },
        loop: { default: 'repeat', oneOf: Object.keys(LoopMode) },
        repetitions: { default: Infinity, min: 0 },
        timeScale: { default: 1 },
        subClips: { default: {} },
    },

    init() {
        /** @type {THREE.Mesh} */
        this.model = null;
        this.offset = 0;
        /** @type {THREE.AnimationMixer} */
        this.mixer = null;
        /** @type {Array<THREE.AnimationAction>} */
        this.actions = [];

        this.loader = new THREE.GLTFLoader();

        const model = this.el.getObject3D('mesh');

        if (model) {
            this.load(model);
        } else {
            this.el.addEventListener('model-loaded', (e) => {
                this.load(e.detail.model);
            });
        }
    },

    load(model) {
        this.model = model;
        if (this.data.animationSrc) {
            this.loadAnimation();
        } else {
            this.updateMixer();
        }
    },

    loadAnimation() {
        this.loader.load(this.data.animationSrc, this.updateAnimations.bind(this));
    },

    updateAnimations(gltf) {
        //Add animation to animations array
        this.model.animations = [];
        this.model.animations.push(gltf.animations[0]);
        this.updateMixer();
    },

    updateMixer() {
        this.mixer = new THREE.AnimationMixer(this.model);
        this.mixer.addEventListener('loop', (e) => {
            this.el.emit('animation-loop', { action: e.action, loopDelta: e.loopDelta });
        });
        this.mixer.addEventListener('finished', (e) => {
            this.el.emit('animation-finished', { action: e.action, direction: e.direction });
            this.setupAction();
        });
        if (this.data.clip) this.update({});
    },

    remove() {
        if (this.mixer) this.mixer.stopAllAction();
    },

    update(prevData) {
        if (!prevData) return;

        const { data } = this;
        const changes = AFRAME.utils.diff(data, prevData);

        // If selected clips have changed, restart animation.
        if ('clip' in changes) {
            this.stopAction();
            if (data.clip) this.setupAction();
            if (data.autoPlay) this.playAction();
            return;
        }
        if ('animationSrc' in changes) {
            this.stopAction();
            this.loadAnimation();
            return;
        }

        // Otherwise, modify running actions.
        this.actions.forEach((action) => {
            if ('duration' in changes && data.duration) {
                action.setDuration(data.duration);
            }
            if ('clampWhenFinished' in changes) {
                action.clampWhenFinished = data.clampWhenFinished;
            }
            if ('loop' in changes || 'repetitions' in changes) {
                action.setLoop(LoopMode[data.loop], data.repetitions);
            }
            if ('timeScale' in changes) {
                action.setEffectiveTimeScale(data.timeScale);
            }
        });
    },

    stopAction() {
        for (let i = 0; i < this.actions.length; i += 1) {
            this.actions[i].stop();
        }
    },

    pauseAction() {
        for (let i = 0; i < this.actions.length; i += 1) {
            this.actions[i].paused = true;
        }
    },

    setupAction() {
        if (!this.mixer) return;

        const { model } = this;
        const { data } = this;
        const clips = [...model.animations] || (model.geometry || {}).animations || [];

        for (let i = 0; i < data.subClips.length; i += 1) {
            clips.push(THREE.AnimationUtils.subclip(clips[0], data.subClips[i].name, data.subClips[i].begin, data.subClips[i].end));
        }

        if (!clips.length) return;

        const re = wildcardToRegExp(data.clip);

        this.stopAction();
        this.actions = [];
        for (let clip, i = 0; (clip = clips[i]); i += 1) {
            if (clip && clip.name && clip.name.match(re)) {
                const action = this.mixer.clipAction(clip, model);
                action.clampWhenFinished = data.clampWhenFinished;
                if (data.duration) action.setDuration(data.duration);
                if (data.timeScale !== 1) action.setEffectiveTimeScale(data.timeScale);
                action.setLoop(LoopMode[data.loop], data.repetitions).fadeIn(data.crossFadeDuration);
                action.time = this.offset;
                this.actions.push(action);
            }
        }
    },

    setPlaybackRate() {},

    playAction() {
        // Otherwise, modify running actions.
        this.actions.forEach((action) => {
            action.time = this.offset;
            action.play();
        });
    },

    tick(t, dt) {
        if (this.mixer && !isNaN(dt)) this.mixer.update(dt / 1000);
    },

    setOffset(offset) {
        this.offset = offset;
    },

    getDurationInSeconds() {
        if (this.actions.length) {
            const action = this.actions[0];
            if (action && action._clip && action._clip.duration) {
                return action._clip.duration;
            }
        }
        return 0;
    },
    isRunning() {
        if (this.actions.length) {
            const action = this.actions[0];
            if (action && action._clip && action._clip.duration) {
                return action.isRunning();
            }
        }
        return false;
    },
});
