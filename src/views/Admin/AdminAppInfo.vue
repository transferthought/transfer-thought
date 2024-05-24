<template>
    <LMSLayout>
        <template v-slot:PageTitle>
            {{ app && app.title }}
        </template>

        <template v-slot:SubPages>
            <v-tabs class="ml-4" style="width: 500px" dark>
                <v-tab class="font-weight-600 text-h3 text-capitalize no-default-hover" :to="'/edit/' + $route.params.appId" exact>
                    Create
                </v-tab>
                <v-tab class="font-weight-600 text-h3 text-capitalize no-default-hover" :to="'/edit/' + $route.params.appId + '/info'" exact>
                    Details
                </v-tab>
                <v-tab class="font-weight-600 text-h3 text-capitalize no-default-hover" :to="'/edit/' + $route.params.appId + '/reports'" exact>
                    Reports
                </v-tab>
            </v-tabs>
        </template>
        <template v-slot:PageActions>
            <v-btn class="font-weight-600 text-h3 text-typo text-capitalize py-1 px-8 mx-2" depressed color="white" @click="preview">
                Preview Course
            </v-btn>
        </template>
        <template v-slot:default>
            <v-row>
                <v-col class="pt-0" cols="12">
                    <v-card class="card-shadow" rounded>
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
                                        :value="app.title"
                                        @change="updateCourseProp('title', $event)"
                                    >
                                        <template slot="prepend-inner">
                                            <v-icon color="#adb5bd">
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
                                        :value="app.description"
                                        @change="updateCourseProp('description', $event)"
                                    >
                                        <template slot="prepend-inner">
                                            <v-icon color="#adb5bd">
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
                                            <v-img class="white--text align-end" height="210" width="380" :src="app.thumbnailUrl">
                                                <v-fade-transition>
                                                    <v-overlay v-show="hover" absolute>
                                                        <HiddenFileInput @files-changed="handleFileUpload">
                                                            <template v-slot:default="{ openFileSelect }">
                                                                <v-btn @click="openFileSelect">
                                                                    Change
                                                                </v-btn>
                                                            </template>
                                                        </HiddenFileInput>
                                                    </v-overlay>
                                                </v-fade-transition>
                                                <template v-slot:placeholder>
                                                    <v-row class="fill-height ma-0" align="center" justify="center">
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
import { mapState } from 'vuex';
import LMSLayout from '@/components/lms/LMSLayout.vue';
import HiddenFileInput from '@/components/HiddenFileInput.vue';

export default {
    components: {
        LMSLayout,
        HiddenFileInput,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
    },
    async mounted() {
        if (this.$route.params.appId) {
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.appId, type: 'master' });
            this.loaded = true;
        }
    },
    methods: {
        preview() {
            window.open(`/take/${this.$route.params.appId}`);
        },
        async handleFileUpload(file) {},
    },
};
</script>

<style scoped></style>
