export const UpdateComponent = {
    id: 'TT_UpdateComponent',
    name: 'UpdateComponent',
    type: 'default',
    code: `
        Store.dispatch('apps/config/updateComponent', {
            entityId: Entity.id,
            componentType: Arguments[0],
            attributes: Arguments[1],
        });
    `,
    argumentDefinitions: [
        {
            name: 'componentType',
            controller: 'BaseInput',
        },
        {
            name: 'attributes',
            controller: 'ObjectInput',
        },
    ],
};

export const Start = {
    id: 'StartSimulation',
    name: 'Start Simulation',
    type: 'default',
    code: `
        Store.dispatch('steps/start');
    `,
};

export const Play = {
    id: 'PlaySimulation',
    name: 'Play Simulation',
    type: 'default',
    code: `
        Store.commit('steps/setPause', false);
    `,
};

export const Pause = {
    id: 'PauseSimulation',
    name: 'Pause Simulation',
    type: 'default',
    code: `
        Store.commit('steps/setPause', true);
    `,
};

export const TogglePlay = {
    id: 'TogglePlaySimulation',
    name: 'Toggle Play Simulation',
    type: 'default',
    code: `
        Store.dispatch('steps/togglePause');
    `,
};

export const GoToNextStep = {
    id: 'GoToNextStep',
    name: 'Go to next step',
    type: 'default',
    code: `
        Store.dispatch('steps/next');
    `,
};

export const GoToPreviousStep = {
    id: 'GoToPreviousStep',
    name: 'Go to previous step',
    type: 'default',
    code: `
        Store.dispatch('steps/back');
    `,
};
export const GoToStep = {
    id: 'GoToStep',
    name: 'Go to selected step',
    type: 'default',
    code: `
        Store.dispatch('steps/gotToStepById', {stepId: Arguments[0]});
    `,
    argumentDefinitions: [
        {
            label: 'Select Step',
            name: 'stepId',
            controller: 'StepIdInput',
        },
    ],
};

export const SetState = {
    id: 'SetState',
    name: 'Update State',
    type: 'default',
    code: `
        Store.dispatch('apps/state/update', {selector: 'data.' + Arguments[0], value: Arguments[0]});
    `,
    argumentDefinitions: [
        {
            label: 'State Key',
            name: 'selector',
            controller: 'BaseInput',
        },
        {
            label: 'Value',
            name: 'value',
            controller: 'BaseInput',
        },
    ],
};

export const ShowEntity = {
    id: 'ShowEntity',
    name: 'Show Prop',
    type: 'default',
    code: `
        const el = document.getElementById(Arguments[0]);
        if (el) {
            el.setAttribute('visible', true);
        }
    `,
    argumentDefinitions: [
        {
            label: 'Select Prop',
            name: 'propId',
            controller: 'PropIdInput',
        },
    ],
};

export const HideEntity = {
    id: 'HideEntity',
    name: 'Hide Prop',
    type: 'default',
    code: `
        const el = document.getElementById(Arguments[0]);
        if (el) {
            el.setAttribute('visible', false);
        }
    `,
    argumentDefinitions: [
        {
            label: 'Select Prop',
            name: 'propId',
            controller: 'PropIdInput',
        },
    ],
};

export const PlaySound = {
    id: 'PlaySound',
    name: 'Play Sound',
    type: 'default',
    code: `
        const sound = new Utils.Howl({
            src: [Arguments[0]],
            html5: true
        });
        sound.play();
    `,
    argumentDefinitions: [
        {
            label: 'Select Audio Clip',
            name: 'audio',
            controller: 'AssetInput',
            data: () => {
                return {
                    title: 'Add Audio',
                    select: 'Select Audio',
                    views: ['TRANSFER_THOUGHT_ASSETS', 'TRANSCRIPT_VIEW'],
                    viewOptions: {
                        subFolder: 'audio',
                    },
                };
            },
        },
    ],
};

export const StopSound = {
    id: 'StopSound',
    name: 'Stop Sound',
    type: 'default',
    code: `
        const el = document.getElementById(Arguments[0]);
        if (el) {
            el.setAttribute('visible', false);
        }
    `,
};

