<template>
    <fragment>
        <EntityOptionsDialog :step="step" :entity="entity" />
        <ToolbarBtn text="Change Audio" icon="mdi-music" @click="$emit('openAssetSelector', 'audio')" />
        <ToolbarBtn
            v-if="this.entity.positional"
            text="Positional"
            icon="mdi-cast-audio-variant
"
            @click="togglePositional"
        />
        <ToolbarBtn v-else text="Background" icon="mdi-speaker" @click="togglePositional" />

        <ToolbarBtn v-if="this.entity.loop" text="Loop" icon="mdi-sync" @click="toggleLoop" />
        <ToolbarBtn v-else text="Play Once" icon="mdi-numeric-1-box-outline" @click="toggleLoop" />

        <VolumeOptions :step="step" :entity="entity" />
        <ToolbarBtn v-if="playing" text="Stop" icon="mdi-stop" @click="stop" />
        <ToolbarBtn v-else text="Play" icon="mdi-play" @click="play" />
    </fragment>
</template>
<script>
import ToolbarBtn from '../../../components/ToolbarBtn.vue';
import EntityOptionsDialog from './EntityOptionsDialog.vue';
import VolumeOptions from './VolumeOptions.vue';

export default {
    name: 'SelectedAudioOptions',
    components: {
        ToolbarBtn,
        EntityOptionsDialog,
        VolumeOptions,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {
            playing: false,
        };
    },
    computed: {},
    mounted() {
        const audioElement = document.getElementById(this.entity.id);
        this.audio = audioElement.components['tt-sound'];
        audioElement.addEventListener('sound-ended', () => {
            this.stop();
        });
    },

    methods: {
        play() {
            this.audio.playSound();
            this.playing = true;
        },
        stop() {
            this.audio.stopSound();
            this.playing = false;
        },
        togglePositional() {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.positional = !currentEntity.positional;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
        toggleLoop() {
            const { entities } = this.step.data;
            const currentEntity = entities[this.entity.id];
            currentEntity.loop = !currentEntity.loop;
            this.$store.dispatch('steps/updateStepDataById', {
                id: this.step.id,
                newData: { entities: _.cloneDeep(entities) },
            });
        },
    },
};
</script>

<style scoped></style>
