<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <v-row align="center" no-gutters class="flex-nowrap">
                    <h5 style="max-width: 250px;" class="text-h5 text-truncate">{{ app.name }}</h5>
                    <AppSettings />
                </v-row>
            </template>
            <template slot="Center">
                <portal-target name="toolbar-center" />
            </template>

            <template slot="Right">
                <v-row justify="end">
                    <v-btn
                        id="publish-button"
                        x-large
                        class="font-weight-bold text-capitalize py-1 px-8 mx-2"
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
                </v-row>
            </template>
        </AdminToolBar>
        <v-main>
            <v-container fluid class="pa-0 fill-height">
                <ObjectiveEditor ref="editor" :app-id="app.appId" />
                <PublishDialog v-if="app" ref="PublishDialog" resourceType="apps" :resourceId="app.appId" />
                <SnackMessages />
            </v-container>
        </v-main>
    </fragment>
</template>
<script>
import { mapState } from 'vuex';
import SnackMessages from '@/components/editor/SnackMessages.vue';
import PublishDialog from '@/components/dialogs/PublishDialog.vue';

import AdminToolBar from '@/components/AdminToolBar.vue';
import ObjectiveEditor from '@/components/lms/Admin/Editors/ObjectiveEditor.vue';
import AppSettings from '@/components/AppSettings.vue';

export default {
    name: 'AppEditor',
    components: {
        AdminToolBar,
        PublishDialog,
        SnackMessages,
        ObjectiveEditor,
        AppSettings,
    },
    mixins: [],
    data() {
        return {
            loaded: false,
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),
        app() {
            return this.$store.state.apps;
        },
    },
    async mounted() {
        if (this.$route.params.appId) {
            await this.$store.dispatch('apps/fetchApp', {
                appId: this.$route.params.appId,
                type: 'master',
            });
            this.loaded = true;
        }
    },
    methods: {
        async publish() {
            this.$refs.PublishDialog.show();
            this.$refs.editor.publish();
        },
    },
};
</script>

<style scoped></style>
