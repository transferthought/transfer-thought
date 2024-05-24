<template>
    <fragment>
        <v-dialog v-model="dialog" eager persistent scrollable max-width="1200">
            <template v-slot:activator="{ on, attrs }">
                <v-btn id="page-settings-button" icon color="white" v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                    Edit Page Settings
                </v-toolbar>

                <v-card-text id="settings-title" class="mt-5" style="height: 700px;">
                    <v-form id="page-settings-form" ref="PageSettingsForm" v-model="pageSettingsValid" lazy-validation @submit.prevent="handleSave">
                        <v-row align="center">
                            <v-col>
                                <h4 class="text-h4 label-color font-weight-bold">Details</h4>
                                <p>Details about what the page should say</p>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Page Template</label>
                            </v-col>
                            <v-col cols="6" class="settings-fieldset-field">
                                <v-select
                                    :value="newPage.data.type"
                                    :items="[
                                        { text: 'Blank', value: 'blank' },
                                        { text: 'Basic', value: 'basic' },
                                    ]"
                                    dense
                                    hide-details
                                    outlined
                                    id="page-type"
                                    class="input-style font-size-input"
                                    placeholder="Title..."
                                    name="title"
                                    @change="handleUpdate('data.type', $event)"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Title</label>
                            </v-col>
                            <v-col cols="6" class="settings-fieldset-field">
                                <v-text-field
                                    :value="newPage.title"
                                    dense
                                    hide-details
                                    outlined
                                    id="page-title"
                                    class="input-style font-size-input"
                                    placeholder="Title..."
                                    name="title"
                                    @change="handleUpdate('title', $event)"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-text-short
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Description</label>
                            </v-col>
                            <v-col cols="6" class="settings-fieldset-field">
                                <RichTextInput :value="newPage.data.description" @change="handleUpdate('data.description', $event)" />
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Cover Image</label>
                            </v-col>
                            <v-col cols="4" class="settings-fieldset-field">
                                <ImageInput id="cover-src" :src="newPage.data.coverSrc" @change="handleUpdate('data.coverSrc', $event)" />
                            </v-col>
                            <v-col cols="2">
                                <v-slider :value="newPage.data.coverYOffset" @change="handleUpdate('data.coverYOffset', $event)" vertical max="100" min="0">
                                    <template v-slot:prepend>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <label v-on="on" class="label-color font-weight-600 d-block">Reposition</label>
                                                <v-icon small v-on="on" class="ml-1">
                                                    mdi-help-circle-outline
                                                </v-icon>
                                            </template>
                                            <span>
                                                Adjust this slider to position the image. 0 will display the bottom, 100 will display the top.
                                            </span>
                                        </v-tooltip>
                                    </template>

                                    <template v-slot:append>
                                        <v-text-field
                                            :value="newPage.data.coverYOffset"
                                            id="page-offset"
                                            class="mt-0 pt-0"
                                            type="number"
                                            dense
                                            hide-details
                                            @change="handleUpdate('data.coverYOffset', $event)"
                                            max="100"
                                            min="0"
                                        ></v-text-field>
                                    </template>
                                </v-slider>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Secondary Image or Logo</label>
                            </v-col>
                            <v-col cols="4" class="settings-fieldset-field">
                                <ImageInput id="page-logo" :src="newPage.data.logoSrc" @change="handleUpdate('data.logoSrc', $event)" />
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row align="center" class="pt-15">
                            <v-col>
                                <h4 class="text-h4 label-color font-weight-bold">Course List Details</h4>
                                <p>A list of all of your courses</p>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Course List Title</label>
                            </v-col>
                            <v-col cols="6" class="settings-fieldset-field">
                                <v-text-field
                                    :value="newPage.data.appListTitle"
                                    @change="handleUpdate('data.appListTitle', $event)"
                                    dense
                                    hide-details
                                    outlined
                                    id="page-app-list-title"
                                    class="input-style font-size-input"
                                    placeholder="Course List Title..."
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-text-short
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>

                        <v-row align="center" class="settings-fieldset-row py-5">
                            <v-col cols="4" class="settings-fieldset-label">
                                <label class="label-color font-weight-600 mb-2 d-block">Courses</label>
                            </v-col>
                            <v-col cols="8" class="settings-fieldset-field">
                                <PageAppSelector :pageApps="newPage.apps" @change="handleUpdate('apps', $event)" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                    <p class="error--text">{{ pageSettingsError }}</p>
                    <v-spacer />
                    <v-btn text large id="page-settings-cancel-button" class="text-capitalize py-1 px-2" @click="handleCancel">
                        Cancel
                    </v-btn>
                    <v-btn
                        depressed
                        large
                        :loading="submiting"
                        color="primary"
                        id="page-settings-save-button"
                        class="font-weight-bold text-capitalize py-1 px-2"
                        type="submit"
                        form="page-settings-form"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>

<script>
import _ from 'lodash';
import PageAppSelector from './PageAppSelector.vue';
import ImageInput from '@/components/ImageInput.vue';
import RichTextInput from '@/components/RichTextInput.vue';

export default {
    components: {
        PageAppSelector,
        ImageInput,
        RichTextInput,
    },
    props: {
        page: Object,
    },
    data: () => ({
        pageSettingsValid: true,
        pageSettingsError: null,
        dialog: false,
        submiting: false,
        updates: {},
        pageList: [],
    }),
    computed: {
        newPage: {
            get() {
                const newPage = _.cloneDeep(this.page);
                _.forEach(this.updates, (value, key) => {
                    _.set(newPage, key, value);
                });
                console.log('newPage', newPage);
                return newPage;
            },
            set(key, value) {
                this.updates[key] = value;
            },
        },
    },
    watch: {
        dialog() {
            if (this.dialog) {
            }
        },
    },

    methods: {
        handleUpdate(key, value) {
            this.updates = { ...this.updates, [key]: value };
        },
        handleCancel() {
            this.dialog = false;
        },
        async handleSave(event) {
            event.preventDefault();
            this.submiting = true;
            const result = this.$refs.PageSettingsForm.validate();
            if (!result) {
                const errorInput = this.$refs.PageSettingsForm.inputs.find((input) => {
                    return input.errorBucket && input.errorBucket.length;
                });
                this.pageSettingsError = errorInput.errorBucket[0];
                return;
            }

            await this.$store.dispatch('pages/update', { newItem: this.newPage });
            this.dialog = false;
            this.submiting = false;
        },
    },
};
</script>

<style>
.settings-fieldset-field {
    /* max-width: 350px; */
}
</style>
