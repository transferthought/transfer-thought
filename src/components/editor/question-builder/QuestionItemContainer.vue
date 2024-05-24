<template>
    <v-expansion-panel>
        <v-expansion-panel-header>
            <template v-slot:default="{}">
                <v-list-item class="pa-0 component-item">
                    <v-list-item-content class="pa-0 ">
                        <v-list-item-title>
                            {{ questionData.title }}
                        </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon x-small class="float-right ma-0">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn icon small v-on="on">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="deleteQuestion(questionData)">
                                    <v-list-item-icon>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Delete Question</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item-icon>
                </v-list-item>
            </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="card-padding">
            <label class="label-color font-weight-600 mb-2 d-block">Title</label>
            <v-text-field outlined class="input-style font-size-input" :value="questionData.title" @input="handleQuestionTitleChanged" />
            <label class="label-color font-weight-600 mb-2 d-block">Type</label>
            <v-autocomplete
                :items="questionTypes"
                :value="questionData.type"
                required
                outlined
                class="input-style font-size-input"
                @input="handleQuestionTypeChanged"
            />
            <component :is="questionData.type" :question-data="questionData" :question-index="questionIndex" />
        </v-expansion-panel-content>
        <v-divider class="ma-0" />
    </v-expansion-panel>
</template>
<script>
import _ from 'lodash';
import MultipleChoice from './MultipleChoice.vue';
import Hotspot from './Hotspot.vue';

export default {
    name: 'QuestionListContainer',
    components: {
        MULTIPLE_CHOICE: MultipleChoice,
        HOTSPOT: Hotspot,
    },
    props: {
        questionData: Object,
        questionIndex: Number,
    },
    data() {
        return {
            questionTypes: [
                {
                    text: 'Multiple Choice',
                    value: 'MULTIPLE_CHOICE',
                },
                {
                    text: 'Hotspot',
                    value: 'HOTSPOT',
                },
            ],
        };
    },
    mounted() {
        this.handleQuestionTitleChanged = _.debounce(this.handleQuestionTitleChanged, 500);
    },
    methods: {
        handleQuestionTitleChanged(newTitle) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.questionIndex}].title`,
                value: newTitle,
            });
        },
        handleQuestionTypeChanged(newType) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.questionIndex}].type`,
                value: newType,
            });
        },
        deleteQuestion() {
            const { questions } = this.$store.state.apps.state.state;
            questions.splice(this.questionIndex, 1);
            this.$store.dispatch('apps/state/update', {
                selector: 'questions',
                value: questions,
            });
        },
    },
};
</script>

<style scoped></style>
