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
        </template>
        <template v-slot:default>
            <v-row>
                <v-col
                    class="pt-0"
                    cols="12"
                >
                    <v-card
                        class="card-shadow"
                        rounded
                    >
                        <div class="card-header-padding card-border-bottom">
                            <p class="font-weight-600 text-h1 text-typo mb-0">
                                Progress
                            </p>
                        </div>

                        <v-card-text class="card-padding">
                            <v-data-table
                                :headers="headers"
                                :items="users"
                                hide-default-footer
                                class="table thead-light"
                                mobile-breakpoint="0"
                            >
                                <template v-slot:body="{ items }">
                                    <tbody>
                                        <tr
                                            v-for="(item) in items"
                                            :key="item.id"
                                        >
                                            <td class="border-bottom">
                                                <v-list class="py-0">
                                                    <v-list-item class="px-0 py-4">
                                                        <v-list-item-avatar
                                                            rounded
                                                            :size="48"
                                                            class="my-0 me-5"
                                                        >
                                                            <v-img
                                                                :alt="item.imgSrc"
                                                                :src="item.imgSrc"
                                                            />
                                                        </v-list-item-avatar>

                                                        <v-list-item-content>
                                                            <v-list-item-title
                                                                class="text-body text-subtitle-2 ls-0 font-weight-600"
                                                            >
                                                                {{ item.project }}
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list>
                                            </td>
                                            <td class="text-body border-bottom text-h5">
                                                {{ item.email }}
                                            </td>
                                            <td class="border-bottom">
                                                <div class="d-flex align-center">
                                                    <span
                                                        class="me-2 text-body text-h5"
                                                    >{{ item.progressValue }}%</span>
                                                    <v-progress-linear
                                                        class="progress-shadow"
                                                        :value="item.progressValue"
                                                        rounded
                                                        background-color="#e9ecef"
                                                        :color="item.progressColor"
                                                    />
                                                </div>
                                            </td>
                                            <td class="text-body border-bottom text-h5">
                                                Lesson Value
                                            </td>
                                            <td class="text-body border-bottom text-h5">
                                                Lesson Value
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </LMSLayout>
</template>

<script>
/* eslint-disable global-require */
import LMSLayout from '@/components/lms/LMSLayout.vue';
import CourseNav from '@/components/lms/Admin/CourseNav.vue';
import _ from 'lodash';

export default {
    components: {
        LMSLayout,
        CourseNav,
    },
    data: () => ({
        page: 1,
        defaultHeaders: [
            {
                text: 'User',
                align: 'start',
                sortable: false,
                value: 'user',
            },
            { text: 'email', value: 'email' },
            { text: 'Completed', value: 'completed' },
        ],
        users: [
            {
                id: 'b38cd25d-e6e2-4c65-9097-7a8058e4e8fd',
                name: 'Keenan Karich',
                imgSrc: require('@/assets/images/team-1.jpg'),
                email: 'transferthought@gmail.com',
                progressValue: '90',
                progressColor: 'primary',
            },
        ],
    }),
    computed: {
        course() {
            return this.$store.getters['courses/getCourseById'](this.$route.params.courseId);
        },
        headers() {
            const lessonHeaders = [];
            if (this.course) {
                _.forEach(this.course.sections, (section) => {
                    _.forEach(section.lessons, (lesson) => {
                        lessonHeaders.push({ text: lesson.title, value: lesson.id });
                    });
                });
            }
            return _.concat(this.defaultHeaders, lessonHeaders);
        },
    },
    async mounted() {
        await this.$store.dispatch('courses/fetchCourse', { courseId: this.$route.params.courseId });
    },
    methods: {
        preview() {
            this.$router.go(`/course/${this.$route.params.courseId}`);
        },
        async updateCourseProp(key, value) {
            await this.$store.dispatch('courses/updateCourseProp', {
                courseId: this.$route.params.courseId,
                key,
                value,
            });
        },
    },
};
</script>

<style scoped>
</style>
