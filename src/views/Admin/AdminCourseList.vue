<template>
    <LMSLayout>
        >
        <template v-slot:PageTitle>
            My Courses
        </template>

        <template v-slot:PageActions>
            <v-dialog
                v-model="showNewCourseWizard"
                width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="font-weight-600 text-h3 text-capitalize py-1 px-2"
                        depressed
                        color="primary lighten-1"
                        v-bind="attrs"
                        v-on="on"
                    >
                        New Course
                    </v-btn>
                </template>
                <NewCourseWizard
                    @submit="handleNewCourse"
                    @cancel="showNewCourseWizard = false"
                />
            </v-dialog>
        </template>
        <template v-slot:default>
            <v-row>
                <v-col
                    class="pt-0"
                    cols="12"
                >
                    <Paging
                        query-name="ownerAppsByName"
                        :filter="{type: { eq: 'master' }}"
                    >
                        <template v-slot:default="slotProps">
                            <div v-if="slotProps.loading">
                                <v-col cols="3">
                                    <v-skeleton-loader
                                        class="mx-auto"
                                        type="card"
                                    />
                                </v-col>
                            </div>
                            <v-col
                                v-for="course in slotProps.items"
                                :key="course.id"
                                cols="12"
                                lg="3"
                                md="6"
                                class="py-0"
                            >
                                <v-card
                                    class="card-shadow mb-6"
                                    rounded
                                    :ripple="false"
                                    @click="to('AdminAppEditor', {appId: course.appId})"
                                >
                                    <v-img
                                        :src="course.thumbnailUrl"
                                        height="210"
                                    >
                                        <template v-slot:placeholder>
                                            <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                            >
                                                <v-icon x-large>
                                                    mdi-image
                                                </v-icon>
                                            </v-row>
                                        </template>
                                    </v-img>

                                    <v-card-text>
                                        <h2 class="text-h2 text-typo font-weight-600 mb-0">
                                            {{ course.name }}
                                        </h2>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </template>
                    </Paging>
                </v-col>
            </v-row>
        </template>
    </LMSLayout>
</template>

<script>
import CourseCard from '@/components/lms/CourseCard.vue';
import CourseCardAdminMenu from '@/components/lms/CourseCardAdminMenu.vue';
import LMSLayout from '@/components/lms/LMSLayout.vue';
import NewCourseWizard from '@/components/lms/Admin/Wizards/NewCourseWizard.vue';
import Paging from '@/components/Paging.vue';

import RoutingMixin from '@/mixins/RoutingMixin';

export default {
    components: {
        LMSLayout,
        NewCourseWizard,
        Paging,
    },
    mixins: [RoutingMixin],
    data() {
        return {
            page: 1,
            showNewCourseWizard: false,
        };
    },
    computed: {
        courses() {
            try {
                return this.$store.state.courses.list;
            } catch {
                return [];
            }
        },
    },
    mounted() {
        this.$store.dispatch('courses/fetchCourses');
    },
    methods: {
        async handleNewCourse(newCourseData) {
            const course = await this.$store.dispatch('courses/createCourse', newCourseData);
            this.$router.push({ name: 'AdminCourseInformation', params: { courseId: course.id } });
        },
    },
};
</script>
