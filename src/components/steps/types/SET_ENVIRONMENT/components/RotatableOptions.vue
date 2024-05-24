<template>
    <fragment>
        <!-- <ToolbarBtn text="Rotate Clockwise" icon="mdi-axis-z-rotate-clockwise" @click="handleRotateEntity(-increment)" />
        <ToolbarBtn text="Rotate Counter Clockwise" icon="mdi-axis-z-rotate-counterclockwise" @click="handleRotateEntity(increment)" /> -->
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
                <ToolbarBtn text="Rotate" icon="mdi-rotate-360" @click="isMenuOpen = true" v-bind="attrs" />
            </template>

            <v-card class="pa-3">
                <v-row>
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Rotation
                        </label>
                        <v-slider v-model="yRotation" :min="-180" :max="180" hide-details="">
                            <template v-slot:prepend>
                                <v-icon @click="handleRotateEntity(-increment)">
                                    mdi-minus
                                </v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon @click="handleRotateEntity(increment)">
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
        increment: {
            type: Number,
            default: 30,
        },
    },
    data() {
        return { isMenuOpen: false };
    },
    mounted() {
        this.updateRotation = _.throttle(this.updateRotation, 100, { leading: true });
    },
    computed: {
        yRotation: {
            // getter
            get() {
                console.log(this.entity.rotation.y);
                return this.entity.rotation.y;
            },
            set(yRotation) {
                this.updateRotation(yRotation);
            },
        },
    },
    methods: {
        updateRotation(yRotation) {
            if (this.entity && this.entity.rotation) {
                const rotation = new THREE.Vector3(this.entity.rotation.x, yRotation, this.entity.rotation.z);
                if (this.$listeners.change) {
                    debugger;
                    this.$emit('change', { rotation });
                } else {
                    this.$store.dispatch('steps/updateEntity', {
                        entityId: this.entity.id,
                        newData: { rotation },
                    });
                }
            }
        },
        handleRotateEntity(degree) {
            if (this.entity && this.entity.rotation) {
                this.updateRotation(this.entity.rotation.y + degree);
            }
        },
    },
};
</script>

<style scoped></style>
