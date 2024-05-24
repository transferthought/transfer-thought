/* global AFRAME,TWEEN,THREE */
/**
 * NUmber widget Component for aframe-material-collection. Includes up/down buttons
 * @namespace aframe-material-collection
 * @component ui-number
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-number', {
    schema: {
        value: { type: 'number', default: 0 },
        increment: { type: 'number', default: 0.001 },
        width: { type: 'number', default: 0.65 },
        height: { type: 'number', default: 0.2 },
        intersectableClass: { default: 'intersectable' },
    },
    init() {
        this.setupElements();
    },
    setupElements() {
        const numberText = document.createElement('a-plane');
        numberText.setAttribute('width', '0.55');
        numberText.setAttribute('height', '0.2');
        numberText.className = 'no-yoga-layout';
        numberText.setAttribute('color', '#212121');
        numberText.setAttribute('text', `value:${this.data.value.toFixed(3)};color:#212121;wrapCount:12;align:center`);
        numberText.setAttribute('ui-border', 'borderRadius:0.1;borderWidth:0.008');

        const upButton = document.createElement('a-ui-fab-button-small');
        upButton.setAttribute('scale', '0.75 0.75 0.75');
        upButton.className = `no-yoga-layout ${this.data.intersectableClass}`;
        upButton.setAttribute('color', '#009688');
        upButton.setAttribute('position', '0.33 0.055 0.001');
        upButton.setAttribute('color', '#009688');
        upButton.setAttribute('icon-color', '#fff');
        upButton.setAttribute('ripple-color', '#009688');
        upButton.setAttribute('src', 'https://cdn.theexpanse.app/images/icons/baseline_keyboard_arrow_up_white_18dp.png');
        upButton.addEventListener('click', () => {
            this.data.value += this.data.increment;
            numberText.setAttribute('text', `value:${(this.data.value).toFixed(3)};color:#212121;wrapCount:12;align:center`);
            this.el.emit('change', this.data.value);
        });
        const downButton = document.createElement('a-ui-fab-button-small');
        downButton.setAttribute('scale', '0.75 0.75 0.75');
        downButton.className = `no-yoga-layout ${this.data.intersectableClass}`;
        downButton.setAttribute('color', '#009688');
        downButton.setAttribute('position', '0.33 -0.055 0.001');
        downButton.setAttribute('color', '#009688');
        downButton.setAttribute('icon-color', '#fff');
        downButton.setAttribute('ripple-color', '#009688');
        downButton.setAttribute('src', 'https://cdn.theexpanse.app/images/icons/down_arrow.png');
        downButton.addEventListener('click', () => {
            this.data.value -= this.data.increment;
            numberText.setAttribute('text', `value:${(this.data.value).toFixed(3)};color:#212121;wrapCount:12;align:center`);
            this.el.emit('change', this.data.value);
        });
        numberText.appendChild(upButton);
        numberText.appendChild(downButton);
        this.el.appendChild(numberText);
    },
});

/*
<a-plane class="zInput" width="0.55" ui-border="borderRadius:0.1;borderWidth:0.008" height="0.2" color="#212121" text="value:{{to-fixed vector.z 3}};color:#212121;wrapCount:12;align:center">
        <a-ui-fab-button-small scale="0.75 0.75 0.75" class="zInputUp intersectable no-yoga-layout" color="#009688" position="0.33 0.055 0.001" icon-color="#fff" ripple-color="#009688" src="https://cdn.theexpanse.app/images/icons/baseline_keyboard_arrow_up_white_18dp.png"></a-ui-fab-button-small>
        <a-ui-fab-button-small scale="0.75 0.75 0.75" class="zInputDown intersectable no-yoga-layout" color="#009688" position="0.33 -0.055 0.001" icon-color="#fff" ripple-color="#009688" src="https://cdn.theexpanse.app/images/icons/down_arrow.png"></a-ui-fab-button-small>
    </a-plane>
 */
