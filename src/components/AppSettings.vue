<template>
    <fragment>
        <v-dialog v-model="dialog" max-width="1000" eager persistent scrollable>
            <template v-slot:activator="{ on, attrs }">
                <v-btn id="app-settings-button" icon color="white" v-bind="attrs" v-on="on">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="label-color font-weight-600 mb-2 d-block">Settings</v-card-title>

                <v-card-text id="settings-title" style="height: 500px;">
                    <v-form ref="AppSettingsForm" v-model="appSettingsValid" lazy-validation>
                        <v-row justify="center">
                            <v-expansion-panels mandatory accordion id="settings-accordion">
                                <v-expansion-panel expand class="label-color mb-2 d-block">
                                    <v-expansion-panel-header>Course Details</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row id="v-step-14">
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    Title
                                                </label>
                                                <v-text-field
                                                    id="input-app-title"
                                                    v-model="courseTitleTemp"
                                                    hide-details
                                                    outlined
                                                    class="input-style font-size-input"
                                                    placeholder="Title..."
                                                >
                                                    <template slot="prepend-inner">
                                                        <v-icon color="#adb5bd">
                                                            mdi-text-short
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <ImageInput
                                                    id="v-step-10"
                                                    :src="courseThumbnailTemp"
                                                    title="Course Thumbnail"
                                                    @change="handleCourseImageChanged"
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    Show Remix Button
                                                    <v-icon
                                                        v-if="!userHasAccessToSetting('apps.canRemoveRemix')"
                                                        @click="handleShowProFeatureDialog('apps.canRemoveRemix')"
                                                    >
                                                        mdi-help-circle-outline
                                                    </v-icon>
                                                </label>
                                                <v-checkbox
                                                    :disabled="!userHasAccessToSetting('apps.canRemoveRemix')"
                                                    :input-value="getDefaultValue('settings.showRemix')"
                                                    @change="handleValueChange('settings.showRemix', $event)"
                                                ></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel expand class="label-color mb-2 d-block">
                                    <v-expansion-panel-header>Coach Settings</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row v-if="state.coach" id="v-step-19">
                                            <v-col>
                                                <ImageInput :src="coachImageTemp" title="Coach Thumbnail" @change="handleCoachImageChanged" />
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="state.coach" id="v-step-15">
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">Coach Voice</label>
                                                <VoiceOptions :voice="coachVoiceTemp" @change="handleCoachVoiceChanged" />
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="state.coach" id="v-step-15">
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">Show voice picker on each step?</label>
                                                <v-checkbox v-model="showVoicePickerPerStepTemp" @change="handleShowVoicePickerChanged"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                <v-expansion-panel expand class="label-color mb-2 d-block">
                                    <v-expansion-panel-header>Customize End Step</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <!-- end text -->
                                        <v-row id="v-step-20">
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    End Text
                                                </label>
                                                <v-text-field
                                                    v-model="endTextTemp"
                                                    hide-details
                                                    outlined
                                                    class="input-style font-size-input"
                                                    placeholder="End Text..."
                                                >
                                                    <template slot="prepend-inner">
                                                        <v-icon color="#adb5bd">
                                                            mdi-text-short
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <!-- end image -->
                                        <v-row v-if="state.coach" id="v-step-21">
                                            <v-col>
                                                <ImageInput :src="endImageTemp" title="End Image" class="font-weight-600" @change="handleEndImageChanged" />
                                            </v-col>
                                        </v-row>
                                        <!-- end audio -->
                                        <v-row id="v-step-22">
                                            <v-col>
                                                <AudioInput
                                                    :src="endAudioTemp"
                                                    title="End Audio"
                                                    class="font-weight-600"
                                                    outlined
                                                    @change="handleEndAudioChanged"
                                                />
                                            </v-col>
                                        </v-row>
                                        <!-- confetti option -->
                                        <v-row>
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    Confetti at the End
                                                </label>
                                                <v-select
                                                    v-model="confettiTemp"
                                                    :items="confetti"
                                                    outlined
                                                    class="input-style font-size-input"
                                                    @change="handleConfettiChanged"
                                                />
                                            </v-col>
                                        </v-row>
                                        <!-- List of links: -->
                                        <v-row>
                                            <v-col>
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    Label your list of links:
                                                </label>
                                                <v-text-field
                                                    v-model="linkEndTextTemp"
                                                    hide-details
                                                    outlined
                                                    class="input-style font-size-input"
                                                    placeholder="Click here for more information..."
                                                >
                                                    <template slot="prepend-inner">
                                                        <v-icon color="#adb5bd">
                                                            mdi-text-short
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-form v-model="isLinkValid" @submit.prevent="handleLinkSubmit" ref="NewLinkForm">
                                                    <label class="label-color font-weight-600 mb-2 d-block">
                                                        List of links
                                                    </label>
                                                    <v-text-field
                                                        v-model="newLinkValue"
                                                        outlined
                                                        class="input-style font-size-input"
                                                        placeholder="Paste links here..."
                                                        append-outer-icon="mdi-check"
                                                        @click:append-outer="handleLinkSubmit"
                                                        :rules="urlRules"
                                                    >
                                                        <template slot="prepend-inner">
                                                            <v-icon color="#adb5bd">
                                                                mdi-link
                                                            </v-icon>
                                                        </template>
                                                    </v-text-field>
                                                    <!-- all input elements go here -->
                                                </v-form>
                                                <v-row v-if="linksTemp.length > 0">
                                                    <v-col cols="12">
                                                        <ul>
                                                            <li v-for="(link, index) in linksTemp" :key="index">
                                                                <a :href="link" target="_blank">{{ link }}</a>
                                                                <v-btn icon @click="handleRemoveLink(index)" class="ml-2">
                                                                    <v-icon>mdi-delete</v-icon>
                                                                </v-btn>
                                                            </li>
                                                        </ul>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel expand class="label-color mb-2 d-block">
                                    <v-expansion-panel-header>Customize Styling</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col ref="editorcontainer">
                                                <label class="label-color font-weight-600 mb-2 d-block">
                                                    Brand Settings
                                                </label>
                                                <AceEditor v-model="styleTemp" width="100%" height="300px" theme="dracula" lang="css" />
                                            </v-col>
                                        </v-row>
                                        <!-- <v-row>
                    <v-col ref="editorcontainer">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Global Event Handler
                        </label>
                        <AceEditor v-model="code" width="100%" height="400px" theme="dracula" lang="javascript" @init="editorInit" />
                    </v-col>
                </v-row> -->
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                    <p class="error--text">{{ appSettingsError }}</p>
                    <v-spacer />
                    <v-btn text class="text-capitalize py-1 px-2" @click="handleCancel">
                        Cancel
                    </v-btn>
                    <v-btn id="v-step-16" depressed color="primary" class="font-weight-600 text-capitalize py-1 px-2" @click="handleSave">
                        Save
                    </v-btn>
                </v-card-actions>
                <v-tour name="myTourTitle" :steps="steps2">
                    <template slot-scope="tour">
                        <transition name="fade">
                            <v-step
                                v-if="tour.steps[tour.currentStep]"
                                :key="tour.currentStep"
                                :step="tour.steps[tour.currentStep]"
                                :previous-step="tour.previousStep"
                                :next-step="tour.nextStep"
                                :stop="tour.stop"
                                :is-first="tour.isFirst"
                                :is-last="tour.isLast"
                                :labels="tour.labels"
                            >
                                <template>
                                    <div slot="actions">
                                        <button class="v-step__button v-step__button-skip" @click="endTour()">
                                            Quit Tour
                                        </button>
                                        <button v-if="tour.currentStep === 0" class="v-step__button v-step__button-skip" @click="handleTour()">
                                            OK
                                        </button>
                                        <button v-if="tour.currentStep === 1" class="v-step__button v-step__button-skip" @click="handleTour2()">
                                            OK
                                        </button>
                                    </div>
                                </template>
                            </v-step>
                        </transition>
                    </template>
                </v-tour>
                <v-tour name="myTourVoice" :steps="steps4">
                    <template slot-scope="tour">
                        <transition name="fade">
                            <v-step
                                v-if="tour.steps[tour.currentStep]"
                                :key="tour.currentStep"
                                :step="tour.steps[tour.currentStep]"
                                :previous-step="tour.previousStep"
                                :next-step="tour.nextStep"
                                :stop="tour.stop"
                                :is-first="tour.isFirst"
                                :is-last="tour.isLast"
                                :labels="tour.labels"
                            >
                                <template>
                                    <div slot="actions">
                                        <button class="v-step__button v-step__button-skip" @click="endTour()">
                                            Quit Tour
                                        </button>
                                        <button class="v-step__button v-step__button-skip" @click="tour.stop">
                                            OK
                                        </button>
                                    </div>
                                </template>
                            </v-step>
                        </transition>
                    </template>
                </v-tour>
                <v-tour name="myTourSave" :steps="steps5">
                    <template slot-scope="tour">
                        <transition name="fade">
                            <v-step
                                v-if="tour.steps[tour.currentStep]"
                                :key="tour.currentStep"
                                :step="tour.steps[tour.currentStep]"
                                :previous-step="tour.previousStep"
                                :next-step="tour.nextStep"
                                :stop="tour.stop"
                                :is-first="tour.isFirst"
                                :is-last="tour.isLast"
                                :labels="tour.labels"
                            >
                                <template>
                                    <div slot="actions">
                                        <button class="v-step__button v-step__button-skip" @click="endTour()">
                                            Quit Tour
                                        </button>
                                        <button class="v-step__button v-step__button-skip" @click="tour.stop">
                                            OK
                                        </button>
                                    </div>
                                </template>
                            </v-step>
                        </transition>
                    </template>
                </v-tour>
                <v-tour name="myTourCoachThumb" :steps="steps3">
                    <template slot-scope="tour">
                        <transition name="fade">
                            <v-step
                                v-if="tour.steps[tour.currentStep]"
                                :key="tour.currentStep"
                                :step="tour.steps[tour.currentStep]"
                                :previous-step="tour.previousStep"
                                :next-step="tour.nextStep"
                                :stop="tour.stop"
                                :is-first="tour.isFirst"
                                :is-last="tour.isLast"
                                :labels="tour.labels"
                            >
                                <template>
                                    <div slot="actions">
                                        <button class="v-step__button v-step__button-skip" @click="endTour()">
                                            Quit Tour
                                        </button>
                                        <button class="v-step__button v-step__button-skip" @click="tour.stop">
                                            OK
                                        </button>
                                    </div>
                                </template>
                            </v-step>
                        </transition>
                    </template>
                </v-tour>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showProSettingsDialog" max-width="500px">
            <v-card>
                <v-card-title class="label-color mb-2 d-block">Upgrade to get access to use this feature</v-card-title>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text class="text-capitalize py-1 px-2" @click="showProSettingsDialog = false">
                        Close
                    </v-btn>
                    <v-btn id="v-step-16" depressed color="primary" class="font-weight-600 text-capitalize py-1 px-2" @click="openAccountPage">
                        Upgrade Account
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>

