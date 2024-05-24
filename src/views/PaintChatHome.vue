<template>
    <section id="hero">
        <v-img :height="'calc(100vh - 100px)'" src="https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg">
            <v-container fill-height align="center" justify="center">
                <v-row align="center" justify="center">
                    <v-col cols="12">
                        <span class="font-weight-light" :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']">
                            WELCOME TO
                        </span>

                        <br />

                        <span :class="[$vuetify.breakpoint.smAndDown ? 'display-3' : 'display-4']" class="font-weight-black">
                            PaintChat
                        </span>
                    </v-col>
                    <v-col cols="12">
                        <v-dialog v-model="dialog" persistent max-width="600px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="accent" text v-on="on">
                                    Join
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">User Profile</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="joinRoomId" label="Room Id" />
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn color="blue darken-1" text @click="dialog = false">
                                        Close
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="joinMeeting">
                                        Join
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn depressed large color="primary" @click="createMeeting">
                            Create
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-img>
    </section>
</template>

<script>
import gql from 'graphql-tag';
import * as UUID from 'uuid/v4';
import Client from '@/tt-api';

export default {
    name: 'Home',
    components: {},
    filters: {
        pluralize(n) {
            return n === 1 ? 'Task' : 'Tasks';
        },
    },
    data() {
        return {
            joinRoomId: '',
            dialog: false,
        };
    },
    methods: {
        async joinMeeting() {
            this.$router.push({ name: 'PaintChat', params: { roomId: this.joinRoomId } });
        },
        async createMeeting() {
            const newRoomId = UUID().substring(0, 5);
            const {
                data: { createMeeting: meeting },
            } = await this.$apollo.mutate({
                mutation: gql(Client.Mutations.createMeeting),
                variables: {
                    input: {
                        id: newRoomId,
                    },
                },
            });
            this.$router.push({ name: 'PaintChat', params: { roomId: meeting.id } });
        },
    },
};
</script>

<style></style>
