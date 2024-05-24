<template>
    <div id="watch">
        <v-container fluid>
            <v-skeleton-loader type="card-avatar, article, actions" :loading="videoLoading" tile large>
                <v-responsive>
                    {{ generatedVideoUrl }}
                    <div v-if="videoLoading">
                        <Scene style="height:100%" embedded :vr-enabled="false" :ar-enabled="false" :app-id="app.appId" @loaded="handleSceneLoaded" />
                    </div>
                    <div v-else>
                        <iframe height="800" width="100%" scrolling="no" frameborder="0" :src="generatedVideoUrl" />
                    </div>
                    <v-card flat tile class="card">
                        <v-card-title class="pl-0 pb-0">
                            {{ video.title }}
                        </v-card-title>
                    </v-card>
                </v-responsive>
            </v-skeleton-loader>
        </v-container>
    </div>
</template>

<script>
import Client from '@/tt-api';
import EditorMixin from '@/mixins/EditorMixin';
import Scene from '@/components/Scene.vue';
import DefaultApp from '@/tt-core/scenes/Imagine/app';
import { mapState } from 'vuex';

export default {
    components: {
        Scene,
    },
    mixins: [EditorMixin],
    data: () => ({
        generatedVideoUrl: '',
        loading: true,
        videoLoading: true,
        video: [],
        truncate: true,
        comment: '',
        showCommentBtns: false,
        repliesInput: {},
        newApp: {
            name: 'TT Imagine',
            appId: 'Imagine',
            config: DefaultApp.config,
            state: DefaultApp.state,
            actions: DefaultApp.actions,
        },
        characters: [
            {
                id: '1',
                display: 'Brian Regan',
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Brian_Regan.png',
                },
                voice: { name: 'Brian Regan' },
            },
            {
                id: '2',
                display: 'Cardi B',
                voice: {
                    name: 'Cardi B',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Cardi_B.png',
                },
            },
            {
                id: '3',
                display: 'Jennifer Lawrence',
                voice: {
                    name: 'Jennifer Lawrence',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Lawrence.png',
                },
            },
            {
                id: '4',
                display: 'Barack Obama',
                voice: {
                    name: 'Barack Obama',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Barack_Obama.png',
                },
            },
            {
                id: '5',
                display: 'Lady Gaga',
                voice: {
                    name: 'Lady Gaga',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lady_Gaga.png',
                },
            },
            {
                id: '6',
                display: 'Lloyd Christmas',
                voice: {
                    name: 'Lloyd Christmas',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lloyd_Christmas.png',
                },
            },
            {
                id: '7',
                display: 'Ricky Gervais',
                voice: {
                    name: 'Ricky Gervais',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ricky_Gervais.png',
                },
            },
            {
                id: '8',
                display: 'Joe Biden',
                voice: {
                    name: 'Joe Biden',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joe_Biden.png',
                },
            },
            {
                id: '9',
                display: 'Ray Ramano',
                voice: {
                    name: 'Ray Ramano',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ray_Ramano.png',
                },
            },
            {
                id: '10',
                display: 'Louis CK',
                voice: {
                    name: 'Louis CK',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Louis_CK.png',
                },
            },
            {
                id: '11',
                display: 'Tim Allen',
                voice: {
                    name: 'Tim Allen',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tim_Allen.png',
                },
            },
            {
                id: '12',
                display: 'Norm MacDonald',
                voice: {
                    name: 'Norm MacDonald',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Norm_MacDonald.png',
                },
            },
            {
                id: '13',
                display: 'Joan Cusack',
                voice: {
                    name: 'Joan Cusack',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joan_Cusack.png',
                },
            },
            {
                id: '14',
                display: 'Jennifer Collidge',
                voice: {
                    name: 'Jennifer Collidge',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Collidge.png',
                },
            },
            {
                id: '15',
                display: 'Roseanne Barr',
                voice: {
                    name: 'Roseanne Barr',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Roseanne_Barr.png',
                },
            },
            {
                id: '16',
                display: 'Aubrey Plaza',
                voice: {
                    name: 'Aubrey Plaza',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Aubrey_Plaza.png',
                },
            },
            {
                id: '17',
                display: 'Adam Sandler',
                voice: {
                    name: 'Adam Sandler',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Adam_Sandler.png',
                },
            },
            {
                id: '18',
                display: 'Bill Maher',
                voice: {
                    name: 'Bill Maher',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Maher.png',
                },
            },
            {
                id: '19',
                display: 'Sebastian Maniscalco',
                voice: {
                    name: 'Sebastian Maniscalco',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Sebastian_Maniscalco.png',
                },
            },
            {
                id: '20',
                display: 'Miley Cyrus',
                voice: {
                    name: 'Miley Cyrus',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Miley_Cyrus.png',
                },
            },
            {
                id: '21',
                display: 'Abe Reese',
                voice: {
                    name: 'Abe Reese',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Abe_Reese.png',
                },
            },
            {
                id: '22',
                display: 'David Lynch',
                voice: {
                    name: 'David Lynch',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/David_Lynch.png',
                },
            },
            {
                id: '23',
                display: 'Leonardo DiCaprio Wolf of Wallstreet',
                voice: {
                    name: 'Leonardo DiCaprio Wolf of Wallstreet',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Leonardo_DiCaprio_Wolf_of_Wallstreet.png',
                },
            },
            {
                id: '24',
                display: 'Donald Trump',
                voice: {
                    name: 'Donald Trump',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Donald_Trump.png',
                },
            },
            {
                id: '25',
                display: 'Kelly Ripa',
                voice: {
                    name: 'Kelly Ripa',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Kelly_Ripa.png',
                },
            },
            {
                id: '26',
                display: 'Bill Burr',
                voice: {
                    name: 'Bill Burr',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Burr.png',
                },
            },
            {
                id: '27',
                display: 'Tom Hanks',
                voice: {
                    name: 'Tom Hanks',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tom_Hanks.png',
                },
            },
            {
                id: '28',
                display: 'Drew Barrymore',
                voice: {
                    name: 'Drew Barrymore',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Drew_Barrymore.png',
                },
            },
            {
                id: '29',
                display: 'Melissa Villasenor',
                voice: {
                    name: 'Melissa Villasenor',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
            },
            {
                id: '30',
                display: 'Steve Jobs',
                voice: {
                    name: 'Steve Jobs',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
            },
            {
                id: '31',
                display: 'Jason Calacanis',
                voice: {
                    name: 'Jason Calacanis',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
            },
            {
                id: '32',
                display: 'Lex Fridman',
                voice: {
                    name: 'Lex Fridman',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
            },
            {
                id: '33',
                display: 'Jesus',
                voice: {
                    name: 'Lex Fridman',
                },
                avatar: {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                    maskSrc:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                },
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
        this.random();
        await this.generate();
        setTimeout(() => {
            this.loading = false;
            // this.videoLoading = false;
            this.getVideos();
        }, 400);
    },

    methods: {
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
        async preLoadAudioFiles() {
            const promises = this.state.steps.map(async (step) => TextToSpeech.getAudioFile(step.data.transcript, step?.data?.voice || this.state.coach.voice));
            return Promise.all(promises);
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

            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate a 200 word dialog from a prompt:
Use the following prompt format:
title: <the title of a short video clip describing the dialog>

Use the following format for your response:
<character name>: <anything a character says during the scene. Make sure it is 25 words or less>
...

It is important to make sure it is only 200 words long.`,
                },
                {
                    role: 'user',
                    content: `title: <${this.$route.params.title}>`,
                },
            ]);
            console.log(result);

            const splitResult = result.message.content
                .split('\n')
                .filter((s) => s.length)
                .map((s) => s.split(':'));

            const [setting, dialog] = _.partition(splitResult, (result) => result[0] === 'Setting');
            try {
                // const prompt = `360 panorama photograph equirectangular projection monoscopic VR of ${setting[1]}.`;
                // const prompt = setting[0][1];
                // const result = await Client.OpenAI.create360Image(prompt, 'blockade');

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

                // document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: false');

                // const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                // const position = normalPosition1.clone().multiplyScalar(75);
                // this.$store.dispatch('steps/createImage', { src: this.selectedCharacter.imageSrc, position });
                debugger;
                const dialogPromises = dialog.map(async (data) => {
                    // const character = characters[data[0]];
                    // const voice = character[2];

                    // document.getElementById('camera').object3D.lookAt(character[3]);
                    // const newRotation = {
                    //     x: 0,
                    //     y: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.y), 2) - 180,
                    //     z: 0,
                    // };
                    const clonedStep = await this.$store.dispatch('steps/cloneStep', 'TT_DEFAULT_ENVIRONMENT');
                    const newStep = await this.$store.dispatch('steps/addStep', { step: clonedStep });

                    const currentStepCharacter = this.characters.find((c) => c.display === 'Lex Fridman');
                    // const currentStepCharacter = this.characters.find((c) => c.display === 'data[0]');

                    debugger;

                    await this.$store.dispatch('steps/updateStepById', { id: newStep.id, newData: { name: data[0] } });
                    await this.$store.dispatch('steps/updateStepDataById', {
                        id: newStep.id,
                        newData: {
                            transcript: data[1],
                            voice: currentStepCharacter.voice.name,
                            // rotation: newRotation,
                        },
                    });
                });
                console.log(dialogPromises);
                console.log('the dialog promises are created');

                await Promise.all(dialogPromises);
                console.log('dialog promises completed');
                await this.save();
                console.log('generated?!?!?');

                // await this.preLoadAudioFiles();
                // await this.reset();
                // console.log('generated?!?!?');
                // document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: true');
                // this.loading = false;
            } catch (err) {
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
</style>
