<template>
    <BaseWizard
        :steps="steps"
        @cancel="$emit('cancel')"
        @submit="handleSubmit"
    >
        <template v-slot:Step-1>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Course Title</label>
                    <v-text-field
                        v-model="courseTitle"
                        hide-details
                        outlined
                        class="input-style font-size-input"
                        placeholder="Title..."
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
                    <ImageInput
                        :src="courseThumbnail"
                        title="Course Thumbnail"
                        @change="handleCourseImageChanged"
                    />
                </v-col>
            </v-row>
        </template>
        <template v-slot:Step-2>
            <v-row>
                <v-col>
                    <ImageInput
                        :src="coachThumbnail"
                        title="Coach Image"
                        @change="handleCoachThumbnailChanged"
                    />
                </v-col>
            </v-row>
        </template>
        <template v-slot:Step-3>
            <v-row>
                <v-col>
                    <ImageInput
                        :src="defaultEnvironmentUrls"
                        multiple
                        title="Default Environment"
                        @change="handleDefaultEnvImageChanged"
                    />
                </v-col>
            </v-row>
        </template>
    </BaseWizard>
</template>

<script>
import ImageInput from '@/components/ImageInput.vue';
import _ from 'lodash';
import BaseWizard from './BaseWizard.vue';

export default {
    components: {
        BaseWizard,
        ImageInput,
    },
    data() {
        return {
            steps: [
                {
                    name: 'Info',
                }, {
                    name: 'Coach',
                }, {
                    name: 'Default Environment',
                },
            ],
            courseTitle: 'Untitled',
            courseThumbnail: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg',
            coachThumbnail: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/avatars/default_avatar.jpeg',
            voice: 'Matthew',
            defaultEnvironmentUrls: ['https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/360Images/construction_chevronmarket_4k.jpg'],
            objectivesBlob: 'New Objective...\n',
        };
    },
    methods: {
        handleCourseImageChanged(thumbnailUrl) {
            this.courseThumbnail = thumbnailUrl;
        },
        handleCoachThumbnailChanged(thumbnailUrl) {
            this.coachThumbnail = thumbnailUrl;
        },
        handleDefaultEnvImageChanged(thumbnailUrls) {
            this.defaultEnvironmentUrls = thumbnailUrls;
        },
        getWizardData() {
            const objectives = _(this.objectivesBlob)
                .split('\n')
                .filter((objectiveName) => !_.isEmpty(objectiveName))
                .map((objectiveName) => ({ name: objectiveName }))
                .value();
            let { defaultEnvironmentUrls } = this;
            if (_.isString(defaultEnvironmentUrls)) {
                defaultEnvironmentUrls = [defaultEnvironmentUrls];
            }
            return {
                title: this.courseTitle,
                courseThumbnail: this.courseThumbnail,
                coachThumbnail: this.coachThumbnail,
                defaultEnvironmentUrls,
                voice: this.voice,
                objectives,
            };
        },
        handleSubmit() {
            this.$emit('submit', this.getWizardData());
        },
    },
};
</script>
