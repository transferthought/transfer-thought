<template>
    <fragment />
</template>
<script>
import ResizeText from 'vue-resize-text';
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'ClipboardOverlayViewer',
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
        app() {
            return this.$store.state.apps;
        },
        state() {
            return this.$store.state.apps.state.state;
        },
        clipboard() {
            if (this.state?.currentEnvironment?.data) {
                const { clipboard } = this.state.currentEnvironment.data;
                if (clipboard && clipboard.length) {
                    return clipboard[0];
                }
            }
            return null;
        },
    },
    watch: {
        'clipboard.pages': {
            handler() {
                if (this.app.context.mode === 'edit') {
                    if (this.clipboard && this.clipboard.pages && this.clipboard.pages.length) {
                        this.showClipboard();
                    } else {
                        this.closeClipboard();
                    }
                }
            },
        },
    },
    methods: {
        showClipboard() {
            if (this.clipboard && this.clipboard.pages && this.clipboard.pages.length) {
                this.$store.dispatch('apps/state/update', {
                    selector: 'currentEnvironment.data.clipboard[0].visible',
                    value: true,
                });
            }
        },
        closeClipboard() {
            this.$store.dispatch('apps/state/update', {
                selector: 'currentEnvironment.data.clipboard[0].visible',
                value: false,
            });
        },
        async BeforeRunStep() {
            this.showClipboard();
            await StepViewerMixin.methods.BeforeRunStep.call(this);
        },
        async BeforeExitStep() {
            this.closeClipboard();
            await StepViewerMixin.methods.BeforeExitStep.call(this);
        },
    },
};
</script>

<style scoped></style>
