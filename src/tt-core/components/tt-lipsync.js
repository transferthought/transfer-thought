AFRAME.registerComponent('tt-lipsync', {
    schema: {
        analyserEl: { type: 'selector' },
        multiplier: { type: 'number', default: 1 },
    },
    tick: function(t, dt) {
        const analyserEl = this.data.analyserEl || this.el;
        const el = this.el;

        const analyserComponent = analyserEl.components['tt-audioanalyser'];
        if (!analyserComponent.analyser) {
            return;
        }

        const volume = analyserComponent.volume * this.data.multiplier;
        // console.log('volume', volume);

        this.el.object3D.traverse((o) => {
            if (o && o.userData && o.userData.targetNames) {
                {
                    const pos = o.userData.targetNames.indexOf('jawOpen');
                    const currentValue = o.morphTargetInfluences[pos];
                    // mouth shut and trigger volume reached
                    // o.morphTargetInfluences[pos] = 0.2 * (1 + Math.sin(t / 100));
                    o.morphTargetInfluences[pos] = THREE.MathUtils.clamp((volume - 20) / 20, 0, 1.2);
                    // 0.2 * (1 + Math.sin(t / 100));
                    // if (currentValue < .3 && volume > 30) {
                    //     o.morphTargetInfluences[pos] = o.morphTargetInfluences[pos] = 0.2 * (1 + Math.sin(15 * t))
                    // }
                    // o.morphTargetInfluences[pos] = THREE.MathUtils.clamp((volume - 20) / 30, 0, 1); //(volume * volume * volume) / (50 * 50 * 50); // volume * volume * volume * 0.00035; //THREE.MathUtils.clamp(volume * 0.01, 0, 1);
                }
                {
                    const pos = o.userData.targetNames.indexOf('mouthOpen');
                    // o.morphTargetInfluences[pos] = 1; // (volume * volume * volume) / (50 * 50 * 50);
                }
                // console.log("updated")
                // console.log(o.userData, pos, o.morphTargetInfluences[pos] )
            }
        });
    },
});
