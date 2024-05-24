<template>
    <div class="video-conference fill-height">
        <v-row
            v-show="joined"
            no-gutters
            class="fill-height"
        >
            <div
                v-show="!paintingEnabled"
                id="cover"
            />
            <canvas
                ref="can"
                :style="{position:'absolute'}"
            />
            <v-col
                cols="12"
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
                        :style="gridStyle"
                        @joined-room="onJoinedRoom"
                        @left-room="onLeftRoom"
                    />
                </section>
            </v-col>
            <div
                id="bottom-sheet-hover"
                @mouseover="sheet = true"
            />
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
        <v-bottom-sheet
            v-model="sheet"
            hide-overlay
        >
            <v-sheet
                class="text-center"
                height="100px"
                @mouseleave="sheet = false"
            >
                <v-container>
                    <v-row>
                        <v-col>
                            <v-checkbox
                                v-model="paintingEnabled"
                                label="Enable Painting"
                                data-vv-name="checkbox"
                                type="checkbox"
                            />
                        </v-col>
                        <v-col>
                            <v-color-picker
                                v-model="color"
                                hide-mode-switch
                                hide-inputs
                                flat
                                hide-canvas
                            />
                        </v-col>
                        <v-col>
                            <v-slider
                                v-model="lineWidth"
                                min="1"
                                max="25"
                            />
                        </v-col>
                        <v-col>
                            <v-btn @click="clearCanvas">
                                Clear
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>
<script>
/* eslint-disable */

import _ from 'lodash';
import gql from 'graphql-tag';
import { fabric } from 'fabric';
import Client from '@/tt-api';
import * as UUID from 'uuid/v4';
import webrtc from '@/components/webrtc.vue';

