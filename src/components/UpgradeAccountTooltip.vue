<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on }">
            <v-icon v-if="!userHasAccessToSetting" v-on="on" small>
                mdi-help-circle-outline
            </v-icon>
        </template>

        <v-card>
            <v-card-title class="mb-2 d-block">{{ title }}</v-card-title>
            <v-card-actions>
                <v-spacer />
                <v-btn text class="text-capitalize py-1 px-2" @click="menu = false">
                    Close
                </v-btn>
                <v-btn id="v-step-16" depressed color="primary" class="font-weight-600 text-capitalize py-1 px-2" @click="openAccountPage">
                    Upgrade Account
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>
<script>
export default {
    props: {
        setting: String,
        title: {
            type: String,
            default: 'Upgrade your account to use this feature',
        },
    },
    data: () => ({
        menu: false,
    }),
    computed: {
        userHasAccessToSetting() {
            return this.$store.getters['user/hasAccess'](this.setting);
        },
    },
    methods: {
        openAccountPage() {
            window.open('https://scenario.transferthought.com/account');
        },
    },
};
</script>
