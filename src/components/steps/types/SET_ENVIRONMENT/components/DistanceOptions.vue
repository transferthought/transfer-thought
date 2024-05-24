<template>
    <fragment>
        <!-- <ToolbarBtn text="Scale Down" icon="mdi-magnify-minus" @click="handleScaleEntity(-0.1)" />
        <ToolbarBtn text="Scale Up" icon="mdi-magnify-plus" @click="handleScaleEntity(0.1)" /> -->
        <v-menu
            nudge-left="40"
            nudge-width="120"
            offset-y
            v-model="isMenuOpen"
            :close-on-content-click="false"
            :close-on-click="true"
            bottom
            origin="center center"
        >
            <template v-slot:activator="{ attrs }">
                <ToolbarBtn text="Distance" icon="mdi-tape-measure" @click="isMenuOpen = true" v-bind="attrs" />
            </template>

            <v-card class="pa-3">
                <v-row>
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Distance
                        </label>
                        <v-slider v-model="distance" :min="-100" :max="0" hide-details>
                            <template v-slot:prepend>
                                <v-icon @click="updateDistance(distance - 1)">
                                    mdi-minus
                                </v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon @click="updateDistance(distance + 1)">
                                    mdi-plus
                                </v-icon>
                            </template>
                        </v-slider>
                    </v-col>
                </v-row>
            </v-card>
        </v-menu>
    </fragment>
</template>
<script>
import lodash from 'lodash';
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'DistanceOptions',
    components: {
        ToolbarBtn,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return { isMenuOpen: false };
    },
    mounted() {
        this.updateDistance = _.throttle(this.updateDistance, 100, { leading: true });
    },
    computed: {
        distance: {
            // getter
            get() {
                return this.entity.distance;
            },
            set(distance) {
                this.updateDistance(distance);
            },
        },
    },
    methods: {
        updateDistance(distance) {
            if (this.entity && !_.isUndefined(this.entity.distance) && distance >= -100 && distance <= 0) {
                if (this.$listeners.change) {
                    this.$emit('change', { distance });
                } else {
                    console.log('distance', distance);
                    this.$store.dispatch('steps/updateEntity', {
                        entityId: this.entity.id,
                        newData: { distance },
                    });

                    const scene = document.getElementById('scene');
                    const position = new THREE.Vector3(0, 0, distance);
                    const cameraWorldQuaternion = new THREE.Quaternion();
                    scene.camera.getWorldQuaternion(cameraWorldQuaternion);
                    position.applyQuaternion(cameraWorldQuaternion);

                    this.$store.dispatch('steps/updateEntity', {
                        entityId: this.entity.id,
                        newData: {
                            position: {
                                x: position.x,
                                y: position.y,
                                z: position.z,
                            },
                        },
                    });
                }
            }
        },
    },
};
</script>

<style scoped></style>
