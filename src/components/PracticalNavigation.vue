<template>
    <div class="pa-0">
        <v-toolbar
            color="primary"
            v-if="!drawer"
            elevation="5"
            absolute
            id="steps-menu"
            class="ma-0 ma-md-5 floating-toolbar dark-background tt-text"
            dark
            rounded
            extended
            :height="40"
            :extension-height="24"
            style="z-index:25"
            width="800px"
        >
            <v-btn icon @click="drawer = !drawer">
                <v-icon class="tt-text">mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title v-if="!drawer" class="tt-text pl-0 wrap toolbar-title font-weight-600 text-capitalize">
                {{ currentStep && currentStep.name }}
            </v-toolbar-title>

            <v-spacer />
            <v-btn icon x-large @click="back()">
                <v-icon class="tt-text">
                    mdi-skip-previous
                </v-icon>
            </v-btn>
            <v-btn icon x-large @click="next()">
                <v-icon class="tt-text">
                    mdi-skip-next
                </v-icon>
            </v-btn>
            <template v-slot:extension>
                <v-progress-linear class="dark-background" :value="appProgress" color="white accent-4" rounded height="6" />
                <span class="ml-2 tt-text">{{ currentStepIndex + 1 }}/{{ steps && steps.length }}</span>
            </template>
        </v-toolbar>

        <v-navigation-drawer class="light-background" v-model="drawer" absolute width="800px" max-width="100%" style="opacity: 90%;z-index:25" temporary>
            <template v-slot:prepend>
                <div class="light-background pa-2" elevation="0" extended :extension-height="24">
                    <v-row no-gutters>
                        <v-col cols="11">
                            <div class="tt-text text-h5 pl-0 font-weight-bold text-capitalize">
                                {{ currentStep && currentStep.name }}
                            </div>
                        </v-col>

                        <v-col cols="1">
                            <v-btn icon @click="drawer = false">
                                <v-icon class="tt-text">mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row no-gutters align="center">
                        <v-col cols="11" class="pr-3">
                            <v-progress-linear :value="appProgress" color="primary accent-4" rounded height="6" />
                        </v-col>
                        <v-col cols="1">
                            <span class="">{{ currentStepIndex + 1 }}/{{ steps && steps.length }}</span>
                        </v-col>
                    </v-row>
                </div>
                <v-divider />
            </template>

            <v-list class="tt-text" id="objective-list">
                <fragment v-for="(step, index) in steps" :key="step.id">
                    <v-list-item
                        class="light-background"
                        :class="{
                            'objective-item': true,
                            current: currentStep && currentStep.id === step.id,
                            completed: isStepCompleted(step),
                        }"
                        v-if="isVisible(step)"
                        @click="handleStepClick(index)"
                    >
                        <v-list-item-icon>
                            <v-icon class="light-background" color="primary">
                                {{ isStepCompleted(step) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
                            </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="tt-text">
                                {{ step.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                                v-if="(isStepCompleted(step) || isCurrentStep(step)) && step.data.transcript"
                                class="tt-text mt-2 step-transcript"
                            >
                                {{ step.data.transcript }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </fragment>
            </v-list>

            <template v-slot:append>
                <v-divider />
                <!-- <v-list>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-help-circle-outline</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Help</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-cog</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Preferences</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-exit-to-app</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Exit</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list> -->
                <v-btn block tile color="primary darken-4" dark x-large @click="openHomePage">
                    <span class="font-weight-light text-h5 text-capitalize">
                        Powered by
                    </span>
                    <span class="font-weight-bold text-h5 text-capitalize ml-1">
                        Transfer Thought
                    </span>
                </v-btn>
            </template>
        </v-navigation-drawer>
    </div>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
    name: 'PracticalNavigation',
    components: {},
    props: {},
    data() {
        return {
            drawer: false,
        };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
        steps() {
            return this.state.steps;
        },
        completedSteps() {
            const result = _.countBy(this.steps, this.isStepCompleted.bind(this));
            return result.true || 0;
        },
        responses() {
            return this.state.responses;
        },
        currentStep() {
            return this.state.currentStep;
        },
        currentStepIndex() {
            return this.$store.state.steps.currentStepIndex;
        },
        appProgress() {
            if (this.steps && this.steps.length) {
                return ((this.currentStepIndex + 1) / this.steps.length) * 100;
            }
            return 0;
        },
    },
    methods: {
        back() {
            this.$store.dispatch('steps/back');
        },
        next() {
            this.$store.dispatch('steps/next');
        },
        openHomePage() {
            window.open('https://transferthought.com');
        },
        isVisible(step) {
            if (step.type === 'SET_ENVIRONMENT' && !step.data.transcript) {
                return false;
            }
            return true;
        },
        isStepCompleted(step) {
            const stepResponses = this.responses[step.id];
            return stepResponses ? stepResponses.completed : false;
        },

        isCurrentStep(step) {
            return this.currentStep && this.currentStep.id === step.id;
        },
        handleStepClick(stepIndex) {
            this.$store.dispatch('steps/setCurrentStepIndex', stepIndex);
        },
    },
};
</script>
<style scoped>
#objective-list .objective-item {
    color: var(--v-background-darken4) !important;
}
#objective-list .objective-item.completed {
    color: black !important;
}
#objective-list .objective-item.current {
    color: black !important;
    font-weight: bold;
}

#objective-list .objective-item .step-transcript {
    white-space: normal;
}
.floating-toolbar {
    width: 800px;
    max-width: 100%;
}
</style>
