<template>
    <v-card align="center" justify="center" style="width: 100%" elevation="5" class="pa-5">
        <v-row align="center" justify="center">
            <v-col>
                <TextToSpeech :voice="currentStep.data.voice || state.coach.voice" :transcript="currentStep.data.transcript" @change="handleAudioChange" />
            </v-col>
        </v-row>
    </v-card>
</template>
<script>
import TextToSpeech from './TextToSpeech.vue';

export default {
    name: 'InstructionalEditor',
    components: {
        TextToSpeech,
    },
    props: {},
    data() {
        return {};
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
        currentStepIndex() {
            return this.state.currentStepIndex;
        },
        currentStep() {
            return this.$store.getters['steps/getCurrentStep']();
        },
    },
    methods: {
        handleAudioChange(data) {
            this.$store.dispatch('steps/updateStepDataById', { id: this.currentStep.id, newData: data });
        },
    },
};
</script>

<style scoped></style>
