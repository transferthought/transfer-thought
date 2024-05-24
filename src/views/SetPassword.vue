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
                    <v-card class="bg-secondary mt-15">
                        <v-row class="d-flex pt-5">
                            <v-col cols="12" md="8" class="mx-auto py-0">
                                <h2 class="text-h2 font-weight-600 text-center mb-2">
                                    Check your email for a verification code
                                </h2>
                            </v-col>
                        </v-row>
                        <v-card-text class="pa-10 text-center font-size-root">
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="updatePassword">
                                <v-text-field
                                    v-model="email"
                                    outlined
                                    :rules="emailRules"
                                    required
                                    background-color="white"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="Email"
                                    class="font-size-input placeholder-lighter text-color-light input-alternative input-focused-alternative input-icon"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd" size=".875rem">
                                            mdi-email
                                        </v-icon>
                                    </template>
                                </v-text-field>
                                <v-text-field
                                    v-model="code"
                                    outlined
                                    required
                                    background-color="white"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="Verification Code"
                                    class="font-size-input placeholder-lighter text-color-light input-alternative input-focused-alternative input-icon"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd" size=".875rem">
                                            mdi-shield-check
                                        </v-icon>
                                    </template>
                                </v-text-field>
                                <v-text-field
                                    v-model="password"
                                    outlined
                                    :rules="passwordRules"
                                    required
                                    background-color="white"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="New Password"
                                    type="password"
                                    class="font-size-input placeholder-lighter text-color-light input-alternative input-focused-alternative input-icon"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-lock
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
                                >
                                    Update
                                </v-btn>
                            </v-form>
                        </v-card-text>
                        <v-card-text class="text-center red--text pt-0">
                            {{ error }}
                        </v-card-text>
                    </v-card>
                    <v-btn text elevation="0" :ripple="false" height="43" class="font-weight-600 text-capitalize" color="white" @click="resendVerificationCode">
                        Resend verification code
                    </v-btn>
                </v-col>
                <v-col cols="12" md="7" v-show="$vuetify.breakpoint.mdAndUp">
                    <v-img contain class="fill-height" src="@/assets/images/TT-Graphic-1.png" />
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';

export default {
    name: 'SetPassword',
    data() {
        return {
            valid: true,
            code: '',
            email: '',
            emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
            password: null,
            passwordRules: [(v) => !!v || 'Password is required', (v) => (v && v.length >= 8) || 'Password must be at least 8 characters'],
            error: null,
            error: null,
            loading: false,
        };
    },
    created() {
        if (this.$route.query && this.$route.query.email) {
            this.email = this.$route.query.email;
        }
        Hub.listen('auth', (data) => {
            // eslint-disable-next-line default-case
            switch (data.payload.event) {
                case 'signIn':
                    if (this.$route.query.redirect) {
                        this.$router.push(this.$route.query.redirect);
                    } else {
                        this.$router.push({ name: 'AdminHome' });
                    }
                    break;
                case 'signUp':
                    console.info('user signed up');
                    break;
                case 'signOut':
                    console.info('user signed out');
                    break;
                case 'signIn_failure':
                    console.error('user sign in failed');
                    break;
                case 'tokenRefresh':
                    console.info('token refresh succeeded');
                    break;
                case 'tokenRefresh_failure':
                    console.error('token refresh failed');
                    break;
                case 'configured':
                    console.info('the Auth module is configured');
            }
        });
    },
    methods: {
        async resendVerificationCode() {
            this.$router.push({ name: 'reset-password', query: this.$route.query });
        },
        async updatePassword() {
            this.error = null;
            await this.$refs.form.validate();
            if (this.valid) {
                try {
                    this.loading = true;
                    await Auth.forgotPasswordSubmit(this.email, this.code, this.password);
                    await Auth.signIn(this.email, this.password);
                    debugger;
                    this.loading = false;
                } catch (error) {
                    this.error = error && error.message ? error.message : error;
                    this.loading = false;
                }
            }
        },
    },
};
</script>
