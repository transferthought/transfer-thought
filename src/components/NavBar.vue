<template>
    <nav id="navbar">
        <v-app-bar
            class="white"
            flat
            app
            clipped-left
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title
                class="font-weight-bold"
            >
                <router-link
                    to="/"
                    class="black--text"
                    style="text-decoration: none"
                >
                    Discover
                </router-link>
            </v-toolbar-title>
            <v-spacer />
            <v-text-field
                v-model="searchText"
                flat
                hide-details
                append-icon="mdi-magnify"
                placeholder="Search"
                outlined
                dense
                class="hidden-sm-and-down"
                @click:append="search"
            />

            <v-spacer />
            <!-- <v-menu offset-y>
                <template v-slot:activator="{ on: menu }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-btn
                                icon
                                v-on="{ ...tooltip, ...menu }"
                            >
                                <v-icon size="25">
                                    mdi-video-plus
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Create a video and more</span>
                    </v-tooltip>
                </template>
                <v-list>
                    <v-list-item
                        router
                        to="/studio"
                    >
                        <v-list-item-icon
                            class="mr-3"
                        >
                            <v-icon>mdi-play-box-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Upload video</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon
                            class="mr-3"
                        >
                            <v-icon>mdi-access-point</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Go live</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        v-on="on"
                    >
                        <v-icon size="25">
                            mdi-apps
                        </v-icon>
                    </v-btn>
                </template>
                <span>Discover apps</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        class="mr-7"
                        v-on="on"
                    >
                        <v-icon size="25">
                            mdi-bell
                        </v-icon>
                    </v-btn>
                </template>
                <span>Notifications</span>
            </v-tooltip> -->

            <!-- <v-menu
                offset-y
                left
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                        small
                        color="red"
                        depressed
                        fab
                        class="white--text"
                        v-on="on"
                    >
                        T
                    </v-btn>
                </template>

                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-avatar>
                                <img :src="`https://randomuser.me/api/portraits/men/4.jpg`">
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>Tech Reagan</v-list-item-title>
                                <v-list-item-subtitle>
                                    techreagan@gmail.com
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-divider />

                    <v-list>
                        <v-list-item
                            router
                            to="/channels/10"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-account-box</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Your channel</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            router
                            to="/studio"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-youtube-studio</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Discover Studio</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            router
                            to="/signin"
                        >
                            <v-list-item-icon>
                                <v-icon>mdi-login-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Sign out</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu> -->
        </v-app-bar>

        <!-- <v-navigation-drawer
            id="nav"
            v-model="drawer"
            app
            :clipped="$route.name !== 'Watch'"
            :temporary="$route.name === 'Watch'"
        >
            <div
                v-bar
                tag="div"
                class="v-navigation-drawer__content"
            >
                <v-list
                    dense
                    nav
                    class="py-0"
                    tag="div"
                >
                    <v-list-item
                        :class="{
                            'hidden-lg-and-up': $route.name === 'Watch' ? false : true
                        }"
                    >
                        <v-app-bar-nav-icon
                            class="mr-5"
                            @click="drawer = !drawer"
                        />
                        <v-toolbar-title class="font-weight-bold">
                            Discover
                        </v-toolbar-title>
                    </v-list-item>
                    <v-divider class="hidden-lg-and-up" />
                    <div
                        v-for="parentItem in items"
                        :key="parentItem.header"
                    >
                        <v-subheader
                            v-if="parentItem.header"
                            class="pl-3 py-4 subtitle-1 font-weight-bold text-uppercase"
                        >
                            {{ parentItem.header }}
                        </v-subheader>
                        <v-list-item
                            v-for="(item, i) in parentItem.pages"
                            :key="item.title"
                            link
                            class="mb-0"
                            router
                            :to="item.link"
                            exact
                            active-class="active-item"
                        >
                            <v-list-item-icon v-if="parentItem.header !== 'Subscriptions'">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-avatar
                                v-else
                                class="mr-5"
                            >
                                <img
                                    :src="`https://randomuser.me/api/portraits/men/${i}.jpg`"
                                >
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class=" font-weight-medium subtitle-2">
                                    {{
                                        item.title
                                    }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2 mb-2" />
                    </div>

                    <span
                        v-for="link in links"
                        :key="link.text"
                    >
                        <span
                            v-if="link.text === 'Terms'"
                            class="mb-2 d-block"
                        />
                        <v-btn
                            href
                            router
                            :to="link.link"
                            text
                            class="text-capitalize px-1"
                            small
                        >{{ link.text }}</v-btn>
                    </span>
                </v-list>
            </div>
        </v-navigation-drawer> -->
    </nav>
</template>

<script>
export default {
    data: () => ({
        drawer: false,
        items: [
            {
                header: null,
                pages: [
                    { title: 'Home', link: '/', icon: 'mdi-home' },
                    { title: 'Trending', link: '/trending', icon: 'mdi-fire' },
                    {
                        title: 'Subscriptions',
                        link: '#s',
                        icon: 'mdi-youtube-subscription',
                    },
                ],
            },
            {
                header: null,
                pages: [
                    {
                        title: 'Library',
                        link: '#l',
                        icon: 'mdi-play-box-multiple',
                    },
                    {
                        title: 'History',
                        link: '/history',
                        icon: 'mdi-history',
                    },
                    {
                        title: 'Your videos',
                        link: '/channels/ddd',
                        icon: 'mdi-play-box-outline',
                    },

                    {
                        title: 'Watch later',
                        link: '#wl',
                        icon: 'mdi-clock',
                    },

                    {
                        title: 'Liked videos',
                        link: '#lw',
                        icon: 'mdi-thumb-up',
                    },
                ],
            },
            {
                header: 'Subscriptions',
                pages: [
                    {
                        title: 'Traversy Media',
                        link: '#tm',
                        icon: 'mdi-badge-account',
                    },
                    {
                        title: 'The New Boston',
                        link: '#tn',
                        icon: 'mdi-badge-account',
                    },
                    {
                        title: 'Net Ninija',
                        link: '#nn',
                        icon: 'mdi-badge-account',
                    },
                    {
                        title: 'Chris Hawks',
                        link: '#ch',
                        icon: 'mdi-badge-account',
                    },
                ],
            },
            {
                header: 'MORE FROM Discover',
                pages: [
                    {
                        title: 'Discover Premium',
                        link: '#vp',
                        icon: 'mdi-youtube',
                    },
                    {
                        title: 'Gaming',
                        link: '#g',
                        icon: 'mdi-youtube-gaming',
                    },
                    {
                        title: 'Live',
                        link: '#li',
                        icon: 'mdi-access-point',
                    },
                ],
            },
            {
                header: null,
                pages: [
                    {
                        title: 'Setting',
                        link: '#sg',
                        icon: 'mdi-cog',
                    },
                    {
                        title: 'Report history',
                        link: '#rh',
                        icon: 'mdi-flag',
                    },
                    {
                        title: 'Help',
                        link: '#hp',
                        icon: 'mdi-help-circle',
                    },
                    {
                        title: 'Send feedback',
                        link: '#f',
                        icon: 'mdi-message-alert',
                    },
                ],
            },
        ],
        links: [
            { text: 'About', link: '#' },
            { text: 'Press', link: '#' },
            { text: 'Copyrignt', link: '#' },
            { text: 'Contact us', link: '#' },
            { text: 'Creators', link: '#' },
            { text: 'Advertise', link: '#' },
            { text: 'Developers', link: '#' },
            { text: 'Terms', link: '#' },
            { text: 'Privacy', link: '#' },
            { text: 'Policy & Safety', link: '#' },
            { text: 'Test new features', link: '#' },
        ],
        searchText: '',
    }),
    mounted() {
        this.drawer = !this.$vuetify.breakpoint.mdAndDown;
        this.drawer = this.$route.name === 'Watch' ? false : this.drawer;
    },
    methods: {
        search() {
            if (!this.searchText) return;
            this.$router.push({
                name: 'Search',
                query: { 'search-query': this.searchText },
            });
        },
    },
};
</script>

<style lang="scss">
#navbar {
  .active-item {
    .v-list-item__icon {
      color: red !important;
    }
  }
  .v-navigation-drawer__border {
    width: 0 !important;
  }

  .vuebar-element {
    height: 250px;
    width: 100%;
    max-width: 500px;
    background: #dfe9fe;
  }

  .vb > .vb-dragger {
    z-index: 5;
    width: 10px;
    right: 0;
  }

  .vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;
    transition: background-color 100ms ease-out, margin 100ms ease-out,
      height 100ms ease-out;

    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }

  .v-navigation-drawer__content:hover .vb > .vb-dragger > .vb-dragger-styler {
    width: 10px;
    background-color: #e0e0e0;
  }

  .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.3);
    background-color: rgba(255, 255, 255, 0.3);
  }

  .vb > .vb-dragger:hover > .vb-dragger-styler {
    margin: 0px;
    width: 10px;
  }

  .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
    margin: 0px;
    height: 100%;
  }

  .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, 0.5);
  }
}
</style>
