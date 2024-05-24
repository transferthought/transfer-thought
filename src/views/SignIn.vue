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
                            <h2 id="sign-in-title" class="text-h5 font-weight-bold">
                                Sign in to Transfer Thought
                            </h2>
                        </div>
                        <div class="card-header-padding text-center pa-10 pt-0 pb-5">
                            <div class="btn-wrapper text-center">
                                <v-btn
                                    elevation="0"
                                    outlined
                                    block
                                    :ripple="false"
                                    class="font-weight-600 text-capitalize py-6 px-6 rounded-md"
                                    @click="openGoogle"
                                >
                                    <v-img max-width="20" max-height="20" src="@/assets/images/google.svg" class="me-3" />
                                    Continue with Google
                                </v-btn>
                            </div>
                        </div>
                        <v-row justify="space-around">
                            <v-col align-self="center">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col align-self="center" class="text-center">
                                <small class="text-muted">Or sign in with an email</small>
                            </v-col>
                            <v-col align-self="center">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>

                        <v-card-text class="pa-10 text-center font-size-root">
                            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="signIn">
                                <v-text-field
                                    id="user-email"
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
                                        <v-icon color="#adb5bd">
                                            mdi-email
                                        </v-icon>
                                    </template>
                                </v-text-field>

                                <v-row justify="end">
                                    <v-btn
                                        text
                                        elevation="0"
                                        :ripple="false"
                                        height="43"
                                        class="font-weight-600 text-capitalize"
                                        color="primary"
                                        @click="resetPassword"
                                    >
                                        Forgot your password?
                                    </v-btn>
                                </v-row>
                                <v-text-field
                                    id="user-password"
                                    v-model="password"
                                    outlined
                                    :rules="passwordRules"
                                    required
                                    background-color="white"
                                    color="rgba(0,0,0,.6)"
                                    light
                                    placeholder="Password"
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
                                    block
                                    :loading="loading"
                                    elevation="0"
                                    :ripple="false"
                                    height="43"
                                    class="font-weight-600 text-capitalize btn-primary py-3 px-6 rounded-sm"
                                    color="primary"
                                    type="submit"
                                >
                                    Sign In
                                </v-btn>
                            </v-form>
                        </v-card-text>
                        <v-card-text class="text-center red--text pt-0">
                            {{ error }}
                        </v-card-text>
                    </v-card>
                    <v-btn text elevation="0" :ripple="false" height="43" class="font-weight-600 text-capitalize" color="white" @click="signUp">
                        Don't have an account?
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
    name: 'SignIn',
    data() {
        return {
            valid: true,
            nameRules: [(v) => !!v || 'Name is required'],
            email: '',
            emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
            password: null,
            passwordRules: [(v) => !!v || 'Password is required', (v) => (v && v.length >= 8) || 'Password must be at least 8 characters'],
            error: null,
            loading: false,
        };
    },
    created() {
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
        openGoogle() {
            Auth.federatedSignIn({ provider: 'Google' });
        },
        async signIn() {
            this.error = null;
            await this.$refs.form.validate();
            if (this.valid) {
                try {
                    this.loading = true;
                    await Auth.signIn(this.email, this.password);
                } catch (error) {
                    this.error = error && error.message ? error.message : error;
                    this.loading = false;
                }
            }
        },
        signUp() {
            this.$router.push({ name: 'signup', query: this.$route.query });
        },
        resetPassword() {
            this.$router.push({ name: 'reset-password', query: this.$route.query });
        },
    },
};
</script>
