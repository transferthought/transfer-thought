<template>
    <v-container id="title-overlay" align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <h1
            v-resize-text="{ ratio: 0.75, minFontSize: '30px', maxFontSize: '100px', delay: 200 }"
            class="title-overlay-text font-weight-bold text-center user-select-none tt-text white--text"
            style="text-shadow: -5px 5px 15px #060606;width: 100%"
        >
            {{ title }}
        </h1>
    </v-container>
</template>
<script>
import ResizeText from 'vue-resize-text';
import StepViewerMixin from '../../mixins/StepViewMixin';

import TemplateFactory from '@/tt-core/services/Templates';

export default {
    name: 'TitleOverlayViewer',
    directives: {
        ResizeText,
    },
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {};
    },
    computed: {
        title() {
            const template = TemplateFactory.buildTemplate(this.step.data.title);
            return template ? template.evaluate({ state: this.state }) : this.step.data.title;
        },
    },
    methods: {},
};
</script>

<style scoped></style>
