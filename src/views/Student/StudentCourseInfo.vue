<template>
    <v-main
        fill-height
    >
        <v-navigation-drawer
            v-model="drawer"
            class="background lighten-2"
            app
        >
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
                    <v-list-item-title>{{ course.title }} (50% complete)</v-list-item-title>
                </v-list-item>
                <v-list-item class="px-4">
                    <v-progress-linear
                        :value="50"
                        color="primary accent-4"
                        rounded
                        height="6"
                    />
                </v-list-item>
            </v-list>
            <v-divider />

            <v-list
                nav
                dense
            >
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-folder</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Course Overview</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <LMSLayout>
            <template
                v-if="$vuetify.breakpoint.mobile"
                v-slot:PageNavAction
            >
                <v-btn
                    icon
                    @click="drawer = true"
                >
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>
            <template v-slot:PageTitle>
                {{ course.title }}
            </template>
            <template v-slot:default>
                <v-row
                    v-for="(section, sectionIndex) in course.sections"
                    :key="section.title"
                    class="ma-0"
                >
                    <v-col
                        cols="12"
                    >
                        <v-card
                            class="card-shadow"
                            rounded
                        >
                            <v-row
                                no-gutters
                                class="card-header-padding card-border-bottom"
                            >
                                <v-col
                                    cols="12"
                                    md="6"
                                    class="d-flex align-center"
                                >
                                    <p class="font-weight-600 text-h3 text-typo mb-0">
                                        {{ section.title }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-list class="py-0">
                                <v-list-item-group
                                    color="primary"
                                >
                                    <v-list-item
                                        v-for="(lesson, lessonIndex) in section.lessons"
                                        :key="lessonIndex"
                                        class="ml-0 text-h3"
                                    >
                                        <v-list-item-icon>
                                            <v-icon color="primary">
                                                {{ getProgressIcon(sectionIndex, lessonIndex) }}
                                            </v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                class="text-typo text-h5 font-weight-600"
                                            >
                                                {{ lesson.title }}
                                                <v-icon class="text-h3">
                                                    {{ lessonTypes[lesson.type].icon }}
                                                </v-icon>
                                            </v-list-item-title>
                                        </v-list-item-content>

                                        <v-btn
                                            elevation="0"
                                            :ripple="false"
                                            class="font-weight-600 text-capitalize"
                                            color="primary"
                                            small
                                            :to="'/view/course/' + $route.params.courseId + '/lesson/' + lesson.appId"
                                        >
                                            Start
                                        </v-btn>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </LMSLayout>
    </v-main>
</template>

<script>

import _ from 'lodash';
import LMSLayout from '@/components/lms/LMSLayout.vue';

export default {
    components: {
        LMSLayout,
    },
    data() {
        return {
            drawer: !this.$vuetify.breakpoint.mobile,
        };
    },
    computed: {
        course() {
            return this.$store.getters['courses/getCourseById'](this.$route.params.courseId);
        },
        lessonTypes() {
            return this.$store.state.courses.lessonTypes;
        },
        currentSession() {
            return this.$store.state.courses.currentSession;
        },
    },
    async mounted() {
        await this.$store.dispatch('courses/fetchCourse', { courseId: this.$route.params.courseId });
    },
    methods: {
        getProgressIcon(sectionIndex, lessonIndex) {
            const result = _.get(this.currentSession.results, `${sectionIndex}.${lessonIndex}`);
            if (result) {
                return result.completed ? 'mdi-checkbox-marked-circle' : 'mdi-circle-half-full';
            }
            return 'mdi-checkbox-blank-circle-outline';
        },
    },
};
</script>

<style scoped>

</style>
