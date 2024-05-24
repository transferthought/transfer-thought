<template>
    <section>
        <section id="hero">
            <!-- <div class="accent" style="
            height: 100vh;
            width: 150vh;
            position: absolute;
            border-radius: 20vh;
            transform: scaleX();
            left: -20vw;
            top: -50vh;
            transform: rotate(45deg);
            z-index:0;
        "></div>
        <div class="accent" style="
            height: 50vh;
            width: 50vh;
            position: absolute;
            border-radius: 20vh;
            right: -16vw;
            top: -16vh;
            transform: rotate(45deg);
        "></div> -->
            <v-row no-gutters>
                <v-img
                    :min-height="'calc(100vh - 100px)'"
                    src="https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg"
                >
                    <v-container>
                        <v-row
                            align="center"
                            justify="center"
                        >
                            <v-col
                                class="text-center"
                                cols="12"
                                sm="7"
                                :style="{zIndex:1}"
                            >
                                <span
                                    class="font-weight-light"
                                    :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                                >
                                    WELCOME TO
                                </span>

                                <br>

                                <span
                                    :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                                    class="font-weight-black"
                                >
                                    TIMEBOX
                                </span>
                                <!-- <h1 class="display-4">Keep your meetings on track with TimeBox</h1> -->
                            </v-col>
                            <v-col
                                class="white--text text-center"
                                cols="12"
                                sm="5"
                                tag="h1"
                            >
                                <v-card class="mx-auto">
                                    <v-toolbar
                                        flat
                                        extended
                                        class="grey lighten-3"
                                    >
                                        <v-toolbar-title class="primary--text">
                                            March 24th
                                        </v-toolbar-title>
                                        <v-spacer />
                                        <v-subheader>{{ todos.length }} {{ todos.length | pluralize }}</v-subheader>
                                        <v-spacer slot="extension" />
                                        <v-btn
                                            slot="extension"
                                            depressed
                                            small
                                            color="accent"
                                            right
                                            @click="createMeeting"
                                        >
                                            Create Meeting
                                        </v-btn>
                                    </v-toolbar>
                                    <v-divider />
                                    <agenda :on-todos-updated="onTodosUpdated" />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-img>
            </v-row>
        </section>

    <!-- <v-footer
      class="justify-center"
      color="#292929"
      height="100"
    >
      <div class="title font-weight-light grey--text text--lighten-1 text-center">
        &copy; {{ (new Date()).getFullYear() }} — Vuetify, LLC — Made with 💜 by John Leider
      </div>
    </v-footer> -->
    </section>
</template>

<script>
import gql from 'graphql-tag';
import * as UUID from 'uuid/v4';
import Client from '@/tt-api';
import Agenda from '@/components/Agenda.vue';

export default {
    name: 'Home',
    components: {
        Agenda,
    },
    filters: {
        pluralize(n) {
            return n === 1 ? 'Task' : 'Tasks';
        },
    },
    data() {
        return {
            timeboxAppId: 1,
            todos: [],
        };
    },
    methods: {
        async createMeeting() {
            const newRoomId = UUID().substring(0, 5);
            const { data: { createAppSession: appSession } } = await this.$apollo.mutate({
                mutation: gql(Client.Mutations.createAppSession),
                variables: {
                    input: {
                        id: newRoomId,
                        appId: this.timeboxAppId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        state: JSON.stringify({
                            todos: this.todos,
                        }),
                    },
                },
            });
            this.$router.push({ name: 'VideoConference', params: { roomId: appSession.id } });
        },
        onTodosUpdated(todos) {
            this.todos = todos;
        },
    },
};
</script>

<style>
</style>
