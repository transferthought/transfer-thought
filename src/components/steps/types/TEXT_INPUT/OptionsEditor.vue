<template>
    <fragment>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">Text Label</label>
                <v-text-field
                    hide-details
                    outlined
                    class="input-style font-size-input"
                    placeholder="Label..."
                    :value="stepData.title"
                    @change="updateStepData('title', $event)"
                >
                    <template slot="prepend-inner">
                        <v-icon color="#adb5bd">
                            mdi-text-short
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
    methods: {},
};
</script>

<style scoped></style>
