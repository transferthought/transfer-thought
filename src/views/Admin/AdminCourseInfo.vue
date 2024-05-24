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
                                Basic Info
                            </p>
                        </div>

                        <v-card-text class="card-padding">
                            <v-row>
                                <v-col>
                                    <label class="label-color font-weight-600 mb-2 d-block">Course Title</label>
                                    <v-text-field
                                        hide-details
                                        outlined
                                        class="input-style font-size-input"
                                        placeholder="Title..."
                                        :value="course.title"
                                        @change="updateCourseProp('title', $event)"
                                    >
                                        <template slot="prepend-inner">
                                            <v-icon
                                                color="#adb5bd"
                                            >
                                                mdi-text-short
                                            </v-icon>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <label class="label-color font-weight-600 mb-2 d-block">Course Description</label>
                                    <v-text-field
                                        hide-details
                                        outlined
                                        class="input-style font-size-input input-icon placeholder-light"
                                        placeholder="Description..."
                                        :value="course.description"
                                        @change="updateCourseProp('description', $event)"
                                    >
                                        <template slot="prepend-inner">
                                            <v-icon
                                                color="#adb5bd"
                                            >
                                                mdi-text
                                            </v-icon>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <label class="label-color font-weight-600 mb-2 d-block">Course Image</label>
                                    <v-hover>
                                        <template v-slot:default="{ hover }">
                                            <v-img
                                                class="white--text align-end"
                                                height="210"
                                                width="380"
                                                :src="course.thumbnailUrl"
                                            >
                                                <v-fade-transition>
                                                    <v-overlay
                                                        v-show="hover"
                                                        absolute
                                                    >
                                                        <HiddenFileInput @files-changed="handleFileUpload">
                                                            <template v-slot:default="{openFileSelect}">
                                                                <v-btn @click="openFileSelect">
                                                                    Change
                                                                </v-btn>
                                                            </template>
                                                        </HiddenFileInput>
                                                    </v-overlay>
                                                </v-fade-transition>
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
                                        </template>
                                    </v-hover>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </LMSLayout>
</template>

<script>
import LMSLayout from '@/components/lms/LMSLayout.vue';
import HiddenFileInput from '@/components/HiddenFileInput.vue';
import CourseNav from '@/components/lms/Admin/CourseNav.vue';

export default {
    components: {
        LMSLayout,
        HiddenFileInput,
        CourseNav,
    },
    data() {
        return {
            page: 1,
            fileSingle: [],
        };
    },
    computed: {
        course() {
            return this.$store.getters['courses/getCourseById'](this.$route.params.courseId);
        },
    },
    async mounted() {
        await this.$store.dispatch('courses/fetchCourse', { courseId: this.$route.params.courseId });
    },
    methods: {
        preview() {
            window.open(`/view/course/${this.$route.params.courseId}`);
        },
        async updateCourseProp(key, value) {
            await this.$store.dispatch('courses/updateCourseProp', {
                courseId: this.$route.params.courseId,
                key,
                value,
            });
        },
        async handleFileUpload(file) {
            const thumbnailUrl = await this.$store.dispatch('assets/createThumbnail', { file });
            await this.$store.dispatch('courses/updateCourseProp', {
                courseId: this.$route.params.courseId,
                key: 'thumbnailUrl',
                value: thumbnailUrl,
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
