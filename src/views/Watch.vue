<template>
    <div id="watch">
        <v-container fluid>
            <v-row>
                <v-col cols="11" class="mx-auto">
                    <v-row>
                        <v-col cols="12" sm="12" md="8" lg="8">
                            <v-skeleton-loader type="card-avatar, article, actions" :loading="videoLoading" tile large>
                                <v-responsive>
                                    <!-- {{ generatedVideoUrl }} -->
                                    <div v-if="videoLoading" />
                                    <div v-else>
                                        <iframe height="600" width="600" scrolling="no" frameborder="0" :src="generatedVideoUrl" />
                                    </div>
                                </v-responsive>
                                <v-card flat tile class="card">
                                    <v-card-title class="pl-0 pb-0">
                                        {{ video.title }}
                                    </v-card-title>
                                    <div id="btns" class="d-flex flex-wrap justify-space-between">
                                        <v-card-subtitle class="pl-0 pt-0 pb-0 subtitle-1" style="line-height: 2.4em;">
                                            {{ video.views }} views
                                            <v-icon>mdi-circle-small</v-icon>
                                            {{ video.createdAt }}
                                        </v-card-subtitle>
                                        <v-card-actions class="pt-0 pl-0 grey--text">
                                            <v-btn text>
                                                <v-icon class="pr-2">
                                                    mdi-thumb-up
                                                </v-icon>
                                                1.5k
                                            </v-btn>
                                            <v-btn text>
                                                <v-icon class="pr-2">
                                                    mdi-thumb-down
                                                </v-icon>
                                                1.5k
                                            </v-btn>
                                            <v-btn text>
                                                <v-icon>mdi-share</v-icon>
                                                Share
                                            </v-btn>
                                            <v-btn text>
                                                <v-icon>mdi-playlist-plus</v-icon>
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </div>
                                </v-card>

                                <v-row class="justify-space-between">
                                    <v-col cols="6" sm="6" md="5" lg="5">
                                        <v-card class="transparent" flat>
                                            <v-list-item three-line>
                                                <v-list-item-avatar size="50">
                                                    <v-img src="https://randomuser.me/api/portraits/men/1.jpg" />
                                                </v-list-item-avatar>
                                                <v-list-item-content class="align-self-auto">
                                                    <v-list-item-title class="font-weight-medium mb-1">
                                                        Tech Reagan
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle>{{ video.subscribers }} subscribers</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="4" lg="4">
                                        <div class="d-flex justify-end align-center">
                                            <v-btn class="red white--text mt-6" tile large depressed>
                                                Subscribed
                                            </v-btn>
                                            <v-btn icon class="ml-5 mt-6">
                                                <v-icon>mdi-bell</v-icon>
                                            </v-btn>
                                        </div>
                                    </v-col>
                                    <v-col class="pl-11" offset="1" cols="11" md="11">
                                        <p>
                                            {{ truncate ? truncateText(video.description, 150) : video.description }}
                                        </p>
                                        <v-btn text class="remove-hover-bg" @click="show">
                                            Show More
                                        </v-btn>
                                    </v-col>
                                    <v-col>
                                        <p class="mb-0">
                                            148 Comments
                                        </p>
                                        <input ref="hello" type="text" />
                                        <v-card class="transparent" flat>
                                            <v-list-item three-line class="pl-0">
                                                <v-list-item-avatar size="50">
                                                    <v-img src="https://randomuser.me/api/portraits/men/1.jpg" />
                                                </v-list-item-avatar>
                                                <v-list-item-content class="align-self-auto">
                                                    <v-text-field v-model="comment" placeholder="Add a public comment..." @click="showCommentBtns = true" />
                                                    <div v-if="showCommentBtns" class="d-inline-block text-right">
                                                        <v-btn text @click="showCommentBtns = !showCommentBtns">
                                                            Cancel
                                                        </v-btn>
                                                        <v-btn class="blue darken-3 white--text" depressed tile :disabled="comment === ''">
                                                            Comment
                                                        </v-btn>
                                                    </div>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-card>

                                        <v-card v-for="i in 5" :key="i" class="transparent" flat>
                                            <v-list-item three-line class="pl-0 mt-2">
                                                <v-list-item-avatar size="50">
                                                    <v-img src="https://randomuser.me/api/portraits/men/1.jpg" />
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title class="font-weight-medium caption mb-1">
                                                        Tech Reagan
                                                        <span class="font-weight-light grey--text">
                                                            1 day ago
                                                        </span>
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle class="black--text text--darken-4 caption">
                                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore deleniti aspernatur nostrum eius
                                                        dignissimos repellendus. Fugiat, aspernatur deserunt iusto natus consectetur voluptatem voluptate
                                                        laboriosam pariatur qui animi repudiandae quae dolorem.
                                                    </v-list-item-subtitle>
                                                    <!-- <v-list-item-action> -->
                                                    <div>
                                                        <!-- <button
                              class="caption font-weight-bold d-inline-block pa-2 grey--text text--darken-3"
                              style="cursor: pointer; outline: none"
                              @click.stop.prevent="showReply"
                            >
                              REPLY
                            </button> -->
                                                        <v-btn text small :ripple="false" @click.stop="showReply(`${'reply' + i}`)">
                                                            Reply
                                                        </v-btn>
                                                    </div>
                                                    <div :ref="`${'reply' + i}`" class="d-none">
                                                        <v-list-item three-line class="pl-0">
                                                            <v-list-item-avatar class="mt-0" size="40">
                                                                <v-img src="https://randomuser.me/api/portraits/men/1.jpg" />
                                                            </v-list-item-avatar>
                                                            <v-list-item-content class="align-self-auto mt-0 pt-0">
                                                                <v-form :ref="`form${i}`">
                                                                    <v-text-field
                                                                        :ref="`${'input' + i}`"
                                                                        class="pt-0 mt-0 body-2"
                                                                        placeholder="Add a public comment..."
                                                                        :value="repliesInput[`input${i}`]"
                                                                    />
                                                                </v-form>
                                                                <div :ref="i + 'btns'" class="d-inline-block text-right">
                                                                    <v-btn text small @click="hideReply(i)">
                                                                        Cancel
                                                                    </v-btn>
                                                                    <v-btn class="blue darken-3 white--text" depressed tile small @click="addReply(i)">
                                                                        Reply
                                                                    </v-btn>
                                                                </div>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                        <!-- </v-list-item-action> -->
                                                    </div>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-skeleton-loader>
                        </v-col>

                        <v-col cols="12" sm="12" md="4" lg="4">
                            <hr class="grey--text" />
                            <h4 class="mb-3 mt-3">
                                Up next
                            </h4>
                            <div v-for="(result, i) in results" :key="i" class="mb-5">
                                <v-card class="card" tile flat @click="goToWatch(result)">
                                    <v-row no-gutters>
                                        <v-col class="mx-auto" cols="3" sm="3" md="5" lg="5">
                                            <!-- <v-responsive max-height="100%"> -->
                                            <v-img class="align-center" :src="'https://api.computerender.com/generate/' + results[i].title" />
                                            <!-- </v-responsive> -->
                                        </v-col>
                                        <v-col>
                                            <div class="ml-2">
                                                <v-card-title class="pl-2 pt-0 subtitle-1 font-weight-bold" style="line-height: 1">
                                                    {{ results[i].title }}
                                                </v-card-title>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </div>
                            <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line" :loading="loadingNext" tile large>
                                <div v-if="loadingNext"></div>
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <Scene style="height: 1; width: 1" embedded :vr-enabled="false" :ar-enabled="false" :app-id="app.appId" @loaded="handleSceneLoaded" />
    </div>
