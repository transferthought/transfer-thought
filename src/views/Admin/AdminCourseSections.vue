<template>
    <LMSLayout>
        <template v-slot:PageTitle>
            {{ course.title }}
        </template>

        <template v-slot:SubPages>
            <CourseNav />
        </template>

        <template v-slot:PageActions>
            <v-btn
                class="font-weight-600 text-h3 text-typo text-capitalize py-1 px-8 mx-2"
                depressed
                color="white"
                @click="preview"
            >
                Preview Course
            </v-btn>
            <v-btn
                class="font-weight-600 text-h3 text-capitalize py-1 px-4"
                depressed
                color="primary lighten-1"
                @click="addSection"
            >
                New Section
            </v-btn>
        </template>
        <template v-slot:default>
            <draggable
                :list="course.sections"
                handle=".handle"
                ghost-class="ghost"
                @change="handleSectionOrderChange"
            >
                <v-row
                    v-for="(section, sectionIndex) in course.sections"
                    :key="section.title"
                >
                    <v-col cols="12">
                        <v-card
                            class="card-shadow"
                            rounded
                        >
                            <v-row
                                no-gutters
                                class="card-header-padding card-border-bottom"
                            >
                                <v-hover v-slot="{ hover }">
                                    <v-col class="d-flex align-center">
                                        <v-list-item-icon class="handle mr-0">
                                            <v-icon>mdi-drag</v-icon>
                                        </v-list-item-icon>
                                        <ClickToEditTextInput
                                            :value="section.title"
                                            @change="handleSectionTitleChanged(sectionIndex, $event)"
                                        >
                                            <template v-slot:Display="{value}">
                                                <p class="font-weight-600 text-h3 text-typo mb-0">
                                                    {{ value }}
                                                </p>
                                            </template>
                                        </ClickToEditTextInput>
                                        <v-list-item-icon class="my-3">
                                            <v-btn
                                                v-show="hover"
                                                icon
                                                x-small
                                                @click="deleteSection(sectionIndex)"
                                            >
                                                <v-icon color="error">
                                                    mdi-delete
                                                </v-icon>
                                            </v-btn>
                                        </v-list-item-icon>
                                    </v-col>
                                </v-hover>
                            </v-row>

                            <v-list class="py-0 ml-4">
                                <draggable
                                    :list="section.lessons"
                                    handle=".handle"
                                    ghost-class="ghost"
                                    group="lessons"
                                    @change="handleLessonOrderChanged(sectionIndex)"
                                >
                                    <v-hover
                                        v-for="(lesson, lessonIndex) in section.lessons"
                                        v-slot="{ hover }"
                                        :key="lessonIndex"
                                    >
                                        <v-list-item>
                                            <v-list-item-icon class="handle mr-0">
                                                <v-icon v-if="hover">
                                                    mdi-drag
                                                </v-icon>
                                                <v-icon v-else>
                                                    {{ lessonTypes[lesson.type].icon }}
                                                </v-icon>
                                            </v-list-item-icon>
                                            <v-list-item-content>
                                                <v-list-item-title lass="text-typo text-h5 font-weight-600">
                                                    <ClickToEditTextInput
                                                        :value="lesson.title"
                                                        @change="handleLessonTitleChanged(sectionIndex, lessonIndex, $event)"
                                                    />
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-icon class="my-3">
                                                <v-btn
                                                    v-show="hover"
                                                    icon
                                                    x-small
                                                    @click="deleteLesson(sectionIndex, lessonIndex)"
                                                >
                                                    <v-icon color="error">
                                                        mdi-delete
                                                    </v-icon>
                                                </v-btn>
                                            </v-list-item-icon>

                                            <v-btn
                                                elevation="0"
                                                :ripple="false"
                                                class="font-weight-600 text-capitalize"
                                                small
                                                :to="'/course/' + $route.params.courseId + '/lesson/' + lesson.appId"
                                            >
                                                Edit
                                            </v-btn>
                                        </v-list-item>
                                    </v-hover>
                                </draggable>
                            </v-list>
                            <div class="card-header-padding text-center">
                                <LessonTypeSelection @lesson-type-selected="addLesson(sectionIndex, $event)" />
                                <ImportLessonSelection
                                    :default-course-id="courseId"
                                    @lesson-selected="importLesson(sectionIndex, $event)"
                                />
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </draggable>

            <ConfirmDialog ref="confirm" />
        </template>
    </LMSLayout>
