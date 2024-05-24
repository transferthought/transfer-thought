<template>
    <v-container />
</template>
<script>
import ActionService from '@/services/action-service';
import StepViewerMixin from '../../mixins/StepViewMixin';

export default {
    name: 'AdvancedInteractionViewer',
    components: {},
    mixins: [StepViewerMixin],
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        async RunStep() {
            if (this.step.data.customActionId) {
                ActionService.runAction(this.step.data.customActionId);
            } else {
                this.next();
            }
        },
    },
};
</script>

<style></style>
