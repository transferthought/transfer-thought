export default {
    setCurrentStepIndex(state, newIndex) {
        state.currentStepIndex = newIndex;
    },
    setStarted(state, started) {
        state.started = started;
    },
    setPause(state, pause) {
        state.paused = pause;
    },
    setTranscriptPlaying(state, transcriptPlaying) {
        state.transcriptPlaying = transcriptPlaying;
    },
    setTranscriptFinished(state, transcriptFinished) {
        state.transcriptFinished = transcriptFinished;
    },
};
