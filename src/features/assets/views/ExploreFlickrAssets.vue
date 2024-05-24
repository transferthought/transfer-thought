<template>
    <div>
        <v-row class="card-header-padding ma-0 card-border-bottom">
            <v-text-field
                v-model="searchText"
                rounded
                hide-details
                outlined
                background-color="white"
                color="rgba(0,0,0,.6)"
                light
                placeholder="Search for places, objects, and more..."
                class="font-size-input placeholder-dark input-alternative input-icon"
                @keyup.enter="search"
            >
                <template v-slot:append-outer>
                    <v-btn depressed rounded class="font-weight-600 text-h5 text-capitalize py-1" @click="search">
                        Search
                    </v-btn>
                </template>
            </v-text-field>
        </v-row>
        <v-card-text class="card-padding">
            <v-item-group v-model="selectedIndexes" :multiple="multiple">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results" :key="index" cols="12" md="3">
                        <v-item v-slot="{ active, toggle }">
                            <AssetCard :active="active" :thumbnail="item.thumbnail" :src="item.src" @click="toggle" />
                        </v-item>
                    </v-col>
                    <v-col v-if="loading" cols="12" md="3">
                        <v-skeleton-loader class="mx-auto" type="card" />
                    </v-col>
                </v-row>
            </v-item-group>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn class="font-weight-600 text-capitalize" depressed @click="loadMore">
                Show More
            </v-btn>
            <v-spacer />
        </v-card-actions>
    </div>
</template>

<script>
import AssetCard from '@/features/assets/AssetCard.vue';
import AssetViewMixin from './AssetViewMixin';

export default {
    name: 'ExploreFlickrAssets',
    components: {
        AssetCard,
    },
    mixins: [AssetViewMixin],
    data() {
        return {
            searchText: '',
            defaultSearch: 'Construction',
            start: 1,
            filters: [
                {
                    id: 'imgColorType',
                    value: 'color',
                    label: 'Image Color',
                    options: [
                        {
                            value: 'color',
                            text: 'Color',
                            description: 'All colors',
                        },
                        {
                            value: 'trans',
                            text: 'Transparent',
                            description: 'Only search for images with transparent background',
                        },
                    ],
                },
                {
                    id: 'imgType',
                    value: 'photo',
                    label: 'Image Type',
                    options: [
                        {
                            value: 'photo',
                            text: 'Photo',
                            description: 'Only search for images with transparent background',
                        },
                        {
                            value: 'face',
                            text: 'Face',
                            description: 'Only search for images with transparent background',
                        },
                        {
                            value: 'animated',
                            text: 'Animation',
                            description: 'Only search for images with transparent background',
                        },
                        {
                            value: 'clipart',
                            text: 'Clipart',
                            description: 'All colors',
                        },
                    ],
                },
            ],
        };
    },
    async created() {
        this.searchText = this.defaultSearch;
        await this.search();
        this.searchText = '';
    },
    methods: {
        async search() {
            this.results = [];
            await this.loadMore();
            this.start = 1;
            this.resetSelectedIndexes();
        },

        async loadMore() {
            this.loading = true;
            // eslint-disable-next-line max-len
            const flickrApiKey = 'FLICKR_API_KEY';
            const responseResult = await fetch(
                `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&text=equirectangular+${encodeURIComponent(
                    this.searchText
                )}&format=json&nojsoncallback=1&page=${this.start}&per_page=10`
            );
            const responseJson = await responseResult.json();
            const responseAsync = responseJson.photos.photo.map(async (item) => {
                // eslint-disable-next-line max-len
                const photoSizesResponse = await fetch(
                    `https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${flickrApiKey}&photo_id=${item.id}&format=json&nojsoncallback=1`
                );
                const photoSizesJson = await photoSizesResponse.json();
                const thumbnail = photoSizesJson.sizes.size.find((size) => size.label === 'Small');
                const original = photoSizesJson.sizes.size.find((size) => size.width === 2048);
                return {
                    name: item.title,
                    thumbnail: thumbnail && thumbnail.source,
                    src: original && original.source,
                };
            });

            const mappedItems = await Promise.all(responseAsync);

            this.results = this.results.concat(mappedItems);
            this.loading = false;
            this.start += 1;
        },

        async getSelectedAssetUrls() {
            if (this.selectedResults.length > 0) {
                const srcs = this.selectedResults.map((selectedResult) => selectedResult.src);
                return srcs;
            }
            throw new Error('Nothing selected');
        },
    },
};
</script>
<style scoped></style>
