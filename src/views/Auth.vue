<template>
    <div class="auth">
        <!-- <amplify-authenticator username-alias="email">
            <amplify-sign-up slot="sign-up" username-alias="email" :form-fields="formFields" />
        </amplify-authenticator> -->
    </div>
</template>

<script>
// import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components';
import { Hub } from 'aws-amplify';

export default {
    name: 'Auth',
    data() {
        return {
            authState: null,
            formFields: [
                {
                    type: 'email',
                },
                {
                    type: 'password',
                },
            ],
        };
    },
    // created() {
    //     this.unsubscribeAuth = onAuthUIStateChange(async (nextAuthState, authData) => {
    //         console.log('nextAuthState', nextAuthState);
    //         if (this.authState !== nextAuthState) {
    //             if (nextAuthState === AuthState.SignedIn) {
    //                 this.$store.commit('user/user', authData);
    //                 if (this.$route.query.redirect) {
    //                     this.$router.push(this.$route.query.redirect);
    //                 } else {
    //                     this.$router.push({ name: 'AdminHome' });
    //                 }
    //             }
    //             if (nextAuthState === AuthState.VerifyContact) {
    //                 Hub.dispatch('Auth UI', {
    //                     event: 'AuthStateChange',
    //                     message: AuthState.SignedIn,
    //                 });
    //             }
    //         }
    //         this.authState = nextAuthState;
    //     });
    // },
    // beforeDestroy() {
    //     this.unsubscribeAuth();
    // },
};
</script>

<style>
:root {
    --amplify-primary-color: var(--v-primary-base);
    --amplify-secondary-color: var(--v-secondary-base);
    --amplify-secondary-contrast: var(--v-background-base);
    --amplify-primary-tint: var(--v-primary-darken1);
    --amplify-primary-shade: var(--v-primary-darken2);
    --amplify-background-color: var(--v-background-base);
}
</style>
