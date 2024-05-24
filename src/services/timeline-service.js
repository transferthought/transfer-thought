/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import anime from 'animejs';
import TemplateFactory from '@/tt-core/services/Templates';
import * as UUID from 'uuid/v4';
import postal from 'postal';
// eslint-disable-next-line import/no-cycle
import ActionService from './action-service';

const { store } = window.TT;

const sceneChannel = postal.channel('scene');

const runningTimelines = {};

// TODO: this is a hack we can do better
const attributesWhitelist = ['x', 'y', 'z', 'opacity'];

function isAnimatable(attribute) {
    return _.includes(attributesWhitelist, attribute);
}

class Timeline {
    constructor(timelineData) {
        this.key = UUID();
        this.time = 0;
        this.targets = {};
        this.timelineData = timelineData;
        this.playbackRate = 1;
        this.lastUpdateTime = 0;
        this.playing = false;
        this.layers = timelineData.layers;
        this.animeTimeline = this.buildAnimeTimeline();
    }

    buildAnimeTimeline() {
        const animeTimeline = anime.timeline({
            targets: this.targets,
            autoplay: false,
            easing: 'linear',
            update: (anim) => {
                // if (anim.paused) { return; }
                const { currentTime } = anim;
                _.forEach(this.timelineData.layers, (layer) => {
                    if (layer.type === 'action') {
                        this.handleActionLayerUpdate(layer, currentTime);
                    } else if (layer.type === 'audio') {
                        this.handleAudioLayerUpdate(layer, currentTime);
                    } else if (layer.type === 'animation') {
                        this.handleAnimationLayerUpdate(layer, currentTime);
                    }
                });
                this.lastUpdateTime = currentTime;
            },
            change: () => {
                this.handleTargetChange();
            },
        });

        _.forEach(this.timelineData.layers, (layer) => {
            let previousValueDef = null;
            if (layer.type === 'layer') {
                _.forEach(layer.values, (valueDef) => {
                    const previousTime = previousValueDef ? previousValueDef.time : 0;
                    const duration = valueDef.time - previousTime;
                    _.forOwn(valueDef.value, (value, key) => {
                        const id = `${layer.id}.${key}`;
                        if (isAnimatable(key) && _.isUndefined(this.targets[id])) {
                            const component = store.state.apps.config.config[layer.id];
                            if (component) {
                                const entityEl = document.getElementById(component.entityId);
                                if (entityEl) {
                                    if (_.includes(['x', 'y', 'z'], key)) {
                                        this.targets[id] = entityEl.object3D[component.componentType][key];
                                    } else {
                                        const currentAttributes = entityEl.getAttribute(component.componentType);
                                        if (currentAttributes) {
                                            this.targets[id] = currentAttributes[key];
                                        }
                                    }
                                }
                            }
                        }
                        const template = TemplateFactory.buildTemplate(value);
                        const templateValue = template ? template.evaluate({ state: store.state.apps.state.state }) : value;
                        animeTimeline.add({ [id]: parseFloat(templateValue), duration }, previousTime);
                    });
                    previousValueDef = valueDef;
                });
            } else if (layer.type === 'audio' || layer.type === 'animation') {
                _.forEach(layer.values, (valueDef) => {
                    const time = valueDef.time / this.playbackRate;
                    const duration = valueDef.duration / this.playbackRate;
                    animeTimeline.add({ duration }, time);
                });
            } else if (layer.type === 'action') {
                _.forEach(layer.values, (valueDef) => {
                    const time = valueDef.time / this.playbackRate;
                    animeTimeline.add({}, time);
                });
            }
        });

        return animeTimeline;
    }

