<template>
    <v-main class="bg-primary primary">
        <v-container>
            <v-row no-gutters justify="start">
                <a href="https://transferthought.com">
                    <v-img contain max-width="300" max-height="100" src="@/assets/images/TT-Logo-Text-Stacked-White.png" class="me-3" />
                </a>
            </v-row>
            <v-row justify="space-between">
                <v-col cols="12" md="5" align-self="center">
                    <v-card class="bg-secondary">
                        <div class="pa-10 pb-5">
                            <h2 id="redeem-title" class="text-h5 font-weight-bold">
                                Enter AppSumo Redemption Code
                            </h2>
                        </div>

                        <v-card-text class="pa-5 px-10 text-center font-size-root">
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="redeemCode">
                                <v-text-field
                                    id="user-code"
                                    v-model="code"
                                    outlined
                                    :rules="codeRules"
                                    required
                                    background-color="white"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="AppSumo Redemption Code"
                                    class="font-size-input placeholder-lighter text-color-light input-alternative input-focused-alternative input-icon"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-ticket-percent
                                        </v-icon>
                                    </template>
                                </v-text-field>

                                <v-btn
                                    :loading="loading"
                                    elevation="0"
                                    :ripple="false"
                                    height="43"
                                    class="font-weight-600 text-capitalize btn-primary py-3 px-6 rounded-sm"
                                    color="primary"
                                    type="submit"
                                    block
                                >
                                    Submit
                                </v-btn>
                            </v-form>
                        </v-card-text>
                        <v-card-text v-if="error" class="text-center red--text pt-0 text-subtitle-1">
                            {{ error }}
                        </v-card-text>

                        <v-card-text v-if="success" class="text-center green--text pt-0 text-subtitle-1">
                            Success! Your account has been upgraded.

                            <a href="/">
                                go to home page
                            </a>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="7" v-show="$vuetify.breakpoint.mdAndUp">
                    <v-img contain class="fill-height" src="@/assets/images/TT-Graphic-1.png" />
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import Client from '@/tt-api';
import gql from 'graphql-tag';

export default {
    name: 'RedeemCode',
    data() {
        return {
            valid: true,
            code: '',
            codeRules: [(v) => !!v || 'An AppSumo Redemption Code is required'],
            error: null,
            loading: false,
            success: false,
        };
    },
    methods: {
        async redeemCode() {
            this.error = null;
            this.loading = true;
            const {
                data: { getPromoCode: foundCode },
            } = await Client.Api.query({
                query: gql(Client.Queries.getPromoCode),
                variables: { id: this.code },
            });

            if (foundCode && foundCode.isValid) {
                await Client.Api.mutate({
                    mutation: gql(Client.Mutations.updatePromoCode),
                    variables: {
                        input: {
                            id: this.code,
                            isValid: false,
                        },
                    },
                });

                await this.$store.dispatch('user/updateUserPlan', { plan: 'pro' });

                // this.$router.push({ name: 'AdminHome' });
                this.success = true;
            } else {
                this.error = 'Invalid Code';
            }
            this.loading = false;
        },
    },
};
</script>
