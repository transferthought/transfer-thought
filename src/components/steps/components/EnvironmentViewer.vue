<template>
    <div>
        <InformationPoint
            v-for="information in informationPoints"
            :id="information.id"
            :label="information.label"
            :description="information.description"
            :key="information.id"
        />
    </div>
</template>
<script>
import _ from 'lodash';
import InformationPoint from '../../InformationPoint.vue';

export default {
    name: 'EnvironmentViewer',
    components: { InformationPoint },
    mixins: [],
    props: {},
    data() {
        return {};
    },
    computed: {
        currentEnvironment() {
            return this.$store.state.apps.state.state.currentEnvironment;
        },

        informationPoints() {
            return this.currentEnvironment?.data?.information || [];
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$nextTick(() => {
                this.playAudio();
                this.playAnimations();
            });
        });
    },
    destroyed() {
        console.log('destroyed');
    },
    watch: {
        app: {
            handler() {
                this.playAudio();
            },
            immediate: true,
        },
        'steps.started': {
            handler() {
                this.playAudio();
            },
            immediate: true,
        },
    },
    methods: {
        playAudio() {
            console.log('PLAY pre', this.app);
            if (this.$store.state.apps && this.$store.state.apps.context.mode !== 'edit' && this.$store.state.steps.started) {
                console.log('PLAY post');
                const audioElements = document.getElementsByClassName('audio');
                console.log('audioElements', audioElements);
                _.forEach(audioElements, (entity) => {
                    if (entity && entity.components && entity.components['tt-sound']) {
                        const audio = entity.components['tt-sound'];
                        if (audio && audio.loaded && !audio.playing()) {
                            audio.playSound();
                        } else {
                            entity.addEventListener('sound-loaded', () => {
                                audio.playSound();
                            });
                        }
                    }
                });
            }
        },
        playAnimations() {
            const entities = document.getElementsByClassName('prop');
            _.forEach(entities, (entity) => {
                if (entity && entity.components && entity.components['animation']) {
                    // entity.setAttribute('animation', { autoplay: true });
                }
            });
        },
        stopAudio() {
            const audioElements = document.getElementsByClassName('audio');
            _.forEach(audioElements, (entity) => {
                if (entity && entity.components && entity.components['tt-sound']) {
                    const audio = entity.components['tt-sound'];
                    if (audio && audio.playing()) {
                        audio.stopSound();
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
