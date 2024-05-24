<template>
    <v-content>
        <section>
            <v-layout
                column
                wrap
                justify-center
                align-center
            >
                <h1>{{ site.title }}</h1>
            </v-layout>
            <v-container>
                <v-img
                    height="100"
                    contain
                    src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/tt-logo.png"
                />
            </v-container>
        </section>
        <section>
            <v-parallax
                :src="site.image1"
                height="600"
            >
                <v-layout
                    column
                    wrap
                    justify-center
                    align-center
                >
                    <h1>
                        {{ site.headline }}
                    </h1>
                    <div class="text-xs-center">
                        {{ site.subHeadline }}
                    </div>
                </v-layout>
                <v-layout
                    column
                    align-center
                    justify-center
                    class="white--text"
                >
                    <v-btn
                        v-if="site.configName === 'videoconference'"
                        class="blue lighten-2 mt-5"
                        dark
                        large
                        :href="'/#/videoconference?title=' + site.title"
                    >
                        Get Started
                    </v-btn>
                    <v-btn
                        v-else
                        class="blue lighten-2 mt-5"
                        dark
                        large
                        :href="'/#/run/' + site.configName"
                    >
                        Get Started
                    </v-btn>
                </v-layout>
            </v-parallax>
        </section>

        <section>
            <v-layout
                column
                wrap
                class="my-5"
                align-center
            >
                <v-flex
                    xs12
                    sm4
                    class="my-3"
                >
                    <div class="text-xs-center">
                        <h2 class="headline">
                            {{ site.featureHeader }}
                        </h2>
                    </div>
                </v-flex>
                <v-flex xs12>
                    <v-container grid-list-xl>
                        <v-layout
                            row
                            wrap
                            align-center
                        >
                            <v-flex
                                xs12
                                md4
                            >
                                <v-card height="250">
                                    <v-card-text class="text-center">
                                        <v-icon
                                            x-large
                                            class="blue--text text--lighten-2"
                                        >
                                            mdi-web
                                        </v-icon>
                                    </v-card-text>
                                    <v-card-title
                                        primary-title
                                        class="layout justify-center"
                                    >
                                        <div class="headline text-xs-center">
                                            {{ site.feature1 }}
                                        </div>
                                    </v-card-title>
                                    <v-card-text />
                                </v-card>
                            </v-flex>
                            <v-flex
                                xs12
                                md4
                            >
                                <v-card height="250">
                                    <v-card-text class="text-center">
                                        <v-icon
                                            x-large
                                            class="blue--text text--lighten-2"
                                        >
                                            mdi-chart-bar
                                        </v-icon>
                                    </v-card-text>
                                    <v-card-title
                                        primary-title
                                        class="layout justify-center"
                                    >
                                        <div class="headline">
                                            {{ site.feature2 }}
                                        </div>
                                    </v-card-title>
                                    <v-card-text />
                                </v-card>
                            </v-flex>
                            <v-flex
                                xs12
                                md4
                            >
                                <v-card height="250">
                                    <v-card-text class="text-center">
                                        <v-icon
                                            x-large
                                            class="blue--text text--lighten-2"
                                        >
                                            mdi-tag
                                        </v-icon>
                                    </v-card-text>
                                    <v-card-title
                                        primary-title
                                        class="layout justify-center"
                                    >
                                        <div class="headline text-xs-center">
                                            {{ site.feature3 }}
                                        </div>
                                    </v-card-title>
                                    <v-card-text />
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
            </v-layout>
        </section>

        <section>
            <v-parallax
                :src="site.image2"
                height="600"
            />
        </section>

        <v-footer>
            <v-layout
                row
                wrap
                align-center
            >
                <v-flex
                    xs12
                    class="text-xs-center"
                >
                    <div class="white--text ml-3">
                        Transfer Thought LLC - Copyright 2020
                    </div>
                </v-flex>
            </v-layout>
        </v-footer>
    </v-content>
</template>
<script>
export default {
    name: 'LandingPage',
    props: {
        msg: String,
    },
    data() {
        return {
            site: {
                title: 'Title',
                headline: 'This is a headline',
                subhHeadline: 'This is a subheadline',
                featureHeader: 'This is the features header',
                feature1: 'Feature 1',
                feature2: 'Feature 2',
                feature3: 'Feature 3',
                configName: 'editor_basic',
                logo: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/tt-logo.png',
                image1: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
                image2: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg',
            },
        };
    },
    mounted() {
        this.site.title = this.$route.query.title;
        this.site.headline = this.$route.query.headline;
        this.site.subHeadline = this.$route.query.subHeadline;
        this.site.featureHeader = this.$route.query.featureHeader;
        this.site.feature1 = this.$route.query.feature1;
        this.site.feature2 = this.$route.query.feature2;
        this.site.feature3 = this.$route.query.feature3;
        this.site.configName = this.$route.query.configName;
        this.site.logo = this.$route.query.logo;
        this.site.image1 = this.$route.query.image1;
        this.site.image2 = this.$route.query.image2;
    },
    methods: {
    },
};
</script>
