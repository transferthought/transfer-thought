<template>
    <v-dialog :value="show" @keydown.esc="cancel" max-width="600px" persistent>
        <v-card>
            <v-card-title class="label-color font-weight-600 mb-2 d-block text-h5">
                Use AI to generate your training!
            </v-card-title>
            <v-card-text>
                <v-textarea
                    v-model="prompt"
                    placeholder="What type of training would you like? Try Confined Space, Fall Protection, Ladder Safety"
                    outlined
                    rows="2"
                    class="input-style font-size-input"
                    hide-details
                    :disabled="loading"
                />
                <div v-if="error" class="my-4 text-subtitle-1 text-error">
                    Uh oh, something went wrong. Please try again...
                </div>
                <div v-if="loading" class="my-4 text-subtitle-1">
                    Generating your training, this may take a few seconds...
                </div>
                <v-progress-linear v-if="loading" :value="loadingValue"></v-progress-linear>
            </v-card-text>
            <v-card-actions class="pt-3">
                <v-spacer />
                <v-btn color="grey" text class="body-2 font-weight-bold text-capitalize" @click.native="cancel">
                    Cancel
                </v-btn>
                <v-btn depressed color="primary" class="body-2 font-weight-bold text-capitalize" @click.native="handleGenerateSteps(prompt)" :loading="loading">
                    Generate
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Client from '@/tt-api';
export default {
    name: 'GenerateStepsDialog',
    props: {
        show: false,
    },
    data() {
        return {
            prompt: '',
            error: false,
            loading: false,
            loadingValue: 15,
        };
    },
    watch: {
        show() {
            this.prompt = '';
            this.loading = false;
            this.loadingValue = 15;
        },
    },
    mounted() {
        this.interval = setInterval(() => {
            if (this.loading) {
                // Every few seconds, randomly go up by 0 - 5%
                this.loadingValue += Math.random() * 5;
            }
        }, 2000);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        async handleGenerateSteps(prompt) {
            this.loading = true;
            this.error = false;
            this.loadingValue = 15;
            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `You are an agent that creates power point presentations but only responds with valid JSON and no conversational text. Use the following format where every item is a TITLE_OVERLAY and the title of the slide is title and the narration is the script the presenter would say:
                                [
                                {
                                        type: "TITLE_OVERLAY",
                                        name: {title},
                                        data: {
                                            title: {title}, voice: 'Matthew', transcript: {narration}
                                        }
                                },
                                ]`,
                },
                {
                    role: 'user',
                    content: `Create a training for: ${prompt}`,
                },
            ]);
            try {
                const content = result.message.content;
                const parts = content.split('```');
                let steps = [];
                if (parts.length > 1) {
                    steps = JSON.parse(parts[1]);
                } else {
                    steps = JSON.parse(parts[0]);
                }

                this.loading = false;
                this.$emit('submit', steps);
            } catch (err) {
                console.log('error');
                this.loading = false;
                this.error = true;
            }
        },
        cancel() {
            this.$emit('cancel');
        },
    },
};
</script>
