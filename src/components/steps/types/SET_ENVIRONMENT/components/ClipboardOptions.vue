<template>
    <div class="py-5">
        <!-- <v-row align="center">
            <v-col cols="4">
                <label class="label-color font-weight-600 mb-2 d-block">Visible</label>
            </v-col>
            <v-col cols="6">
                <v-checkbox :input-value="newClipboardData.visible" @change="handleUpdate('visible', $event)"></v-checkbox>
            </v-col>
        </v-row> -->
        <v-row class="pb-2" v-if="newClipboardData && newClipboardData.pages && newClipboardData.pages.length">
            <v-col>
                <v-row v-for="(page, index) in newClipboardData.pages" :key="index" class="pb-4">
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">Page {{ index + 1 }}</label>
                        <v-row no-gutters class="pb-4">
                            <v-col>
                                <v-text-field
                                    :value="page.header"
                                    hide-details
                                    outlined
                                    label="Header"
                                    class="input-style font-size-input"
                                    placeholder="Clipboard Page Header..."
                                    @change="handlePageValueChanged(index, 'header', $event)"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-text-short
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <label class="label-color font-weight-600 d-block">Page Type</label>
                        <v-row no-gutters class="pb-4">
                            <v-col>
                                <v-radio-group :value="page.type || 'text'" @change="handlePageValueChanged(index, 'type', $event)">
                                    <v-radio label="Text" value="text"></v-radio>
                                    <v-radio label="Image" value="image"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <v-row no-gutters class="pb-4" v-if="page.type === 'text'">
                            <v-col>
                                <v-textarea
                                    :value="page.body"
                                    hide-details
                                    outlined
                                    rows="3"
                                    label="Body"
                                    class="input-style font-size-input"
                                    placeholder="Clipboard Page Body..."
                                    @change="handlePageValueChanged(index, 'body', $event)"
                                >
                                    <template slot="prepend-inner">
                                        <v-icon color="#adb5bd">
                                            mdi-text-long
                                        </v-icon>
                                    </template>
                                </v-textarea>
                            </v-col>
                        </v-row>

                        <v-row no-gutters class="pb-4" v-if="page.type === 'image'">
                            <v-col>
                                <ImageInput :src="page.src" title="Page Image" @change="handlePageValueChanged(index, 'src', $event)" />
                            </v-col>
                        </v-row>

                        <v-row justify="end" no-gutters>
                            <v-btn class="font-weight-600 text-capitalize py-1" color="error" depressed dark @click="handleDeletePage(index)">
                                Delete Page {{ index + 1 }}
                            </v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <EmptyMessage v-else title="No Clipboard Pages Yet" description="" />

        <v-btn depressed block color="primary" class="font-weight-600 text-capitalize py-1" x-large @click="addPage()">
            Add New Page
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>
    </div>
</template>
<script>
import EmptyMessage from '@/components/EmptyMessage.vue';
import ImageInput from '@/components/ImageInput.vue';

export default {
    name: 'ClipboardOptions',
    components: { EmptyMessage, ImageInput },
    mixins: [],
    props: {},
    data() {
        return {
            updates: [],
        };
    },
    computed: {
        state() {
            return this.$store.state.apps.state.state;
        },
        clipboard() {
            if (this.state?.currentEnvironment?.data) {
                const { clipboard } = this.state.currentEnvironment.data;
                if (clipboard && clipboard.length) {
                    return clipboard[0];
                }
            }
            return null;
        },
        newClipboardData: {
            get() {
                const newClipboardData = this.clipboard
                    ? _.cloneDeep(this.clipboard)
                    : {
                          id: 'clipboard',
                          type: 'clipboard',
                          visible: false,
                          currentPage: 0,
                      };
                _.forEach(this.updates, (value, key) => {
                    _.set(newClipboardData, key, value);
                });
                return newClipboardData;
            },
            set(key, value) {
                this.updates[key] = value;
            },
        },
    },
    methods: {
        addPage() {
            const newPage = { header: 'New Header...', body: 'New Body...', type: 'text' };
            if (this.newClipboardData && this.newClipboardData.pages) {
                this.handleUpdate('pages', [...this.newClipboardData.pages, newPage]);
            } else {
                this.handleUpdate('pages', [newPage]);
            }
        },
        handleDeletePage(pageIndex) {
            const newPages = this.newClipboardData.pages.filter((page, index) => {
                return index !== pageIndex;
            });

            this.handleUpdate('pages', newPages);
        },
        handlePageValueChanged(pageIndex, key, value) {
            const newPages = this.newClipboardData.pages.map((page, index) => {
                if (index === pageIndex) {
                    return {
                        ...page,
                        [key]: value,
                    };
                }
                return page;
            });
            this.handleUpdate('pages', newPages);
        },
        handleUpdate(key, value) {
            this.updates = { ...this.updates, [key]: value };
            this.$emit('change', this.newClipboardData);
        },
        getData() {
            return this.newClipboardData;
        },
        reset() {
            this.updates = [];
        },
        async save() {
            console.log('clup', this.clipboard);
            if (this.clipboard) {
                this.$store.dispatch('steps/updateEntity', {
                    entityId: 'clipboard',
                    newData: this.newClipboardData,
                });
            } else {
                this.$store.dispatch('steps/createEntity', {
                    entity: this.newClipboardData,
                });
            }
        },
    },
};
</script>

<style scoped></style>
