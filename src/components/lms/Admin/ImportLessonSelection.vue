<template>
    <v-menu
        v-model="opened"
        :close-on-content-click="false"
        offset-y
        transition="scale-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                outlined
                v-bind="attrs"
                class="font-weight-600 text-capitalize py-1 px-2 mx-3"
                v-on="on"
            >
                Import Lesson
            </v-btn>
        </template>
        <v-card width="400">
            <v-card-text>
                <h2> Import Lesson </h2>
                <v-autocomplete
                    v-model="selectedCourseId"
                    :items="courseOptions"
                    label="Course"
                    required
                />
                <v-autocomplete
                    v-model="selectedLessonId"
                    :items="lessonOptions"
                    label="Lesson"
                    required
                />
            </v-card-text>

            <v-card-actions>
                <v-spacer />

                <v-btn
                    text
                    class="text-capitalize py-1 px-2 mx-3"
                    @click="handleCancelClicked"
                >
                    Cancel
                </v-btn>

                <v-btn
                    color="primary"
                    depressed
                    class="font-weight-600 text-capitalize py-1 px-2 mx-3"
                    @click="handleImportClicked"
                >
                    Import
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
import _ from 'lodash';

export default {
    components: {
    },
    props: {
        defaultCourseId: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            selectedCourseId: null,
            selectedLessonId: null,
            opened: false,
        };
    },
    computed: {
        selectedCourse() {
            return this.$store.getters['courses/getCourseById'](this.selectedCourseId);
        },
        courses() {
            try {
                return this.$store.state.courses.list;
            } catch {
                return [];
            }
        },
        courseOptions() {
            return _.map(this.courses, (course) => {
                const text = course.id === this.defaultCourseId
                    ? `${course.title} (current course)`
                    : course.title;

                return { text, value: course.id };
            });
        },
        lessonOptions() {
            const lessons = [];
            if (this.selectedCourse) {
                _.forEach(this.selectedCourse.sections, (section, sectionIndex) => {
                    lessons.push({ header: section.title });
                    lessons.push({ divider: true });
                    _.forEach(section.lessons, (lesson) => {
                        lessons.push({
                            value: lesson.appId,
                            text: lesson.title,
                            group: section.title,
                        });
                    });
                    if (sectionIndex < this.selectedCourse.sections.length - 1) {
                        lessons.push({ divider: true });
                    }
                });
            }
            return lessons;
        },
    },
    mounted() {
        this.$store.dispatch('courses/fetchCourses');
        this.selectedCourseId = this.defaultCourseId;
    },
    methods: {
        close() {
            this.opened = false;
        },
        handleCancelClicked() {
            this.close();
        },
        handleImportClicked() {
            this.$emit('lesson-selected', this.selectedLessonId);
            this.close();
        },
    },
};
</script>
