<template>
    <fragment>
        <v-app-bar id="app-toolbar" app color="primary" tile elevation="0" height="100" dark>
            <v-row no-gutters align="center">
                <v-col cols="2">
                    <v-row no-gutters align="center" class="flex-nowrap">
                        <v-col cols="2" class="flex-grow-0 flex-shrink-0" :style="{ minWidth: '48px' }">
                            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                        </v-col>
                        <v-col class="flex-grow-1 flex-shrink-0 no-wrap" cols="10">
                            <slot name="Title" />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="8">
                    <v-row align="center" justify="center">
                        <v-col cols="12">
                            <slot name="Center" />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="2" align-self="center">
                    <slot name="Right" class="mr-2" />
                </v-col>
            </v-row>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" id="side-nav">
            <v-list>
                <v-list-item class="px-2" @click="openAccount">
                    <v-list-item-avatar>
                        <v-avatar color="primary lighten-2">
                            <span class="white--text text-h4 text-uppercase">{{ userInitials }}</span>
                        </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{ user.attributes.email }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="primary--text text-uppercase">
                            {{ userData.plan }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="">{{ userData.currentMonthViews }} of {{ alottedPlanViews }} monthly views used</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-btn icon @click.stop="drawer = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list>
                <v-list-item link to="/">
                    <v-list-item-avatar tile class="sidenav-icon">
                        <v-img contain src="@/assets/images/TransferThoughts-Logo.png" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Transfer Thoughts</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item link to="/pages">
                    <v-list-item-avatar tile class="sidenav-icon">
                        <v-img contain src="@/assets/images/LandingPages-Logo.png" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>Landing Pages</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list>
                <v-list-item link to="/assets">
                    <v-list-item-icon class="mr-1">
                        <v-icon>
                            mdi-image-outline
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        My Assets
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="openDocs">
                    <v-list-item-icon class="mr-1">
                        <v-icon>
                            mdi-school-outline
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        Knowledge Base
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="openScheduleTraining">
                    <v-list-item-icon class="mr-1">
                        <v-icon>
                            mdi-account-box-outline
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        Schedule a training
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="openSupport">
                    <v-list-item-icon class="mr-1">
                        <v-icon>
                            mdi-help-circle-outline
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        Talk with support
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <template v-slot:append>
                <div class="pa-2">
                    <v-btn block @click="signOut" class="font-weight-600 text-h5 text-capitalize py-1 px-2" depressed color="primary lighten-1">
                        Sign Out
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
    </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        drawer: false,
        items: [
            { title: 'Home', icon: 'mdi-home-city' },
            { title: 'My Account', icon: 'mdi-account' },
            { title: 'Users', icon: 'mdi-account-group-outline' },
        ],
        mini: true,
    }),
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),
        alottedPlanViews() {
            if (this.userData.plan === 'pilot') {
                return 10;
            }
            if (this.userData.plan === 'pro') {
                return 2500;
            }
            return 'Unlimited';
        },
        userInitials() {
            try {
                return this.user.attributes.email[0];
            } catch {
                return ':)';
            }
        },
    },
    methods: {
        async openDocs() {
            window.open('https://transferthought.freshdesk.com/support/solutions');
        },
        async openSupport() {
            window.open('https://transferthought.freshdesk.com/support/tickets/new');
        },
        async openScheduleTraining() {
            window.open('https://calendly.com/transferthought/getstarted');
        },
        async signOut() {
            await this.$store.dispatch('user/signOut');
            this.$router.push({ name: 'signin' });
        },
        async openAccount() {
            this.$router.push({ name: 'Account' });
        },
    },
};
</script>

<style>
#side-nav {
    z-index: 30;
    max-height: 100vh;
    position: fixed;
}
#app-toolbar {
    z-index: 30;
}
</style>
