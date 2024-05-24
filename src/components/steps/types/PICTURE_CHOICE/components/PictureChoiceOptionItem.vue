<template>
    <v-item v-slot="{ active, toggle }">
        <v-card outlined :color="!editing && active ? 'primary' : ''" v-on="!editing ? { click: toggle } : {}">
            <v-row>
                <v-col>
                    <ImageInput :src="option.src" :height="200" :disabled="!editing" @change="handleOptionImageChanged(option.id, $event)" />
                    <v-hover>
                        <template v-slot:default="{ hover }">
                            <v-card-title :class="!editing && active ? 'white--text' : ''">
                                <v-btn depressed class="mr-2" style="min-width: 24px" small :color="!editing && active ? '' : 'grey'">
                                    {{ convertIndexToCharCode(index) }}
                                </v-btn>

                                <TextSpeaker :text="option.value" />
                                <ClickToEditTextInput :value="option.value" @change="handleOptionValueChanged(option.id, $event)">
                                    <template v-slot:Display="{ value, edit }">
                                        <span @click="edit">{{ value }}</span>
                                        <v-btn v-show="editing && hover" icon x-small @click="edit">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                </ClickToEditTextInput>
                            </v-card-title>
                        </template>
                    </v-hover>
                </v-col>
            </v-row>
        </v-card>
    </v-item>
</template>
<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import ImageInput from '@/components/ImageInput.vue';
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';
import TextSpeaker from '@/components/TextSpeaker.vue';
import OptionsMixin from '../../../mixins/OptionsMixin';

export default {
    name: 'Hotspot',
    components: {
        ImageInput,
        ClickToEditTextInput,
        TextSpeaker,
    },
    mixins: [OptionsMixin],
    props: {
        option: Object,
        index: Number,
        editing: Boolean,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
        }),
    },
    watch: {},
    mounted() {},
    methods: {
        async handleOptionImageChanged(id, thumbnailUrl) {
            this.updateOptionKey(id, 'src', thumbnailUrl);
        },
        handleOptionValueChanged(id, newValue) {
            this.updateOptionKey(id, 'value', newValue);
        },
        convertIndexToCharCode(index) {
            return String.fromCharCode(index + 65);
        },
    },
};
</script>

<style scoped></style>
