<template>
    <fragment>
        <v-menu
            nudge-left="150"
            nudge-width="120"
            v-model="inAnimationMode"
            :close-on-content-click="false"
            :close-on-click="false"
            bottom
            origin="center center"
        >
            <template v-slot:activator="{ attrs }">
                <ToolbarBtn text="Animation" icon="mdi-motion" @click="inAnimationMode = true" v-bind="attrs" />
            </template>

            <v-card class="pa-3">
                <!-- <v-btn icon left top>
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn> -->
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Duration
                        </label>
                        <v-text-field v-model="duration" hide-details outlined class="input-style font-size-input" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Delay
                        </label>
                        <v-text-field v-model="delay" hide-details outlined class="input-style font-size-input" type="number"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Loop
                        </label>

                        <v-switch v-model="loop" hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Direction
                        </label>
                        <v-select
                            v-model="direction"
                            solo
                            :items="[
                                { text: 'Normal', value: 'normal' },
                                { text: 'Alternate', value: 'alternate' },
                            ]"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <!-- <v-col cols="6">
                        <v-btn color="primary lighten-1" depressed class="white--text text-h3 text-capitalize py-1 px-2" @click="previewAnimation">
                            <v-icon left>
                                mdi-play
                            </v-icon>
                            Preview Animation
                        </v-btn>
                    </v-col> -->
                    <v-col cols="6" offset="3">
                        <v-btn color="red lighten-1" depressed class="white--text text-capitalize py-1 px-2" @click="clearAnimation">
                            <v-icon left>
                                mdi-delete
                            </v-icon>
                            Clear Animation
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </v-menu>
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'AnimationOptions',
    components: {
        ToolbarBtn,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {
            attributes: [],
        };
    },
    mounted() {
        this.el = document.getElementById(this.entity.id);
        this.el.addEventListener('animationcomplete', () => {
            this.stopAnimation();
        });
    },
    computed: {
        inAnimationMode: {
            // getter
            get() {
                return this.$store.state.apps.context.inAnimationMode;
            },
            // setter
            set(inAnimationMode) {
                this.$store.commit('apps/context/update', { selector: 'inAnimationMode', value: inAnimationMode });
                if (inAnimationMode) {
                    this.$store.commit('apps/context/update', {
                        selector: 'animationContext',
                        value: {
                            from: this.entity.position,
                            to: this.entity.animation.to,
                        },
                    });
                } else {
                    this.$store.commit('apps/context/update', { selector: 'animationContext', value: null });
                }
            },
        },
        duration: {
            // getter
            get() {
                return this.entity.animation.duration;
            },
            set(duration) {
                const { entities } = this.step.data;
                const currentEntity = entities[this.entity.id];
                currentEntity.animation.duration = duration;
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            },
        },
        delay: {
            // getter
            get() {
                return this.entity.animation.delay;
            },
            set(delay) {
                const { entities } = this.step.data;
                const currentEntity = entities[this.entity.id];
                currentEntity.animation.delay = delay;
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            },
        },
        loop: {
            // getter
            get() {
                return this.entity.animation.loop;
            },
            set(loop) {
                const { entities } = this.step.data;
                const currentEntity = entities[this.entity.id];
                currentEntity.animation.loop = loop;
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            },
        },
        direction: {
            // getter
            get() {
                return this.entity.animation.direction;
            },
            set(direction) {
                const { entities } = this.step.data;
                const currentEntity = entities[this.entity.id];
                currentEntity.animation.direction = direction;
                this.$store.dispatch('steps/updateStepDataById', {
                    id: this.step.id,
                    newData: { entities: _.cloneDeep(entities) },
                });
            },
        },
    },
    methods: {
        previewAnimation() {
            this.el.setAttribute('animation', { autoplay: true });
        },
        stopAnimation() {
            this.el.setAttribute('animation', { autoplay: false });
        },
        clearAnimation() {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.animation.to = null;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
            this.loop = false;
            this.delay = 0;
            this.duration = 3000;
            this.inAnimationMode = false;
        },
    },
};
</script>

<style scoped></style>
