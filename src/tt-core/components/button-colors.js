import * as AFRAME from 'aframe';

const COLORS = [
    '#F85333',
    '#48BAEA',
    '#e0cb49',
    '#33F853',
];

// Set button colors for dynamic list of buttons.
AFRAME.registerComponent('button-colors', {
    init() {
        this.el.addEventListener('child-attached', () => {
            setTimeout(this.setColors.bind(this));
        });
    },

    setColors() {
    // Skip template tag.
        for (let i = 1; i < this.el.children.length + 1; i += 1) {
            if (this.el.children[i]) {
                this.el.children[i].setAttribute('text', 'color', COLORS[i - 1]);
            }
        }
    },
});
