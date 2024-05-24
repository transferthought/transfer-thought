/* eslint-disable import/no-cycle */
// import _ from 'lodash';
import _ from 'lodash';
import * as UUID from 'uuid/v4';
import {
    createMachine,
    interpret,
    send,
} from 'xstate';

const defaultStateMachine = {
    initial: 'intro',
    states: {
        intro: {
            entry: ['onIntroEntry'],
            always: 'in_progress',
        },
        in_progress: {
            entry: ['onInProgressEntry'],
            states: {},
            on: {},
        },
        validate: {
            always: [
                {
                    target: 'success',
                    cond: 'validateCurrentObjective',
                },
                { target: 'in_progress', actions: ['playFeedback'] },
            ],
        },
        success: {
            entry: ['onSuccessEntry'],
            after: {
                500: 'finished',
            },
        },
        finished: {
            type: 'final',
        },
    },
};
function isChildCompleted(children, id) {
    return !children[id];
}

class ObjectivesStateMachineService {
    static create(data, options) {
        const machine = _.isArray(data)
            ? ObjectivesStateMachineService.createGroup(data, options)
            : ObjectivesStateMachineService.createNode(data, options);

        return interpret(machine);
    }

    static createNode(node, options) {
        const stateMachineData = _.cloneDeep(defaultStateMachine);
        stateMachineData.id = node.id;
        stateMachineData.context = { id: stateMachineData.id };
        const inProgress = stateMachineData.states.in_progress;
        if (node.children && node.children.length) {
            const childOptions = _.extend({ ...options }, { type: node.type });
            inProgress.invoke = {
                src: ObjectivesStateMachineService.createGroup(node.children, childOptions),
                autoForward: true,
                onDone: {
                    target: 'success',
                },
            };
        }

        inProgress.on[node.id] = {
        // transition actions
            target: 'validate',
        };
        return createMachine(stateMachineData, _.pick(options, ['actions', 'services', 'guards']));
    }

    static createGroup(nodes, options = { type: 'linear' }) {
        if (options.type === 'linear') {
            return ObjectivesStateMachineService.createLinearGroup(nodes, options);
        }
        return ObjectivesStateMachineService.createParalellGroup(nodes, options);
    }

    static createLinearGroup(nodes, options) {
        const stateMachineData = _.cloneDeep(defaultStateMachine);
        stateMachineData.id = UUID();
        stateMachineData.context = { id: stateMachineData.id };
        const inProgress = stateMachineData.states.in_progress;
        _.forEach((nodes), (childNode, index) => {
            const nextObjective = nodes[index + 1];
            inProgress.states[childNode.id] = {
                invoke: {
                    id: childNode.id,
                    src: ObjectivesStateMachineService.createNode(childNode, options),
                    autoForward: true,
                    onDone: {
                        target: nextObjective ? nextObjective.id : `#${stateMachineData.id}.success`,
                        actions: (context, state) => {
                            console.log(context, state);
                        },
                    },
                },
            };
        });
        inProgress.initial = nodes[0].id;
        const linearFlowMachine = createMachine(stateMachineData, _.pick(options, ['actions', 'services', 'guards']));
        return linearFlowMachine;
    }

    static createParalellGroup(nodes, options = { paralellType: 'any' }) {
        const stateMachineData = _.cloneDeep(defaultStateMachine);
        stateMachineData.id = UUID();
        stateMachineData.context = { id: stateMachineData.id };
        const inProgress = stateMachineData.states.in_progress;

        _.forEach((nodes), (node) => {
            inProgress.type = 'parallel';
            inProgress.states[node.id] = {
                invoke: {
                    id: node.id,
                    src: ObjectivesStateMachineService.createNode(node, options),
                    autoForward: true,
                    onDone: {
                        actions: send('CHECK'),
                    },
                },
            };
        });
        inProgress.on.CHECK = {
            cond: (context, event, machine) => {
                const { children } = machine.state;
                if (options.paralellType === 'any') {
                    return _.some(nodes, (node) => isChildCompleted(children, node.id));
                }
                return _.every(nodes, (node) => isChildCompleted(children, node.id));
            },
            target: 'success',
        };
        const paralellFlowMachine = createMachine(stateMachineData, _.pick(options, ['actions', 'services', 'guards']));
        return paralellFlowMachine;
    }
}

export default ObjectivesStateMachineService;
