<template>
    <v-container contain align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card id="steps-ending" width="100%" max-height="100%" contain class="pointer-events-auto" style="overflow-y: scroll">
            <v-img
                class="d-flex justify-center primary--text end-image mx-auto"
                :src="end.endImage"
                contain
                :max-height="$vuetify.breakpoint.smAndDown ? 250 : 350"
            />
            <v-card-title class="d-flex justify-center">
                {{ this.end.endText }}
            </v-card-title>
            <v-card-title v-if="this.end.links && this.end.links.length > 0" class="d-flex justify-center">
                {{ this.end.linkEndText }}
            </v-card-title>
            <v-card-actions v-for="(link, index) in this.end.links" :key="index" class="d-flex justify-center">
                <a :href="link" target="_blank">{{ link }}</a>
            </v-card-actions>

            <v-card-actions class="d-flex justify-center">
                <v-btn class="tt-text dark-background text-capitalize font-weight-bold" depressed x-large color="primary" @click="downloadResponseData">
                    Download Response Data
                </v-btn>
                <v-btn
                    v-if="$route.query.redirect"
                    class="tt-text dark-background text-capitalize font-weight-bold text-h4"
                    depressed
                    x-large
                    color="primary"
                    @click="handleRedirect"
                >
                    Complete
                </v-btn>
                <v-btn
                    v-else
                    id="replay-button"
                    class="tt-text dark-background text-capitalize font-weight-bold"
                    depressed
                    x-large
                    color="primary"
                    @click="replay"
                >
                    Replay
                </v-btn>
            </v-card-actions>

            <v-card-actions>
                <v-btn color="primary darken-4" x-large dark block class="pa-4" @click="openHomePage">
                    <span class="text-capitalize">
                        Powered by
                    </span>
                    <span class="font-weight-bold text-capitalize ml-1">
                        Transfer Thought
                    </span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
<script>
import StepViewerMixin from '../../mixins/StepViewMixin';

import { getStepDefinition } from '@/components/steps/types';

export default {
    name: 'EndingViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {
            replaying: false,
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
        end() {
            try {
                var end = this.$store.state.apps.state.state.end || {};
                return {
                    endImage: end.endImage || 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/animations/trophy.gif',
                    endAudio: end.endAudio || 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/SFX/Celebration_Orchestral.mp3',
                    endText: end.endText || 'Nice Job!',
                    confetti: typeof end.confetti === 'boolean' ? end.confetti : true,
                    linkEndText: end.linkEndText || 'More information here:',
                    links: end.links || [],
                };
            } catch {
                return {
                    endImage: 'default_image_url.jpg',
                    endAudio: 'default_audio_url.mp3',
                    endText: 'Nice Job!',
                    confetti: true,
                    linkEndText: 'More information here:',
                    links: [],
                };
            }
        },
    },
    mounted() {
        // TODO: this should be apart of the store or some audio service
        const audio = new Audio(this.end.endAudio);
        audio.volume = 0.25;

        //-----default image:
        // src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/animations/trophy.gif"
        //const audio = new Audio('https://tt-assets-us-east-1.s3.amazonaws.com/assets/SFX/Celebration_Orchestral.mp3');
        audio.play();
        if (this.end.confetti === true) {
            this.$confetti.start();
        }
        this.$emit('complete');
    },
    destroyed() {
        this.$confetti.stop();
    },
    methods: {
        async BeforeRunStep() {
            const sceneEl = document.querySelector('a-scene');
            if (sceneEl.is('vr-mode')) sceneEl.exitVR();
            await StepViewerMixin.methods.BeforeRunStep.call(this);
        },
        openHomePage() {
            window.open('https://transferthought.com');
        },
        convertArrayToCSVAndDownload(data, filename) {
            const csvData = [];

            // Add CSV header (assuming the keys of the first object in the array are the column names)
            const headers = Object.keys(data[0]);
            csvData.push(headers.join(','));

            // Convert data to CSV rows
            data.forEach((item) => {
                const values = headers.map((header) => item[header]);
                csvData.push(values.join(','));
            });

            // Create CSV content
            const csvContent = csvData.join('\n');

            // Create a Blob object and initiate download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename || 'data.csv';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        async downloadResponseData() {
            // for each step in the scene
            // get the id
            // get the name
            // check the results objects for an responses
            const responsePromises = this.state.steps.map(async (step) => {
                const stepResponse = this.state.responses[step.id] || {};
                const stepDefinition = await getStepDefinition(step.type);
                return {
                    'Step Name': step.name,
                    Completed: !!stepResponse.completed,
                    Response: (stepDefinition && stepDefinition.getTextFromResponseData && stepDefinition.getTextFromResponseData(step, stepResponse)) || '',
                };
            });
            const responseData = await Promise.all(responsePromises);
            this.convertArrayToCSVAndDownload(responseData, 'results.csv');
        },
        replay() {
            this.$store.dispatch('steps/setCurrentStepIndex', 0);
            //this.window.reload();
        },
        handleRedirect() {
            window.open(this.$route.query.redirect, '_self');
        },
    },
};
</script>

<style>
#end-list-link {
    list-style-type: none;
}
</style>
