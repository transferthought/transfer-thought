/* eslint-disable */
AFRAME.registerComponent('forward', {
    schema: {
        speed: { default: 0.1 },
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
    },
});

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
        this.createBullet();
    },

    createBullet: function() {
        var el = document.createElement('a-entity');
        el.setAttribute('networked', 'template:' + this.data.bulletTemplate);
        el.setAttribute('remove-in-seconds', 3);
        el.setAttribute('forward', 'speed: 0.3');

        var tip = document.querySelector('#player');
        el.setAttribute('position', this.getInitialBulletPosition(tip));
        el.setAttribute('rotation', this.getInitialBulletRotation(tip));

        var scene = document.querySelector('a-scene');
        scene.appendChild(el);
    },

    getInitialBulletPosition: function(spawnerEl) {
        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);
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

const initialState = {};

const handlers = {
    joinRoom(state) {
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
          scale="0.1 0.1 0.1"
          color="#fff"
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
                    selector: '.head',
                    component: 'material',
                    property: 'color',
                },
            ],
        });

        //Connect to room
        AFRAME.scenes[0].emit('connect');
    },
};

const recaptchaScript = document.createElement('script');
recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js');
document.head.appendChild(recaptchaScript);

export { initialState, handlers };
