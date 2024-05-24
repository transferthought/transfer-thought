<template>
    <fragment>
        <v-card :data-title="name" outlined hover rounded class="asset-card mb-6" :color="active ? 'primary lighten-1' : ''" @click="$emit('click')">
            <v-container fluid class="pa-0" v-if="isAudio">
                <v-row class="fill-height ma-0 align-center justify-center">
                    <v-icon class="text-center" width="100%" style="font-size: 200px;">mdi-music</v-icon>
                </v-row>
                <v-row class="px-2">
                    <v-col cols="3">
                        <v-btn icon x-large v-show="!audio.playing()" @click.stop="play">
                            <v-icon x-large>
                                mdi-play
                            </v-icon>
                        </v-btn>

                        <v-btn icon x-large v-show="audio.playing()" @click.stop="stop">
                            <v-icon>
                                mdi-stop
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-container fluid class="pa-0" v-else>
                <v-img class="ma-1 rounded-sm white--text align-end thumbnail" lazy-src="http://placehold.jp/200x200.png" aspect-ratio="1" :src="thumbnail">
                    <template v-slot:placeholder>
                        <!-- <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row> -->
                    </template>
                </v-img>
            </v-container>
            <v-card-text class="pa-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <v-list-item-title class="text-truncate text-typo font-weight-600 mb-0">
                            {{ name }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
        </v-card>
    </fragment>
</template>

<script>
import ClickToEditTextInput from '@/components/ClickToEditTextInput.vue';

import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

export default {
    name: 'AssetCard',
    components: { ConfirmationDialog, ClickToEditTextInput },
    props: {
        src: String,
        thumbnail: String,
        name: String,
        active: Boolean,
    },
    data() {
        return {
            tempName: null,
            isAudio: false,
            audio: null,
            deleting: false,
            showConfirmationDialog: false,
        };
    },
    mounted() {
        this.checkIsAudio();
    },
    computed: {},
    methods: {
        async checkIsAudio() {
            try {
                if (this.src.endsWith('.wav') || this.src.endsWith('.mp3')) {
                    this.isAudio = true;
                } else {
                    const res = await fetch(this.src, { method: 'HEAD' });
                    this.isAudio = res.headers.get('content-type').startsWith('audio');
                }
                this.initAudio();
            } catch (err) {
                console.error(err);
            }
        },
        initAudio() {
            if (this.isAudio) {
                this.audio = new Howl({
                    src: [this.src],
                    html5: true,
                });
            }
        },
        play() {
            this.audio.play();
        },
        stop() {
            this.audio.stop();
        },
    },
};
</script>
<style scoped>
.thumbnail {
    overflow: hidden;
}
</style>
