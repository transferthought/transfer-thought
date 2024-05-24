<template>
    <v-container
        fluid
        class="pa-0 ma-0"
        style="overflow: auto; height: 100vh"
    >
        <v-app-bar
            color="primary"
            dark
            flat
        >
            <slot name="PageNavAction">
                <v-btn
                    v-if="parentRoute"
                    icon
                    @click="back"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </slot>
            <v-toolbar-title
                class="toolbar-title font-weight-600 text-h2 text-capitalize"
            >
                <slot name="PageTitle" />
            </v-toolbar-title>

            <slot name="SubPages" />
            <v-spacer />

            <slot name="PageActions" />
        </v-app-bar>
        <v-container
            fluid
            class="primary pa-0 pt-md-5 px-md-6 pb-md-16"
        />

        <v-container
            fluid
            class="pa-0 px-md-6 mt-md-n16"
        >
            <slot />
        </v-container>
        <SnackMessages />
    </v-container>
</template>

<script>
import SnackMessages from '@/components/editor/SnackMessages.vue';
import RoutingMixin from '@/mixins/RoutingMixin';

export default {
    components: {
        SnackMessages,
    },
    mixins: [RoutingMixin],
    props: {
    },
    data: () => ({
    }),
    computed: {
        parentRoute() {
            return this.$route.meta && this.$route.meta.parentRoute;
        },
    },
    methods: {
        back() {
            this.to(this.parentRoute, this.$route.params);
        },
    },
};
</script>
