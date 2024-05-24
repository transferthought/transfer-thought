<template>
    <div class="video-conference fill-height">
        <v-row
            v-show="joined"
            no-gutters
            class="fill-height"
        >
            <v-col
                cols="6"
                class="fill-height"
            >
                <v-container>
                    <v-card
                        v-if="todos"
                        class="mx-auto"
                    >
                        <v-toolbar
                            flat
                            class="grey lighten-3"
                        >
                            <v-toolbar-title class="primary--text">
                                March 24th
                            </v-toolbar-title>
                            <v-spacer />
                            <v-subheader>{{ todos.length }} {{ todos.length | pluralize }}</v-subheader>
                        </v-toolbar>
                        <v-divider />
                        <agenda
                            :todos="todos"
                            :on-add-todo="onAddTodo"
                            :on-update-todo="onUpdateTodo"
                            :on-remove-todo="onRemoveTodo"
                        />
                    </v-card>
                </v-container>
            </v-col>
            <v-col
                cols="6"
                class="fill-height"
            >
                <section
                    v-if="meeting.id"
                    class="fill-height"
                >
                    <webrtc
                        ref="webrtc"
                        :room-id="meeting.id"
                        class="fill-height"
                    />
                </section>
            </v-col>
        </v-row>
        <v-row
            v-show="!joined"
            no-gutters
            class="fill-height"
            align="center"
            justify="center"
        >
            <v-btn @click="onJoin">
                Join
            </v-btn>
        </v-row>
        <!-- <v-btn @click="onLeave">Leave</v-btn>
        <v-btn @click="onCapture">Capture Photo</v-btn>
        <v-btn @click="onShareScreen">Share Screen</v-btn> -->
        <!-- <div class="row">
            <div class="col-md-12">
                <h2>Captured Image</h2>
                <figure class="figure">
                <img :src="img" class="img-responsive" />
                </figure>
            </div>
        </div> -->
        <!-- <v-footer>
        <v-layout row wrap align-center>
          <v-flex xs12 class="text-xs-center">
            <div class="white--text ml-3">
              Transfer Thought LLC - Copyright 2020
            </div>
          </v-flex>
        </v-layout>
      </v-footer> -->
    </div>
</template>
<script>
import gql from 'graphql-tag';
import Agenda from '@/components/Agenda.vue';
import Client from '@/tt-api';
import AppSession from '@/tt-core/services/AppSession';
import webrtc from '@/components/webrtc.vue';

export default {
    name: 'VideoConference',
    components: {
        Agenda,
        webrtc,
    },
    filters: {
        pluralize(n) {
            return n === 1 ? 'Task' : 'Tasks';
        },
    },
    props: {
        msg: String,
    },
    data() {
        return {
            img: null,
            joined: false,
            meeting: {
            },
        };
    },
    computed: {
        todos() {
            if (this.meeting.state) {
                return this.meeting.state.todos;
            }
            return [];
        },
    },
    async mounted() {
        const recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js');
        document.head.appendChild(recaptchaScript);

        const { data: { getAppSession: appSession } } = await this.$apollo.query({
            query: gql(Client.Queries.getAppSession),
            variables: { id: this.$route.params.roomId },
        });

        appSession.state = JSON.parse(appSession.state);
        this.meeting = new AppSession(appSession);
        this.meeting.registerAction('AddTodo', this.handleAddTodo);
        this.meeting.registerAction('UpdateTodo', this.handleUpdateTodo);
        this.meeting.registerAction('RemoveTodo', this.handleRemoveTodo);
    },
    methods: {
        onCapture() {
            this.img = this.$refs.webrtc.capture();
        },
        onJoin() {
            this.$refs.webrtc.join();
            this.joined = true;
        },
        onLeave() {
            this.$refs.webrtc.leave();
        },
        onShareScreen() {
            this.img = this.$refs.webrtc.shareScreen();
        },
        onAddTodo(todo) {
            this.meeting.dispatch('AddTodo', todo);
        },
        onUpdateTodo(todo) {
            this.meeting.dispatch('UpdateTodo', todo);
        },
        onRemoveTodo(todo) {
            this.meeting.dispatch('RemoveTodo', todo);
        },
        handleAddTodo(app, data) {
            this.meeting.insert('todos', data);
        },
        handleUpdateTodo(app, data) {
            this.meeting.set('todos', { id: data.id }, data);
        },
        handleRemoveTodo(app, data) {
            this.meeting.remove('todos', { id: data.id });
        },
    },
};
</script>
<style>
.video-conference {
    height: calc(100vh - 64px);
}
.video-list {
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
    height: 100% !important;
    gap: 5px;
}

.video-item {
    background: #c5c4c4;
    display: flex !important;
    overflow: hidden;
    align-items: center;
    justify-content: center;
}

.video-item video {
    display: inline-block;
    height: 100%;
}
</style>
