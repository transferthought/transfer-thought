<!--
/**
 * @fileoverview Chart component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <div class="gantt-elastic__chart" :style="{ ...root.style['chart'] }" ref="chart">
    <div
      class="gantt-elastic__chart-calendar-container"
      ref="chartCalendarContainer"
      :style="{
        ...root.style['chart-calendar-container'],
        height: root.state.options.calendar.height + 'px',
        'margin-bottom': root.state.options.calendar.gap + 'px'
      }"
    >
      <calendar></calendar>
    </div>
    <div
      class="gantt-elastic__chart-graph-container"
      ref="chartGraphContainer"
      :style="{
        ...root.style['chart-graph-container'],
        height: root.state.options.height - root.state.options.calendar.height + 'px'
      }"
    >
      <div
        :style="{
          ...root.style['chart-area'],
          width: root.state.options.width + 'px',
          height: root.state.options.rowsHeight + 'px'
        }"
      >
        <div
          class="gantt-elastic__chart-graph"
          ref="chartGraph"
          :style="{ ...root.style['chart-graph'], height: '100%' }"
        >
          <svg
            @dblclick="chartDblClick"
            class="gantt-elastic__chart-graph-svg"
            :style="{ ...root.style['chart-graph-svg'] }"
            ref="chartGraphSvg"
            x="0"
            y="0"
            :width="root.state.options.width + 'px'"
            :height="root.state.options.allVisibleTasksHeight + 'px'"
            xmlns="http://www.w3.org/2000/svg"
          >
            <days-highlight></days-highlight>
            <grid></grid>
            <dependency-lines :tasks="root.visibleTasks"></dependency-lines>
            <g
              class="gantt-elastic__chart-row-wrapper"
              :style="{ ...root.style['chart-row-wrapper'] }"
              v-for="task in root.visibleTasks"
              :task="task"
              :key="task.id"
            >
              <component :task="task" :is="getTaskType(task.type)"></component>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Grid from './Grid.vue';
import DaysHighlight from './DaysHighlight.vue';
import Calendar from '../Calendar/Calendar.vue';
import DependencyLines from './DependencyLines.vue';
import Task from './Row/Task.vue';
import Milestone from './Row/Milestone.vue';
import Project from './Row/Project.vue';
import Layer from './Row/Layer.vue';
import Audio from './Row/Audio.vue';
import Animation from './Row/Animation.vue';
import Action from './Row/Action.vue';
export default {
  name: 'Chart',
  components: {
    Grid,
    DependencyLines,
    Calendar,
    Task,
    Milestone,
    Project,
    Layer,
    Audio,
    Animation,
    Action,
    DaysHighlight
  },
  inject: ['root'],
  data() {
    return {
      moving: false
    };
  },
  /**
   * Mounted
   */
  mounted() {
    this.root.state.refs.chart = this.$refs.chart;
    this.root.state.refs.chartCalendarContainer = this.$refs.chartCalendarContainer;
    this.root.state.refs.chartGraphContainer = this.$refs.chartGraphContainer;
    this.root.state.refs.chartGraph = this.$refs.chartGraph;
    this.root.state.refs.chartGraphSvg = this.$refs.chartGraphSvg;
    this.root.$el.addEventListener('mousemove', (event) => {
      this.mouseMove(event);
    });
    this.root.$el.addEventListener('mouseup', (event) => {
      this.mouseUp(event);
    });
    this.root.$el.addEventListener('mouseleave', (event) => {
      this.mouseOut(event);
    });
  },

  methods: {
    getTaskType(type) {
      if (type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
      return '';
    },
    mouseUp(event, value) {
      this.root.visibleTasks.forEach((task) => {
        task.values.forEach((value) => {
          if (value.mouseDown) {
            value.mouseDown = false;
            value.time = this.root.pixelOffsetXToTime(value.x);
          }
        });
      });
    },
    mouseOut(event, value) {
      this.root.visibleTasks.forEach((task) => {
        task.values.forEach((value) => {
          if (value.mouseDown) {
            value.mouseDown = false;
            value.time = this.root.pixelOffsetXToTime(value.x);
          }
        });
      });
    },
    mouseMove(event) {
      this.root.visibleTasks.forEach((task) => {
        task.values.forEach((value) => {
          if (value.mouseDown) {
            const newValue = value.x + event.movementX;
            if (newValue > 0) {
              value.x = newValue;
              task.updates += 1;
            }
          }
        });
      });
    },
    chartDblClick(ev) {
      if (this.root.state.options.chart.events.dblclick) {
        const taskHeight = this.root.state.options.rowsHeight / this.root.visibleTasks.length;
        const event = {
          task: Math.floor(ev.offsetY / taskHeight),
          time: this.root.pixelOffsetXToTime(ev.offsetX)
        };
        this.root.state.options.chart.events.dblclick(event);
      }
    },
  },

  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      return `0 0 ${this.root.state.options.width} ${this.root.state.options.allVisibleTasksHeight}`;
    }
  }
};
</script>
