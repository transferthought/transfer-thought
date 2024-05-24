<template>
    <div id="watch">
        <v-skeleton-loader type="card-avatar, article, actions" :loading="videoLoading" tile large>
            <v-responsive>
                <!-- {{ generatedVideoUrl }} -->
                <div v-if="videoLoading" />
                <div v-else>
                    <iframe class="frame" scrolling="no" frameborder="0" :src="generatedVideoUrl" />
                </div>
            </v-responsive>
        </v-skeleton-loader>
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
        videoLoading: true,
        truncate: true,
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
            //     name: 'Brian Regan',
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
            //     name: 'Cardi B',
            //     voice: {
            //         name: 'Cardi B',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Cardi_B.png',
            //     },
            // },
            // {
            //     id: '3',
            //     name: 'Jennifer Lawrence',
            //     voice: {
            //         name: 'Jennifer Lawrence',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Lawrence.png',
            //     },
            // },
            {
                id: '4',
                name: 'Barack Obama',
                voice: {
                    name: 'Barack Obama',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-4.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Barack_Obama.png',
                },
            },
            // {
            //     id: '5',
            //     name: 'Lady Gaga',
            //     voice: {
            //         name: 'Lady Gaga',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lady_Gaga.png',
            //     },
            // },
            // {
            //     id: '6',
            //     name: 'Lloyd Christmas',
            //     voice: {
            //         name: 'Lloyd Christmas',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lloyd_Christmas.png',
            //     },
            // },
            // {
            //     id: '7',
            //     name: 'Ricky Gervais',
            //     voice: {
            //         name: 'Ricky Gervais',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ricky_Gervais.png',
            //     },
            // },
            {
                id: '8',
                name: 'Joe Biden',
                voice: {
                    name: 'Joe Biden-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-7.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joe_Biden.png',
                },
            },
            // {
            //     id: '9',
            //     name: 'Ray Ramano',
            //     voice: {
            //         name: 'Ray Ramano',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ray_Ramano.png',
            //     },
            // },
            // {
            //     id: '10',
            //     name: 'Louis CK',
            //     voice: {
            //         name: 'Louis CK',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Louis_CK.png',
            //     },
            // },
            // {
            //     id: '11',
            //     name: 'Tim Allen',
            //     voice: {
            //         name: 'Tim Allen',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tim_Allen.png',
            //     },
            // },
            // {
            //     id: '12',
            //     name: 'Norm MacDonald',
            //     voice: {
            //         name: 'Norm MacDonald',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Norm_MacDonald.png',
            //     },
            // },
            // {
            //     id: '13',
            //     name: 'Joan Cusack',
            //     voice: {
            //         name: 'Joan Cusack',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joan_Cusack.png',
            //     },
            // },
            // {
            //     id: '14',
            //     name: 'Jennifer Collidge',
            //     voice: {
            //         name: 'Jennifer Collidge',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Collidge.png',
            //     },
            // },
            // {
            //     id: '15',
            //     name: 'Roseanne Barr',
            //     voice: {
            //         name: 'Roseanne Barr',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Roseanne_Barr.png',
            //     },
            // },
            // {
            //     id: '16',
            //     name: 'Aubrey Plaza',
            //     voice: {
            //         name: 'Aubrey Plaza',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Aubrey_Plaza.png',
            //     },
            // },
            // {
            //     id: '17',
            //     name: 'Adam Sandler',
            //     voice: {
            //         name: 'Adam Sandler',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Adam_Sandler.png',
            //     },
            // },
            // {
            //     id: '18',
            //     name: 'Bill Maher',
            //     voice: {
            //         name: 'Bill Maher',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Maher.png',
            //     },
            // },
            // {
            //     id: '19',
            //     name: 'Sebastian Maniscalco',
            //     voice: {
            //         name: 'Sebastian Maniscalco',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Sebastian_Maniscalco.png',
            //     },
            // },
            // {
            //     id: '20',
            //     name: 'Miley Cyrus',
            //     voice: {
            //         name: 'Miley Cyrus',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Miley_Cyrus.png',
            //     },
            // },
            // {
            //     id: '21',
            //     name: 'Abe Reese',
            //     voice: {
            //         name: 'Abe Reese',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Abe_Reese.png',
            //     },
            // },
            // {
            //     id: '22',
            //     name: 'David Lynch',
            //     voice: {
            //         name: 'David Lynch',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/David_Lynch.png',
            //     },
            // },
            // {
            //     id: '23',
            //     name: 'Leonardo DiCaprio Wolf of Wallstreet',
            //     voice: {
            //         name: 'Leonardo DiCaprio Wolf of Wallstreet',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Leonardo_DiCaprio_Wolf_of_Wallstreet.png',
            //     },
            // },
            {
                id: '24',
                name: 'Donald Trump',
                voice: {
                    name: 'Donald Trump-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Donald_Trump.png',
                },
            },
            // {
            //     id: '25',
            //     name: 'Kelly Ripa',
            //     voice: {
            //         name: 'Kelly Ripa',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Kelly_Ripa.png',
            //     },
            // },
            // {
            //     id: '26',
            //     name: 'Bill Burr',
            //     voice: {
            //         name: 'Bill Burr',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Burr.png',
            //     },
            // },
            // {
            //     id: '27',
            //     name: 'Tom Hanks',
            //     voice: {
            //         name: 'Tom Hanks',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tom_Hanks.png',
            //     },
            // },
            // {
            //     id: '28',
            //     name: 'Drew Barrymore',
            //     voice: {
            //         name: 'Drew Barrymore',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Drew_Barrymore.png',
            //     },
            // },
            // {
            //     id: '29',
            //     name: 'Melissa Villasenor',
            //     voice: {
            //         name: 'Melissa Villasenor',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '30',
            //     name: 'Steve Jobs',
            //     voice: {
            //         name: 'Steve Jobs',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            {
                id: '31',
                name: 'Jason Calacanis',
                voice: {
                    name: 'Jason Calacanis-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',

                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
            },
            // {
            //     id: '32',
            //     name: 'Lex Fridman',
            //     voice: {
            //         name: 'Lex Fridman',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '33',
            //     name: 'Jesus',
            //     voice: {
            //         name: 'Lex Fridman',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '34',
            //     name: 'Aaron',
            //     voice: {
            //         name: 'Aaron',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            // {
            //     id: '35',
            //     name: 'Myra',
            //     voice: {
            //         name: 'Myra',
            //     },
            //     avatar: {
            //         src:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
            //         maskSrc:
            //             'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
            //     },
            // },
            {
                id: '36',
                name: 'Rachel',
                voice: {
                    name: 'Rachel-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/female-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '37',
                name: 'Domi',
                voice: {
                    name: 'Domi-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/female-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '39',
                name: 'Antoni',
                voice: {
                    name: 'Antoni-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '40',
                name: 'Elli',
                voice: {
                    name: 'Elli-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/female-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'female',
            },
            {
                id: '41',
                name: 'Josh',
                voice: {
                    name: 'Josh-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '42',
                name: 'Arnold',
                voice: {
                    name: 'Arnold-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '43',
                name: 'Adam',
                voice: {
                    name: 'Adam-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/male-1.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
                gender: 'male',
            },
            {
                id: '44',
                name: 'Sam',
                voice: {
                    name: 'Sam-ElevenLabs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/models/female-1.glb',
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
        await this.generate();
    },

    methods: {
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
            window.location.replace(`${currentUrl.origin}/embed/${this.app.appId}`);
            // this.generatedVideoUrl = `${currentUrl.origin}/take/${this.app.appId}`;
            // window.location.replace(`${currentUrl.origin}/take/${this.app.appId}`);

            // this.videoLoading = false;
            // const currentUrl = new URL(window.location);
            // window.open(`${currentUrl.origin}/take/${app.appId}`);
            // this.$router.push({ name: 'take', params: { appId: app.appId } });
        },
        async random() {
            const randomElement = this.examples[Math.floor(Math.random() * this.examples.length)];

            this.promptValue = randomElement.prompt;

            this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: randomElement.src } });
        },
        getCharacter(characterData) {
            const character = this.characters.find((c) => c.name === characterData.name);
            if (character) {
                return {
                    ...character,
                    ...characterData,
                };
            }
            return {
                ...characterData,
                avatar: { src: this.getRandomAvatar(characterData.gender) },
                voice: this.getRandomVoice(characterData.gender),
            };
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
                    content: `Generate a video script from a prompt:
Use the following prompt format:
title: <the title of a short video clip>

Use the following JSON format for your response:
{
    characters: [{id: <random id>, name: <the name of the character talking>, age: <the age of the character>, gender: <gender of the character: male|female>}]
    setting: "the setting the scene takes place in"
    dialog: [{characterId, message: "anything the character or narrator would say in 50 words or less"},...]
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
            let { dialog, characters, setting } = this.result;
            this.app.name = this.$route.params.title;
            try {
                // const prompt = `360 panorama photograph equirectangular projection monoscopic VR of ${setting[1]}.`;
                // const prompt = setting[0][1];
                if (this.$route.query['setting'] === 'true') {
                    const result = await Client.OpenAI.create360Image(setting, 'blockade');

                    this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: result.src } });
                }

                const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                const normalPosition2 = new THREE.Vector3(-1, 0, 0).normalize();
                const normalPosition3 = new THREE.Vector3(0, 0, 1).normalize();
                const normalPosition4 = new THREE.Vector3(1, 0, 0).normalize();
                const normalPositions = [normalPosition1, normalPosition2, normalPosition3, normalPosition4];

                // Disable look controls so we can turn the camera programmatically
                document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: false');

                const characterPromises = characters.map(async (c, index) => {
                    const character = this.getCharacter(c);
                    const position = normalPositions[index].clone().multiplyScalar(75);
                    position.y = -20;
                    const rotation = new THREE.Vector3(0, 45 * index, 0);
                    const entity = await this.$store.dispatch('steps/createAvatar', { src: character.avatar.src, position, rotation });
                    character.entityId = entity.id;
                    return character;
                });

                characters = await Promise.all(characterPromises);

                const dialogPromises = dialog.map(async (data) => {
                    // const character = characters[data[0]];
                    // const voice = character[2];

                    const clonedStep = await this.$store.dispatch('steps/cloneStep', 'TT_DEFAULT_ENVIRONMENT');
                    const newStep = await this.$store.dispatch('steps/addStep', { step: clonedStep });

                    const character = characters.find((c) => c.id === data.characterId);
                    console.log('character', character);
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
                        newData: {
                            soundSrc: transcriptAudioUrl,
                            events: {
                                'sound-started': {
                                    event: 'sound-started',
                                    action: 'TwinLabAudioStart',
                                    propId: character.entityId,
                                    actionId:
                                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/animations/Standing-Talking.glb',
                                    loop: true,
                                },
                                'sound-ended': {
                                    action: 'TwinLabAudioStop',
                                    event: 'sound-ended',
                                    actionId:
                                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/Ready_Player_Me/animations/Standing-Idle.glb',
                                    loop: true,
                                    propId: character.entityId,
                                },
                            },
                        },
                    });

                    await this.$store.dispatch('steps/updateStepDataById', {
                        id: newStep.id,
                        newData: {
                            autoProgressType: 'pause',
                            timeoutSeconds: 10,
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
                console.log('failed to generate', err);
                // this.loading = false;
                // this.showErrorMessage = true;
            }
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

.frame {
    height: 100vh;
    width: 100vw;
}
</style>
