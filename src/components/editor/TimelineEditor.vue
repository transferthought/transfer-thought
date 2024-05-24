<template>
    <v-row class="fill-height">
        <v-container>
            <v-row class="controls-row">
                <v-col cols="1">
                    <v-btn v-if="!options.play" icon @click="options.play = true">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                    <v-btn v-if="options.play" icon @click="options.play = false">
                        <v-icon>mdi-stop</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-slider v-model="options.times.timeZoom" max="10" min="1" />
                </v-col>
                <v-col cols="1">
                    <v-switch v-model="selectTrackFromComponent" />
                </v-col>
                <v-col v-if="selectTrackFromComponent" cols="3">
                    <ComponentIdInput
                        :input-definition="{ nane: 'qwe' }"
                        :current-value="selectedComponentId"
                        :on-value-changed="handleComponentChanged"
                        :entity-id="selectedEntityId"
                    />
                </v-col>
                <v-col cols="1">
                    <v-btn icon @click="addLayer">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-col>
                <v-col v-if="selectedLayer && selectedValue" cols="3">
                    <v-btn icon @click="deleteValue(selectedLayer, selectedValue)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <LayerValueEditor :layer="selectedLayer" :value="selectedValue" />
                </v-col>
            </v-row>
        </v-container>
        <GanttElastic :tasks="rawLayers" :options="options" :dynamic-style="dynamicStyle" />
    </v-row>
</template>

<script>
import _ from 'lodash';
import GanttElastic from '@/libs/timeline/GanttElastic.vue';
import ComponentIdInput from '@/components/editor/input-controllers/ComponentIdInput.vue';
import TimelineService from '@/services/timeline-service';
import LayerValueEditor from '@/components/editor/LayerValueEditor.vue';

const UUID = require('uuid/v4');

