<template>
    <LMSLayout>
        <template v-slot:PageTitle>
            {{ course && course.title }}
        </template>

        <template v-slot:SubPages>
            <CourseNav>
                <template v-slot:AppendTabs>
                    <v-tab class="font-weight-600 text-h3 text-capitalize no-default-hover" :to="'/course/' + $route.params.courseId + '/lesson'">
                        {{ lesson ? lesson.title : 'Loading...' }}
                    </v-tab>
                </template>
            </CourseNav>
        </template>

        <template v-slot:PageActions>
            <v-btn class="font-weight-600 text-h3 text-typo text-capitalize py-1 px-8 mx-2" depressed color="white" @click="launchPublishedSite">
                Preview
            </v-btn>
            <v-btn
                class="font-weight-600 text-h3 text-capitalize py-1 px-8 mx-2"
                depressed
                color="primary lighten-1"
                :loading="app.publishing"
                @click="publish"
            >
                Publish
                <v-icon right dark>
                    mdi-cloud-upload
                </v-icon>
            </v-btn>
        </template>
        <template v-slot:default>
            <v-row>
                <v-col cols="12">
                    <v-card rounded>
                        <component :is="appEditor" v-if="loaded" ref="editor" :course-id="$route.params.courseId" :app-id="$route.params.lessonId" />
                    </v-card>
                </v-col>
            </v-row>

            <v-dialog v-model="showPublishDialog" persistent width="400">
                <v-card v-if="app.publishing" color="primary" dark>
                    <v-card-text>
                        Publishing...
                        <v-progress-linear indeterminate color="white" class="mb-0" />
                    </v-card-text>
                </v-card>
                <v-card v-else>
                    <v-card-text>
                        <p class="display-1 text--primary">
                            {{ app.name }}
                        </p>
                    </v-card-text>
                    <v-list-item>
                        <v-list-item-content @click="launchPublishedSite">
                            <v-list-item-title>{{ getPublishedUrl() }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon @click="copyPublishedUrl">
                                <v-icon>mdi-content-copy</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="showPublishDialog = false">
                            Close
                        </v-btn>
                        <v-btn depressed color="primary" @click="launchPublishedSite">
                            View
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <SnackMessages />
        </template>
    </LMSLayout>
</template>
<script>
import { mapState } from 'vuex';
import LMSLayout from '@/components/lms/LMSLayout.vue';
import SnackMessages from '@/components/editor/SnackMessages.vue';
import CourseNav from '@/components/lms/Admin/CourseNav.vue';

import _ from 'lodash';

export default {
    name: 'AdminLessonEditorContainer',
    components: {
        LMSLayout,
        SnackMessages,
        CourseNav,
    },
    mixins: [],
    data() {
        return {
            showPublishDialog: false,
            loaded: false,
            appEditor: null,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
        course() {
            return this.$store.getters['courses/getCourseById'](this.$route.params.courseId);
        },
        lesson() {
            return this.$store.getters['courses/getCourseLessonById'](this.$route.params.courseId, this.$route.params.lessonId);
        },
    },
    watch: {},
    async mounted() {
        if (this.$route.params.lessonId) {
            await this.$store.dispatch('courses/fetchCourse', { courseId: this.$route.params.courseId });
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.lessonId, type: 'master' });
            this.loaded = true;
            this.appEditor = await this.$store.getters['courses/getLessonEditorByType'](this.app.state.state.lessonType);
        }
    },
    methods: {
        async publish() {
            this.showPublishDialog = true;
            this.$refs.editor.publish();
        },
        getPublishedUrl() {
            const currentUrl = new URL(window.location);

            // TODO: this is a hack, we should make the student portal handle this
            if (this.app.state.state.lessonType === 'objective') {
                return `${currentUrl.origin}/take/${this.$route.params.lessonId}`;
            }

            return `${currentUrl.origin}/view/course/${this.$route.params.courseId}/lesson/${this.$route.params.lessonId}`;
        },
        launchPublishedSite() {
            window.open(this.getPublishedUrl());
        },
        copyPublishedUrl() {
            const el = document.createElement('textarea');
            el.value = this.getPublishedUrl();
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$store.commit('apps/snackMessage', 'Link copied to clipboard');
        },
    },
};
</script>

<style scoped></style>
