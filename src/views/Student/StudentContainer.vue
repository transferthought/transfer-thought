<template>
    <v-layout fill-height>
        <v-navigation-drawer
            v-if="user"
            class="background lighten-2"
            clipped
            mini-variant
            permanent
        >
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="@/assets/images/tt-logo.png" />
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                        <v-list-item-title class="title d-flex align-center mb-0">
                            Transfer Thought
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider />
            <v-list>
                <v-tooltip
                    v-for="(item, i) in pages"
                    :key="i"
                    :to="item.link"
                    right
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item
                            :to="item.link"
                            v-on="on"
                        >
                            <v-list-item-icon large>
                                <v-icon
                                    class="text-h1"
                                    v-text="item.icon"
                                />
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title" />
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <span>{{ item.title }}</span>
                </v-tooltip>
                <v-menu
                    top
                    offset-x
                    open-on-hover
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item v-on="on">
                            <v-list-item-action>
                                <v-icon class="text-h1">
                                    mdi-account
                                </v-icon>
                            </v-list-item-action>
                            <v-list-item-title class="grey--text text--darken-1">
                                Account
                            </v-list-item-title>
                        </v-list-item>
                    </template>

                    <v-list>
                        <v-list-item @click="signOut">
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Sign Out</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-list>
        </v-navigation-drawer>
        <router-view />
    </v-layout>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data: () => ({
        pages: [
            {
                icon: 'mdi-book',
                link: '/',
                title: 'Courses',
            },
        ],
    }),
    computed: {
        ...mapState({
            user: (state) => state.user.user,
        }),
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

<style>
</style>
