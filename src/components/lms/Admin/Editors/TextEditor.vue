<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col class="pa-4" cols="12">
                <HtmlEditor :value="initialValue" @input="handleTextChange" />
            </v-col>
        </v-row>
    </v-layout>
</template>
<script>
import _ from 'lodash';
import HtmlEditor from '@/components/HtmlEditor.vue';
import EditorMixin from '@/mixins/EditorMixin';

export default {
    name: 'Editor',
    components: {
        HtmlEditor,
    },
    mixins: [EditorMixin],
    props: {
        appId: {
            type: String,
            default: null,
        },
    },
    data() {
        return { initialValue: '' };
    },
    computed: {},
    watch: {
        state: {
            handler() {
                if (this.app) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
    },
    async mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
        this.handleTextChange = _.debounce(this.handleTextChange, 2000, { leading: false });

        this.initialValue = this.state.value;
    },
    methods: {
        async publish() {
            await this.publishApp();
        },
        async handleTextChange(newValue) {
            await this.$store.dispatch('apps/state/update', {
                selector: 'value',
                value: newValue,
            });
        },
    },
};
</script>

<style scoped></style>
