<template>
    <span>
        <v-expansion-panels :value="selectedQuestionIndex" focusable color="primary" accordion flat @change="handleSelectedQuestionChanged">
            <QuestionItemContainer v-for="(question, index) in questions" :key="question.id" :question-data="question" :question-index="index" />
        </v-expansion-panels>
        <v-list-item>
            <v-list-item-content>
                <v-btn text small color="primary" @click="addQuestion">
                    <v-icon left dark>mdi-plus</v-icon>
                    Add Question
                </v-btn>
            </v-list-item-content>
        </v-list-item>
    </span>
</template>
<script>
/* eslint-disable no-undef */
import * as UUID from 'uuid/v4';
import { TransformControls } from '@/tt-core/components/position-control';
import { mapState } from 'vuex';
import QuestionItemContainer from './QuestionItemContainer.vue';

export default {
    name: 'QuestionListContainer',
    components: {
        QuestionItemContainer,
    },
    data() {
        return {
            distanceFromCamera: 2,
        };
    },
    mounted() {
        this.handleQuestionTitleChanged = _.debounce(this.handleQuestionTitleChanged, 500);
        this.handleOptionValueChanged = _.debounce(this.handleOptionValueChanged, 500);
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
        selectedQuestionIndex() {
            try {
                return this.$store.state.apps.state.state.currentQuestionIndex;
            } catch {
                return null;
            }
        },
        questions() {
            try {
                return this.$store.state.apps.state.state.questions;
            } catch {
                return [];
            }
        },
        selectedQuestion() {
            try {
                return this.questions[this.selectedQuestionIndex];
            } catch {
                return [];
            }
        },
    },
    methods: {
        async addQuestion() {
            const camera = document.getElementById('camera');
            const position = new THREE.Vector3(0, 0, -this.distanceFromCamera);
            position.applyQuaternion(camera.object3D.quaternion);
            const newQuestion = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                title: 'New Question',
                type: 'MULTIPLE_CHOICE',
                options: [
                    {
                        id: `TT_${UUID().replace(/-/g, '')}`,
                        value: 'New Option',
                    },
                ],
            };
            await this.$store.dispatch('apps/state/insert', {
                selector: 'questions',
                value: newQuestion,
            });
        },
        async deleteQuestion(question) {
            const questions = _.reject(this.questions, question);
            await this.$store.dispatch('apps/state/update', {
                selector: 'questions',
                value: questions,
            });
        },
        handleQuestionTitleChanged(newTitle) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.selectedQuestionIndex}].title`,
                value: newTitle,
            });
        },
        async addOption() {
            const newOption = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                value: 'New Option',
            };
            await this.$store.dispatch('apps/state/insert', {
                selector: `questions[${this.selectedQuestionIndex}].options`,
                value: newOption,
            });
        },
        async deleteOption(option) {
            const options = _.reject(this.selectedQuestion.options, option);
            await this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.selectedQuestionIndex}].options`,
                value: options,
            });
        },
        handleOptionValueChanged(optionIndex, newValue) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.selectedQuestionIndex}].options[${optionIndex}].value`,
                value: newValue,
            });
        },
        handleSelectedQuestionChanged(selectedIndex) {
            this.$store.dispatch('apps/state/update', {
                selector: 'currentQuestionIndex',
                value: selectedIndex === undefined ? null : selectedIndex, // dont use undefined because it breaks change detection
            });
        },
        handlePositionUpdate(optionIndex, newValue) {
            this.$store.dispatch('apps/state/update', {
                selector: `questions[${this.selectedQuestionIndex}].options[${optionIndex}].position`,
                value: newValue,
            });
        },
    },
    watch: {
        'app.scene': {
            handler() {
                if (this.app.scene) {
                    const positionGizmo = new TransformControls(this.app.scene.el.camera, this.app.scene.el.renderer.domElement);
                    this.app.scene.el.object3D.positionGizmo = positionGizmo;
                    this.app.scene.el.object3D.add(positionGizmo);
                    positionGizmo.setSnapDistanceToCamera(this.distanceFromCamera);
                    this.app.scene.el.addEventListener('click', (e) => {
                        if (e.target && e.target.classList.contains('hotspot')) {
                            this.app.scene.el.object3D.positionGizmo.attach(e.target.object3D);
                        }
                    });

                    const self = this;
                    positionGizmo.addEventListener('mouseUp', (event) => {
                        const hotspotId = event.target.object.el.id;
                        const optionIndex = _.findIndex(self.selectedQuestion.options, { id: hotspotId });
                        if (optionIndex > -1) {
                            const newPostion = {
                                x: event.target.object.position.x,
                                y: event.target.object.position.y,
                                z: event.target.object.position.z,
                            };
                            self.handlePositionUpdate(optionIndex, newPostion);
                        }
                    });
                }
            },
        },
    },
};
</script>

<style scoped></style>
