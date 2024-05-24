<template>
    <fragment>
        <v-app-bar color="primary">
            <v-toolbar-title class="white--text toolbar-title font-weight-600 text-h4 text-capitalize">
                <v-avatar class="mr-2" color="primary darken-2">
                    <v-img src="@/assets/images/tt-logo.png" />
                </v-avatar>
                My Transfer Thoughts
            </v-toolbar-title>

            <v-spacer />
            <v-avatar color="primary lighten-2">
                <span class="white--text text-h1 text-uppercase">{{ userInitials }}</span>
            </v-avatar>
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
    </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({}),
    computed: {
        ...mapState({
            user: (state) => state.user.user,
        }),
        userInitials() {
            try {
                return this.user.attributes.email[0];
            } catch {
                return ':)';
            }
        },
    },
    methods: {
        async signOut() {
            this.drawer = false;
            await this.$store.dispatch('user/signOut');
            this.$router.push({ name: 'auth' });
        },
    },
};
</script>

<style></style>
