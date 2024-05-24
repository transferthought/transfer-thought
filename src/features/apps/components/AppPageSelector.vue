<template>
    <fragment>
        <div class="mt-2">
            <v-text-field
                id="page-app-search"
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                label="Search..."
                single-line
                hide-details
            ></v-text-field>
            <div v-if="pageListStatus === 'SUCCESS'">
                <v-data-table
                    :value="selected"
                    :loading="isUpdatingSelection"
                    loading-text="Updating Selection..."
                    item-key="id"
                    show-select
                    checkbox-color="primary"
                    :items="pageList"
                    :headers="headers"
                    :search="search"
                    :item-class="(item) => 'app-page'"
                    @item-selected="handleItemSelected"
                >
                    <template v-slot:header.data-table-select></template>
                    <template v-slot:item.data-table-select="{ isSelected, item }">
                        <v-checkbox :value="isSelected" :disabled="isUpdatingSelection" @change="handleItemSelected({ item, value: $event })"></v-checkbox>
                    </template>
                    <template v-slot:item.updatedAt="{ item }">
                        {{ new Date(item.updatedAt) | dateFormat('MM/DD/YYYY') }}
                    </template>
                </v-data-table>
            </div>
            <div v-else>
                Loading....
            </div>
        </div>
    </fragment>
</template>

<script>
export default {
    components: {},
    props: {
        app: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            isUpdatingSelection: false,
            search: '',
            headers: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                {
                    text: 'Last Updated',
                    align: 'start',
                    sortable: false,
                    value: 'updatedAt',
                },
            ],
        };
    },
    async mounted() {
        await this.$store.dispatch('pages/fetchList');
    },
    computed: {
        pageListStatus() {
            return this.$store.state.pages.listStatus;
        },
        pageList() {
            const pageList = this.$store.getters['pages/list'];
            return pageList;
        },
        selected() {
            if (this.pageListStatus === 'SUCCESS') {
                const selectedPages = _(this.pageList)
                    .filter((page) => {
                        const foundApp = _.find(page.apps, (app) => {
                            return app.appId === this.app.appId;
                        });
                        return foundApp;
                    })
                    .value();
                return selectedPages;
            }
            return [];
        },
    },
    methods: {
        async handleItemSelected(selected) {
            console.log(selected);
            this.isUpdatingSelection = true;
            try {
                if (selected.value) {
                    await this.$store.dispatch('apps/publishPageApp', { pageId: selected.item.id, appId: this.app.appId });
                } else {
                    await this.$store.dispatch('apps/removePageApp', { pageId: selected.item.id, appId: this.app.appId });
                }
            } catch (err) {
                console.log(err);
            }
            this.isUpdatingSelection = false;
        },
    },
};
</script>
<style scoped>
.app-list-container {
    max-height: 300px;
    overflow-y: auto;
}
.ghost {
    border: solid 2px var(--v-primary-base) !important;
    opacity: 0.5;
}
.draggable {
    cursor: grab;
}
</style>
