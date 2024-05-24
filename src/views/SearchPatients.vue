<template>
    <div id="search">
        <v-container fluid>
            <v-row>
                <v-col
                    cols="12"
                    sm="12"
                    md="10"
                    lg="11"
                >
                    <div
                        v-for="(result, i) in results"
                        :key="i"
                        class="mb-5"
                    >
                        <v-skeleton-loader
                            class="mx-auto"
                            type="list-item-avatar-three-line"
                            :loading="loading"
                            tile
                            large
                        >
                            <v-card
                                v-if="false"
                                class="card mb-10"
                                tile
                                flat
                            >
                                <v-row
                                    no-gutters
                                    justify="center"
                                >
                                    <v-col
                                        cols="10"
                                        sm="10"
                                        md="3"
                                        lg="3"
                                        class="d-flex"
                                    >
                                        <!-- <v-responsive max-height="100%"> -->
                                        <v-avatar
                                            size="130"
                                            max-width="150"
                                            class="mx-auto"
                                        >
                                            <v-img
                                                class="align-center"
                                                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                                            />
                                        </v-avatar>
                                        <!-- </v-responsive> -->
                                    </v-col>
                                    <v-col
                                        cols="10"
                                        sm="10"
                                        md="6"
                                        lg="6"
                                        class="justify-center"
                                    >
                                        <!-- <div class="ml-2"> -->
                                        <v-card-title
                                            class="pl-2 pt-0 subtitle-1 font-weight-bold align-center"
                                        >
                                            Tech Reagan
                                        </v-card-title>

                                        <v-card-subtitle
                                            class="pl-2 pt-2 pb-0"
                                            style="line-height: 1.2"
                                        >
                                            2.1M subscribers<v-icon>mdi-circle-small</v-icon>700
                                            videos
                                        </v-card-subtitle>
                                        <v-card-subtitle class="pl-2 pt-2 pb-0">
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            Fugiat consequatur rerum id nulla, iure beatae atque
                                        </v-card-subtitle>
                                        <!-- </div> -->
                                    </v-col>
                                    <v-col
                                        cols="10"
                                        sm="10"
                                        md="3"
                                        lg="3"
                                    >
                                        <v-btn
                                            class="red white--text mt-6"
                                            tile
                                            depressed
                                        >
                                            Subscribed
                                        </v-btn>
                                        <v-btn
                                            icon
                                            class="ml-5 mt-6"
                                        >
                                            <v-icon>mdi-bell</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-card
                                v-else
                                class="card mb-10"
                                tile
                                flat
                                @click="generateVideo(i)"
                            >
                                <v-row no-gutters>
                                    <v-col
                                        cols="5"
                                        sm="3"
                                        md="3"
                                        lg="3"
                                    >
                                        <!-- <v-responsive max-height="100%"> -->
                                        <v-img
                                            class="align-center"
                                            :src="'https://api.computerender.com/generate/' + results[i].title"
                                        />
                                        <!-- </v-responsive> -->
                                    </v-col>
                                    <v-col
                                        cols="7"
                                        sm="7"
                                        md="8"
                                        lg="8"
                                    >
                                        <div class="ml-2">
                                            <v-card-title
                                                class="pl-2 pt-0 subtitle-1 font-weight-bold"
                                            >
                                                {{ results[i].title }}
                                            </v-card-title>

                                            <v-card-subtitle
                                                class="pl-2 pt-2 pb-0"
                                                style="line-height: 1.2"
                                            >
                                                {{ results[i].title }}<br>
                                                9.6k views<v-icon>mdi-circle-small</v-icon>6 hours ago
                                            </v-card-subtitle>
                                            <v-card-subtitle class="pl-2 pt-2 pb-0">
                                                {{ results[i].description }}
                                            </v-card-subtitle>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-skeleton-loader>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Client from '@/tt-api';
import videoCard from '@/components/VideoCard';

export default {
    data: () => ({
        loading: true,
        bottom: false,
        results: [
            // {
            //     title: 'Top 10 Seinfeld Episodes',
            //     description: 'Laugh along with Jerry, George, Elaine and Kramer in the best Seinfeld episodes ever.',
            // },
            // {
            //     title: 'Seinfeld Bloopers That Will Make You Laugh Out Loud',
            //     description: 'Hilarious outtakes from the classic sitcom Seinfeld.',
            // },
            // {
            //     title: 'The Real Reason Seinfeld Ended',
            //     description: 'Uncover the behind-the-scenes story of why Seinfeld came to a close after nine seasons.',
            // },
            // {
            //     title: 'The Best Seinfeld Quotes',
            //     description: 'Relive some of the funniest and most iconic lines from Seinfeld.',
            // },
            // {
            //     title: "Seinfeld's Best One-Liners",
            //     description: 'Enjoy a compilation of the most memorable quips and zingers from the show about nothing.',
            // },
        ],
    }),
    watch: {
        bottom(newValue) {
            if (newValue) {
                this.generateMoreSearchResults();
            }
        },
    },
    async mounted() {
        // const [result] = await Client.OpenAI.createChatCompletion([
        //     {
        //         role: 'system',
        //         content: `Generate 5 YouTube video titles and video descriptions from a prompt.
        //         Treat the prompt as if it is a search on YouTube.
        //         Provide 5 results regardless of the prompt.
        //         Video descriptions should be less than 120 characters
        //         Respond with the titles in a JSON array in this format:
        //         [{title: <title>, description: <description>}...]`,
        //     },
        //     {
        //         role: 'user',
        //         content: `<${this.$route.query['search-query']}>`,
        //     },
        // ]);
        // console.log(result);
        // this.results = JSON.parse(result.message.content);
        // console.log(this.results);
        // const splitResult = result.message.content
        //     .split('\n')
        //     .filter((s) => s.length)
        //     .map((s) => s.split(':'));

        this.loading = false;

        window.addEventListener('scroll', () => {
            console.log(this.bottomVisible());
            this.bottom = this.bottomVisible();
        });
        this.generateMoreSearchResults();

        // setTimeout(() => {
        //     this.loading = false;
        // }, 3000);
    },
    methods: {
        async generateMoreSearchResults() {
            console.log('generating more search results');
            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate 5 patient profiles from a prompt.
                Treat the prompt as if it is a search on a patient databse.
                Provide 5 results regardless of the prompt.
                Patient descriptions should be less than 120 characters
                Respond with the videos in a JSON array in this format:
                [{title: <Patient Gender | Patient Age | Patient Reason for Visit>, description: <description>}...]
                
                It is important the array not have quotes around it`,
                },
                {
                    role: 'user',
                    content: `<${this.$route.query['search-query']}>`,
                },
            ]);
            console.log(result);
            this.results.push(...JSON.parse(result.message.content));
            console.log(this.results);

            // const splitResult = result.message.content
            //     .split('\n')
            //     .filter((s) => s.length)
            //     .map((s) => s.split(':'));
        },
        async generateVideo(index) {
            this.$router.push({ name: 'Watch', params: { id: index, title: this.results[index].title } });
        },
        bottomVisible() {
            console.log('scrolling');
            const { scrollY } = window;
            const visible = document.documentElement.clientHeight;
            const pageHeight = document.documentElement.scrollHeight;
            const bottomOfPage = visible + scrollY >= pageHeight;
            return bottomOfPage || pageHeight < visible;
        },
    },
};
</script>

<style></style>
