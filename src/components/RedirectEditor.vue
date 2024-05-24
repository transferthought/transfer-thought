<template>
    <fragment>
        <v-form ref="RedirectForm" v-model="redirectIsValid" @submit.prevent="handleSave">
            <v-row>
                <v-col>
                    <label class="label-color font-weight-600 mb-2 d-block">
                        Specify a Custom URL
                    </label>
                    <v-text-field v-model="customRedirectUrlTemp" dense :rules="rules" outlined class="" placeholder="Custom-link-here" clearable>
                        <template slot="prepend-inner">
                            <v-icon color="#adb5bd">
                                mdi-text-short
                            </v-icon>
                        </template>
                        <template v-slot:append-outer>
                            <v-btn
                                depressed
                                type="submit"
                                :loading="saving"
                                color="primary"
                                class="font-weight-600 text-capitalize py-1 px-2 mt-n2"
                                :disabled="!hasCustomRedirectUrlChanged || !redirectIsValid"
                            >
                                Save
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <p class="error--text">{{ error }}</p>
        </v-form>
        <v-row>
            <v-col>
                <label class="label-color font-weight-600 mb-2 d-block">
                    Your Public Link
                    <v-tooltip bottom v-if="hasCustomRedirectUrlChanged">
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" color="red">
                                mdi-help-circle-outline
                            </v-icon>
                        </template>
                        <span>
                            Your custom URL has changed but has not been saved yet. Please save your changes to update this link.
                        </span>
                    </v-tooltip>
                </label>

                {{ publishedUrl }}
                <v-btn icon @click="copyValue(publishedUrl)">
                    <v-icon>
                        mdi-content-copy
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </fragment>
</template>

<script>
import Client from '@/tt-api';
import gql from 'graphql-tag';

export default {
    // specify TiptapVuetify component in "components"
    components: {},
    props: {
        resourceType: {
            type: String,
            default: '',
        },
        resourceId: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        saving: false,
        redirectIsValid: true,
        error: null,
        customRedirectUrlTemp: null,
        rules: [
            (value) => {
                // allow empty strings to reset
                if (!value) {
                    return true;
                }
                const urlSegmentRegex = /^[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
                const isValidUrlSegment = urlSegmentRegex.test(value);
                if (!isValidUrlSegment) {
                    return 'Custom URL should be a valid path name and should not contain spaces';
                }
                return true;
            },
        ],
    }),
    watch: {
        redirectData: {
            handler() {
                this.customRedirectUrlTemp = this.redirectData?.destination;
            },
            immediate: true,
        },
    },
    computed: {
        resourceSource() {
            return `/${this.resourceType}/${this.resourceId}`;
        },
        redirectData() {
            return this.$store.getters[`redirect/redirectData`];
        },
        publishedUrl() {
            return this.$store.getters[`${this.resourceType}/publishedUrl`](this.resourceId);
        },
        hasCustomRedirectUrlChanged() {
            if (this.customRedirectUrlTemp?.length) {
                if (this.redirectData?.destination && this.redirectData?.destination === this.customRedirectUrlTemp) {
                    return false;
                }
                return true;
            } else {
                if (this.redirectData?.destination) {
                    return true;
                }
                return false;
            }
        },
    },
    methods: {
        copyValue(value) {
            navigator.clipboard.writeText(value);
            this.$store.commit('apps/snackMessage', {
                message: 'Link Copied',
                color: 'success',
            });
        },
        handleCancel() {
            this.customRedirectUrlTemp = null;
        },
        async handleSave() {
            this.error = null;

            const result = this.$refs.RedirectForm.validate();
            if (!result) {
                const errorInput = this.$refs.RedirectForm.inputs.find((input) => {
                    return input.errorBucket && input.errorBucket.length;
                });
                this.error = errorInput.errorBucket[0];
                return;
            }
            if (this.hasCustomRedirectUrlChanged) {
                this.saving = true;

                if (this.customRedirectUrlTemp) {
                    const {
                        data: { sourceByDestination },
                    } = await Client.Api.query({
                        query: gql(Client.Queries.sourceByDestination),
                        variables: { destination: this.customRedirectUrlTemp },
                        fetchPolicy: 'no-cache',
                    });

                    const redirect = sourceByDestination?.items?.length ? sourceByDestination.items[0] : null;
                    if (redirect) {
                        this.error = 'Custom URL is already taken.';
                        this.saving = false;
                        return;
                    }

                    if (this.redirectData) {
                        this.$store.dispatch(`redirect/updateRedirect`, {
                            source: this.resourceSource,
                            destination: this.customRedirectUrlTemp,
                        });
                    } else {
                        this.$store.dispatch(`redirect/createRedirect`, {
                            source: this.resourceSource,
                            destination: this.customRedirectUrlTemp,
                        });
                    }
                } else {
                    this.$store.dispatch(`redirect/deleteRedirect`, {
                        source: this.resourceSource,
                    });
                }
                this.saving = false;
            }
        },
    },
};
</script>
