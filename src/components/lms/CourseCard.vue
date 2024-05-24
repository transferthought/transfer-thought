<template>
    <v-card
        class="card-shadow mb-6"
        rounded
        :ripple="false"
        @click="$emit('click')"
    >
        <v-img
            :src="course.thumbnailUrl"
            height="210"
        >
            <template v-slot:placeholder>
                <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                >
                    <v-icon x-large>
                        mdi-image
                    </v-icon>
                </v-row>
            </template>
        </v-img>

        <slot name="Menu" />
        <v-card-text class="card-padding">
            <h2 class="text-h2 text-typo font-weight-600 mb-0">
                {{ course.title }}
            </h2>
            <!-- <small class="text-muted">by John Snow on Oct 29th at 10:23 AM</small> -->
            <p class="font-weight-light text-body mt-6">
                {{ course.description }}
            </p>
        </v-card-text>
    </v-card>
</template>

<script>

export default {
    components: {
    },
    mixins: [],
    props: {
        course: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
    }),
    computed: {
    },
    methods: {
    },
};
</script>
