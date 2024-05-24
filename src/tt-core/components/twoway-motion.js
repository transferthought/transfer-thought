/* eslint-disable */

AFRAME.registerComponent('twoway-motion', {
    schema: {
        speed: { type: 'number', default: 40 },
        threshold: { type: 'number', default: -40 },
        nonMobileLoad: { type: 'boolean', default: false },
        removeCheckpoints: { type: 'boolean', default: true },
        chatty: { type: 'boolean', default: true },
    },
    init() {
        const twowaymotion = document.querySelector('[camera]').components['twoway-motion'];
        twowaymotion.componentName = 'twoway-motion';
        report = function (text) {
            if (twowaymotion.data.chatty) {
                console.log(twowaymotion.componentName, ':', text);
            }
        };

        report('init.');
        // report("asked to load with speed=", this.data.speed);

        if (!AFRAME.utils.device.isMobile() && this.data.nonMobileLoad === false) {
            // this is only for mobile devices.
            // document.querySelector("[camera]").removeAttribute("twoway-motion");
            report('Retired. Will only work on mobile.');
            return;
        } if (this.data.nonMobileLoad === true) {
            report('Loading on non-mobile platform.');
        }

        if (this.el.components['wasd-controls'] === undefined) {
            this.el.setAttribute('wasd-controls', 'true');
            report('Installing wasd-controls.');
        }
        this.el.components['wasd-controls'].data.acceleration = this.data.speed;

        // two-way hides checkpoint-controls by default.
        if (this.data.removeCheckpoints) {
            if (this.el.components['checkpoint-controls'] !== undefined) {
                const checkpoints = document.querySelectorAll('[checkpoint]');
                for (let cp = 0; cp < checkpoints.length; cp++) {
                    checkpoints[cp].setAttribute('visible', false);
                }
            }
        }

        this.el.removeAttribute('universal-controls');
        if (this.el.components['look-controls'] === undefined) {
            this.el.setAttribute('look-controls', 'true');
        }

        const cur = document.querySelector('[cursor]');
        if (cur !== null) {
            console.log(this.componentName, ': found a cursor.');
            this.cur = cur;
            // this.curcolor = cur.getAttribute("material").color;
            this.curcolor = cur.getAttribute('color');
        } else {
            console.log(this.componentName, ": didn't find a cursor.");
        }

        const canvas = document.querySelector('.a-canvas');

        canvas.addEventListener('mousedown', function (e) {
            report('mousedown', e);
            twowaymotion.touching = true;
            this.touchTime = new Date().getTime();
        });
        canvas.addEventListener('mouseup', (e) => {
            report('mouseup', e);
            twowaymotion.touching = false;
        });

        canvas.addEventListener('touchstart', function (e) {
            this.touch = e;
            report('touches.length: ', e.touches.length);
            if (e.touches.length > 1) {
                report('multitouch: doing nothing');
            } else {
                report('touchstart', e);
                twowaymotion.touching = true;
            }
        });
        canvas.addEventListener('touchend', function () {
            console.log(this.componentName, ' touchend');
            twowaymotion.touching = false;
        });
    },
    update() {
        if (this.el.components['twoway-controls'] !== undefined) {
            this.el.components['wasd-controls'].data.acceleration = this.el.components['wasd-controls'].data.speed;
        }
    },
    tick() {
        if (!AFRAME.utils.device.isMobile() && this.data.nonMobileLoad === false) {
            // this is only for mobile devices, unless you ask for it.
            return;
        }
        if (!this.isPlaying) {
            return;
        }
        const cam = this.el;
        const camrot = cam.getAttribute('rotation');

        if (camrot.x < this.data.threshold) {
            // we are looking down
            if (this.cur !== null && this.cur !== undefined) {
                this.cur.setAttribute('material', 'color', 'orange');
            }
            if (this.touching === true) {
                cam.components['wasd-controls'].keys.ArrowDown = true;
            } else {
                cam.components['wasd-controls'].keys.ArrowDown = false;
                cam.components['wasd-controls'].keys.ArrowUp = false;
            }
        } else {
            // we are looking forward or up
            if (this.cur !== null && this.cur !== undefined) {
                this.cur.setAttribute('material', 'color', this.curcolor);
            }
            if (this.touching === true) {
                cam.components['wasd-controls'].keys.ArrowUp = true;
            } else {
                cam.components['wasd-controls'].keys.ArrowDown = false;
                cam.components['wasd-controls'].keys.ArrowUp = false;
            }
        }
    },
    pause() {
        // we get isPlaying automatically from A-Frame
    },
    play() {
        // we get isPlaying automatically from A-Frame
    },
    remove() {
        if (this.el.components['wasd-controls'] === undefined) {
            this.el.removeAttribute('wasd-controls');
        }
    },
});
