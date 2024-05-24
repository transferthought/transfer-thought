<template>
    <v-container class="pa-0 mb-12 d-flex flex-column ">
        <div class="headerRight">
            <a href="https://forms.gle/ASXPeLC6jmXm18Fx5" target="_blank" rel="noopener noreferrer">Want full access? Sign up for Inveo Closed Beta</a>
        </div>
        <v-row class="mt-12">
            <v-col cols="12" class=" mt-12 mb-0  d-flex justify-center" wrap>
                <h1 class="mt-12">
                    <span class="blackFont">i</span>
                    <span class="blackFont">n</span>
                    <span class="blackFont">v</span>
                    <span class="blackFont">e</span>
                    <span class="blackFont">o</span>
                </h1>
            </v-col>
            <v-col cols="12" class=" d-flex justify-center mb-3">
                <input v-model="searchWord" type="text" class="input-field mt-0" placeholder="What is your video about?" @keyup.enter="generateNewVideo" />
            </v-col>
            <v-col cols="12" class="d-flex justify-center align-center  mb-4 mt-3 ">
                <v-btn class="blue white--text" @click="generateNewVideo">
                    Generate
                </v-btn>
            </v-col>
            <v-col v-if="!loaded" class="d-flex justify-center align-center spinner mt-12 " cols="12" />
        </v-row>
        <v-row class="d-flex justify-center align-center " mt-12>
            <v-col v-for="item in generatedVideos" :key="item.src" cols="12" md="3" lg="4" xl="4">
                <v-card color="#ffa500" :elevation="7">
                    <v-card-text class="black--text d-flex justify-center align-center  ">
                        <p>{{ item.title }}</p>
                        <v-btn icon @click="copyUrl(item.src)">
                            <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                    </v-card-text>
                    <video controls><source :src="item.src" type="video/mp4" /></video>
                </v-card>
            </v-col>
        </v-row>
        <SnackMessages />
    </v-container>
</template>

<script>
import SnackMessages from '@/components/editor/SnackMessages.vue';

export default {
    name: 'Inveo',
    components: {
        SnackMessages,
    },
    data() {
        return {
            linkArray: [],
            counter: 0,
            testState: '',
            loaded: true,
            searchWord: '',
            generatedVideos: [],
        };
    },
    mounted() {
        const storedVideos = localStorage.getItem('videos');
        this.generatedVideos = storedVideos ? JSON.parse(storedVideos) : [];
    },
    watch: {
        generatedVideos() {
            localStorage.setItem('videos', JSON.stringify(this.generatedVideos));
        },
    },
    methods: {
        async generateNewVideo() {
            this.loaded = false;
            this.generatedVideos = [
                {
                    title: this.searchWord,
                    src: `https://api.inveo.ai/generate/${this.searchWord}`,
                },
                ...this.generatedVideos,
            ];
            this.loaded = true;
        },
        copyUrl(url) {
            const el = document.createElement('textarea');
            el.value = encodeURI(url);
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$store.commit('apps/snackMessage', 'Link copied to clipboard');
        },
    },
};
</script>

<style scoped>
.headerRight {
    display: flex;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.87);
    position: fixed;
    right: 0; /* for it to be responsive */
    top: 15px;
    z-index: 2;
}

label textarea {
    vertical-align: middle;
}

h1 {
    font-size: 5em;
    font-family: 'Readex Pro', sans-serif;
}

.title {
    font-size: 9em;
}

.capital {
    font-size: 1.05em;
}

.input-field {
    vertical-align: middle;
    justify-content: center;
    text-align: center;
    border-radius: 70px;
    box-shadow: 1px 1px 3px -2px rgb(0 0 0 / 20%), 1px 1px 1px 1px rgb(0 0 0 / 14%), 1px 1px 5px 1px rgb(0 0 0 / 12%);
    width: 45%;
    padding: 1%;
    margin-top: 5%;
}

input:hover {
    outline-color: rgb(80, 80, 81);
    outline-width: 0.1px;
    box-shadow: 0px 4px 2px -2px rgb(0 0 0 / 20%), 0px 2px 2px 2px rgb(0 0 0 / 14%), 3px 3px 6px 4px rgb(0 0 0 / 12%);
}

input:focus {
    outline: none;
}

input:focus::placeholder {
    color: transparent;
}

::placeholder {
    font-size: large;
}

::placeholder:hover {
    display: none;
}

.v-card {
    border: 5px solid;
}

.orangeFont {
    color: orange;
}

.greenFont {
    color: seagreen;
}

.redFont {
    color: tomato;
}

.blueFont {
    color: #2196f3;
}

.blackFont {
    color: black;
}
</style>
