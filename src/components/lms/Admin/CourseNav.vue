<template>
    <v-tabs
        class="ml-4"
        style="width: 500px"
        dark
    >
        <v-tab
            class="font-weight-600 text-h3 text-capitalize no-default-hover"
            :to="'/course/' + $route.params.courseId"
            exact
        >
            Description
        </v-tab>
        <v-tab
            class="font-weight-600 text-h3 text-capitalize no-default-hover"
            :to="'/course/' + $route.params.courseId + '/sections'"
            exact
        >
            Curriculum
        </v-tab>
        <v-tab
            class="font-weight-600 text-h3 text-capitalize no-default-hover"
            :to="'/course/' + $route.params.courseId + '/progress'"
            exact
        >
            Progress
        </v-tab>
        <slot name="AppendTabs" />
    </v-tabs>
</template>

<script>

export default {
    components: {
    },
    props: {
    },
    data: () => ({
    }),
    computed: {
    },
    methods: {
    },
};
</script>
