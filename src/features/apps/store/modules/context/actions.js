export function setSelectedEntityId({ commit }, selectedEntityId) {
    commit('update', { selector: 'selectedEntityId', value: selectedEntityId });
    if (!selectedEntityId) {
        commit('update', { selector: 'inAnimationMode', value: false });
    }
    const camera = document.getElementById('camera');
    if (camera) {
        const lookControls = camera.components['tt-look-controls'];
        if (lookControls) {
            lookControls.data.reverseMouseDrag = !selectedEntityId;
        }
    }
}
