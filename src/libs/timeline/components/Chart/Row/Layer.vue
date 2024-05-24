<!--
/**
 * @fileoverview Task component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <g
    class="gantt-elastic__chart-row-bar-wrapper gantt-elastic__chart-row-task-wrapper"
    :style="{
      ...root.style['chart-row-bar-wrapper'],
      ...root.style['chart-row-task-wrapper'],
      ...task.style['chart-row-bar-wrapper']
    }"
  >
    <svg v-for="(value, index) in task.values" v-bind:key="index"
      class="gantt-elastic__chart-row-bar gantt-elastic__chart-row-task"
      :style="{ ...root.style['chart-row-bar'], ...root.style['chart-row-task'], ...task.style['chart-row-bar'] }"
      :x="value.x"
      :y="task.y"
      :width="value.width"
      :height="task.height"
      @click="emitEvent('click', $event, value)"
      @mouseenter="emitEvent('mouseenter', $event, value)"
      @mouseover="emitEvent('mouseover', $event, value)"
      @mouseout="emitEvent('mouseout', $event, value)"
      @mousemove="emitEvent('mousemove', $event, value)"
      @mousedown="emitEvent('mousedown', $event, value)"
      @mouseup="emitEvent('mouseup', $event, value)"
      @mousewheel="emitEvent('mousewheel', $event, value)"
      @touchstart="emitEvent('touchstart', $event, value)"
      @touchmove="emitEvent('touchmove', $event, value)"
      @touchend="emitEvent('touchend', $event, value)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        fill="red"
        class="gantt-elastic__chart-row-bar-polygon gantt-elastic__chart-row-task-polygon"
        :cx="value.width/2" :cy="task.height/2" :r="radius"/>
    </svg>
  </g>
</template>

<script>
/* eslint-disable */
import ChartText from '../Text.vue';
import ProgressBar from '../ProgressBar.vue';
import Expander from '../../Expander.vue';
import taskMixin from './Task.mixin.js';
import _ from 'lodash';

const CLICK_THRESHOLD = 5;
export default {
  name: 'Layer',
  components: {
    ChartText,
    ProgressBar,
    Expander
  },
  inject: ['root'],
  props: ['task'],
  mixins: [taskMixin],
  data() {
    return {};
  },
  methods: {
    emitEvent(eventName, event, value) {
      if (eventName === 'mousedown') {
        this.valueMouseDown(event, value);
      } else if (eventName === 'mouseup') {
        this.valueMouseUp(event, value);
      }
    },
    valueMouseDown(event, value) {
      value.mouseDownX = value.x;
      value.mouseDown = true;
    },
    valueMouseUp(event, value) {
      if (Math.abs(value.x - value.mouseDownX) < CLICK_THRESHOLD) {
        if (this.root.state.options.chart.events.valueClick) {
          const event = {
            task: this.task,
            value,
          };
          this.root.state.options.chart.events.valueClick(event);
        }
      }
    }
  },
  computed: {
    radius() {
      return Math.min(this.task.updates + 5, 7);
    },
    clipPathId() {
      return 'gantt-elastic__task-clip-path-' + this.task.id;
    },
  }
};
</script>
