if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Audio visualizer component for A-Frame using AnalyserNode.
 */
AFRAME.registerComponent('tt-audioanalyser', {
    dependencies: ['tt-sound'],
    schema: {
        beatStartCutoff: { default: 0.8 },
        beatEndCutoff: { default: 0.75 },
        enabled: { default: true },
        enableBeatDetection: { default: true },
        enableLevels: { default: true },
        enableWaveform: { default: true },
        enableVolume: { default: true },
        fftSize: { default: 2048 },
        smoothingTimeConstant: { default: 0.8 },
        unique: { default: false },
    },

    init: function() {
        this.audioEl = null;
        this.levels = null;
        this.waveform = null;
        this.volume = 0;
        this.xhr = null;

        this.beat_low = false;
        this.beat_mid = false;
        this.beat_high = false;
        this.beat_low_max = 20;
        this.beat_mid_max = 20;
        this.beat_high_max = 20;

        this.initContext();
    },

    update: function(oldData) {
        const analyser = this.analyser;
        const data = this.data;

        // Update analyser stuff.
        if (oldData.fftSize !== data.fftSize || oldData.smoothingTimeConstant !== data.smoothingTimeConstant) {
            analyser.fftSize = data.fftSize;
            analyser.smoothingTimeConstant = data.smoothingTimeConstant;
            this.levels = new Uint8Array(analyser.frequencyBinCount);
            this.waveform = new Uint8Array(analyser.fftSize);
        }
    },

    /**
     * Update spectrum on each frame.
     */
    tick: function() {
        const data = this.data;

        if (!data.enabled) {
            return;
        }

        // Levels (frequency).
        if (data.enableLevels || data.enableVolume) {
            this.analyser.getByteFrequencyData(this.levels);
        }

        // Waveform.
        if (data.enableWaveform) {
            this.analyser.getByteTimeDomainData(this.waveform);
        }

        // Average volume.
        if (data.enableVolume || data.enableBeatDetection) {
            var sum = 0;
            for (var i = 0; i < this.levels.length; i++) {
                sum += this.levels[i];
            }
            this.volume = sum / this.levels.length;
        }

        // Beat detection.
        if (data.enableBeatDetection) {
            //frequencies here are on a scale of 0 - 23600hz
            var val = this.beatInRange(1, 350, this.beat_low, this.beat_low_max, 'audioanalyser-beat-low');
            this.beat_low = val[0];
            this.beat_low_max = val[1];
            val = this.beatInRange(500, 2000, this.beat_mid, this.beat_mid_max, 'audioanalyser-beat-mid');
            this.beat_mid = val[0];
            this.beat_mid_max = val[1];
            val = this.beatInRange(4000, 10000, this.beat_high, this.beat_high_max, 'audioanalyser-beat-high');
            this.beat_high = val[0];
            this.beat_high_max = val[1];
        }
    },

    //uses fourier transforms to detect beats in a given frequency range
    beatInRange: function(_start, _end, _lastBeat, beat_max, _emitName) {
        const frequencyLength = this.levels.length;
        const adjStart = Math.floor((_start / 23600) * frequencyLength);
        const adjEnd = Math.floor((_end / 23600) * frequencyLength);

        const slice = this.levels.slice(adjStart, adjEnd);
        const average = slice.reduce((a, b) => a + b) / slice.length;

        beat_max = Math.max(average, beat_max);

        if (average >= beat_max * this.data.beatStartCutoff && _lastBeat == false) {
            this.el.emit(_emitName, null, false);
            return [true, beat_max];
        } else if (average < beat_max * this.data.beatEndCutoff && _lastBeat == true) {
            return [false, beat_max];
        }
        return [_lastBeat, beat_max];
    },

    initContext: function() {
        // const data = this.data;

        // this.context = new (window.webkitAudioContext || window.AudioContext)();
        // const analyser = (this.analyser = this.context.createAnalyser());
        // const gainNode = (this.gainNode = this.context.createGain());
        // gainNode.connect(analyser);
        // analyser.connect(this.context.destination);
        // analyser.fftSize = data.fftSize;
        // analyser.smoothingTimeConstant = data.smoothingTimeConstant;
        // this.levels = new Uint8Array(analyser.frequencyBinCount);
        // this.waveform = new Uint8Array(analyser.fftSize);

        const data = this.data;
        console.log(this.el);
        console.log(this.el.getObject3D('sound'));
        const sound = this.el.components['tt-sound'];
        this.analyser = sound.listener.context.createAnalyser();
        sound.listener.getInput().connect(this.analyser);
        this.analyser.smoothingTimeConstant = data.smoothingTimeConstant;

        this.context = this.el.sceneEl.audioListener.context;
        this.levels = new Uint8Array(this.analyser.frequencyBinCount);
        this.waveform = new Uint8Array(this.analyser.fftSize);
    },
});
