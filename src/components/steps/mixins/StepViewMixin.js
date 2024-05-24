import TextToSpeech from '@/services/texttospeech-service';
import Coach from '@/services/coach-service';
import { getStepDefinition } from '../types';

export default {
    components: {},
    props: {
        step: Object,
    },
    data() {
        return {
            Coach,
            stepStartTime: null,
            currentStepDefinition: null,
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
        appContext() {
            try {
                return this.$store.state.apps.context;
            } catch {
                return {};
            }
        },
        steps() {
            return this.state.steps;
        },
        coach() {
            return this.state.coach;
        },
        currentEnvironment() {
            return this.state.currentEnvironment;
        },
        currentStepIndex() {
            return this.$store.state.steps.currentStepIndex;
        },
        currentStepAutoProgressSetting() {
            const autoProgressType = this.step?.data?.autoProgressType;
            if (autoProgressType) {
                return autoProgressType;
            }
            return 'transcript';
            // TODO: add this back in when figured out best way to handle versions
            // return this.currentStepDefinition?.defaults?.autoProgressType || 'transcript';
        },
        currentStepTimoutSeconds() {
            return this.step.data.timeoutSeconds;
        },
        started() {
            return this.$store.state.steps.started;
        },
        paused() {
            return this.$store.state.steps.paused;
        },
    },
    async mounted() {
        await this.BeforeRunStep();
        if (this.started && !this.paused) {
            await this.RunStep();
        }
    },
    async beforeDestroy() {
        await this.BeforeExitStep();
    },
    watch: {
        started() {
            if (!this.paused) {
                this.RunStep();
            }
        },
        paused() {
            if (this.paused) {
                this.pause();
            } else {
                this.RunStep();
            }
        },
    },
    methods: {
        pause() {
            this.Coach.pause();
        },
        async resume() {
            await this.Coach.updateTranscript(this.step.data.transcript, this.step?.data?.voice || this.coach.voice);
            this.Coach.play();
        },
        checkAutoProgress() {
            // TODO: this can be moved into an Assessment Mixin
            if (this.currentStepDefinition && this.currentStepDefinition.category !== 'ASSESSMENT') {
                if (this.currentStepAutoProgressSetting === 'timeout') {
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - this.stepStartTime;
                    const timeRemaining = this.currentStepTimoutSeconds * 1000 - elapsedTime;
                    if (timeRemaining > 0) {
                        this.next(timeRemaining + 500);
                    } else {
                        this.next(500);
                    }
                } else if (this.currentStepAutoProgressSetting === 'transcript') {
                    this.next(500);
                }
            }
        },
        next(timer = 0) {
            setTimeout(() => {
                this.$store.dispatch('steps/next');
            }, timer);
        },
        async BeforeRunStep() {
            console.log('ENTER STEP', this.step.id);
            if (this.step.data.transcript) {
                await this.updateCoachTranscript();
            } else {
                this.Coach.clearTranscript();
            }
            const stepDefinition = await getStepDefinition(this.step.type);
            if (stepDefinition) {
                this.currentStepDefinition = stepDefinition;
            } else {
                this.currentStepDefinition = {};
            }
        },
        async updateCoachTranscript() {
            const transcriptId = await this.Coach.updateTranscript(this.step.data.transcript, this.step?.data?.voice || this.coach.voice);
            this.Coach.$on(`transcript.${transcriptId}.ended`, this.checkAutoProgress.bind(this));
        },
        async RunStep() {
            this.stepStartTime = Date.now();
            if (this.Coach.transcript) {
                this.Coach.play();
            } else {
                this.checkAutoProgress();
            }
        },
        async BeforeExitStep() {
            console.log('EXIT STEP', this.step.id);
            if (this.Coach.transcript) {
                this.Coach.clearTranscript();
            }

            this.Coach.$off('ended');
        },
    },
};
