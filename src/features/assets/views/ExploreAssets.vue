<template>
    <div>
        <div class="card-header-padding ma-0 card-border-bottom">
            <v-row>
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
                />
                <v-btn depressed rounded class="font-weight-600 text-h5 text-capitalize py-1 ml-3" @click="search">
                    Search
                </v-btn>
            </v-row>
            <v-row class="">
                <v-col v-for="filter in filters" :key="filter.id" cols="3">
                    <v-select v-model="filter.value" filled :items="filter.options" :label="filter.label" />
                </v-col>
            </v-row>
        </div>
        <v-card-text class="card-padding">
            <v-item-group v-model="selectedIndexes" :multiple="multiple">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results" :key="index" cols="12" md="3">
                        <v-item v-slot="{ active, toggle }">
                            <AssetCard :active="active" :name="item.name" :src="item.src" :thumbnail="item.thumbnail" @click="toggle" />
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
    name: 'ExploreAssets',
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
        generateFilterString() {
            const filterStrings = this.filters.map((filter) => `${filter.id}=${filter.value}`);
            return filterStrings.join('&');
        },

        async loadMore() {
            this.loading = true;
            const filterString = this.generateFilterString();
            // eslint-disable-next-line max-len

            const googleSearchKey = 'GOOGLE_KEY';
            const responseResult = await fetch(
                `https://www.googleapis.com/customsearch/v1?cx=b64b1296003d540c6&searchType=image&imgSize=large&key=${googleSearchKey}&safe=high&start=${
                    this.start
                }&q=${encodeURIComponent(this.searchText)}&${filterString}`
            );
            const responseJson = await responseResult.json();
            const mappedItems = responseJson.items.map((item) => ({
                name: item.title,
                thumbnail: item.link,
                src: item.link,
            }));
            this.results = this.results.concat(mappedItems);
            this.loading = false;
            this.start += 10;
        },

        // Pulling files from google, lets upload them to our asset store first
        async getSelectedAssetUrls() {
            if (this.selectedResults.length > 0) {
                const imagePromises = this.selectedResults.map(async (selectedResult) => {
                    const proxySrc = `https://qaqv02l4hh.execute-api.us-east-1.amazonaws.com/default/google-asset-passthrough?query=${selectedResult.src}`;
                    const response = await fetch(proxySrc);
                    const data = await response.blob();
                    return this.$store.dispatch('assets/createThumbnail', { file: data });
                });
                const images = await Promise.all(imagePromises);
                return images;
            }
            throw new Error('Nothing selected');
        },
    },
};
</script>
<style scoped></style>
