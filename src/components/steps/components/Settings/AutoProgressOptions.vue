<template>
    <v-row>
        <v-col>
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">Step Progression Type</label>
                    <v-select
                        id="auto-progress-type"
                        :value="autoProgressType"
                        :items="options"
                        outlined
                        class="input-style font-size-input"
                        @change="updateStepData('autoProgressType', $event)"
                    />
                </v-col>
                <v-col v-if="autoProgressType === 'timeout'">
                    <label class="label-color font-weight-600 mb-2 d-block">Timeout in seconds</label>
                    <v-text-field
                        id="auto-progress-timout-seconds"
                        :value="timeoutSeconds"
                        type="number"
                        outlined
                        class="input-style font-size-input"
                        @change="updateStepData('timeoutSeconds', $event)"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script>
import OptionEditorMixin from '../../mixins/OptionEditorMixin';

export default {
    name: 'AutoProgressOptions',
    components: {},
    mixins: [OptionEditorMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            fields: ['autoProgressType', 'timeoutSeconds'],
            options: [
                { text: 'Transcript', value: 'transcript' },
                { text: 'Timeout', value: 'timeout' },
                { text: 'Pause', value: 'pause' },
            ],
        };
    },
    computed: {
        autoProgressType() {
            const autoProgressType = this.stepData.autoProgressType;
            if (autoProgressType) {
                return autoProgressType;
            }
            return this.stepDefinition?.defaults?.autoProgressType;
        },
        timeoutSeconds() {
            const timeoutSeconds = this.stepData.timeoutSeconds;
            if (timeoutSeconds) {
                return timeoutSeconds;
            }
            return this.stepDefinition?.defaults?.timeoutSeconds;
        },
    },
    methods: {},
};
</script>

<style scoped></style>
