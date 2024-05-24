<template>
    <v-dialog :value="show" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="text-h4 text-typo font-weight-600">Delete {{ type }}?</span>
            </v-card-title>

            <v-card-text>
                Are you sure you want to delete
                <span class="text-typo font-weight-600">{{ name }}</span>
                ?
            </v-card-text>

            <v-card-text><slot name="ExtraOptions" /></v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn class="font-weight-600 text-h5 text-capitalize" text @click="cancel">
                    No
                </v-btn>
                <v-btn :loading="loading" class="font-weight-600 text-h5 text-capitalize" depressed color="error" @click="confirm">
                    Yes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmationDialog',
    components: {},
    props: {
        name: String,
        type: String,
        show: Boolean,
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        confirm() {
            this.$emit('confirm');
        },
    },
};
</script>
