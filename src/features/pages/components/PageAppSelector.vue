<template>
    <fragment>
        <div v-if="selected && selected.length">
            <label class="label-color font-weight-600 mb-2 d-block">Current</label>

            <draggable v-model="selected" ghost-class="ghost" handle=".draggable" :scroll-sensitivity="100" :force-fallback="true" :sort="true">
                <v-chip v-for="app in selected" :key="app.appId" class="ma-1 draggable" close @click:close="handleRemovePageApp(pageApp)">
                    <v-icon left>
                        mdi-drag
                    </v-icon>
                    {{ app.name }}
                </v-chip>
            </draggable>
        </div>
        <div class="mt-2">
            <label class="label-color font-weight-600 mb-2 d-block">All Options</label>

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
            <div v-if="appListStatus === 'SUCCESS'">
                <v-data-table
                    v-model="selected"
                    item-key="appId"
                    show-select
                    checkbox-color="primary"
                    :items="appList"
                    :headers="headers"
                    :search="search"
                    :item-class="(item) => 'app-page'"
                >
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
import draggable from 'vuedraggable';
export default {
    components: { draggable },
    props: {
        pageApps: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            search: '',
            headers: [
                {
                    text: 'Name',
                    align: 'start',
                    sortable: false,
                    value: 'name',
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
    computed: {
        appListStatus() {
            return this.$store.state.apps.listStatus;
        },
        appList() {
            const appList = this.$store.getters['apps/list'];
            return appList;
        },
        selected: {
            get() {
                if (this.appListStatus === 'SUCCESS') {
                    const selectedApps = _(this.pageApps)
                        .map((pageApp) => {
                            const app = _.find(this.appList, (app) => {
                                if (app && app.appId) {
                                    return app.appId === pageApp.appId;
                                }
                                return false;
                            });
                            return { ...app, pageApp };
                        })
                        .filter((app) => {
                            // only show apps that have been found
                            return !!app.appId;
                        })
                        // sort apps by order
                        // .sort((a, b) => {
                        //     const orderA = a?.pageApp?.data?.order;
                        //     const orderB = b?.pageApp?.data?.order;
                        //     const updatedAtA = new Date(a.updatedAt);
                        //     const updatedAtB = new Date(b.updatedAt);

                        //     const hasOrderA = orderA !== undefined;
                        //     const hasOrderB = orderB !== undefined;

                        //     if (hasOrderA && hasOrderB) {
                        //         // Both items have 'order', compare them
                        //         return orderA - orderB;
                        //     } else if (hasOrderA) {
                        //         // Only item a has 'order', so b should come after a
                        //         return -1;
                        //     } else if (hasOrderB) {
                        //         // Only item b has 'order', so a should come after b
                        //         return 1;
                        //     } else {
                        //         // Neither item has 'order', sort by app updated at
                        //         return updatedAtA - updatedAtB;
                        //     }
                        // })
                        .value();
                    return selectedApps;
                }
                return [];
            },
            set(newSelected) {
                console.log('new selected', newSelected);
                const pageApps = _.map(newSelected, (selectedItem, index) => {
                    return {
                        appId: selectedItem.appId,
                        data: { order: index },
                    };
                });
                console.log('pageApps', pageApps);
                this.$emit('change', pageApps);
            },
        },
    },
    methods: {
        async handleRemovePageApp(removedPageApp) {
            const newPageApps = _.filter(this.pageApps, (pageApp) => pageApp.appId !== removedPageApp.appId);
            this.$emit('change', newPageApps);
        },
        handlePageAppReorder({ moved }) {
            const { oldIndex, newIndex } = moved;
            const newSelected = _.clone(this.selected);
            console.log(newSelected[0].name, oldIndex, newIndex);
            const [element] = newSelected.splice(oldIndex, 1);
            console.log(newSelected[0].name, oldIndex, newIndex);
            // Insert the element at the new position
            newSelected.splice(newIndex, 0, element);
            console.log(newSelected[0].name, oldIndex, newIndex);
            this.selected = newSelected;
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
