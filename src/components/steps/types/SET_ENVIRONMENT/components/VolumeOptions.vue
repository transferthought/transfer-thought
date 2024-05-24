<template>
    <fragment>
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
                <ToolbarBtn text="Volume" icon="mdi-volume-high" @click="isMenuOpen = true" v-bind="attrs" />
            </template>

            <v-card class="pa-3">
                <v-row>
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Volume
                        </label>
                        <v-slider v-model="volume" :min="1" :max="100" hide-details="">
                            <template v-slot:prepend>
                                <v-icon @click="volume -= increment">
                                    mdi-minus
                                </v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon @click="volume += increment">
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

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export default {
    name: 'VolumeOptions',
    components: {
        ToolbarBtn,
    },
    props: {
        step: Object,
        entity: Object,
        increment: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return { isMenuOpen: false };
    },
    mounted() {
        this.updateVolume = _.throttle(this.updateVolume, 100, { leading: true });
    },
    computed: {
        volume: {
            // getter
            get() {
                console.log(this.entity.volume);
                return this.entity.volume;
            },
            set(newVolume) {
                this.updateVolume(newVolume);
            },
        },
    },
    methods: {
        updateVolume(newVolume) {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            if (currentEntity) {
                _.extend(currentEntity, { volume: clamp(newVolume, 1, 100) });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
        handleUpdate(degree) {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            if (currentEntity && currentEntity.rotation) {
                const rotation = new THREE.Vector3(currentEntity.rotation.x, currentEntity.rotation.y + degree, currentEntity.rotation.z);
                _.extend(currentEntity, { rotation });
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            }
        },
    },
};
</script>

<style scoped></style>
