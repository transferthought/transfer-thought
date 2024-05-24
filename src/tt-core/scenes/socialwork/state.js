/* eslint-disable */

import * as AFRAME from 'aframe';
import * as _ from 'lodash';

const initialState = {
    characters: {
        Jo: {
            hasTalked: false,
            clip: 'sit',
            currentDialogIndex: 0,
            dialogueCount: 4,
            currentDialogue: '#JoAudio1',
        },
        Ria: {
            hasTalked: false,
            clip: 'sit',
            currentDialogIndex: 0,
            dialogueCount: 3,
            currentDialogue: '#RiaAudio1',
        },
        Dason: {
            hasTalked: false,
            clip: 'sit',
            currentDialogIndex: 0,
            dialogueCount: 2,
            currentDialogue: '#DasonAudio1',

        },
        Major: {
            hasTalked: false,
            clip: 'sit',
            currentDialogIndex: 0,
            dialogueCount: 3,
            currentDialogue: '#MajorAudio1',
        },
        Narrator: {
            hasTalked: true,
            currentDialogIndex: 0,
        },
    },
    subClipDefinitions: {
        male: [
            { name: 'idle', begin: 520, end: 640 },
            { name: 'sit', begin: 2659, end: 2850 },
            { name: 'talk', begin: 1030, end: 1300 },
            { name: 'talk2', begin: 1300, end: 1600 },
            { name: 'walk', begin: 1, end: 35 },
        ],
        female: [
            { name: 'idle', begin: 565, end: 665 },
            { name: 'sit', begin: 1990, end: 2090 },
            { name: 'talk', begin: 1075, end: 1345 },
            { name: 'talk2', begin: 1350, end: 1550 },
            { name: 'talk3', begin: 1551, end: 1730 },
            { name: 'walk', begin: 1, end: 40 },
        ],
    },
    characterSelected: 'Jo',
    clip: 'idle',
    step: 'INTRO',
    environment: 'forest',
    forceListenToIntro: false,
};


const allCharactersTalked = function (state) {
    console.log('CHECKING IF ALL CHARACTERS TALKED');
    console.log(state);
    return _.every(state.characters, character => character.hasTalked);
};

const handlers = {
    start(scene) {
        const state = scene.state;
        const entity = document.querySelector('#Narrator');
        function introEnded() {
            state.step = 'SELECT_CHARACTER';
            entity.removeEventListener('sound-ended', introEnded);
        }
        scene.session.log('Start');
        const soundName = '#NarratorAudio1';
        state.characters.Narrator.currentDialogue = soundName;
        entity.components.sound.playSound();

        if (state.forceListenToIntro) {
            entity.addEventListener('sound-ended', introEnded);
        } else {
            state.step = 'SELECT_CHARACTER';
        }
    },
    round2Ended(scene) {
        const state = scene.state;
        scene.session.log('RoundTwoFinished');
        state.step = 'FINAL_SCORE';
        const soundName = '#NarratorAudio4';
        state.characters.Narrator.currentDialogue = soundName;
        const entity = document.querySelector('#Narrator');
        entity.components.sound.init();
        entity.components.sound.playSound();
    },
    concludeConversation(scene) {
        const state = scene.state;
        console.log(`Concluding Conversation with ${state.characterSelected}`);
        state.characters[state.characterSelected].hasTalked = true;
        state.characters[state.characterSelected].clip = 'sit';
        state.step = 'SELECT_CHARACTER';
        if (allCharactersTalked(state)) {
            scene.session.log('RoundOneFinished');
            console.log('ALL CHARACTERS TALKED!');
            state.step = 'ROUND_2';
            state.characters.Narrator.currentDialogIndex += 1;
            const soundName = '#NarratorAudio2';
            state.characters.Narrator.currentDialogue = soundName;
            const entity = document.querySelector('#Narrator');
            entity.components.sound.init();
            entity.components.sound.playSound();
        }
    },
    personSelected(scene, action) {
        const state = scene.state;
        function roundTwoEnded(entity) {
            AFRAME.scenes[0].emit('round2Ended');
            entity.removeEventListener('sound-ended', roundTwoEnded);
        }
        scene.session.log('PersonSelected', {
            person: action.character,
            step: state.step
        });
        if (state.step === 'ROUND_2') {
            const narratorEntity = document.querySelector('#Narrator');

            narratorEntity.addEventListener('sound-ended', () => roundTwoEnded(narratorEntity));

            state.step = 'GAME_OVER';
            const soundName = '#NarratorAudio3';
            state.characters.Narrator.currentDialogue = soundName;
            narratorEntity.components.sound.init();
            narratorEntity.components.sound.playSound();

            state.characterSelected = action.character;
            const characterEntity = document.querySelector(`#${state.characterSelected}`);
            state.characters[state.characterSelected].clip = 'walk';
            characterEntity.components.animation__position.beginAnimation();
            characterEntity.components.animation__rotation.beginAnimation();
        } else {
            state.clip = 'idle';
            state.step = 'CHARACTER_SELECTED';
            state.characterSelected = action.character;
            const characterSelectedEntity = document.querySelector(`#${state.characterSelected}`);

            const soundName = `#${state.characterSelected}Audio${state.characters[state.characterSelected].currentDialogIndex + 1}`;
            state.characters[state.characterSelected].currentDialogue = soundName;

            characterSelectedEntity.components.sound.playSound();

            const narratorEntity = document.querySelector('#Narrator');
            narratorEntity.components.sound.stopSound();

            state.characters[state.characterSelected].clip = 'idle';
        }
    },
    moveOn(scene) {
        const state = scene.state;
        state.clip = 'sit';
        state.step = 'SELECT_CHARACTER';
        state.characters[state.characterSelected].currentDialogIndex = 0;
        state.characters[state.characterSelected].clip = 'sit';

        AFRAME.scenes[0].emit('concludeConversation');
    },
    tellMeMore(scene) {
        const state = scene.state;
        state.clip = 'talk2';
        state.characters[state.characterSelected].clip = 'talk';

        const entity = document.querySelector(`#${state.characterSelected}`);
        entity.components.sound.stopSound();

        state.characters[state.characterSelected].currentDialogIndex += 1;
        const soundName = `#${state.characterSelected}Audio${state.characters[state.characterSelected].currentDialogIndex + 1}`;
        state.characters[state.characterSelected].currentDialogue = soundName;

        entity.components.sound.init();

        entity.components.sound.playSound();

        if (state.characters[state.characterSelected].currentDialogIndex + 1
            >= state.characters[state.characterSelected].dialogueCount) {
            AFRAME.scenes[0].emit('concludeConversation');
        }
    },
    changeClip(scene, action) {
        const state = scene.state;
        state.clip = action.clip;
    },
};

export {
    initialState,
    handlers,
};
