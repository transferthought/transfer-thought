import * as AFRAME from 'aframe';

AFRAME.registerComponent('handle-events', {
    init() {
        const { el } = this;
        this.el.addEventListener('click', () => {
            if (AFRAME.scenes[0].systems.state.state.step === 'SELECT_CHARACTER' || AFRAME.scenes[0].systems.state.state.step === 'ROUND_2') {
                AFRAME.scenes[0].emit('personSelected', { character: el.id });
            }
        });
    },
});
