/* eslint-disable */

AFRAME.registerComponent('grab-ball', {
    init() {
        const { el } = this;
        this.el.addEventListener('mousedown', () => {
            AFRAME.scenes[0].emit('grabBall', { element: el });
        });

        this.el.addEventListener('ownership-changed', function(evt) {
            if (el.components.networked.isMine()) {
                console.log('You stole the ball', evt.detail);

                //Bring ball in front of you
                var playerElement = document.querySelector('#player');
                var newBallPosition = playerElement.components.gun.getInitialBulletPosition(player);
                var newBallRotation = playerElement.components.gun.getInitialBulletRotation(player);

                el.setAttribute('position', newBallPosition);
                el.setAttribute('rotation', newBallRotation);

                el.setAttribute('dynamic-body', '');
            } else {
                console.log('You lost the ball', evt.detail);
                el.removeAttribute('dynamic-body');
            }
        });
    },
});

/*
AFRAME.registerComponent('forward', {
  schema: {
    speed: {default: 0.1},
  },

  init: function() {
  	var worldDirection = new THREE.Vector3();

    this.el.object3D.getWorldDirection(worldDirection);
    worldDirection.multiplyScalar(-1);

    this.worldDirection = worldDirection;
  },

  tick: function() {
  	var el = this.el;

  	var currentPosition = el.getAttribute('position');
	  var newPosition = this.worldDirection
							        .clone()
							        .multiplyScalar(this.data.speed)
							        .add(currentPosition);
	  el.setAttribute('position', newPosition);
  }
});
*/

AFRAME.registerComponent('gun', {
    schema: {
        bulletTemplate: { default: '#bullet-template' },
        triggerKeyCode: { default: 32 }, // spacebar
    },

    init: function() {
        var that = this;
        document.body.onkeyup = function(e) {
            if (e.keyCode == that.data.triggerKeyCode) {
                that.shoot();
            }
        };
    },

    shoot: function() {
        if (AFRAME.scenes[0].systems.state.state.haveBall) {
            this.createBullet();
            AFRAME.scenes[0].emit('throwBall');
        }
        if (AFRAME.scenes[0].systems.state.state.canShoot) {
            AFRAME.scenes[0].emit('shootBall');
        }
    },

    createBullet: function() {
        var el = document.createElement('a-entity');
        el.setAttribute('networked', 'template:' + this.data.bulletTemplate);
        //el.setAttribute('remove-in-seconds', 3);
        //el.setAttribute('forward', 'speed: 0.3');
        el.setAttribute('dynamic-body', '');

        var tip = document.querySelector('#player');
        el.setAttribute('position', this.getInitialBulletPosition(tip));
        el.setAttribute('rotation', this.getInitialBulletRotation(tip));

        var scene = document.querySelector('a-scene');
        scene.appendChild(el);

        //REFACTOR: Timeout added to avoid race-condition - el.body needs a tick to be created
        setTimeout(function() {
            var worldPos = new THREE.Vector3();
            worldPos.setFromMatrixPosition(el.object3D.matrixWorld);
            var dist = 30;
            var inFront = new THREE.Vector3(0, dist / 2, -dist);
            inFront.applyQuaternion(el.object3D.quaternion);
            worldPos.add(inFront);

            el.body.applyImpulse(new CANNON.Vec3().copy(worldPos), new CANNON.Vec3().copy(tip.object3D.position));
        }, 100);
    },

    getInitialBulletPosition: function(spawnerEl) {
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);

        var dist = 1;
        var inFront = new THREE.Vector3(0, 0, -dist);
        inFront.applyQuaternion(spawnerEl.object3D.quaternion);

        worldPos.add(inFront);

        return worldPos;
    },

    getInitialBulletRotation: function(spawnerEl) {
        var worldDirection = new THREE.Vector3();

        spawnerEl.object3D.getWorldDirection(worldDirection);
        worldDirection.multiplyScalar(-1);
        this.vec3RadToDeg(worldDirection);

        return worldDirection;
    },

    vec3RadToDeg: function(rad) {
        rad.set(rad.y * 90, -90 + -THREE.MathUtils.radToDeg(Math.atan2(rad.z, rad.x)), 0);
    },
});

const initialState = {
    connectionStatus: 'disconnected',
    haveBall: true,
    canShoot: false,
    redScore: 0,
    blueScore: 0,
};

