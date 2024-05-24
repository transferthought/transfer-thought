<template>
    <v-dialog v-model="dialog" max-width="1000" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark color="primary" flat>
                <v-toolbar-title class="font-weight-bold white--text">
                    Welcome to Transfer Thought!
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-8">
                <v-row>
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Here are some resources to help get you started!
                        </label>
                        <ul>
                            <li>
                                <v-btn
                                    text
                                    x-large
                                    class="text-capitalize"
                                    href="https://transferthought.freshdesk.com/support/solutions/articles/72000569595-getting-started-video-instructions"
                                    target="_blank"
                                >
                                    Watch Our Getting Started Video & Instructions
                                </v-btn>
                            </li>
                            <li>
                                <v-btn text x-large class="text-capitalize" href="https://calendly.com/transferthought/getstarted" target="_blank">
                                    Schedule a 1 on 1 Training
                                </v-btn>
                            </li>
                            <li>
                                <v-btn text x-large class="text-capitalize" href="https://transferthought.freshdesk.com/support/solutions" target="_blank">
                                    Check out the transfer thought knowledge base
                                </v-btn>
                            </li>
                        </ul>
                    </v-col>
                    <!-- <v-col>
                        <label class="text-h3 label-color font-weight-600 mb-2 d-block">
                            Additional Links
                        </label>
                        <ul>
                            <li>
                                <a
                                    href="https://transferthought.freshdesk.com/support/solutions/articles/72000594150-designing-for-visual-and-kinesthetic-learners-with-vr"
                                    target="_blank"
                                >
                                    Visual and Kinesthetic Learners With VR
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://transferthought.freshdesk.com/support/solutions/articles/72000594151-using-vr-to-enhance-active-learning"
                                    target="_blank"
                                >
                                    Using Virtual Reality to enhance active learning
                                </a>
                            </li>
                            <li>
                                <a href="https://transferthought.freshdesk.com/support/solutions/articles/72000594153-discovery-learning-in-vr" target="_blank">
                                    Discovery Learning in VR
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://transferthought.freshdesk.com/support/solutions/articles/72000594159-how-vr-can-level-up-your-learning-outcomes-bloom-s-taxonomy-"
                                    target="_blank"
                                >
                                    How VR Can Level Up Your Learning Outcomes (Bloom's Taxonomy)
                                </a>
                            </li>
                        </ul>
                    </v-col> -->
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-actions class="pt-3">
                <v-spacer />
                <v-btn x-large color="primary" text class="font-weight-bold text-capitalize" outlined @click.native="cancel">
                    I'm ready to explore on my own
                </v-btn>
                <v-btn x-large color="primary" class="font-weight-bold text-capitalize" @click.native="agree">
                    Show Me Around
                </v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'WelcomeDialog',
    data() {
        return {
            dialog: false,
            resolve: null,
            reject: null,
            message: null,
            title: null,
            options: {
                color: 'grey lighten-3',
                width: 400,
                zIndex: 200,
                noconfirm: false,
            },
        };
    },

    methods: {
        open(title, message, options) {
            this.dialog = true;
            this.title = title;
            this.message = message;
            this.options = Object.assign(this.options, options);
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        },
        agree() {
            this.resolve(true);
            this.dialog = false;
        },
        cancel() {
            this.resolve(false);
            this.dialog = false;
        },
    },
};
</script>
