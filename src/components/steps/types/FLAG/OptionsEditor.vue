<template>
    <fragment>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">
                    Flag Options
                </label>
                <v-row v-for="option in currentOptions" :key="option.id" align="center">
                    <v-col cols="2">
                        <v-text-field
                            :value="option.pointValue || 0"
                            solo
                            hide-details
                            single-line
                            type="number"
                            @change="handlePointValueChange(option, $event)"
                        />
                    </v-col>
                    <v-col>
                        <HotspotIconDropdown :value="option.icon" />
                    </v-col>
                    <v-col>
                        <v-select
                            :items="flagOptions"
                            class="mx-4"
                            label="Select Value"
                            :value="option.expectedValue"
                            @change="handledExpectedValueChange(option, $event)"
                            solo
                        >
                            <template v-slot:selection="{ item }">
                                <v-list-item-icon>
                                    <v-icon large>
                                        {{ item.icon }}
                                    </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.text }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <template v-slot:item="{ item }">
                                <v-list-item-icon>
                                    <v-icon large>
                                        {{ item.icon }}
                                    </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.text }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="1">
                        <v-btn icon x-small @click="deleteOption(option.id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Confirmation Button Label</label>
                <v-text-field
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    placeholder="Confirmation Button..."
                    :value="stepData.confirmationButton || 'Submit'"
                    @change="updateStepData('confirmationButton', $event)"
                >
                    <template slot="prepend-inner">
                        <v-icon color="#adb5bd">
                            mdi-button
                        </v-icon>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </fragment>
</template>
<script>
import _ from 'lodash';
import OptionEditorMixin from '../../mixins/OptionEditorMixin';
import OptionsMixin from '../../mixins/OptionsMixin';
import HotspotIconDropdown from '../../components/HotspotIconDropdown.vue';

export default {
    name: 'FlagOptionsEditor',
    components: {
        HotspotIconDropdown,
    },
    mixins: [OptionEditorMixin, OptionsMixin],
    props: {
        step: Object,
    },
    data() {
        return {
            showOptionSettingsDialog: false,
            editingOption: null,
            flagOptions: [
                { value: 'green', icon: 'thumb_up', text: 'Green Flag' },
                { value: 'red', icon: 'thumb_down', text: 'Red Flag' },
            ],
        };
    },
    computed: {},
    methods: {
        handleNewHotspotIconChange(option, newValue) {
            option.icon = newValue;
        },
        handlePointValueChange(option, newValue) {
            option.pointValue = parseInt(newValue);
        },
        handledExpectedValueChange(option, newValue) {
            option.expectedValue = newValue;
        },
    },
};
</script>

<style scoped></style>
