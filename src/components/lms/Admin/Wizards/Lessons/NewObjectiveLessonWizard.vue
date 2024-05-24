<template>
    <BaseWizard
        :steps="steps"
        @cancel="$emit('cancel')"
        @submit="handleSubmit"
    >
        <template v-slot:Step-1>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Lesson Title</label>
                    <v-text-field
                        v-model="lessonTitle"
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
        </template>
        <template v-slot:Step-2>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Default Environment</label>
                    <v-hover>
                        <template v-slot:default="{ hover }">
                            <v-img
                                class="white--text align-end"
                                height="210"
                                width="380"
                                :src="defaultEnvironmentUrl"
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
        </template>
        <template v-slot:Step-3>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Lesson Objectives (enter objectives on new lines)</label>

                    <v-textarea
                        v-model="objectivesBlob"
                        auto-grow
                        outlined
                        rows="3"
                        row-height="25"
                        class="input-style font-size-input"
                    />
                </v-col>
            </v-row>
        </template>
    </BaseWizard>
</template>

<script>
import HiddenFileInput from '@/components/HiddenFileInput.vue';
import _ from 'lodash';
import BaseWizard from '../BaseWizard.vue';

export default {
    components: {
        HiddenFileInput,
        BaseWizard,
    },
    data() {
        return {
            steps: [
                {
                    name: 'Basic Lesson Info',
                },
                {
                    name: 'Default Environment',
                },
                {
                    name: 'Lesson Objectives',
                },
            ],
            lessonTitle: 'New Lesson',
            defaultEnvironmentUrl: '',
            objectivesBlob: 'New Objective...\n',
        };
    },
    methods: {
        async handleFileUpload(file) {
            const thumbnailUrl = await this.$store.dispatch('assets/createThumbnail', { file });
            this.defaultEnvironmentUrl = thumbnailUrl;
        },
        getWizardData() {
            const objectives = _(this.objectivesBlob)
                .split('\n')
                .filter((objectiveName) => !_.isEmpty(objectiveName))
                .map((objectiveName) => ({ name: objectiveName }))
                .value();
            return {
                title: this.lessonTitle,
                objectives,
                defaultEnvironmentUrl: this.defaultEnvironmentUrl,
            };
        },
        handleSubmit() {
            this.$emit('submit', this.getWizardData());
        },
    },
};
</script>

<style scoped>

.ghost {
    opacity: .5;
    background: var(--v-secondary-lighten5)
}
</style>
