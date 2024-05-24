<template>
    <v-btn icon style="display:flex" class="mx-1" depressed @click="handleClick">
        <v-row no-gutters justify="center" align="center" height="100%" style="min-width:40px">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-col v-bind="attrs" v-on="on" cols="12">
                        <v-icon color="grey darken-1" style="font-size:30px">
                            {{ icon }}
                        </v-icon>
                    </v-col>
                </template>
                <span>{{ text }}</span>
            </v-tooltip>
            <!-- <v-col cols="12" color="grey darken-2" class="text-h4 text-capitalize pt-1 font-weight-500" v-if="$vuetify.breakpoint.mdAndUp">
                {{ text }}
            </v-col> -->
        </v-row>
    </v-btn>
</template>
<script>
export default {
    name: 'ToolbarBtn',
    components: {},
    props: {
        icon: String,
        text: String,
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        handleClick(e) {
            this.$emit('click', e);
        },
    },
};
</script>

<style scoped></style>
