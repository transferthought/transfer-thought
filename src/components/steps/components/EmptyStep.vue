<template>
    <v-container contain align="center" justify="center" class="fill-height pointer-events-none pa-5">
        <v-card id="empty-step" width="100%" max-height="100%" contain class="pointer-events-auto pa-5">
            <EmptyMessage title="Almost there!" description="Open the options to update this step." />
            <v-card-actions class="d-flex justify-center">
                <v-btn @click="$emit('open-step-options-dialog')" depressed color="primary" class="font-weight-600 text-capitalize py-1" x-large>
                    <v-icon dark style="font-size:30px" class="mr-2">
                        mdi-cog
                    </v-icon>
                    Open Step Options
                </v-btn>
            </v-card-actions>
            <!-- <v-img src="@/assets/images/EmptyStates/State-1.png" cover height="100%" width="100%" /> -->
        </v-card>
    </v-container>
</template>
<script>
import EmptyMessage from '../../EmptyMessage.vue';

export default {
    name: 'EmptyStep',
    components: { EmptyMessage },
    props: {},
    data() {
        return {};
    },
    computed: {},
    methods: {},
};
</script>

<style>
.empty-image-container {
    position: absolute;
    width: 100%;
    bottom: 0;
}
</style>