<script>
import _ from 'lodash';
import DefaultApp from '@/tt-core/scenes/360Objective/app';
import ImageInput from '@/components/ImageInput.vue';
import AudioInput from '@/components/AudioInput.vue';
import VoiceOptions from '@/components/steps/components/VoiceOptions.vue';
import { mapState } from 'vuex';
import AceEditor from 'vue2-ace-editor';

import 'brace/ext/language_tools'; // language extension prerequsite.
import 'brace/mode/javascript'; // language
import 'brace/mode/json'; // language
import 'brace/theme/dracula';
import 'brace/snippets/text'; // snippette
import 'brace/snippets/javascript';
import 'brace/snippets/json';
import 'brace/ext/language_tools'; // language extension prerequsite.
import 'brace/mode/css'; // language

export default {
    components: {
        ImageInput,
        AudioInput,
        AceEditor,
        VoiceOptions,
    },
    data: () => ({
        appSettingsValid: true,
        appSettingsError: null,
        dialog: false,
        showProSettingsDialog: false,
        isLinkValid: false,
        urlRules: [
            (value) => {
                // allow empty strings to reset
                if (!value) {
                    return 'You must enter a valid URL';
                }
                const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
                const isValidUrl = urlRegex.test(value);
                if (!isValidUrl) {
                    return 'Link should be a valid URL and should not contain spaces';
                }
                return true;
            },
        ],
        steps2: [
            {
                target: '#v-step-14',
                content: "Start by giving your new project a title. Then click 'OK'",
                params: {
                    placement: 'bottom',
                },
            },
            {
                target: '#v-step-10',
                content: 'Update the thumbnail that users will see before selecting your course, here.',
                params: {
                    placement: 'bottom',
                },
            },
        ],
        steps3: [
            {
                target: '#v-step-19',
                content: "Great, now let's choose a coach to guide us through our course, here.",
                params: {
                    placement: 'bottom',
                },
            },
        ],
        steps4: [
            {
                target: '#v-step-15',
                content: "Now let's choose a voice for that coach. This is the voice you'll hear thorughout your app, so choose wisely.",
                params: {
                    placement: 'bottom',
                },
            },
        ],
        steps5: [
            {
                target: '#v-step-16',
                content: "Great, now let's save these settings.",
                params: {
                    placement: 'bottom',
                },
            },
        ],
        styleTemp: '',
        tourStep: 0,
        courseTitleTemp: '',
        courseThumbnailTemp: '',
        coachImageTemp: '',
        endImageTemp: '',
        coachVoiceTemp: '',
        showVoicePickerPerStepTemp: false,
        endTextTemp: '',
        linkEndTextTemp: '',
        linksTemp: [],
        newLinkValue: '',
        endAudioTemp: '',
        confettiTemp: '',
        confetti: [
            { text: 'Yes', value: true },
            { text: 'No', value: false },
        ],
        links: [],
        proSettings: ['settings.removeRemix'],
        updates: [],
    }),
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
        }),
        action() {
            return this.$store.getters['apps/actions/getActionById']('TT_52573de7c11848f487ac56e059dc3ed0');
        },
        publishedUrl() {
            return this.$store.getters['apps/publishedUrl'];
        },
    },
    watch: {
        dialog() {
            if (this.dialog) {
                this.styleTemp = this.state.styles;
                this.courseTitleTemp = this.app.name;
                this.courseThumbnailTemp = this.app.thumbnail;
                this.coachImageTemp = this.state.coach.src;
                this.coachVoiceTemp = this.state.coach.voice;
                this.showVoicePickerPerStepTemp = this.state.coach.showVoicePickerPerStep || false;
                this.endImageTemp = this.state.end.endImage;
                this.endAudioTemp = this.state.end.endAudio;
                this.confettiTemp = this.state.end.confetti;
                this.linksTemp = this.state.end.links || [];

                this.nextTour();
            }
        },
    },
    methods: {
        handleShowVoicePickerChanged(newValue) {
            this.showVoicePickerPerStepTemp = newValue;
        },
        handleCoachVoiceChanged(newSource) {
            this.coachVoiceTemp = newSource;
            if (this.app.tour) {
                this.$tours.myTourVoice.stop();
                this.$tours.myTourSave.start();
            }
            return null;
        },
        handleCourseImageChanged(newSource) {
            this.courseThumbnailTemp = newSource;
            if (this.app.tour) {
                this.$tours.myTourTitle.stop();
                this.$tours.myTourCoachThumb.start();
            }
            return null;
        },
        handleCoachImageChanged(newSource) {
            this.coachImageTemp = newSource;
            if (this.app.tour) {
                this.$tours.myTourCoachThumb.stop();
                this.$tours.myTourVoice.start();
            }
            return null;
        },
        handleEndTextChanged(newSource) {
            this.endTextTemp = newSource;
        },
        handleLinkEndTextChanged(newSource) {
            this.linkEndTextTemp = newSource;
        },
        handleEndImageChanged(newSource) {
            this.endImageTemp = newSource;
        },
        handleEndAudioChanged(newSource) {
            this.endAudioTemp = newSource;
        },
        handleConfettiChanged(newSource) {
            this.confettiTemp = newSource;
        },
        userHasAccessToSetting(selector) {
            return this.$store.getters['user/hasAccess'](selector);
        },
        handleShowProFeatureDialog(selector) {
            const userHasAccessToSettings = this.userHasAccessToSetting(selector);
            if (!userHasAccessToSettings) {
                this.showProSettingsDialog = true;
            }
        },
        getDefaultValue(selector) {
            const value = _.get(this.state, selector, _.get(DefaultApp.state, selector));
            return value;
        },
        handleValueChange(selector, value) {
            this.updates.push({ selector, value });
        },
        handleLinkSubmit() {
            if (this.isLinkValid) {
                var pastedLink = this.newLinkValue.trim();
                console.log(pastedLink, pastedLink.startsWith('http://'), pastedLink.startsWith('https://'));
                if (pastedLink.startsWith('http://') || pastedLink.startsWith('https://')) {
                    this.linksTemp.push(pastedLink);
                } else {
                    this.linksTemp.push('http://' + pastedLink);
                }
                this.$refs.NewLinkForm.reset();
                this.newLinkValue = '';
            }
        },
        handleRemoveLink(index) {
            this.linksTemp.splice(index, 1);
        },
        handleCancel() {
            this.dialog = false;
        },
        handleTour() {
            this.tourStep = 1;
            this.$tours.myTourTitle.nextStep();
        },
        handleTour2() {
            this.tourStep = 2;
            this.$tours.myTourTitle.stop();
        },
        async handleSave() {
            const result = this.$refs.AppSettingsForm.validate();
            if (!result) {
                const errorInput = this.$refs.AppSettingsForm.inputs.find((input) => {
                    return input.errorBucket && input.errorBucket.length;
                });
                this.appSettingsError = errorInput.errorBucket[0];
                return;
            }
            this.appSettingsError = null;
            this.$store.dispatch('apps/state/update', {
                selector: 'coach.src',
                value: this.coachImageTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'coach.voice',
                value: this.coachVoiceTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'coach.showVoicePickerPerStep',
                value: this.showVoicePickerPerStepTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'end.endText',
                value: this.endTextTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'end.endImage',
                value: this.endImageTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'styles',
                value: this.styleTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'end.endAudio',
                value: this.endAudioTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'end.confetti',
                value: this.confettiTemp,
            });
            this.$store.dispatch('apps/state/update', {
                selector: 'end.linkEndText',
                value: this.linkEndTextTemp,
            });
            this.updates.forEach(({ selector, value }) => {
                this.$store.dispatch('apps/state/update', {
                    selector,
                    value,
                });
            });
            const customStyleTag = document.getElementById('custom-styles');
            customStyleTag.innerHTML = this.styleTemp;
            this.$store.commit('apps/updateName', this.courseTitleTemp);
            this.$store.dispatch('apps/updateApp', {
                type: 'master',
                thumbnailUrl: this.courseThumbnailTemp,
            });
            this.dialog = false;
        },
        fullscreen() {
            this.$refs.editorcontainer.requestFullscreen();
        },
        editorInit(editor) {
            editor.setShowPrintMargin(false);
        },
        endTour() {
            this.app.tour = false;
            this.$tours.myTourCoachThumb.stop();
            this.$tours.myTourSave.stop();
            this.$tours.myTourVoice.stop();
            this.$tours.myTourTitle.stop();
        },
        nextTour() {
            if (this.$tours.myTourTitle && this.app.tour) {
                // this.$tours.myTourTitle.start();
            }
        },
        openAccountPage() {
            window.open('https://scenario.transferthought.com/account');
        },
    },
};
</script>

<style>
#settings-accordion {
    padding-top: 24px !important;
}
#settings-title {
    margin-bottom: 0px !important;
    margin: 0px !important;
}
</style>
