<template>
    <fragment>
        <v-card :data-title="page.title" outlined hover rounded class="page-card mb-6" :to="{ name: 'PageEditor', params: { pageId: page.id } }">
            <v-img :src="page.data.coverSrc" height="210">
                <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-icon x-large>
                            mdi-image
                        </v-icon>
                    </v-row>
                </template>
            </v-img>

            <v-card-text class="pr-0">
                <v-list-item class="pr-0">
                    <v-list-item-content>
                        <v-list-item-title class="text-h6 text-typo font-weight-600 mb-0">{{ page.title }}</v-list-item-title>
                        <v-list-item-subtitle>Updated {{ new Date(page.updatedAt) | dateFormat('MM/DD/YYYY') }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-menu bottom min-width="200px" rounded offset-y class="ml-2">
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" v-on:click.prevent>
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="handleClone">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Duplicate</v-list-item-title>
                                </v-list-item>
                                <v-list-item id="page-card-menu-delete" @click="showConfirmationDialog = true">
                                    <v-list-item-icon large>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item-action>
                </v-list-item>
            </v-card-text>
        </v-card>

        <ConfirmationDialog
            type="Page"
            :name="page && page.title"
            :show="showConfirmationDialog"
            @cancel="showConfirmationDialog = false"
            @confirm="handleDelete"
        />
    </fragment>
</template>

<script>
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

export default {
    components: { ConfirmationDialog },
    props: {
        page: Object,
    },
    data() {
        return {
            pages: [],
            showConfirmationDialog: false,
        };
    },
    computed: {},
    methods: {
        async handleClone() {
            const newPage = {
                ...this.page,
                title: `${this.page.title} (clone)`,
            };
            const newPageItem = await this.$store.dispatch('pages/clone', newPage);
            // clone all of the related pages
            this.$router.push({ name: 'PageEditor', params: { pageId: newPageItem.id } });
        },
        async handleDelete() {
            this.$store.dispatch('pages/destroy', { id: this.page.id, type: this.page.type });
            this.showConfirmationDialog = false;
        },
    },
};
</script>
