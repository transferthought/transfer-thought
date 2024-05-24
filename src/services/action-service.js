/* eslint-disable import/no-cycle */
import _ from 'lodash';
import * as UUID from 'uuid/v4';
import * as xstate from 'xstate';
import { Howl } from 'howler';
import * as Tone from 'tone';

import TextToSpeechService from '@/services/texttospeech-service';
import Coach from '@/services/coach-service';

import TimelineService from './timeline-service';
const { store } = window.TT;
const utils = {
    xstate,
    _,
    UUID,
    Howl,
    Tone,
    TextToSpeechService,
    Coach,
};

const ALL_RUNNING_TIMELINES = new Map();

class ActionService {
    static runAction(actionId, attributes, event) {
        if (_.includes(actionId, '.')) {
            const [entityId, componentType, functionName] = _.split(actionId, '.');
            return ActionService.runPassthroughAction(entityId, componentType, functionName);
        }
        const action = store.getters['apps/actions/getActionById'](actionId);
        if (action.type === 'custom' || action.type === 'default') {
            return ActionService.runCustomAction(action, attributes, event);
        }
        if (action.type === 'timeline') {
            return new Promise((resolve) => {
                const timeline = TimelineService.buildTimeline(action);
                timeline.play();
                if (!ALL_RUNNING_TIMELINES.has(action.id)) {
                    ALL_RUNNING_TIMELINES.set(action.id, new Set());
                }
                const runningTimelinesForId = ALL_RUNNING_TIMELINES.get(action.id);
                runningTimelinesForId.add(timeline);
                timeline.animeTimeline.finished.then(() => {
                    runningTimelinesForId.delete(timeline);
                    resolve();
                });
            });
        }
        return null;
    }

    static async runCustomAction(action, attributes, event) {
        const entityEl = attributes && attributes.entityId ? document.getElementById(attributes.entityId) : null;
        const Arguments = _.map(action.argumentDefinitions, (argument) => attributes[argument.name]);
        const actionCode = `async function newAction(Entity, Store, ActionService, Action, Arguments, Event, Utils){
                                ${action.code};
                            }
                            return newAction(Entity, Store, ActionService, Action, Arguments, Event, Utils);`;
        // eslint-disable-next-line no-new-func
        const handler = new Function('Entity', 'Store', 'ActionService', 'Action', 'Arguments', 'Event', 'Utils', actionCode);
        return handler(entityEl, store, ActionService, action, Arguments, event, utils);
    }

    static endAllActions() {
        ALL_RUNNING_TIMELINES.forEach((timelineSet) => {
            timelineSet.forEach((timeline) => {
                // NOTE: this may not completely garbage collect all timeline data.
                timeline.pause();
            });
        });
        ALL_RUNNING_TIMELINES.clear();
    }

    static runPassthroughAction(entityId, componentType, functionName) {
        const entityEl = document.getElementById(entityId);
        if (entityEl) {
            const component = entityEl.components[componentType];
            if (component && _.isFunction(component[functionName])) {
                component[functionName]();
            }
        }
    }

    /**
     * Gets the running action by the passed in id. Right now the only async action is a timelines
     */
    static getRunningTimelinesById(timelineId) {
        const runningTimelinesForId = ALL_RUNNING_TIMELINES.get(timelineId);
        if (runningTimelinesForId) {
            return Array.from(runningTimelinesForId);
        }

        return [];
    }
}

export default ActionService;
