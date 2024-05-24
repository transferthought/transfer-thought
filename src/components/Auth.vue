<template>
    <div class="auth">
        <amplify-authenticator :auth-config="authConfig" />
    </div>
</template>

<script>
export default {
    name: 'Auth',
    data() {
        return {
            authConfig: {
                signInConfig: {
                    header: 'Transfer Thought Sign In',
                    hideAllDefaults: true,
                    defaultCountryCode: '1',
                    signUpFields: [
                        {
                            label: 'Email',
                            key: 'username',
                            required: true,
                            displayOrder: 1,
                            type: 'string',
                            signUpWith: true,
                        },
                        {
                            label: 'Password',
                            key: 'password',
                            required: true,
                            displayOrder: 2,
                            type: 'password',
                        },
                    ],
                },
                signUpConfig: {
                    header: 'Transfer Thought Sign Up',
                    hideAllDefaults: true,
                    defaultCountryCode: '1',
                    signUpFields: [
                        {
                            label: 'Email',
                            key: 'username',
                            required: true,
                            displayOrder: 1,
                            type: 'string',
                            signUpWith: true,
                        },
                        {
                            label: 'Password',
                            key: 'password',
                            required: true,
                            displayOrder: 2,
                            type: 'password',
                        },
                    ],
                },
            },
        };
    },
};
</script>
