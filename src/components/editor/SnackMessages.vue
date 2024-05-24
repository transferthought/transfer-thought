<template>
    <v-snackbar v-model="show" :bottom="true" :color="color" :timeout="5000">
        {{ message }}
        <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="show = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import _ from 'lodash';

const DEFAULT_COLOR = '';
export default {
    name: 'SnackMessages',
    data() {
        return {
            show: false,
            message: '',
            color: DEFAULT_COLOR,
        };
    },
    computed: {
        snack() {
            return this.$store.state.apps.snack;
        },
    },
    watch: {
        snack() {
            if (!_.isEmpty(this.snack)) {
                this.show = true;
                if (_.isObject(this.snack)) {
                    this.message = this.snack.message;
                    this.color = this.snack.color || DEFAULT_COLOR;
                } else {
                    this.message = this.snack;
                    this.color = DEFAULT_COLOR;
                }
            }
        },
        show() {
            if (!this.show) {
                this.$store.commit('apps/snackMessage', null);
            }
        },
    },
    methods: {},
};
</script>
