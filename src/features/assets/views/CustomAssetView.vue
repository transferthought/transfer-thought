<template>
    <div>
        <v-card-text class="card-padding">
            <v-item-group v-model="selectedIndexes" :multiple="multiple">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results" :key="index" cols="3">
                        <v-item v-slot="{ active, toggle }">
                            <AssetCard :active="active" :name="item.name" :thumbnail="getItemThumbnail(item)" @click="toggle" />
                        </v-item>
                    </v-col>
                    <v-col v-if="loading" cols="3">
                        <v-skeleton-loader class="mx-auto" type="card" />
                    </v-col>
                </v-row>
            </v-item-group>
        </v-card-text>
        <!-- <v-card-actions>
            <v-spacer />
            <v-btn
                class="font-weight-600 text-capitalize"
                depressed
                @click="loadMore"
            >
                Show More
            </v-btn>
            <v-spacer />
        </v-card-actions> -->
    </div>
</template>

<script>
import Client from '@/tt-api';
import AssetCard from '@/features/assets/AssetCard.vue';
import AssetViewMixin from './AssetViewMixin';

export default {
    name: 'TransferThoughtAssets',
    components: {
        AssetCard,
    },
    mixins: [AssetViewMixin],
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        options: {},
    },
    computed: {},
    data() {
        return {
            searchText: '',
        };
    },
    created() {
        this.results = this.options.items || [];
    },
    methods: {
        getItemThumbnail(item) {
            const base = Client.getAssetBase();
            return `${base}/${this.options.thumbailSubfolder}/${item.name}.jpg`;
        },
    },
};
</script>
<style scoped></style>
