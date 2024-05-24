<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col class="pa-4" cols="12">
                <v-navigation-drawer v-model="drawer" class="background lighten-2" absolute temporary>
                    <v-list>
                        <v-list-item class="pa-4">
                            <v-list-item-title>My Lesson (50% complete)</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="px-4">
                            <v-progress-linear :value="50" color="primary accent-4" rounded height="6" />
                        </v-list-item>
                    </v-list>
                    <v-divider />

                    <v-list dense>
                        <v-list-item v-for="objective in objectives" :key="objective.name" active-class="highlight">
                            <v-list-item-icon>
                                <v-icon color="primary">
                                    {{ !objective.completed ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ objective.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>

                <v-app-bar color="primary" dark flat>
                    <v-btn icon @click="drawer = true">
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                    <v-toolbar-title class="toolbar-title font-weight-600 text-h5 text-capitalize">
                        test
                    </v-toolbar-title>
                </v-app-bar>
                <Scene embedded :app-id="appId" />
                <v-bottom-sheet v-model="sheet" hide-overlay="true" persistent>
                    <v-sheet class="text-center" height="200px">
                        <v-btn class="mt-6" text color="red" @click="sheet = !sheet">
                            close
                        </v-btn>
                        <div class="py-3">
                            This is a bottom sheet using the controlled by v-model instead of activator
                        </div>
                    </v-sheet>
                </v-bottom-sheet>
            </v-col>
        </v-row>
    </v-layout>
</template>
<script>
import Scene from '@/components/Scene.vue';
import { mapState } from 'vuex';

export default {
    name: 'Editor',
    components: {
        Scene,
    },
    mixins: [],
    props: {
        appId: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            drawer: false,
            sheet: true,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
        objectives() {
            try {
                return this.$store.state.apps.state.state.objectives;
            } catch {
                return [];
            }
        },
    },
    watch: {},
    async mounted() {
        this.initialValue = this.state.value;
    },
    methods: {},
};
</script>

<style scoped></style>
