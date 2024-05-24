<template>
    <v-card class="pointer-events-auto d-flex flex-column  justify-end" width="100%" elevation="5" style="opacity: 95%;max-height: 100%">
        <v-toolbar color="primary" class="dark-background tt-text header">
            <v-btn v-if="openPanel == 0" dark class="tt-text dark-background text-capitalize font-weight-bold" icon @click="openPanel = -1">
                <v-icon>
                    mdi-chevron-up
                </v-icon>
            </v-btn>
            <v-btn v-if="openPanel !== 0" dark class="tt-text dark-background text-capitalize font-weight-bold" icon @click="openPanel = 0">
                <v-icon>
                    mdi-chevron-down
                </v-icon>
            </v-btn>
            <v-toolbar-title dark class="tt-text wrap toolbar-title white--text font-weight-600 text-capitalize">
                {{ step.data.title }}
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn class="tt-text dark-background text-capitalize font-weight-bold" depressed x-large color="gray" @click="handleContinue">
                End Chat
            </v-btn>
        </v-toolbar>
        <v-card-text
            class="light-background flex-shrink-1"
            style="
                    overflow: auto;
                    display: flex;
                    flex-direction: column-reverse;
                "
        >
            <v-expansion-panels accordion flat v-model="openPanel">
                <v-expansion-panel expand class="label-color mb-2 d-block">
                    <v-expansion-panel-content>
                        <v-container class="mb-1 grey lighten-3 rounded fill-height" v-if="chatHistory.length || step.data.promptPlaceholder">
                            <ChatBubble v-if="step.data.promptPlaceholder" :content="step.data.promptPlaceholder" justify="end" />
                            <ChatBubble
                                v-for="(chat, index) in chatHistory"
                                :key="index"
                                :content="chat.content"
                                :autoplay="chat.role !== 'user'"
                                :justify="chat.role === 'user' ? 'start' : 'end'"
                            />

                            <v-row justify="end" v-if="currentChatState === chatStates.GENERATING_TEXT_RESPONSE">
                                <v-col cols="5">
                                    <v-card flat class="pa-2">
                                        <v-skeleton-loader type="text"></v-skeleton-loader>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container class="mb-1 grey lighten-3 rounded fill-height" v-else>
                            <!-- <v-row v-if="questions && questions.length">
                        <v-col cols="4" v-for="(question, index) in questions" :key="index">
                            <v-btn class="font-weight-600 text-h5 text-capitalize py-4 px-2" block outlined x-large @click="message = question">
                                {{ question }}
                            </v-btn>
                        </v-col>
                    </v-row> -->

                            <v-row justify="center">
                                <v-col cols="8">
                                    <p class="text-center">
                                        No discussion history. Your chat history will be displayed here once it is available.
                                    </p>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <v-card-text class="light-background">
            <v-text-field
                rows="1"
                outlined
                hide-details
                class="mx-2"
                :loading="currentChatState === chatStates.RECORDING"
                :placeholder="currentChatState === chatStates.RECORDING ? 'Recording...' : 'How can I help you?'"
                @keyup.enter="submitChat"
                v-model="message"
            >
                <template slot="prepend" v-if="currentChatState === chatStates.RECORDING">
                    <v-icon style="font-size:24px" class="mr-2" color="red">
                        mdi-record
                    </v-icon>
                    {{ formatSeconds(timer) }}
                </template>
                <template slot="append">
                    <v-btn
                        v-if="currentChatState === chatStates.IDLE"
                        icon
                        height="24"
                        class="font-weight-600 text-capitalize py-1 float-right"
                        @click="startRecording"
                    >
                        <v-icon class="mr-2">
                            mdi-microphone
                        </v-icon>
                    </v-btn>
                    <v-btn v-if="currentChatState === chatStates.RECORDING" icon height="24" class="font-weight-600 text-h5 text-capitalize py-1 float-right">
                        <v-icon style="font-size:24px" class="mr-2">
                            mdi-stop
                        </v-icon>
                    </v-btn>
                    <v-btn
                        v-if="currentChatState === chatStates.GENERATING_TEXT_RESPONSE"
                        icon
                        loading
                        height="24"
                        class="font-weight-600 text-capitalize py-1 float-right"
                    ></v-btn>
                    <v-btn
                        v-if="currentChatState === chatStates.IDLE"
                        icon
                        height="24"
                        class="font-weight-600 text-h5 text-capitalize py-1 float-right"
                        @click="submitChat"
                    >
                        <v-icon style="font-size:24px" class="mr-2">
                            mdi-send
                        </v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </v-card-text>
    </v-card>
