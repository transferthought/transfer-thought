<template>
    <div id="run-container">
        <Scene embedded />
    </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import Scene from '@/components/Scene.vue';
import exifr from 'exifr';
import * as turf from '@turf/turf';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

export default {
    name: 'Run',
    components: {
        Scene,
    },
    data() {
        return {
            imagePoints: [],
            centerPoint: null,
        };
    },
    computed: {
        app() {
            try {
                return this.$store.state.apps;
            } catch {
                return {};
            }
        },
        isAR() {
            return Boolean(this.$route.query.ar);
        },
        isARImage() {
            return Boolean(this.$route.query.arimage);
        },
    },
    watch: {
        'app.scene': {
            handler() {
                if (this.app.scene) {
                    // const positionGizmo = new TransformControls(this.app.scene.el.camera, this.app.scene.el.renderer.domElement);
                    // this.app.scene.el.object3D.positionGizmo = positionGizmo;
                    // this.app.scene.el.object3D.add(positionGizmo);
                    // this.app.scene.el.addEventListener('click', (e) => {
                    //     if (e.target && e.target.classList.contains('checkpoint')) {
                    //         this.app.scene.el.object3D.positionGizmo.attach(e.target.object3D);
                    //     }
                    // });
                    // positionGizmo.addEventListener('mouseUp', (event) => {
                    //     const newPostion = {
                    //         x: Math.round(event.target.object.position.x * 100) / 100,
                    //         y: Math.round(event.target.object.position.y * 100) / 100,
                    //         z: Math.round(event.target.object.position.z * 100) / 100,
                    //     };
                    //     console.log(newPostion);
                    // });
                }
            },
        },
    },
    async mounted() {
        if (this.isAR) {
            await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
        } else if (this.isARImage) {
            await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js');
        }

        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });

        if (this.$route.params.appId) {
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.appId, type: 'published' });
            // this.calculateGPS();
        }
    },
    methods: {
        async calculateGPS() {
            const gpsResultPromises = this.$store.state.apps.state.state.scenes.map((scene) => exifr.gps(scene.url));

            const gpsResults = await Promise.all(gpsResultPromises);
            gpsResults.forEach((gps, index) => {
                this.$store.state.apps.state.state.scenes[index].gps = [gps.longitude, gps.latitude];
            });
            this.calculateMidpoint();
        },
        calculateMidpoint() {
            const points = this.$store.state.apps.state.state.scenes.map((scene) => scene.gps);
            const features = turf.points(points);
            this.centerPoint = turf.center(features);
            this.calculatePosition();
        },
        calculatePosition() {
            this.$store.state.apps.state.state.scenes.forEach((scene) => {
                scene.pos = {
                    x: null,
                    y: null,
                };
                const distance = turf.distance(this.centerPoint, scene.gps);
                const bearing = turf.bearing(this.centerPoint, scene.gps);
                scene.pos.x = Math.cos(90 - bearing) * distance;
                scene.pos.y = Math.sin(90 - bearing) * distance;
            });
        },
    },
};
</script>

<style scoped>
#run-container {
    height: 100vh;
    width: 100vw;
}
</style>