</template>

<script>
import draggable from 'vuedraggable';
import LMSLayout from '@/components/lms/LMSLayout.vue';
import CourseNav from '@/components/lms/Admin/CourseNav.vue';
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import LessonTypeSelection from '@/components/lms/Admin/LessonTypeSelection.vue';
import ImportLessonSelection from '@/components/lms/Admin/ImportLessonSelection.vue';

export default {
    components: {
        draggable,
        LMSLayout,
        ClickToEditTextInput,
        CourseNav,
        ConfirmDialog,
        LessonTypeSelection,
        ImportLessonSelection,
    },
    data() {
        return {
            confirmDelete: false,
        };
    },
    computed: {
        courseId() {
            return this.$route.params.courseId;
        },
        course() {
            return this.$store.getters['courses/getCourseById'](this.courseId);
        },
        lessonTypes() {
            return this.$store.state.courses.lessonTypes;
        },
    },
    async mounted() {
        await this.$store.dispatch('courses/fetchCourse', { courseId: this.courseId });
    },
    methods: {
        preview() {
            window.open(`/course/${this.courseId}`);
        },
        addSection() {
            this.$store.dispatch('courses/addSection', {
                courseId: this.courseId,
            });
        },
        async addLesson(sectionIndex, lessonType) {
            const lesson = await this.$store.dispatch('courses/addLesson', {
                courseId: this.courseId,
                sectionIndex,
                partial: {
                    type: lessonType,
                },
            });
            this.$router.push({ name: 'AdminCourseLesson', params: { courseId: this.courseId, lessonId: lesson.appId } });
        },
        importLesson(sectionIndex, lessonId) {
            this.$store.dispatch('courses/importLesson', {
                courseId: this.courseId,
                sectionIndex,
                lessonId,
            });
        },
        handleSectionTitleChanged(sectionIndex, newTitle) {
            this.$store.dispatch('courses/updateSectionTitle', {
                courseId: this.courseId,
                sectionIndex,
                newTitle,
            });
        },
        async deleteSection(sectionIndex) {
            const confirmed = await this.$refs.confirm.open(
                'Confirm',
                'Are you sure you want to delete this record?',
            );
            if (confirmed) {
                this.$store.dispatch('courses/deleteSection', {
                    courseId: this.courseId,
                    sectionIndex,
                });
            }
        },
        handleLessonTitleChanged(sectionIndex, lessonIndex, newTitle) {
            this.$store.dispatch('courses/updateLessonTitle', {
                courseId: this.courseId,
                sectionIndex,
                lessonIndex,
                newTitle,
            });
        },
        async deleteLesson(sectionIndex, lessonIndex) {
            const confirmed = await this.$refs.confirm.open(
                'Confirm',
                'Are you sure you want to delete this record?',
            );
            if (confirmed) {
                this.$store.dispatch('courses/deleteLesson', {
                    courseId: this.courseId,
                    sectionIndex,
                    lessonIndex,
                });
            }
        },
        handleSectionOrderChange() {
            this.$store.dispatch('courses/updateCourseProp', {
                courseId: this.courseId,
                key: 'sections',
                value: this.course.sections,
            });
        },
        handleLessonOrderChanged(sectionIndex) {
            const newLessons = this.course.sections[sectionIndex].lessons;
            this.$store.dispatch('courses/updateCourseProp', {
                courseId: this.courseId,
                key: `sections[${sectionIndex}].lessons`,
                value: newLessons,
            });
        },
    },
};
</script>

<style scoped>
.handle {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

 /* (Optional) Apply a "closed-hand" cursor during drag operation. */
.handle:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}
.ghost {
    opacity: .5;
    background: var(--v-primary-lighten3)
}
</style>
