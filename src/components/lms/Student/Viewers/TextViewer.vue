<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col class="pa-4" cols="12">
                <HtmlEditor :value="initialValue" read-only />
            </v-col>
        </v-row>
    </v-layout>
</template>
<script>
import HtmlEditor from '@/components/HtmlEditor.vue';
import { mapState } from 'vuex';

export default {
    name: 'Editor',
    components: {
        HtmlEditor,
    },
    mixins: [],
    props: {
        appId: {
            type: String,
            default: null,
        },
    },
    data() {
        return { initialValue: '' };
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
    },
    watch: {},
    async mounted() {
        this.initialValue = this.state.value;
    },
    methods: {},
};
</script>

<style scoped></style>
