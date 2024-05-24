/* eslint-disable */


const initialState = {
};

const handlers = {
    joinRoom(state) {
        //Add user avatar template to assets
        //document.head.appendChild(template);
        //Create template element
        //Create entity
        //Add geometry attribute to entity
        //Make entity a child of template
        //Append template to a-assets
        document.getElementsByTagName('a-assets')[0].insertAdjacentHTML('afterbegin', `
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
        </template>`);
        //Add defined avatar to NAF schemas
        NAF.schemas.add({
            template: '#avatar-template',
            components: [
              'position',
              'rotation',
              {
                selector: '.head',
                component: 'material',
                property: 'color'
              }
            ]
          });

          //Connect to room
          AFRAME.scenes[0].emit('connect');

    },
};

const recaptchaScript = document.createElement('script');
recaptchaScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js');
document.head.appendChild(recaptchaScript);

export {
    initialState,
    handlers,
};
