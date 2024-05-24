<template>
    <v-container fluid class="pa-0 ma-0 pointer-events-none" style="flex-direction:column;flex-wrap: nowrap;">
        <portal to="toolbar-center">
            <v-card light outlined id="step-toolbar-container">
                <v-card-text class="pa-6">
                    <v-row class="align-center flex-wrap-no-wrap">
                        <slot name="Toolbar" />
                    </v-row>
                </v-card-text>
            </v-card>
        </portal>
        <v-row style="flex:1; width: 100%;overflow:hidden" class="pointer-events-none" no-gutters>
            <slot name="Hero"></slot>
        </v-row>
        <v-row style="flex:0; width: 100%;" no-gutters class="pointer-events-auto">
            <slot name="Footer">
                <TranscriptEditor id="transcript-container" class="ma-5" />
            </slot>
        </v-row>
    </v-container>
</template>
<script>
import TranscriptEditor from './TranscriptEditor.vue';

export default {
    name: 'StepOverlayLayout',
    components: {
        TranscriptEditor,
    },
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {},
};
</script>

<style scoped>
#step-toolbar-container {
    width: max-content;
    margin: auto;
}
</style>
