<template>
    <div>
        <v-row class="card-header-padding ma-0 card-border-bottom">
            <v-text-field
                v-model="text"
                rounded
                hide-details
                outlined
                background-color="white"
                color="rgba(0,0,0,.6)"
                light
                placeholder="Search for places, objects, and more..."
                class="font-size-input placeholder-dark input-alternative input-icon"
                @keyup.enter="generate"
            />
            <v-btn depressed rounded class="font-weight-600 text-h5 text-capitalize py-1 ml-3" @click="generate">
                Generate
            </v-btn>
        </v-row>
        <v-card-text class="card-padding">
            <v-item-group v-model="selectedIndexes">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results" :key="index" cols="3">
                        <v-item v-slot="{ active, toggle }">
                            <AssetCard :thumbnail="item.thumbnail" :src="item.src" :active="active" @click="toggle" />
                        </v-item>
                    </v-col>
                    <v-col v-if="loading" cols="3">
                        <v-skeleton-loader class="mx-auto" type="card" />
                    </v-col>
                </v-row>
            </v-item-group>
        </v-card-text>
    </div>
</template>

<script>
import Client from '@/tt-api';
import AssetCard from '@/features/assets/AssetCard.vue';
import AssetViewMixin from './AssetViewMixin';

export default {
    name: 'DallE360View',
    components: {
        AssetCard,
    },
    mixins: [AssetViewMixin],
    data() {
        return {
            text: '',
        };
    },
    methods: {
        async generate() {
            this.loading = true;
            const prompt = `360 panorama photograph equirectangular projection monoscopic VR of ${this.text}.`;
            const result = await Client.OpenAI.create360Image(prompt, 'blockade');
            this.results = [
                {
                    name: this.text,
                    thumbnail: result.src,
                    src: result.src,
                },
            ];
            this.loading = false;
        },
        async addBlackBarsToImage(imageBlob) {
            return new Promise((resolve, reject) => {
                // Create a new image object
                const image = new Image();

                // Set the source of the image to the blob
                image.src = URL.createObjectURL(imageBlob);

                // Create a canvas element
                const canvas = document.createElement('canvas');

                // Wait for the image to load
                image.onload = () => {
                    // Get the dimensions of the image
                    const width = image.width;
                    const height = image.height;

                    // Define the width of the black bars
                    const barWidth = width / 2;

                    // Set the width and height of the canvas to the dimensions of the image plus the width of the black bars
                    canvas.width = width + barWidth * 2;
                    canvas.height = height;

                    // Get the 2D context of the canvas
                    const context = canvas.getContext('2d');

                    // Create black bars on the left and right sides of the canvas
                    context.fillStyle = '#000000';
                    context.fillRect(0, 0, barWidth, height);
                    context.fillRect(canvas.width - barWidth, 0, barWidth, height);

                    // Draw the image in the middle of the canvas
                    context.drawImage(image, barWidth, 0, width, height);

                    // Convert the canvas to a blob
                    canvas.toBlob((blob) => {
                        // Resolve the Promise with the new blob
                        resolve(blob);
                    });
                };

                // Handle errors loading the image
                image.onerror = () => {
                    reject(new Error('Failed to load image.'));
                };
            });
        },
        drawImageBlobToCanvas(canvas, imageBlob, x, y) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.src = URL.createObjectURL(imageBlob);

                const context = canvas.getContext('2d');

                image.onload = () => {
                    context.drawImage(image, x, y);
                    resolve();
                };

                image.onerror = () => {
                    reject(new Error('Failed to load image.'));
                };
            });
        },
        async joinImages(leftImageBlob, rightImageBlob) {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            return new Promise(async (resolve, reject) => {
                // Create a new image object
                await Promise.all([this.drawImageBlobToCanvas(canvas, leftImageBlob, 0, 0), this.drawImageBlobToCanvas(canvas, rightImageBlob, 1024, 0)]);
                // Convert the canvas to a blob
                canvas.toBlob((blob) => {
                    // Resolve the Promise with the new blob
                    resolve(blob);
                });
            });
        },
        async getSelectedAssetUrls() {
            if (this.selectedResults.length > 0) {
                // const srcs = this.selectedResults.map(async (selectedResult) => {
                //     const proxySrc = `https://qaqv02l4hh.execute-api.us-east-1.amazonaws.com/default/google-asset-passthrough?query=${selectedResult.joinedImages}&format=base64`;
                //     const response = await fetch(proxySrc);
                //     const oneEightyBlob = await response.blob();
                //     const data = await this.addBlackBarsToImage(oneEightyBlob);
                //     const imageUrl = await this.$store.dispatch('assets/createThumbnail', { file: data });
                //     return imageUrl;
                // });
                // return Promise.all(srcs);
                // const srcs = this.selectedResults.map((selectedResult) => {
                //     debugger;
                //     // const response = await fetch(selectedResult.src);
                //     // debugger;
                //     // const data = await response.blob();
                //     // const imageUrl = await this.$store.dispatch('assets/createThumbnail', { file: data });
                //     return selectedResult.src;
                // });
                // const resolvedSrcs = await Promise.all(srcs);
                // return resolvedSrcs;

                return this.selectedResults.map((selectedResult) => {
                    return selectedResult.src;
                });
            }
            throw new Error('Nothing selected');
        },
    },
};
</script>
<style scoped></style>