</template>
<script>
import _ from 'lodash';

import { Howl } from 'howler';

import TextToSpeech from '@/services/texttospeech-service';
import TextSpeaker from '@/components/TextSpeaker';
import Client from '@/tt-api';

import ChatBubble from './ChatBubble.vue';

export default {
    name: 'AIChatBox',
    components: {
        TextSpeaker,
        ChatBubble,
    },
    props: {
        step: Object,
        systemMessage: String,
    },
    data() {
        return {
            timer: 0,
            message: '',
            openPanel: 0,
            chatHistory: [],
            currentChatState: 'IDLE',
            chatStates: {
                IDLE: 'IDLE',
                RECORDING: 'RECORDING',
                GENERATING_TEXT_RESPONSE: 'GENERATING_TEXT_RESPONSE',
                CONVERTING_TEXT_TO_AUDIO: 'CONVERTING_TEXT_TO_AUDIO',
                RESPONDING: 'RESPONDING',
                ERROR: 'ERROR',
            },
        };
    },
    computed: {
        state() {
            try {
                return this.$store.state.apps.state.state;
            } catch {
                return {};
            }
        },
        coach() {
            return this.state.coach;
        },
        questions() {
            return ['How can I help?', 'Can you repeat what you said?'];
        },
        responses() {
            return this.$store.state.apps.state.state.responses;
        },
    },
    mounted() {
        if (
            this.responses[this.step.id] &&
            this.responses[this.step.id].values[this.step.data.title] &&
            this.responses[this.step.id].values[this.step.data.title].length
        ) {
            this.chatHistory = this.responses[this.step.id].values[this.step.data.title];
        } else {
            this.chatHistory = [];
        }
    },
    methods: {
        async submitChat() {
            if (!this.message.length) {
                return;
            }
            this.currentChatState = this.chatStates.GENERATING_TEXT_RESPONSE;
            this.chatHistory.push({
                role: 'user',
                content: this.message,
            });
            this.message = '';
            const completeChatRequest = [...this.chatHistory];
            if (this.systemMessage) {
                completeChatRequest.unshift({
                    role: 'system',
                    content: this.systemMessage,
                });
            }
            const [result] = await Client.OpenAI.createChatCompletion(completeChatRequest);
            try {
                this.chatHistory.push(result.message);
                this.currentChatState = this.chatStates.IDLE;

                this.$store.dispatch('steps/updateResponseValue', {
                    stepId: this.step.id,
                    valueId: this.step.data.title,
                    value: this.chatHistory,
                });
            } catch (err) {
                this.currentChatState = this.chatStates.ERROR;
                console.log('error', err);
            }
        },
        recordingTimer() {
            if (this.currentChatState === this.chatStates.RECORDING) {
                setTimeout(() => {
                    this.timer += 1;
                    this.recordingTimer();
                }, 1000);
            }
        },
        formatSeconds(inputSeconds) {
            const minutes = Math.floor(inputSeconds / 60);
            const seconds = inputSeconds % 60;

            const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

            return `${formattedMinutes}:${formattedSeconds}`;
        },
        async startRecording() {
            this.recognition = new webkitSpeechRecognition();

            // Set up recognition properties
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US'; // Specify the language

            this.recognition.start();
            this.recognition.addEventListener('result', (event) => {
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    interim_transcript += event.results[i][0].transcript;
                }
                this.message = interim_transcript;
            });
            this.recognition.addEventListener('end', (event) => {
                this.currentChatState = this.chatStates.IDLE;
                this.submitChat();
            });
            this.timer = 0;
            this.currentChatState = this.chatStates.RECORDING;
            this.recordingTimer();
        },
        handleContinue() {
            this.$emit('continue');
        },
    },
};
</script>

<style scoped>
.chat-bubble {
    width: max-content;
}
</style>
