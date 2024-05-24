<template>
    <LMSLayout>
        >
        <template v-slot:PageTitle>
            My Courses ({{ courses.length }})
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
                            <v-form
                                id="navbar-search-main"
                                class="navbar-search navbar-search-light"
                                @submit.prevent="submit"
                            >
                                <v-text-field
                                    rounded
                                    hide-details
                                    outlined
                                    background-color="rgba(255,255,255,.9)"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="Search"
                                    class="font-size-input placeholder-dark input-alternative input-icon"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon
                                            color="rgba(0,0,0,.6)"
                                            size=".875rem"
                                        >
                                            mdi-magnify
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-form>
                        </div>

                        <v-card-text class="card-padding">
                            <v-row class="ma-0">
                                <v-col
                                    v-for="course in courses"
                                    :key="course.title"
                                    cols="12"
                                    lg="3"
                                    md="6"
                                    class="py-0"
                                >
                                    <CourseCard
                                        :course="course"
                                        @click="to('StudentCourse', {courseId: course.id}, true)"
                                    />
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <div class="card-padding d-flex justify-end">
                            <v-pagination
                                v-model="page"
                                prev-icon="mdi-chevron-left"
                                next-icon="mdi-chevron-right"
                                class="pagination"
                                color="primary"
                                :length="4"
                                circle
                            />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </LMSLayout>
</template>

<script>
import CourseCard from '@/components/lms/CourseCard.vue';
import LMSLayout from '@/components/lms/LMSLayout.vue';
import RoutingMixin from '@/mixins/RoutingMixin';

export default {
    components: {
        CourseCard,
        LMSLayout,
    },
    mixins: [RoutingMixin],
    data: () => ({
        page: 1,
    }),
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
    },
};
</script>
