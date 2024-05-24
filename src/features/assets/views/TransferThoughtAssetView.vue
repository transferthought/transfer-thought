<template>
    <div>
        <v-row class="card-header-padding  card-border-bottom ma-0">
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
                @input="search"
            />
        </v-row>
        <v-card-text class="card-padding">
            <v-breadcrumbs :items="breadcrumbItems">
                <template v-slot:item="{ item }">
                    <v-btn text color="primary" @click="popSubFolderToIndex(item.index)" :disabled="item.disabled">{{ item.text }}</v-btn>
                </template>
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
            <v-item-group v-model="selectedIndexes" :multiple="multiple">
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in folders" :key="index" cols="12" md="3">
                        <v-item v-slot="{}">
                            <v-card class="asset-folder" outlined @click="addSubFolder(item.name)">
                                <div class="row fill-height ma-0 align-center justify-center">
                                    <v-icon class="text-center" width="100%" style="font-size: 200px;">mdi-folder</v-icon>
                                </div>
                                <p class="ml-3 text-capitalize">
                                    {{ item.name }}
                                </p>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col v-for="(item, index) in results" :key="index" cols="12" md="3">
                        <v-item v-slot="{ active, toggle }">
                            <AssetCard :key="item.src" :active="active" :src="item.src" :thumbnail="item.thumbnail" :name="item.name" @click="toggle" />
                        </v-item>
                    </v-col>
                    <v-col v-if="loading" cols="12" md="3">
                        <v-card outlined>
                            <v-skeleton-loader class="mx-auto" type="card" />
                        </v-card>
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
import _ from 'lodash';
import Client from '@/tt-api';
import AssetCard from '@/features/assets/AssetCard.vue';
import AssetViewMixin from './AssetViewMixin';
import Fuse from 'fuse.js';

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
    computed: {
        src() {
            if (this.options.subFolder) {
                return `Transfer_Thought_Media/${this.options.subFolder}`;
            }
            return 'Transfer_Thought_Media';
        },
        thumbnailFileType() {
            if (this.options.thumbnailFileType) {
                return this.options.thumbnailFileType;
            }
            return '.jpg';
        },
        breadcrumbItems() {
            if (this.selectedSubFolder.length > 0) {
                let rootString = 'Root';
                if (this.options.subFolder) {
                    rootString = this.options.subFolder;
                }
                return [rootString].concat(this.selectedSubFolder).map((text, index) => {
                    return {
                        text,
                        index,
                        disabled: index === this.selectedSubFolder.length,
                    };
                });
            }
            return this.selectedSubFolder;
        },
    },
    data() {
        return {
            searchText: '',
            selectedSubFolder: [],
            folders: [],
            fileSystem: {},
            fuse: null,
        };
    },
    created() {
        this.createFileSystem = _.throttle(this.createFileSystem, 200, { leading: true });
        this.fetch();
    },
    watch: {
        fileSystem() {
            this.updateResults();
        },
        selectedSubFolder() {
            this.updateResults();
        },
    },
    methods: {
        search() {
            this.selectedIndexes = null;
            this.createFileSystem();
        },
        popSubFolderToIndex(popToIndex) {
            while (this.selectedSubFolder.length > popToIndex) {
                this.selectedSubFolder.pop();
            }
        },
        addSubFolder(subfolder) {
            this.selectedSubFolder.push(subfolder);
        },
        updateResults() {
            this.selectedIndexes = null;
            // join folders and add training / to keep it consistent with the passed in src
            const srcParts = _.split(this.src, '/');
            const selectedFolderKeys = _.join([...srcParts, ...this.selectedSubFolder], '.');
            const currentSelectedFolder = _.get(this.fileSystem, selectedFolderKeys);
            [this.folders, this.results] = _(currentSelectedFolder)
                .keys()
                .filter((key) => {
                    return key !== '__data';
                })
                .map((key) => {
                    // check if result is a folder or a file
                    // if folder, set name and folder true then move on
                    // if file, set src and thumbnail
                    const value = currentSelectedFolder[key];
                    if (value.src) {
                        return value;
                    }
                    return {
                        name: key,
                        folder: true,
                    };
                })
                .partition({ folder: true })
                .value();
        },
        async fetch() {
            this.loading = true;
            // add training space to make sure we only search for folders
            const response = await Client.Storage.list(this.src + '/', { pageSize: 'ALL' });

            const options = {
                keys: ['key'],
                includeScore: true,
                threshold: 0.3,
                ignoreLocation: true,
            };
            //create fuzzy search array
            this.fuse = new Fuse(response.results, options);
            this.createFileSystem();

            this.loading = false;
        },
        createFileSystem() {
            const fileSystem = {};
            const add = (source, target, item) => {
                const elements = source.split('/');
                const element = elements.shift();
                if (!element) return; // blank
                if (elements.length) {
                    target[element] = target[element] || {}; // folder;
                    add(elements.join('/'), target[element], item);
                } else {
                    const thumbnail = this.getFileThumbnail(item);
                    const file = {
                        name: source,
                        thumbnail,
                        src: this.getFileSrc(item),
                    };
                    target[element] = file;
                }
            };
            if (this.searchText) {
                const results = this.fuse.search(this.searchText);
                results.forEach((result) => add(result.item.key, fileSystem, result.item));
            } else {
                const items = this.fuse._docs;
                items.forEach((item) => add(item.key, fileSystem, item));
            }
            this.fileSystem = fileSystem;
        },
        getFileSrc(file) {
            const base = Client.getAssetBase();
            return `${base}/${file.key}`;
        },
        getFileThumbnail(file) {
            const base = Client.getAssetBase();
            const assetFileType = file.key.split('.')[1];
            // const thumbnailFileTypes = ['.jpg', '.jpeg', '.gif', '.png'];
            // let thumbnailFileType = '.jpg';
            // console.log('fetching....', file.key);
            // for (const fileType of thumbnailFileTypes) {
            //     const url = `${base}/${file.key}`.replace('Transfer_Thought_Media', 'Transfer_Thought_Media_Thumbnails').replace(`.${assetFileType}`, fileType);
            //     console.log('fetching...', file.key, fileType);
            //     const response = await fetch(url, { method: 'HEAD' });

            //     if (response.status === 200) {
            //         console.log(`File ${fileType} exists.`);
            //         thumbnailFileType = fileType;
            //         break; // Exit the loop if any file exists
            //     } else {
            //         console.log(`File ${fileType} does not exist.`);
            //     }
            // }
            // console.log('fetched...', file.key, thumbnailFileType);

            return `${base}/${file.key}`
                .replace('Transfer_Thought_Media', 'Transfer_Thought_Media_Thumbnails')
                .replace(`.${assetFileType}`, this.thumbnailFileType);
        },
    },
};
</script>
<style scoped></style>
