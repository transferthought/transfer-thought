<template>
    <fragment>
        <div id="run-container">
            <Scene embedded :vr-enabled="false" :ar-enabled="false" />
        </div>

        <v-container fluid>
            <v-row>
                <v-col cols="12" class="py-0">
                    <v-slider
                        label="Oxygen"
                        color="blue"
                        track-color="blue lighten-4"
                        max="100"
                        min="0"
                        :value="oxygen"
                        @input="updateValue('oxygen', $event)"
                        thumb-label="always"
                    >
                        <template v-slot:thumb-label="{ value }">
                            {{ isFireBurning ? '🔥' : value }}
                        </template>
                        <template v-slot:append>
                            <v-text-field
                                :value="oxygen"
                                @input="updateValue('oxygen', $event)"
                                class="mt-0 pt-0"
                                hide-details
                                single-line
                                type="number"
                                style="width: 60px"
                                max="100"
                                min="0"
                            ></v-text-field>
                        </template>
                    </v-slider>
                </v-col>

                <v-col cols="12" class="py-0">
                    <v-slider
                        label="Heat"
                        color="red"
                        track-color="red lighten-4"
                        max="1000"
                        min="-100"
                        :value="heat"
                        @input="updateValue('heat', $event)"
                        thumb-label="always"
                    >
                        <template v-slot:thumb-label="{ value }">
                            {{ isFireBurning ? '🔥' : value }}
                        </template>
                        <template v-slot:append>
                            <v-text-field
                                :value="heat"
                                @input="updateValue('heat', $event)"
                                class="mt-0 pt-0"
                                hide-details
                                single-line
                                type="number"
                                style="width: 60px"
                                max="1000"
                                min="-100"
                            ></v-text-field>
                        </template>
                    </v-slider>
                </v-col>

                <v-col cols="12" class="py-0">
                    <v-slider
                        label="Fuel"
                        color="yellow"
                        track-color="yellow lighten-4"
                        max="100"
                        min="0"
                        :value="fuel"
                        @input="updateValue('fuel', $event)"
                        thumb-label="always"
                    >
                        <template v-slot:thumb-label="{ value }">
                            {{ isFireBurning ? '🔥' : value }}
                        </template>
                        <template v-slot:append>
                            <v-text-field
                                :value="fuel"
                                @input="updateValue('fuel', $event)"
                                class="mt-0 pt-0"
                                hide-details
                                single-line
                                type="number"
                                style="width: 60px"
                                max="100"
                                min="0"
                            ></v-text-field>
                        </template>
                    </v-slider>
                </v-col>
            </v-row>
        </v-container>
    </fragment>
</template>

<script>
/* eslint-disable no-param-reassign */
import Scene from '@/components/Scene.vue';
import exifr from 'exifr';
import * as turf from '@turf/turf';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export default {
    name: 'Run',
    components: {
        Scene,
    },
    data() {
        return {
            oxygenRules: [
                (v) => {
                    if (this.isFireBurning) {
                        return 'Reduce oxygen to put out the fire';
                    }
                    return false;
                },
            ],
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
        heat() {
            try {
                return this.$store.state.apps.state.state.heat;
            } catch {
                return {};
            }
        },
        fuel() {
            try {
                return this.$store.state.apps.state.state.fuel;
            } catch {
                return {};
            }
        },
        oxygen() {
            try {
                return this.$store.state.apps.state.state.oxygen;
            } catch {
                return {};
            }
        },
        isFireBurning() {
            try {
                return this.$store.state.apps.state.state.isFireBurning;
            } catch {
                return {};
            }
        },
    },
    watch: {},
    async mounted() {
        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });
        await this.$store.dispatch('apps/fetchApp', { appId: 'f3a14a30-fe2c-4097-943b-ff9c3e7688fd', type: 'published' });
    },
    methods: {
        updateValue(selector, value) {
            this.$store.dispatch('apps/state/update', {
                selector,
                value,
            });
        },
    },
};
</script>

<style scoped>
#run-container {
    height: 70vh;
    width: 100vw;
}
</style>