</template>

<script>
import Client from '@/tt-api';
import EditorMixin from '@/mixins/EditorMixin';
import Scene from '@/components/Scene.vue';
import DefaultApp from '@/tt-core/scenes/Imagine/app';
import { mapState } from 'vuex';
import TextToSpeech from '@/services/texttospeech-service';

export default {
    components: {
        Scene,
    },
    mixins: [EditorMixin],
    data: () => ({
        generatedVideoUrl: '',
        loading: true,
        loadingNext: true,
        videoLoading: true,
        video: [],
        truncate: true,
        comment: '',
        showCommentBtns: false,
        repliesInput: {},
        results: [],
        newApp: {
            name: 'TT Imagine',
            appId: 'Imagine',
            config: DefaultApp.config,
            state: DefaultApp.state,
            actions: DefaultApp.actions,
        },
        characters: [
            // {
            //     id: '1',
            //     display: 'Brian Regan',
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Brian_Regan.png',
            //     },
            //     voice: { name: 'Brian Regan' },
            // },
            // {
            //     id: '2',
            //     display: 'Cardi B',
            //     voice: {
            //         name: 'Cardi B',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Cardi_B.png',
            //     },
            // },
            // {
            //     id: '3',
            //     display: 'Jennifer Lawrence',
            //     voice: {
            //         name: 'Jennifer Lawrence',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Lawrence.png',
            //     },
            // },
            // {
            //     id: '4',
            //     display: 'Barack Obama',
            //     voice: {
            //         name: 'Barack Obama',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Barack_Obama.png',
            //     },
            // },
            // {
            //     id: '5',
            //     display: 'Lady Gaga',
            //     voice: {
            //         name: 'Lady Gaga',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lady_Gaga.png',
            //     },
            // },
            // {
            //     id: '6',
            //     display: 'Lloyd Christmas',
            //     voice: {
            //         name: 'Lloyd Christmas',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lloyd_Christmas.png',
            //     },
            // },
            // {
            //     id: '7',
            //     display: 'Ricky Gervais',
            //     voice: {
            //         name: 'Ricky Gervais',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ricky_Gervais.png',
            //     },
            // },
            // {
            //     id: '8',
            //     display: 'Joe Biden',
            //     voice: {
            //         name: 'Joe Biden',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joe_Biden.png',
            //     },
            // },
            // {
            //     id: '9',
            //     display: 'Ray Ramano',
            //     voice: {
            //         name: 'Ray Ramano',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ray_Ramano.png',
            //     },
            // },
            // {
            //     id: '10',
            //     display: 'Louis CK',
            //     voice: {
            //         name: 'Louis CK',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Louis_CK.png',
            //     },
            // },
            // {
            //     id: '11',
            //     display: 'Tim Allen',
            //     voice: {
            //         name: 'Tim Allen',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tim_Allen.png',
            //     },
            // },
            // {
            //     id: '12',
            //     display: 'Norm MacDonald',
            //     voice: {
            //         name: 'Norm MacDonald',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Norm_MacDonald.png',
            //     },
            // },
            // {
            //     id: '13',
            //     display: 'Joan Cusack',
            //     voice: {
            //         name: 'Joan Cusack',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joan_Cusack.png',
            //     },
            // },
            // {
            //     id: '14',
            //     display: 'Jennifer Collidge',
            //     voice: {
            //         name: 'Jennifer Collidge',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Collidge.png',
            //     },
            // },
            // {
            //     id: '15',
            //     display: 'Roseanne Barr',
            //     voice: {
            //         name: 'Roseanne Barr',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Roseanne_Barr.png',
            //     },
            // },
            // {
            //     id: '16',
            //     display: 'Aubrey Plaza',
            //     voice: {
            //         name: 'Aubrey Plaza',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Aubrey_Plaza.png',
            //     },
            // },
            // {
            //     id: '17',
            //     display: 'Adam Sandler',
            //     voice: {
            //         name: 'Adam Sandler',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Adam_Sandler.png',
            //     },
            // },
            // {
            //     id: '18',
            //     display: 'Bill Maher',
            //     voice: {
            //         name: 'Bill Maher',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Maher.png',
            //     },
            // },
            // {
            //     id: '19',
            //     display: 'Sebastian Maniscalco',
            //     voice: {
            //         name: 'Sebastian Maniscalco',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Sebastian_Maniscalco.png',
            //     },
            // },
            // {
            //     id: '20',
            //     display: 'Miley Cyrus',
            //     voice: {
            //         name: 'Miley Cyrus',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Miley_Cyrus.png',
            //     },
            // },
            // {
            //     id: '21',
            //     display: 'Abe Reese',
            //     voice: {
            //         name: 'Abe Reese',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Abe_Reese.png',
            //     },
            // },
            // {
            //     id: '22',
            //     display: 'David Lynch',
            //     voice: {
            //         name: 'David Lynch',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/David_Lynch.png',
            //     },
            // },
            // {
            //     id: '23',
            //     display: 'Leonardo DiCaprio Wolf of Wallstreet',
            //     voice: {
            //         name: 'Leonardo DiCaprio Wolf of Wallstreet',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Leonardo_DiCaprio_Wolf_of_Wallstreet.png',
            //     },
            // },
            // {
            //     id: '24',
            //     display: 'Donald Trump',
            //     voice: {
            //         name: 'Donald Trump',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Donald_Trump.png',
            //     },
            // },
            // {
            //     id: '25',
            //     display: 'Kelly Ripa',
            //     voice: {
            //         name: 'Kelly Ripa',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Kelly_Ripa.png',
            //     },
            // },
            // {
            //     id: '26',
            //     display: 'Bill Burr',
            //     voice: {
            //         name: 'Bill Burr',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Burr.png',
            //     },
            // },
            // {
            //     id: '27',
            //     display: 'Tom Hanks',
            //     voice: {
            //         name: 'Tom Hanks',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tom_Hanks.png',
            //     },
            // },
            // {
            //     id: '28',
            //     display: 'Drew Barrymore',
            //     voice: {
            //         name: 'Drew Barrymore',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Drew_Barrymore.png',
            //     },
            // },
            // {
            //     id: '29',
            //     display: 'Melissa Villasenor',
            //     voice: {
            //         name: 'Melissa Villasenor',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '30',
            //     display: 'Steve Jobs',
            //     voice: {
            //         name: 'Steve Jobs',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '31',
            //     display: 'Jason Calacanis',
            //     voice: {
            //         name: 'Jason Calacanis',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '32',
            //     display: 'Lex Fridman',
            //     voice: {
            //         name: 'Lex Fridman',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '33',
            //     display: 'Jesus',
            //     voice: {
            //         name: 'Lex Fridman',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '34',
            //     display: 'Aaron',
            //     voice: {
            //         name: 'Aaron',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '35',
            //     display: 'Myra',
            //     voice: {
            //         name: 'Myra',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            {
                id: '36',
                display: 'Rachel',
                voice: {
                    name: 'Rachel',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '37',
                display: 'Domi',
                voice: {
                    name: 'Domi-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '39',
                display: 'Antoni',
                voice: {
                    name: 'Antoni-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '40',
                display: 'Elli',
                voice: {
                    name: 'Elli-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '41',
                display: 'Josh',
                voice: {
                    name: 'Josh-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '42',
                display: 'Arnold',
                voice: {
                    name: 'Arnold-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '43',
                display: 'Adam',
                voice: {
                    name: 'Adam-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '44',
                display: 'Sam',
                voice: {
                    name: 'Sam-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
        ],
    }),
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
    },
    async mounted() {
        await this.$store.dispatch('apps/initApp', { app: this.newApp });
        await this.$store.dispatch('steps/init');
        // this.random();
        setTimeout(() => {
            this.loading = false;
            // this.videoLoading = false;
            this.getVideos();
        }, 1000);
        this.generateNextResults();
        await this.generate();
    },

    methods: {
        async generateNextResults() {
            this.loadingNext = true;
            console.log('generating more search results');
            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate 8 YouTube video titles and video descriptions based on the title of another video.
                Provide 8 results regardless of the prompt.
                Video descriptions should be less than 120 characters
                Respond with the videos  in a JSON array in this format:
                [{title: <title>, description: <description>}...]

                It is important the array not have quotes around it`,
                },
                {
                    role: 'user',
                    content: `<${this.$route.params.title}>`,
                },
            ]);
            console.log('generating', result);
            this.loadingNext = false;
            this.results.push(...JSON.parse(result.message.content));
            console.log('generating', this.results);

            // const splitResult = result.message.content
            //     .split('\n')
            //     .filter((s) => s.length)
            //     .map((s) => s.split(':'));
        },
        getVideos() {
            this.video = {
                channelName: 'Tech Reagan',
                subscribers: '100k',
                createdAt: '6 hours ago',
                views: '200,459',
                videoUrl: '/video.mp4',
                title: this.$route.params.title,
                description:
                    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa vel inventore voluptatum reiciendis delectus quibusdam incidunt consequuntur, nostrum aperiam, natus quidem qui corrupti reprehenderit quaerat neque voluptatibus? Ullam, maiores temporibus!',
            };
        },
        showReply(id) {
            this.$refs[id][0].classList.toggle('d-none');
        },
        hideReply(id) {
            this.$refs[`form${id}`][0].reset();
            this.$refs[`reply${id}`][0].classList.toggle('d-none');
        },
        addReply(id) {
            this.$refs[`form${id}`][0].reset();
            console.log(this.$refs[`input${id}`][0].$refs.input.value);
        },
        show(event) {
            if (event.target.innerText === 'SHOW MORE') {
                this.truncate = false;
                event.target.innerText = 'SHOW LESS';
            } else {
                this.truncate = true;
                event.target.innerText = 'SHOW MORE';
            }
        },
        truncateText(string = '', num) {
            if (string.length <= num) {
                return string;
            }
            return string.slice(0, num);
        },
        copyValue(value) {
            navigator.clipboard.writeText(value);
            this.$store.commit('apps/snackMessage', {
                message: 'Link Copied',
                color: 'success',
            });
        },
        async handleSceneLoaded() {
            await this.$store.dispatch('steps/init');
        },
        async reset() {
            // this.selectedCharacterId = null;
            this.state.steps.forEach((step) => {
                if (step.id !== 'TT_DEFAULT_ENVIRONMENT') {
                    this.$store.dispatch('steps/deleteStep', step.id);
                }
            });
        },
        async save() {
            console.log('entered save function');
            console.log('app', this.app);
            const app = await this.$store.dispatch('apps/createApp', {
                name: this.app.name,
                config: JSON.stringify(this.app.config.config),
                actions: JSON.stringify(this.app.actions.actions),
                state: JSON.stringify(this.app.state.state),
                thumbnailUrl: this.app.thumbnailUrl,
            });
            // debugger;
            this.$store.commit('apps/setAppId', app.appId);
            await this.$store.dispatch('apps/publishApp');

            const currentUrl = new URL(window.location);
            this.generatedVideoUrl = `${currentUrl.origin}/take/${this.app.appId}`;

            this.videoLoading = false;
            // const currentUrl = new URL(window.location);
            // window.open(`${currentUrl.origin}/take/${app.appId}`);
            // this.$router.push({ name: 'take', params: { appId: app.appId } });
        },
        async random() {
            const randomElement = this.examples[Math.floor(Math.random() * this.examples.length)];

            this.promptValue = randomElement.prompt;

            this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: randomElement.src } });
        },
        getRandomAvatar(gender) {
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * 10) + 1;
            return `https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/${gender}-${randomIndex}.glb`;
        },
        getRandomVoice(gender) {
            if (gender) {
                const charactersByGender = this.characters.filter((c) => c.gender === gender);
                if (charactersByGender.length) {
                    const randomIndex = Math.floor(Math.random() * charactersByGender.length);
                    const voice = charactersByGender[randomIndex];
                    if (voice) {
                        return charactersByGender[randomIndex].voice;
                    }
                }
            }
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * this.characters.length);
            return this.characters[randomIndex].voice;
        },
        async generate() {
            console.log('generating!');
            // this.showPublishDialog = true;
            // this.showErrorMessage = false;
            // this.loading = true;
            // this.loadingValue = 10;

            // const [result] = await Client.OpenAI.createChatCompletion([
            //     {
            //         role: 'system',
            //         content: `Generate a script word script from a prompt:
            // Use the following format:
            // Prompt: <the prompt for creating a script>
            // Setting: <a 30 word description of the setting the scene takes place, be as descriptive as possible. Describe it in a way someone could picture it if they have never heard of anything in the script. Do not use names people would not understand.>
            // Narration: <any thing that should be narrated to know what is going on>
            // <character name>: <anything a character says during the scene>`,
            //     },
            //     {
            //         role: 'user',
            //         content: `Prompt: <${this.promptValue}>`,
            //     },
            // ]);

            //             const [result] = await Client.OpenAI.createChatCompletion([
            //                 {
            //                     role: 'system',
            //                     content: `Generate a 200 word monologue from a prompt:
            // Use the following prompt format:
            // Character: <a description of the character in the scene>
            // Topic: <the topic to be covered in the monologue>
            // Style: <the style of the monologue>
            // References: <any distinct references that should be made in the monologue>

            // Use the following format for your response:
            // <character name>: <the first 25 words of the monologue>
            // <character name>: <the second 25 words of the monologue>
            // <character name>: <the third 25 words of the monologue>
            // ...

            // It is important to make sure it is only 200 words long.`,
            //                 },
            //                 {
            //                     role: 'user',
            //                     content: `Character: <${this.selectedCharacter.display}>
            // Topic: <${this.selectedTopic.name}>
            // Style: <${this.selectedStyle.name}>
            // References: <${this.references}>`,
            //                 },
            //             ]);
            console.log(this.$route.params.title);

            let [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate a 200 word dialog from a prompt:
Use the following prompt format:
title: <the title of a short video clip describing the dialog>

Use the following JSON format for your response:
{
    characters: [{id: <random id>, name: <the name of the character>, age: <the age of the character>, gender: <gender of the character: male|female>}]
    setting: "the setting the scene takes place in"
    dialog: [{characterId, message: "anything the character or narrator would say in 25 words or less"},...]
}
[Only export JSON]
[No Prose]
`,
                },
                {
                    role: 'user',
                    content: `title: <${this.$route.params.title}>`,
                },
            ]);
            try {
                console.log('first', result, JSON.parse(result.message.content));
            } catch {
                console.log('Invalid JSON');
                [result] = await Client.OpenAI.createChatCompletion([
                    {
                        role: 'system',
                        content:
                            'You are a JSON parser. Your goal is to make sure the provided message is in valid JSON format. Please only respond with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: `Please parse the following message:<${result.message.content}>

It is very important that you only respond with valid JSON!

[Only export JSON]
[No Prose]`,
                    },
                ]);
                console.log('second', result, JSON.parse(result.message.content));
            }

            // const splitResult = result.message.content
            //     .split('\n')
            //     .filter((s) => s.length)
            //     .map((s) => s.split(':'));

            // const [setting, dialog] = _.partition(splitResult, (result) => result[0] === 'Setting');
            this.result = JSON.parse(result.message.content);
            const { dialog, characters, setting } = this.result;
            debugger;
            try {
                // const prompt = `360 panorama photograph equirectangular projection monoscopic VR of ${setting[1]}.`;
                // const prompt = setting[0][1];
                // const result = await Client.OpenAI.create360Image(setting, 'blockade');

                // this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: result.src } });

                // const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                // const normalPosition2 = new THREE.Vector3(1, 0, -1).normalize();
                // const normalPosition3 = new THREE.Vector3(0.5, 0, -0.5).normalize();
                // const normalPosition4 = new THREE.Vector3(0.5, 0, 0.5).normalize();
                // const normalPositions = [normalPosition1, normalPosition2, normalPosition3, normalPosition4];

                // // Get the uniq characters
                // const characters = _.keyBy(dialog, (data) => data[0]);
                // let characterIterator = 0;

                // Object.keys(characters).forEach((character) => {
                //     const randomVoice = this.voices[Math.floor(Math.random() * this.voices.length)];
                //     characters[character].push(randomVoice.name);
                //     const position = normalPositions[characterIterator].clone().multiplyScalar(75);
                //     characterIterator += 1;
                //     if (characterIterator > 3) {
                //         characterIterator = 0;
                //     }
                //     this.$store.dispatch('steps/createAvatar', { src: this.avatarSrcs[Math.floor(Math.random() * this.avatarSrcs.length)], position });
                //     characters[character].push(position);
                // });

                // Disable look controls so we can turn the camera programmatically
                document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: false');

                // const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                // const position = normalPosition1.clone().multiplyScalar(75);
                // this.$store.dispatch('steps/createImage', { src: this.selectedCharacter.imageSrc, position });
                characters.forEach((c, index) => {
                    c.voice = this.getRandomVoice(c.gender);
                    if (index < 2) {
                        debugger;
                        c.entityId = `character_${index + 1}`;
                        this.$store.dispatch('steps/updateEntity', {
                            entityId: `character_${index + 1}`,
                            newData: { src: this.getRandomAvatar(c.gender) },
                        });
                        c.entityId = `character_${index + 1}`;
                    }
                });

                const dialogPromises = dialog.map(async (data) => {
                    // const character = characters[data[0]];
                    // const voice = character[2];

                    const clonedStep = await this.$store.dispatch('steps/cloneStep', 'TT_DEFAULT_ENVIRONMENT');
                    const newStep = await this.$store.dispatch('steps/addStep', { step: clonedStep });

                    const character = characters.find((c) => c.id === data.characterId);
                    let newRotation = {
                        x: 0,
                        y: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.y), 2) - 180,
                        z: 0,
                    };
                    if (character.entityId) {
                        // document.getElementById('camera').object3D.lookAt(document.getElementById(character.entityId).object3D.getObjectByName('Head').getWorldPosition());
                        const cameraTarget = document.getElementById(character.entityId).object3D.position.clone();
                        cameraTarget.setY(cameraTarget.y + 15);
                        document.getElementById('camera').object3D.lookAt(cameraTarget);
                        newRotation = {
                            x: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.x), 2),
                            y: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.y), 2) - 180,
                            z: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.z), 2),
                        };
                    }

                    await this.$store.dispatch('steps/updateStepById', { id: newStep.id, newData: { name: character.name } });

                    const transcriptAudioUrl = await TextToSpeech.getAudioFile(data.message, character.voice.name);
                    console.log('transcriptAudioUrl', character, newStep.id, transcriptAudioUrl);
                    await this.$store.dispatch('steps/updateEntity', {
                        stepId: newStep.id,
                        entityId: character.entityId,
                        newData: { soundSrc: transcriptAudioUrl },
                    });

                    await this.$store.dispatch('steps/updateStepDataById', {
                        id: newStep.id,
                        newData: {
                            autoProgressType: 'pause',
                            rotation: newRotation,
                            zoom: 4.5,
                        },
                    });

                    // await this.$store.dispatch('steps/updateStepDataById', {
                    //     id: newStep.id,
                    //     newData: {
                    //         transcript: data.message,
                    //         // voice: character.voice.name,
                    //         // rotation: newRotation,
                    //     },
                    // });
                });
                console.log(dialogPromises);
                console.log('the dialog promises are created');

                await Promise.all(dialogPromises);
                console.log('dialog promises completed');
                await this.save();
                console.log('generated?!?!?');
                // await this.reset();
                // console.log('generated?!?!?');
                // document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: true');
                // this.loading = false;
            } catch (err) {
                console.log(err);
                // this.loading = false;
                // this.showErrorMessage = true;
            }
        },
        goToWatch(result) {
            this.$router.push({ name: 'Watch', params: { title: result.title } });
        },
    },
};
</script>

<style lang="scss">
video {
    max-width: 100%;
    /* min-height: 360px; */
    /* width: 640px;
  height: 360px; */
}

#btns {
    border-bottom: 1px solid #e0d8d8;
    button {
        color: #7f7f7f;
    }
}

button.v-btn.remove-hover-bg {
    background-color: initial !important;
    &:hover {
        background-color: #f9f9f9;
    }
}
</style>
