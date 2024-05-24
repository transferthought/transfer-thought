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
                        <div class="pa-10 pb-0">
                            <h2 id="sign-in-title" class="text-h5 font-weight-bold">
                                Reset your password
                            </h2>
                        </div>
                        <v-card-text class="pa-10 text-center font-size-root">
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="resetPassword">
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
                                <v-btn
                                    :loading="loading"
                                    elevation="0"
                                    block
                                    :ripple="false"
                                    height="43"
                                    class="font-weight-600 text-capitalize btn-primary py-3 px-6 rounded-sm"
                                    color="primary"
                                    type="submit"
                                >
                                    Reset Password
                                </v-btn>
                            </v-form>
                        </v-card-text>
                        <v-card-text class="text-center red--text pt-0">
                            {{ error }}
                        </v-card-text>
                    </v-card>
                    <v-btn text elevation="0" :ripple="false" height="43" class="font-weight-600 text-capitalize" color="white" @click="signIn">
                        Sign In
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
    name: 'ResetPassword',
    data() {
        return {
            valid: true,
            email: '',
            emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
            message: null,
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
        async resetPassword() {
            this.error = null;
            await this.$refs.form.validate();
            if (this.valid) {
                try {
                    this.loading = true;
                    await Auth.forgotPassword(this.email);
                    this.loading = false;
                    this.$router.push({ name: 'set-password', query: { ...this.$route.query, email: this.email } });
                } catch (error) {
                    this.error = error && error.message ? error.message : error;
                    this.loading = false;
                }
            }
        },
        signIn() {
            this.$router.push({ name: 'signin', query: this.$route.query });
        },
    },
};
</script>
