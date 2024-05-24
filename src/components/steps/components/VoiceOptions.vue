<template>
    <v-select hide-details dense v-model="voiceTemp" :items="voices" outlined class="input-style font-size-input" @change="handleVoiceChange" />
</template>

<script>
import { mapState } from 'vuex';
export default {
    components: {},
    props: {
        voice: String,
    },
    data: () => ({
        voiceTemp: '',
        voices: [
            { text: 'Joanna (US)', value: 'Joanna' },
            { text: 'Aria (NZ)', value: 'Aria' },
            { text: 'Lupe (Spanish)', value: 'Lupe' },
            { text: 'Matthew (US)', value: 'Matthew' },
            { text: 'Olivia (Australia)', value: 'Olivia' },
            { text: 'Arlet (Catalan)', value: 'Arlet' },
            { text: 'Amy (British)', value: 'Amy' },
            { text: 'Kevin (US - Child)', value: 'Kevin' },
            { text: 'Emma (British)', value: 'Emma' },
            { text: 'Brian (British)', value: 'Brian' },
            { text: 'Arthur', value: 'Arthur' },
            {
                text: '(Pro) Rachel',
                value: 'Rachel-ElevenLabs',
            },
            {
                text: '(Pro) Domi',
                value: 'Domi-ElevenLabs',
            },
            {
                text: '(Pro) Antoni',
                value: 'Antoni-ElevenLabs',
            },
            {
                text: '(Pro) Elli',
                value: 'Elli-ElevenLabs',
            },
            {
                text: '(Pro) Josh',
                value: 'Josh-ElevenLabs',
            },
            {
                text: '(Pro) Arnold',
                value: 'Arnold-ElevenLabs',
            },
            {
                text: '(Pro) Adam',
                value: 'Adam-ElevenLabs',
            },
            {
                text: '(Pro) Sam',
                value: 'Sam-ElevenLabs',
            },
        ],
    }),
    watch: {
        voice: {
            imediate: true,
            handler() {
                this.voiceTemp = this.voice;
            },
        },
    },
    mounted() {
        this.voiceTemp = this.voice;
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
        }),
    },
    methods: {
        handleVoiceChange(newSource) {
            this.$emit('change', newSource);
        },
    },
};
</script>

<style></style>
