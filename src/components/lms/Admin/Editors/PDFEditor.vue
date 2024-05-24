<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col class="pa-4" cols="12">
                <v-card v-if="value">
                    <v-row no-gutters class="card-header-padding card-border-bottom">
                        <label class="label-color font-weight-600 mb-2 d-block">Uploaded PDF</label>
                    </v-row>
                    <v-row no-gutters class="card-header-padding">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="text-typo text-h5 font-weight-600">
                                    {{ lesson.title }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon class="my-3">
                                <v-btn icon x-small @click="deletePDF()">
                                    <v-icon color="error">
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-row>
                </v-card>
                <v-card v-else>
                    <v-row no-gutters class="card-header-padding card-border-bottom">
                        <label class="label-color font-weight-600 mb-2 d-block">Upload a PDF</label>
                    </v-row>
                    <v-row no-gutters class="card-header-padding">
                        <HiddenFileInput @files-changed="handleFileUpload">
                            <template v-slot:default="{ openFileSelect }">
                                <v-btn :loading="uploadingAsset" class="body-2 font-weight-bold text-capitalize" @click="openFileSelect">
                                    Select PDF
                                </v-btn>
                            </template>
                        </HiddenFileInput>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <ConfirmDialog ref="confirm" />
    </v-layout>
</template>
<script>
import _ from 'lodash';
import HiddenFileInput from '@/components/HiddenFileInput.vue';
import EditorMixin from '@/mixins/EditorMixin';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

export default {
    name: 'Editor',
    components: {
        HiddenFileInput,
        ConfirmDialog,
    },
    mixins: [EditorMixin],
    props: {
        appId: {
            type: String,
            default: null,
        },
        courseId: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            uploadingAsset: false,
        };
    },
    computed: {
        value() {
            return this.state.value;
        },
        lesson() {
            return this.$store.getters['courses/getCourseLessonById'](this.courseId, this.appId);
        },
    },
    watch: {
        state: {
            handler() {
                if (this.app) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
    },
    async mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
    },
    methods: {
        async publish() {
            await this.publishApp();
        },
        async handleFileUpload(file) {
            this.uploadingAsset = true;
            const pdfUrl = await this.$store.dispatch('assets/createPDF', { file });
            await this.$store.dispatch('apps/state/update', {
                selector: 'value',
                value: pdfUrl,
            });
            this.uploadingAsset = false;
        },
        async deletePDF() {
            const confirmed = await this.$refs.confirm.open('Confirm', 'Are you sure you want to delete this?');
            if (confirmed) {
                // TODO: delete the asset here too
                await this.$store.dispatch('apps/state/update', {
                    selector: 'value',
                    value: null,
                });
            }
        },
    },
};
</script>

<style scoped></style>