export default {
    name: 'VideoConference',
    components: {
        webrtc,
    },
    props: {
        msg: String,
    },
    data() {
        return {
            paintingEnabled: false,
            img: null,
            sheet: false,
            joined: false,
            brushSizes: [],
            brushSize: 'small',
            canvas: null,
            color: '#000000',
            lineWidth: 3,
            localData: {},
            meeting: {
            },
            members: [],
        };
    },
    watch: {
        color: {
            handler(color) {
                this.canvas.freeDrawingBrush.color = color;
            },
            deep: true,
        },
        lineWidth: {
            handler() {
                this.canvas.freeDrawingBrush.width = this.paintingEnabled ? this.lineWidth : 0;
            },
            deep: true,
        },
        paintingEnabled() {
            this.canvas.freeDrawingBrush.width = this.paintingEnabled ? this.lineWidth : 0;
        },
        meeting() {
            if (this.canvas && this.meeting && this.meeting.data) {
                this.canvas.loadFromJSON(this.meeting.data, this.canvas.renderAll.bind(this.canvas));
            }
        },
        deep: true,
    },
    created() {
        this.onCanvasUpdated = _.throttle(this.onCanvasUpdated, 1000);
    },
    methods: {
        onJoin() {
            this.$refs.webrtc.join();
            this.joined = true;

            const ref = this.$refs.can;
            this.canvas = new fabric.Canvas(ref, {
                isDrawingMode: true,
            });

            this.canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight - 100,
            });

            this.canvas.freeDrawingBrush.color = this.color;
            this.canvas.freeDrawingBrush.width = this.paintingEnabled ? this.lineWidth : 0;
            this.canvas.setZoom(window.innerWidth / 1000);
            this.canvas.loadFromJSON(this.meeting.data, this.canvas.renderAll.bind(this.canvas));
            // this.canvas.on('mouse:up', this.onCanvasUpdated.bind(this));
            this.canvas.on('path:created', this.onNewPath.bind(this));
        },
        onJoinedRoom(id) {
            this.members.push(id);
        },
        onLeftRoom(id) {
            const removeIndex = this.members.indexOf(id);
            if (removeIndex > -1) {
                this.members.splice(removeIndex, 1);
            }
        },
        onNewPath(data) {
            this.createEvent('NewObject', data.path)
        },
        onCanvasUpdated() {
            const data = this.canvas.toJSON();

            if (!_.isEqual(data, this.meeting.data)) {
                this.$apollo.mutate({
                    mutation: gql(Client.Mutations.updateMeeting),
                    variables: {
                        input: {
                            id: this.$route.params.roomId,
                            data: JSON.stringify(data),
                        },
                    },
                });
            }
        },
        clearCanvas() {
            this.canvas.clear();
            this.onCanvasUpdated();
        },
        async createEvent(name, data) {
            const { data: { createEvent: event } } = await this.$apollo.mutate({
                mutation: gql(Client.Mutations.createEvent),
                variables: {
                    input: {
                        id: UUID(),
                        subscriptionId: this.$route.params.roomId,
                        createdAt: new Date(),
                        name,
                        data: JSON.stringify(data),
                    },
                },
            });
        },
        handleNewObject(data) {
            const newPath = new fabric.Object(data)
            this.canvas.add(newPath);
        }
    },
    mounted() {
        const recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js');
        document.head.appendChild(recaptchaScript);
    },
    computed: {
        gridStyle() {
            const base = {
                'pointer-events': 'none',
            };
            if (this.members.length < 2) {
                return _.extend(base, {
                    'grid-template-rows': '100%',
                    'grid-template-columns': '100%',
                });
            }

            if (this.members.length === 2) {
                return _.extend(base, {
                    'grid-template-rows': '50% 50%',
                    'grid-template-columns': '100%',
                });
            }

            if (this.members.length < 5) {
                return _.extend(base, {
                    'grid-template-rows': '50% 50%',
                    'grid-template-columns': '50% 50%',
                });
            }

            if (this.members.length < 7) {
                return _.extend(base, {
                    'grid-template-rows': '33% 33% 33%',
                    'grid-template-columns': '50% 50%',
                });
            }

            return _.extend(base, {
                'grid-template-rows': '33% 33% 33%',
                'grid-template-columns': '33% 33% 33%',
            });
        },
    },
    filters: {
        pluralize(n) {
            return n === 1 ? 'Task' : 'Tasks';
        },
    },
    apollo: {
        meeting() {
            return {
                query: gql(Client.Queries.getMeeting),
                variables: { id: this.$route.params.roomId },
                update: (data) => {
                    const { getMeeting: meeting } = data;
                    meeting.data = JSON.parse(meeting.data);
                    return meeting;
                }
            };
        },
        events() {
            return {
                query: gql(Client.Queries.itemsBySubscriptionId),
                variables: {
                    subscriptionId: this.$route.params.roomId
                },
                update: (data) => {
                },
                subscribeToMore: {
                    document: gql(Client.Subscriptions.onCreateEvent),
                    variables: {
                        subscriptionId: this.$route.params.roomId 
                    },
                    // Mutate the previous result
                    updateQuery: (previousResult, { subscriptionData }) => {
                        const { data: { onCreateEvent: event } } = subscriptionData;
                        if (event.name === 'NewObject') {
                            this.handleNewObject(JSON.parse(event.data));
                        }
                    },
                },
            };
        },
    },
};
</script>
<style>
#bottom-sheet-hover {
    position: absolute;
    height: 100px;
    width:100vw;
    bottom:0
}

#cover {
    position: absolute;
    height: calc(100vh - 200px);
    width: 100vw;
    z-index:10;
}

.video-conference {
    height: calc(100vh - 100px);
}
.video-list {
    display: grid;
    height: 100% !important;
    background: white !important;
}

.video-item {
    background: white !important;
    display: flex !important;
    overflow: hidden;
    align-items: center;
    justify-content: center;
}

.video-item video {
    display: inline-block;
    height: 100%;
}

.canvas-container {
    position: absolute !important;
}
</style>