const COMPONENT_TYPES_TO_LAYER_TYPES = {
    sound: 'audio',
    'animation-mixer': 'animation',
};
const TimelineEditor = {
    name: 'TimelineEditor',
    components: {
        GanttElastic,
        ComponentIdInput,
        LayerValueEditor,
    },
    props: {
        selectedTimeline: Object,
    },
    data() {
        return {
            timeline: null,
            rawLayers: [],
            selectedLayer: null,
            selectedValue: null,
            selectedComponentId: null,
            selectTrackFromComponent: true,
            dynamicStyle: {
                'task-list-header-label': {
                    'font-weight': 'bold',
                },
            },
            options: {
                play: false,
                timelineCursor: 0,
                times: {
                    firstTime: 0,
                    timeZoom: 1,
                },
                maxRows: 100,
                title: {
                    label: 'Your project title as html (link or whatever...)',
                    html: false,
                },
                row: {
                    height: 24,
                },
                calendar: {
                    hour: {
                        display: true,
                    },
                },
                chart: {
                    progress: {
                        bar: false,
                    },
                    expander: {
                        display: true,
                    },
                    events: {
                        dblclick: this.handleChartDblClick.bind(this),
                        valueClick: this.handleValueClick.bind(this),
                    },
                },
                taskList: {
                    expander: {
                        straight: false,
                    },
                    columns: [
                        {
                            id: 0,
                            label: '',
                            html: true,
                            value: () => `<button type="button" class="v-btn v-btn--flat v-btn--icon v-btn--round v-size--default">
                            <span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mdi mdi-delete"></i></span></button>`,
                            width: 50,
                            events: {
                                click: this.handleDeleteRowClicked.bind(this),
                            },
                        },
                        {
                            id: 1,
                            label: 'ID',
                            value: 'id',
                            width: 40,
                        },
                        {
                            id: 2,
                            label: 'Description',
                            value: 'label',
                            width: 200,
                            expander: true,
                            html: true,
                        },
                        {
                            id: 4,
                            label: 'Type',
                            value: 'type',
                            width: 68,
                        },
                    ],
                },
            },
        };
    },
    computed: {
        timelines() {
            return this.$store.getters['apps/actions/timelinesList'];
        },
        selectedEntityId() {
            return this.$store.state.apps.selectedEntityId;
        },
        config() {
            return this.$store.state.apps.config.config;
        },
        selectedEntity() {
            return this.config[this.selectedEntityId];
        },
        selectedComponent() {
            return this.config[this.selectedComponentId];
        },
    },
    mounted() {
        this.updateTimeline = _.debounce(this.updateTimeline, 1000);
    },
    methods: {
        play() {
            this.timeline.play();
        },
        pause() {
            this.timeline.pause();
        },
        getLayer(layerId) {
            return _.find(this.rawLayers, (layer) => layer.id === layerId);
        },
        addLayer() {
            const newLayer = this.createLayer();
            this.rawLayers.push(newLayer);
        },
        createLayer() {
            let type = 'action';
            let label = 'Action Row';
            let id = UUID();
            if (this.selectTrackFromComponent) {
                id = this.selectedComponentId;
                type = COMPONENT_TYPES_TO_LAYER_TYPES[this.selectedComponent.componentType]
                    ? COMPONENT_TYPES_TO_LAYER_TYPES[this.selectedComponent.componentType]
                    : 'layer';
                label = `${this.selectedEntity.name} ${this.selectedComponent.componentType}`;
            }
            const layer = {
                id,
                label,
                type,
                values: [],
            };
            const newValue = this.createValue(layer, 0);
            if (newValue) {
                layer.values.push(newValue);
            }
            return layer;
        },
        deleteLayer(layer) {
            const rawLayerIndex = _.findIndex(this.rawLayers, (l) => l.id === layer.id);
            if (rawLayerIndex > -1) {
                this.rawLayers.splice(rawLayerIndex, 1);
            }
        },
        addValue(layer, time) {
            const newValue = this.createValue(layer, time);
            if (newValue) {
                layer.values.push(newValue);
            }
        },
        createValue(layer, time) {
            if (layer.type === 'action') {
                return {
                    time,
                    value: {
                        entityId: undefined,
                        action: undefined,
                    },
                };
            }

            const component = this.config[layer.id];
            if (component) {
                if (component.componentType === 'sound') {
                    let duration;
                    const entityEl = document.getElementById(component.entityId);
                    const audio = entityEl.components['tt-sound'];
                    if (audio) {
                        const audioDuration = audio.getDurationInSeconds();
                        if (audioDuration) {
                            duration = audio.getDurationInSeconds() * 1000;
                        }
                    }
                    return {
                        time,
                        duration,
                    };
                }

                if (component.componentType === 'animation-mixer') {
                    let duration;
                    const entityEl = document.getElementById(component.entityId);
                    const animation = entityEl.components['animation-mixer-new'];
                    if (animation) {
                        const animationDuration = animation.getDurationInSeconds();
                        if (animationDuration) {
                            duration = animationDuration * 1000;
                        }
                    }
                    return {
                        time,
                        duration,
                    };
                }
                return {
                    time,
                    value: _.cloneDeep(component.attributes),
                };
            }
            return null;
        },
        deleteValue(layer, value) {
            const rawLayer = _.find(this.rawLayers, (l) => l.id === layer.id);
            if (rawLayer) {
                const valueIndex = _.findIndex(rawLayer.values, (v) => v === value);
                rawLayer.values.splice(valueIndex, 1);
            }
        },
        addTimeline() {
            this.$store.dispatch('apps/actions/newAction', 'timeline');
        },
        updateTimeline() {
            const layers = _.map(this.rawLayers, (layer) => {
                const parsedLayer = _.pick(layer, ['id', 'label', 'type', 'values']);
                parsedLayer.values = _(parsedLayer.values)
                    .map((value) => _.pick(value, ['time', 'value', 'duration']))
                    .sortBy('time')
                    .value();
                return parsedLayer;
            });
            const partial = { layers };
            this.$store.dispatch('apps/actions/updateAction', { action: this.selectedTimeline, partial });
        },
        deleteTimeline(timeline) {
            this.$store.dispatch('apps/actions/deleteAction', timeline);
        },
        handleComponentChanged(property, newValue) {
            this.selectedComponentId = newValue;
        },
        handleChartDblClick(event) {
            const layer = this.rawLayers[event.task];
            this.addValue(layer, event.time);
        },
        handleValueClick(event) {
            const { task, value } = event;
            this.selectedLayer = task;
            this.selectedValue = value;
        },
        handleDeleteRowClicked(event) {
            const { data } = event;
            this.deleteLayer(data);
        },
    },
    watch: {
        selectedTimeline: {
            immediate: true,
            handler() {
                this.rawLayers = _.cloneDeep(this.selectedTimeline.layers);
                this.timeline = TimelineService.buildTimeline(this.selectedTimeline);
                this.timeline.seek(this.options.timelineCursor);
            },
        },
        rawLayers: {
            deep: true,
            handler() {
                this.updateTimeline();
                this.timeline = TimelineService.buildTimeline(this.selectedTimeline);
                this.timeline.seek(this.options.timelineCursor);
            },
        },
        'options.play': {
            handler() {
                if (this.options.play) {
                    this.play();
                } else {
                    this.pause();
                }
            },
        },
        'options.timelineCursor': {
            handler() {
                if (!this.options.play) {
                    this.timeline.seek(this.options.timelineCursor);
                }
            },
        },
    },
};

export default TimelineEditor;
</script>
<style>
.timeliner-container {
    position: fixed;
}
</style>
