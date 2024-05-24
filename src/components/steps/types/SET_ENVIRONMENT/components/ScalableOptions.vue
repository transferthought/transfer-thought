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
                <ToolbarBtn text="Scale" icon="mdi-resize" @click="isMenuOpen = true" v-bind="attrs" />
            </template>

            <v-card class="pa-3">
                <v-row>
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Scale
                        </label>
                        <v-slider v-model="xScale" :min="1" :max="100" hide-details>
                            <template v-slot:prepend>
                                <v-icon @click="handleScaleEntity(-0.1)">
                                    mdi-minus
                                </v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon @click="handleScaleEntity(0.1)">
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
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'ScalableOptions',
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
        this.updateScale = _.throttle(this.updateScale, 100, { leading: true });
    },
    computed: {
        xScale: {
            // getter
            get() {
                return this.entity.scale.x;
            },
            set(xScale) {
                this.updateScale(xScale);
            },
        },
    },
    methods: {
        updateScale(xScale) {
            if (this.entity && this.entity.scale) {
                const scale = new THREE.Vector3(xScale, xScale, xScale);
                if (this.$listeners.change) {
                    this.$emit('change', { scale });
                } else {
                    this.$store.dispatch('steps/updateEntity', {
                        entityId: this.entity.id,
                        newData: { scale },
                    });
                }
            }
        },
        handleScaleEntity(scaleMultiple) {
            if (this.entity && this.entity.scale) {
                const scaler = 1 + scaleMultiple;
                const scale = new THREE.Vector3(this.entity.scale.x, this.entity.scale.y, this.entity.scale.z).multiplyScalar(scaler);
                this.updateScale(scale.x);
            }
        },
    },
};
</script>

<style scoped></style>