const handlers = {
    redGoal(scene, action) {
        scene.state.redScore++;
        console.log('red goal ' + scene.state.redScore, action);

        var goalElement = document.querySelector('#red-goal');
        goalElement.setAttribute('material', 'color: green');

        setTimeout(function() {
            goalElement.setAttribute('material', 'color: red');
        }, 150);
    },
    blueGoal(scene, action) {
        scene.state.blueScore++;
        console.log('blue goal ' + scene.state.blueScore, action);

        var goalElement = document.querySelector('#blue-goal');
        goalElement.setAttribute('material', 'color: green');

        setTimeout(function() {
            goalElement.setAttribute('material', 'color: blue');
        }, 150);
    },
    shootBall(scene) {
        scene.state.canShoot = false;

        var playerElement = document.querySelector('#player');
        var el = playerElement.components['super-hands'].state.get('grab-start');

        //Drop object
        playerElement.components['super-hands'].onGrabEndButton();

        //Shot calculation
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(playerElement.object3D.matrixWorld);
        var dist = 30;
        var inFront = new THREE.Vector3(0, dist / 2, -dist);
        inFront.applyQuaternion(playerElement.object3D.quaternion);
        worldPos.add(inFront);

        el.body.applyImpulse(new CANNON.Vec3().copy(worldPos), new CANNON.Vec3().copy(playerElement.object3D.position));
    },
    throwBall(scene) {
        scene.state.haveBall = false;
        scene.state.canShoot = false;
        //document.querySelector('#player').components.networked.syncAll();
        //document.querySelector('#player').getElementsByClassName("ball")[0].components.material.data.visible = false;
    },
    grabBall(scene, action) {
        console.log('grabbing ball...', action.element);

        /*
      if (action.element.getAttribute('dynamic-body')) {
        action.element.removeAttribute('dynamic-body');
      }
      */
        //scene.state.currentBallId = action.element.id

        //scene.state.haveBall = true;

        //document.querySelector('#player').getElementsByClassName("ball")[0].components.material.data.visible = true;

        if (action.element.components.networked.isMine()) {
            scene.state.canShoot = true;

            var playerElement = document.querySelector('#player');

            //Calculate placement in front of player
            var worldPos = new THREE.Vector3();
            worldPos.setFromMatrixPosition(playerElement.object3D.matrixWorld);

            var dist = 1;
            var inFront = new THREE.Vector3(0, 0, -dist);
            inFront.applyQuaternion(playerElement.object3D.quaternion);

            worldPos.add(inFront);

            //Need to apply to physics body, since physics is overriding position
            action.element.body.position = new CANNON.Vec3().copy(worldPos);
        } else {
            action.element.components.networked.lastOwnerTime = NAF.connection.getServerTime();
            setTimeout(function() {
                scene.state.canShoot = true;
                NAF.utils.takeOwnership(action.element);
            }, 500);
        }
    },
    joinRoom(scene) {
        if (scene.state.connectionStatus != 'disconnected') {
            return;
        }
        scene.state.connectionStatus = 'connecting';

        //Add user avatar template to assets
        //document.head.appendChild(template);
        //Create template element
        //Create entity
        //Add geometry attribute to entity
        //Make entity a child of template
        //Append template to a-assets
        document.getElementsByTagName('a-assets')[0].insertAdjacentHTML(
            'afterbegin',
            `
        <template id="bullet-template">
          <a-entity class="bullet"
            geometry="primitive: sphere;"
            scale="0.4 0.4 0.4"
            color="#fff"
            raycastable
            hoverable grabbable stretchable draggable droppable
            grab-ball
          ></a-entity>
        </template>
        <template id="avatar-template">
          <a-entity geometry="primitive: sphere" scale="0.45 0.5 0.4">
            <a-entity class="face"
            position="0 0.05 -1"
            >
              <a-entity geometry="primitive: sphere" class="eye"
              material="color: #efefef"
              position="0.16 0.1 -0.35"
              scale="0.12 0.12 0.12"
              >
                <a-entity geometry="primitive: sphere" class="pupil"
                  material="color: #000"
                  position="0 0 -1"
                  scale="0.2 0.2 0.2"
                ></a-entity>
            </a-entity>
            <a-entity geometry="primitive: sphere" class="eye"
              material="color: #efefef" 
              position="-0.16 0.1 -0.35"
              scale="0.12 0.12 0.12"
              >
                <a-entity geometry="primitive: sphere" class="pupil"
                  material="color: #000"
                  position="0 0 -1"
                  scale="0.2 0.2 0.2"
                ></a-entity>
            </a-entity>
          </a-entity>
        </template>
`
        );

        //Add defined avatar to NAF schemas
        NAF.schemas.add({
            template: '#avatar-template',
            components: [
                'position',
                'rotation',
                {
                    selector: '.ball',
                    component: 'material',
                },
            ],
        });

        NAF.schemas.add({
            template: '#bullet-template',
            components: ['position', 'rotation'],
        });

        //Connect to room
        AFRAME.scenes[0].emit('connect');
    },
};

const recaptchaScript = document.createElement('script');
recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js');
document.head.appendChild(recaptchaScript);

export { initialState, handlers };