export const PlayAction = {
    id: 'PlayAction',
    name: 'Play Action',
    type: 'default',
    code: `
        const parent = document.getElementById(Arguments[0]);
        const el = parent.children[0]
        if (el && el.components && el.components['animation-mixer-new']) {
            const animation = el.components['animation-mixer-new'];
            if (animation) {
                const currentAttrValue = animation.attrValue;
                el.setAttribute('animation-mixer-new', { animationSrc: Arguments[1], loop: Arguments[2] ? 'repeat' : 'once' });
                if (!animation.isRunning()) {
                    animation.playAction();
                }
    
                el.addEventListener('animation-finished',function() {
                    const entityDefaults = Store.state.apps.state.state.currentEnvironment.data.entities[Arguments[0]];
                    setTimeout(() => {
                        el.setAttribute('animation-mixer-new', { clip: entityDefaults.action, loop: 'repeat' });

                    },25);
                  }, {once:true});
            }
        }
    `,
    argumentDefinitions: [
        {
            label: 'Select Prop',
            name: 'propId',
            controller: 'PropIdInput',
        },
        {
            label: 'Select Action',
            name: 'actionId',
            controller: 'AssetInput',
            data: function(context) {
                console.log('CONTEXT', context);
                return {
                    title: 'Update Action',
                    select: 'Select Animation',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        thumbnailFileType: '.gif',
                        subFolder: 'avatars/Ready_Player_Me/animations',
                    },
                };
            },
        },
        {
            label: 'Loop',
            name: 'loop',
            controller: 'BooleanInput',
            default: true,
        },
    ],
};

export const StopAction = {
    id: 'StopAction',
    name: 'Stop Action',
    type: 'default',
    code: `
        const el = document.getElementById(Arguments[0]);
        if (el && el.components && el.components['animation-mixer-new']) {
            el.setAttribute('animation-mixer-new', { autoPlay: false });
        }
    `,
};

export const TwinLabAudioStart = {
    id: 'TwinLabAudioStart',
    name: 'TL Audio Start',
    type: 'default',
    code: `
    // find prop id
    // set animation
    // start moving mouth
    console.log("TwinLabAudioStart")

    const parent = document.getElementById(Arguments[0]);
    const el = parent.children[0]
    if (el && el.components && el.components['animation-mixer-new']) {
        const animation = el.components['animation-mixer-new'];
        if (animation) {
            Store.dispatch('steps/updateEntity', {
                entityId: Arguments[0],
                newData: { action: Arguments[1] },
            });
        }
    }
    `,
    argumentDefinitions: [
        {
            label: 'Select Prop',
            name: 'propId',
            controller: 'PropIdInput',
        },
        {
            label: 'Select Action',
            name: 'actionId',
            controller: 'AssetInput',
            data: function(context) {
                console.log('CONTEXT', context);
                return {
                    title: 'Update Action',
                    select: 'Select Animation',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        thumbnailFileType: '.gif',
                        subFolder: 'avatars/Ready_Player_Me/animations',
                    },
                };
            },
        },
        {
            label: 'Loop',
            name: 'loop',
            controller: 'BooleanInput',
            default: true,
        },
    ],
};

export const TwinLabAudioStop = {
    id: 'TwinLabAudioStop',
    name: 'TL Audio Stop',
    type: 'default',
    code: `
    Store.dispatch('steps/next');
    `,
    argumentDefinitions: [
        {
            label: 'Select Prop',
            name: 'propId',
            controller: 'PropIdInput',
        },
        {
            label: 'Select Action',
            name: 'actionId',
            controller: 'AssetInput',
            data: function(context) {
                console.log('CONTEXT', context);
                return {
                    title: 'Update Action',
                    select: 'Select Animation',
                    views: ['TRANSFER_THOUGHT_ASSETS'],
                    viewOptions: {
                        thumbnailFileType: '.gif',
                        subFolder: 'avatars/Ready_Player_Me/animations',
                    },
                };
            },
        },
    ],
};

export const ShowOverlay = {
    id: 'ShowOverlay',
    name: 'Show Overlay',
    type: 'default',
    code: `
        Store.dispatch('apps/state/update', {
            'selector': 'slots.overlay.src',
            'value': Arguments[0]
        });
    `,
    argumentDefinitions: [
        {
            name: 'Source',
            controller: 'AssetInput',
            data: () => {
                return {
                    title: 'Select Image',
                    select: 'Select Image',
                    views: ['TRANSFER_THOUGHT_ASSETS', 'EXPLORE', 'MY_ASSET_VIEW'],
                    viewOptions: {
                        subFolder: 'images',
                    },
                };
            },
        },
    ],
};

const DefaultActionsList = [
    Start,
    Play,
    Pause,
    TogglePlay,
    UpdateComponent,
    GoToNextStep,
    GoToPreviousStep,
    GoToStep,
    SetState,
    ShowEntity,
    HideEntity,
    PlaySound,
    StopSound,
    PlayAction,
    StopAction,
    ShowOverlay,
    TwinLabAudioStart,
    TwinLabAudioStop,
];

export default DefaultActionsList;
export const DefaultActionsMap = {};

DefaultActionsList.forEach((defaultAction) => {
    DefaultActionsMap[defaultAction.id] = defaultAction;
});
