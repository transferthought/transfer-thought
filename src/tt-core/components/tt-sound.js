/* eslint-disable no-plusplus */
/* eslint-disable no-multi-assign */
/* eslint-disable func-names */
/* eslint-disable no-continue */
import * as AFRAME from 'aframe';

const { THREE } = AFRAME;

/**
 * Sound component.
 */
AFRAME.registerComponent('tt-sound', {
    schema: {
        autoplay: { default: false },
        distanceModel: { default: 'inverse', oneOf: ['linear', 'inverse', 'exponential'] },
        loop: { default: false },
        maxDistance: { default: 10000 },
        on: { default: '' },
        poolSize: { default: 1 },
        positional: { default: true },
        refDistance: { default: 1 },
        rolloffFactor: { default: 1 },
        src: { type: 'audio' },
        volume: { default: 1 },
    },

    multiple: true,

    init() {
        const self = this;

        this.listener = null;
        this.audioLoader = new THREE.AudioLoader();
        this.pool = new THREE.Group();
        this.loaded = false;
        this.mustPlay = false;
        this.isPlaying = false;

        // Don't pass evt because playSound takes a function as parameter.
        this.playSoundBound = function() {
            self.playSound();
        };
    },

    update(oldData) {
        const { data } = this;
        let i;
        let sound;
        const srcChanged = data.src !== oldData.src;

        // Create new sound if not yet created or changing `src`.
        if (srcChanged) {
            if (!data.src) {
                return;
            }
            this.setupSound();
        }

        for (i = 0; i < this.pool.children.length; i++) {
            sound = this.pool.children[i];
            if (data.positional) {
                sound.setDistanceModel(data.distanceModel);
                sound.setMaxDistance(data.maxDistance);
                sound.setRefDistance(data.refDistance);
                sound.setRolloffFactor(data.rolloffFactor);
            }
            sound.setLoop(data.loop);
            sound.setVolume(data.volume);
            sound.isPaused = false;
        }

        if (data.on !== oldData.on) {
            this.updateEventListener(oldData.on);
        }

        // All sound values set. Load in `src`.
        if (srcChanged) {
            const self = this;

            this.loaded = false;
            this.audioLoader.load(data.src, (buffer) => {
                for (i = 0; i < self.pool.children.length; i++) {
                    sound = self.pool.children[i];
                    sound.setBuffer(buffer);
                }
                self.loaded = true;
                self.isPlaying = false;

                // Remove this key from cache, otherwise we can't play it again
                THREE.Cache.remove(data.src);
                if (self.data.autoplay || self.mustPlay) {
                    self.playSound();
                }
                self.el.emit('sound-loaded', self.evtDetail, false);
            });
        }
    },

    pause() {
        this.stopSound();
        this.removeEventListener();
    },

    play() {
        if (this.data.autoplay) {
            this.playSound();
        }
        this.updateEventListener();
    },

    remove() {
        let i;
        let sound;

        this.removeEventListener();

        if (this.el.getObject3D(this.attrName)) {
            this.el.removeObject3D(this.attrName);
        }

        try {
            for (i = 0; i < this.pool.children.length; i++) {
                sound = this.pool.children[i];
                sound.disconnect();
            }
        } catch (e) {
            // disconnect() will throw if it was never connected initially.
        }
    },

    /**
     *  Update listener attached to the user defined on event.
     */
    updateEventListener(oldEvt) {
        const { el } = this;
        if (oldEvt) {
            el.removeEventListener(oldEvt, this.playSoundBound);
        }
        el.addEventListener(this.data.on, this.playSoundBound);
    },

    removeEventListener() {
        this.el.removeEventListener(this.data.on, this.playSoundBound);
    },

    /**
     * Removes current sound object, creates new sound object, adds to entity.
     *
     * @returns {object} sound
     */
    setupSound() {
        const { el } = this;
        let i;
        const { sceneEl } = el;
        const self = this;
        let sound;

        if (this.pool.children.length > 0) {
            this.stopSound();
            el.removeObject3D('sound');
        }

        // Only want one AudioListener. Cache it on the scene.
        const listener = (this.listener = sceneEl.audioListener || new THREE.AudioListener());
        sceneEl.audioListener = listener;

        if (sceneEl.camera) {
            sceneEl.camera.add(listener);
        }

        // Wait for camera if necessary.
        sceneEl.addEventListener('camera-set-active', (evt) => {
            evt.detail.cameraEl.getObject3D('camera').add(listener);
        });

        // Create [poolSize] audio instances and attach them to pool
        this.pool = new THREE.Group();
        for (i = 0; i < this.data.poolSize; i += 1) {
            sound = this.data.positional ? new THREE.PositionalAudio(listener) : new THREE.Audio(listener);
            this.pool.add(sound);
        }
        el.setObject3D(this.attrName, this.pool);

        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            sound.onEnded = function() {
                this.isPlaying = false;
                self.el.emit('sound-ended', self.evtDetail, false);
            };
        }
    },

    /**
     * Set playback rate
     */
    setPlaybackRate(playbackRate) {
        let i;
        let sound;
        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            if (!sound.source || !sound.source.buffer) {
                continue;
            }
            sound.setPlaybackRate(playbackRate);
        }
    },

    /**
     * Pause all the sounds in the pool.
     */
    setOffset(offset) {
        let i;
        let sound;
        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            if (!sound.source || !sound.source.buffer) {
                continue;
            }
            sound.offset = offset;
        }
    },

    /**
     * Pause all the sounds in the pool.
     */
    pauseSound() {
        let i;
        let sound;

        this.isPlaying = false;
        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            if (!sound.source || !sound.source.buffer || !sound.isPlaying || sound.isPaused) {
                continue;
            }
            sound.isPaused = true;
            sound.pause();
        }
    },

    /**
     * Look for an unused sound in the pool and play it if found.
     */
    playSound(processSound) {
        let found;
        let i;
        let sound;

        if (!this.loaded) {
            this.mustPlay = true;
            return;
        }

        found = false;
        this.isPlaying = true;
        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            if (!sound.isPlaying && sound.buffer && !found) {
                if (processSound) {
                    processSound(sound);
                }
                this.el.emit('sound-started', this.evtDetail, false);
                sound.play();
                sound.isPaused = false;
                found = true;
            }
        }

        if (!found) {
            return;
        }

        this.mustPlay = false;
    },

    /**
     * Stop all the sounds in the pool.
     */
    stopSound() {
        let i;
        let sound;
        this.isPlaying = false;
        for (i = 0; i < this.pool.children.length; i += 1) {
            sound = this.pool.children[i];
            if (!sound.source || !sound.source.buffer) {
                return;
            }
            sound.stop();
        }
    },

    getDurationInSeconds() {
        if (this.pool.children.length) {
            const sound = this.pool.children[0];
            if (sound.buffer) {
                return sound.buffer.duration;
            }
        }
        return undefined;
    },

    playing() {
        let isPlaying = false;
        for (let i = 0; i < this.pool.children.length; i += 1) {
            const sound = this.pool.children[i];
            if (sound.isPlaying) {
                isPlaying = true;
                break;
            }
        }
        return isPlaying;
    },
});
