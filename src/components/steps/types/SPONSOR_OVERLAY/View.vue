<template>
    <v-container id="sponsor-overlay" align="center" justify="center" class="fill-height pa-5 pointer-events-auto">
        <v-card class="fill-height d-flex flex-column" width="100%">
            <v-toolbar color="primary" class="header">
                <v-toolbar-title dark class="wrap toolbar-title white--text font-weight-600 text-h4 text-capitalize">
                    {{ step.name }}
                </v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h4 card-padding">
                This course has gone over it's allotted views. To keep this online it has been sponsored by Transfer Thought.
            </v-card-title>
            <v-card-text class="flex-grow-1 flex-shrink-1 fill-height" style="overflow-y:hidden">
                <video width="100%" height="100%" controls src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/TT_EXPLAINER.mp4" />
            </v-card-text>

            <v-card-actions>
                <v-btn class="pa-4 text-capitalize" text @click="openAccountPage">
                    Are you the course owner?
                </v-btn>
                <v-spacer />

                <v-btn depressed class="pa-4 text-capitalize" @click="openHomePage">
                    Learn More
                </v-btn>

                <v-btn color="primary" dark class="pa-4 text-capitalize" @click="$emit('complete')">
                    Got it
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'SponserOverlayViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        async RunStep() {
            console.log('SponserOverlayViewer');
            // DO NOT RUN STEP
        },
        openAccountPage() {
            window.open('https://scenario.transferthought.com/account');
        },
        openHomePage() {
            window.open('https://transferthought.com');
        },
    },
};
</script>

<style></style>