    handleTargetChange() {
        _.forOwn(this.targets, (value, id) => {
            if (id.indexOf('.') > -1) {
                const [componentId, attributeName] = id.split('.');
                if (isAnimatable(attributeName)) {
                    const component = store.state.apps.config.config[componentId];
                    if (component) {
                        const entityEl = document.getElementById(component.entityId);
                        if (entityEl) {
                            if (_.includes(['x', 'y', 'z'], attributeName)) {
                                if (component.componentType === 'rotation') {
                                    // eslint-disable-next-line no-undef
                                    entityEl.object3D[component.componentType][attributeName] = THREE.MathUtils.degToRad(value);
                                } else {
                                    entityEl.object3D[component.componentType][attributeName] = value;
                                }
                            } else {
                                entityEl.setAttribute(component.componentType, attributeName, value);
                            }
                        }
                    }
                }
            }
        });
    }

    handleActionLayerUpdate(layer, currentTime) {
        _.forEach(layer.values, (value) => {
            const valueTime = value.time / this.playbackRate;
            if (valueTime >= this.lastUpdateTime && valueTime < currentTime) {
                const attributes = value.value;
                if (attributes && attributes.action) {
                    ActionService.runAction(attributes.action, attributes);
                }
            }
        });
    }

    handleAudioLayerUpdate(layer, currentTime) {
        _.forEach(layer.values, (value) => {
            const startTime = value.time;
            const endTime = value.time + value.duration;
            if (startTime < currentTime && currentTime < endTime) {
                const component = store.state.apps.config.config[layer.id];
                const entityEl = document.getElementById(component.entityId);
                const audio = entityEl.components['tt-sound'];
                if (audio && audio.loaded && !audio.playing()) {
                    const offsetInSeconds = (currentTime - startTime) / 1000;
                    audio.setOffset(offsetInSeconds);
                    audio.playSound();
                    audio.setPlaybackRate(this.playbackRate);
                }
            }
        });
    }

    handleAnimationLayerUpdate(layer, currentTime) {
        _.forEach(layer.values, (value) => {
            const startTime = value.time;
            const endTime = value.time + value.duration;
            if (startTime < currentTime && currentTime < endTime) {
                const component = store.state.apps.config.config[layer.id];
                const entityEl = document.getElementById(component.entityId);
                const animation = entityEl.components['animation-mixer-new'];
                if (animation && !animation.isRunning()) {
                    const offsetInSeconds = (currentTime - startTime) / 1000;
                    animation.setOffset(offsetInSeconds);
                    animation.playAction();
                    animation.setPlaybackRate(this.playbackRate);
                }
            }
        });
    }

    seek(offset) {
        this.animeTimeline.seek(offset);
    }

    pause() {
        this.animeTimeline.pause();
        _.forEach(this.timelineData.layers, (layer) => {
            if (layer.type === 'audio') {
                const component = store.state.apps.config.config[layer.id];
                const entityEl = document.getElementById(component.entityId);
                const audio = entityEl.components['tt-sound'];
                if (audio) {
                    audio.stopSound();
                }
            } else if (layer.type === 'animation') {
                const component = store.state.apps.config.config[layer.id];
                const entityEl = document.getElementById(component.entityId);
                const animation = entityEl.components['animation-mixer-new'];
                if (animation) {
                    animation.pauseAction();
                }
            }
        });
        this.playing = false;
    }

    play() {
        this.playing = true;
    }

    tick(t, dt) {
        if (this.playing) {
            this.time += dt;
            this.animeTimeline.tick(this.time);
        }
    }
}

class TimelineService {
    static buildTimeline(timelineData) {
        const timeline = new Timeline(timelineData);
        runningTimelines[timeline.key] = timeline;
        return timeline;
    }

    static endAllTimelines() {
        _.forOwn(runningTimelines, (timeline, key) => {
            // NOTE: this may not completely garbage collect all timeline data.
            timeline.pause();
            delete runningTimelines[key];
        });
    }

    static handleTick(t, dt) {
        _.forOwn(runningTimelines, (timeline) => {
            timeline.tick(t, dt);
        });
    }
}
sceneChannel.subscribe('events.tick', ({ t, dt }) => {
    TimelineService.handleTick(t, dt);
});

export default TimelineService;
