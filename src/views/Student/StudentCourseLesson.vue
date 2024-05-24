<template>
    <v-main fill-height>
        <v-navigation-drawer v-model="drawer" class="background lighten-2" app>
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="@/assets/images/tt-logo.png" />
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                        <v-list-item-title class="title d-flex align-center mb-0">
                            Transfer Thought
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item class="pa-4">
                    <v-list-item-title>My Course (50% complete)</v-list-item-title>
                </v-list-item>
                <v-list-item class="px-4">
                    <v-progress-linear :value="50" color="primary accent-4" rounded height="6" />
                </v-list-item>
            </v-list>
            <v-divider />

            <v-list v-for="(section, sectionIndex) in course.sections" :key="section.title" dense>
                <v-subheader>{{ section.title }}</v-subheader>
                <v-list-item
                    v-for="(lesson, lessonIndex) in section.lessons"
                    :key="lessonIndex"
                    active-class="highlight"
                    :to="'/view/course/' + $route.params.courseId + '/lesson/' + lesson.appId"
                >
                    <v-list-item-icon>
                        <v-icon color="primary">
                            {{ getProgressIcon(sectionIndex, lessonIndex) }}
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ lesson.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <LMSLayout>
            <template v-if="$vuetify.breakpoint.mobile" v-slot:PageNavAction>
                <v-btn icon @click="drawer = true">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>
            <template v-slot:PageTitle>
                {{ course.title }}
            </template>

            <template v-slot:PageActions>
                <v-btn class="font-weight-600 text-h3 text-typo text-capitalize py-1 px-8 mx-2" depressed color="white" @click="previous">
                    Previous
                </v-btn>
                <v-btn class="font-weight-600 text-h3 text-capitalize py-1 px-8 mx-2" depressed color="primary lighten-1" @click="next">
                    Next
                </v-btn>
            </template>
            <template v-slot:default>
                <v-row class="ma-0">
                    <v-col cols="12" class="pa-0">
                        <v-card rounded class="card-shadow">
                            <v-row no-gutters class="card-header-padding card-border-bottom">
                                <v-col cols="12" md="6" class="d-flex align-center">
                                    <p class="font-weight-600 text-h3 text-typo mb-0">
                                        {{ app.name }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-row id="scene-editor-container" no-gutters>
                                        <v-col id="scene-editor" cols="12">
                                            <v-layout v-if="app.fetching" align-center justify-center column fill-height>
                                                <v-flex row align-center>
                                                    <v-progress-circular indeterminate :size="50" color="primary" class="" />
                                                </v-flex>
                                            </v-layout>
                                            <component :is="appViewer" v-else embedded :app-id="$route.params.lessonId" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </LMSLayout>
    </v-main>
</template>
<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import LMSLayout from '@/components/lms/LMSLayout.vue';

export default {
    name: 'Editor',
    components: {
        LMSLayout,
    },
    mixins: [],
    data() {
        return {
            drawer: !this.$vuetify.breakpoint.mobile,
            appViewer: null,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
        course() {
            return this.$store.getters['courses/getCourseById'](this.$route.params.courseId);
        },
        currentSession() {
            return this.$store.state.courses.currentSession;
        },
        currentAppId() {
            return this.app.appId;
        },
    },
    watch: {
        async $route() {
            this.appViewer = null;
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.lessonId, type: 'published' });
            this.appViewer = await this.$store.getters['courses/getLessonViewerByType'](this.app.state.state.lessonType);
        },
    },
    async mounted() {
        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });

        if (this.$route.params.lessonId) {
            await this.$store.dispatch('courses/fetchCourse', { courseId: this.$route.params.courseId });
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.lessonId, type: 'published' });
            this.appViewer = await this.$store.getters['courses/getLessonViewerByType'](this.app.state.state.lessonType);
        }
    },
    methods: {
        getProgressIcon(sectionIndex, lessonIndex) {
            const result = _.get(this.currentSession.results, `${sectionIndex}.${lessonIndex}`);
            if (result) {
                return result.completed ? 'mdi-checkbox-marked-circle' : 'mdi-circle-half-full';
            }
            return 'mdi-checkbox-blank-circle-outline';
        },
        getCurrentLessonIndex() {
            let currentSectionIndex;
            let currentLessonIndex;
            _.forEach(this.course.sections, (section, sectionIndex) => {
                _.forEach(section.lessons, (lesson, lessonIndex) => {
                    if (lesson.appId === this.app.appId) {
                        currentSectionIndex = sectionIndex;
                        currentLessonIndex = lessonIndex;
                    }
                });
            });
            return { currentSectionIndex, currentLessonIndex };
        },
        previous() {
            const { currentSectionIndex, currentLessonIndex } = this.getCurrentLessonIndex();
            if (currentSectionIndex >= 0 && currentLessonIndex >= 0) {
                if (currentLessonIndex > 0) {
                    this.goToLesson(currentSectionIndex, currentLessonIndex - 1);
                } else if (currentSectionIndex > 0) {
                    const newSectionIndex = currentSectionIndex - 1;
                    const newSection = this.course.sections[newSectionIndex];
                    this.goToLesson(newSectionIndex, newSection.length - 1);
                }
            }
        },
        next() {
            const { currentSectionIndex, currentLessonIndex } = this.getCurrentLessonIndex();
            const currentSection = this.course.sections[currentSectionIndex];
            if (currentSectionIndex >= 0 && currentLessonIndex >= 0) {
                if (currentLessonIndex < currentSection.lessons.length - 1) {
                    this.goToLesson(currentSectionIndex, currentLessonIndex + 1);
                } else if (currentSectionIndex < this.course.sections.length - 1) {
                    this.goToLesson(currentSectionIndex + 1, 0);
                }
            }
        },
        goToLesson(sectionIndex, lessonIndex) {
            const section = this.course.sections[sectionIndex];
            if (section) {
                const lesson = section.lessons[lessonIndex];
                if (lesson) {
                    this.$router.push({ name: 'Lesson', params: { courseId: this.$route.params.courseId, lessonId: lesson.appId } });
                }
            }
        },
    },
};
</script>

<style scoped>
#scene-editor-container {
    height: calc(100vh - 168px);
}
#scene-editor {
    overflow: hidden;
    height: 100%;
}
.entity-list-container {
    height: calc(100vh - 48px);
    overflow-y: auto;
}
.asset-list-container {
    height: calc(50vh - 48px);
    overflow-y: auto;
}
.entity-edditor-container {
    height: calc(100vh - 48px);
    overflow-y: auto;
}
.asset-viewer-content {
    height: calc(100vh - 64px - 52px);
}
.component-item {
    min-height: 0px;
    overflow: hidden;
}
.highlight {
    background: var(--v-background-darken1);
}
</style>
