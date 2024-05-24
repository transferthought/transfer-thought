/* eslint-disable */

import * as AFRAME from 'aframe';

AFRAME.registerComponent('magnetic-grabbable', {
    init() {
        const { el } = this;
        this.el.addEventListener('mousedown', () => {
            console.log(event);
            const action = { element: event.target };

            if (action.element.components.networked.isMine()) {
                const playerElement = document.querySelector('#camera');

                // Calculate placement in front of player
                const worldPos = new THREE.Vector3();
                worldPos.setFromMatrixPosition(playerElement.object3D.matrixWorld);

                const dist = 1;
                const inFront = new THREE.Vector3(0, 0, -dist);
                inFront.applyQuaternion(playerElement.object3D.quaternion);

                worldPos.add(inFront);

                // Need to apply to physics body, since physics is overriding position
                action.element.body.position = new CANNON.Vec3().copy(worldPos);
            } else {
                action.element.components.networked.lastOwnerTime = NAF.connection.getServerTime();
                setTimeout(() => {
                    NAF.utils.takeOwnership(action.element);
                }, 250);
            }
        });

        this.el.addEventListener('mouseup', () => {
            console.log(event);
            const action = { element: event.target };

            // enter action code below
            this.getInitialBulletPosition = function(spawnerEl) {
                var worldPos = new THREE.Vector3();
                worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);

                var dist = 1;
                var inFront = new THREE.Vector3(0, 0, -dist);
                inFront.applyQuaternion(spawnerEl.object3D.quaternion);

                worldPos.add(inFront);

                return worldPos;
            };

            this.getInitialBulletRotation = function(spawnerEl) {
                var worldDirection = new THREE.Vector3();

                spawnerEl.object3D.getWorldDirection(worldDirection);
                worldDirection.multiplyScalar(-1);
                this.vec3RadToDeg(worldDirection);

                return worldDirection;
            };

            this.vec3RadToDeg = function(rad) {
                rad.set(rad.y * 90, -90 + -THREE.MathUtils.radToDeg(Math.atan2(rad.z, rad.x)), 0);
            };
            console.log(this.getInitialBulletPosition);

            var el = document.createElement('a-entity');
            el.setAttribute('networked', 'template:' + '#bullet-template');
            el.setAttribute('dynamic-body', '');

            var tip = document.querySelector('#camera');
            el.setAttribute('position', this.getInitialBulletPosition(tip));
            el.setAttribute('rotation', this.getInitialBulletRotation(tip));

            var scene = document.querySelector('a-scene');
            scene.appendChild(el);

            //REFACTOR: Timeout added to avoid race-condition - el.body needs a tick to be created
            setTimeout(function() {
                var worldPos = new THREE.Vector3();
                worldPos.setFromMatrixPosition(el.object3D.matrixWorld);
                var dist = 60;
                var inFront = new THREE.Vector3(0, dist / 2, -dist);
                inFront.applyQuaternion(el.object3D.quaternion);
                worldPos.add(inFront);

                el.body.applyImpulse(new CANNON.Vec3().copy(worldPos), new CANNON.Vec3().copy(tip.object3D.position));
            }, 100);
        });

        this.el.addEventListener('ownership-changed', (evt) => {
            if (el.components.networked.isMine()) {
                console.log('You stole the ball', evt.detail);

                // Bring ball in front of you
                const playerElement = document.querySelector('#camera');

                el.setAttribute('dynamic-body', '');

                // Calculate placement in front of player
                const worldPos = new THREE.Vector3();
                worldPos.setFromMatrixPosition(playerElement.object3D.matrixWorld);

                const dist = 1;
                const inFront = new THREE.Vector3(0, 0, -dist);
                inFront.applyQuaternion(playerElement.object3D.quaternion);

                worldPos.add(inFront);

                // Need to apply to physics body, since physics is overriding position
                el.body.position = new CANNON.Vec3().copy(worldPos);
            } else {
                console.log('You lost the ball', evt.detail);
                el.removeAttribute('dynamic-body');
            }
        });
    },
});
