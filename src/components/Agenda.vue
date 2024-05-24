<template>
    <section class="todoapp">
        <v-tabs v-model="tab">
            <v-tab>Todo</v-tab>
            <v-tab>Agenda</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <v-list>
                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>mdi-plus</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-text-field
                                id="newTodo"
                                v-model="newTodo"
                                autofocus
                                clearable
                                name="newTodo"
                                placeholder="What needs to be done?"
                                @keyup.enter="addTodo"
                            />
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider />

                    <v-list class="todo-container">
                        <v-list-item
                            v-for="todo in currentTodos"
                            :key="todo.id"
                        >
                            <v-list-item-action>
                                <v-checkbox
                                    v-model="todo.completed"
                                    @change="todoCompleted(todo)"
                                />
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-text-field
                                    :value="todo.title"
                                    @change="editTodo(todo, $event)"
                                >
                                    <v-icon
                                        slot="append"
                                        @click="removeTodo(todo)"
                                    >
                                        mdi-close
                                    </v-icon>
                                </v-text-field>
                            </v-list-item-content>
                            <v-list-item-action-text>
                                <Countdown-Timer
                                    :timer-data="todo.timerData"
                                    @timer-updated="onTimerUpdated"
                                />
                            </v-list-item-action-text>
                        </v-list-item>
                        <v-icon
                            v-if="currentTodos.length === 0"
                            color="grey lighten-3"
                            class="empty-list-icon"
                        >
                            mdi-circle-edit-outline
                        </v-icon>
                    </v-list>
                </v-list>
            </v-tab-item>
            <v-tab-item>
                <v-stepper
                    v-model="currentStep"
                    vertical
                >
                    <div
                        v-for="(todo, index) in currentTodos"
                        :key="todo.id"
                    >
                        <v-stepper-step
                            :step="index + 1"
                            :complete="currentStep > index+1"
                        >
                            {{ todo.title }}
                        </v-stepper-step>
                        <v-stepper-content :step="index + 1">
                            <Countdown-Timer
                                :timer-data="todo.timerData"
                                @timer-updated="onTimerUpdated"
                            />
                            <v-divider />
                            <v-card
                                color="grey lighten-3"
                                class="mb-12"
                                height="200px"
                            >
                                {{ todo.title }}
                            </v-card>
                            <v-btn
                                color="primary"
                                @click="currentStep++"
                            >
                                Continue
                            </v-btn>
                            <v-btn text>
                                Cancel
                            </v-btn>
                        </v-stepper-content>
                    </div>
                </v-stepper>
            </v-tab-item>
        </v-tabs-items>
    </section>
</template>
<script>
import * as UUID from 'uuid/v4';
import CountdownTimer from '@/components/CountdownTimer.vue';

/* eslint-disable */
// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// app Vue instance
export default{
    props: {
        todos: {
            type: Array,
            default: function() {
                return [];
            }
        },
        onTodosUpdated: {
            type: Function,
            default: function() {

            }
        },
        onUpdateTodo: {
            type: Function,
            default: function() {

            }
        },
        onRemoveTodo: {
            type: Function,
            default: function() {

            }
        },
        onAddTodo: {
            type: Function,
            default: function() {

            }
        }
    },
    
    components: {
        CountdownTimer
    },
    // app initial state
    data() {
      return {
          currentTodos: this.todos,
          newTodo: '',
          currentStep: 1,
          tab: null,
      }
    },

    // watch todos change for localStorage persistence
    watch: {
        todos:  {
            handler(todos) {
                this.currentTodos = todos;
            },
            deep: true,
        },
        currentTodos: {
            handler(todos) {
                if (this.currentTodos !== this.todos) {
                    this.onTodosUpdated(this.currentTodos);
                }
            },
            deep: true,
        },
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        onTimerUpdated() {
            this.onTodosUpdated(this.currentTodos);
        },

        addTodo() {
            const value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.onAddTodo({
                id: UUID(),
                title: value,
                completed: false,
                timerData: {
                        active : false,
                        startTime: new Date(),
                        duration: 5,
                    }
            });
            this.newTodo = '';
        },

        removeTodo(todo) {
            this.onRemoveTodo(todo);
        },

        todoCompleted(todo) {
            this.onUpdateTodo(todo);
        },

        editTodo(todo, newValue) {
            if (newValue && newValue.length) {
                const updatedTodo = _.extend({}, todo, {title: newValue});
                this.onUpdateTodo(updatedTodo);
            } else {
                this.removeTodo(todo);
            }
        },
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus();
            }
        },
    },
};
</script>

<style>
.todoapp .v-text-field > .v-input__control > .v-input__slot:before {
    border-style: none;
}
.todoapp .todo-container {
    position:relative;
    height: 400px;
    overflow: auto;
}
.todoapp .empty-list-icon {
    position: absolute;
    font-size: 300px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
}
</style>