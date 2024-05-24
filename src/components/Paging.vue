<template>
    <div>
        <div v-if="!hideSearch" class="card-header-padding card-border-bottom">
            <slot name="Search">
                <v-text-field
                    v-model="searchString"
                    rounded
                    hide-details
                    outlined
                    background-color="rgba(255,255,255,.9)"
                    color="rgba(0,0,0,.6)"
                    light
                    placeholder="Search"
                    class="font-size-input placeholder-dark input-alternative input-icon"
                />
            </slot>
        </div>

        <v-card-text class="card-padding">
            <v-row style="margin: 0">
                <slot :items="items" :loading="loading" />
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn class="font-weight-600 text-capitalize" depressed :disabled="this.nextNextToken === null" @click="showMore">
                Show More
            </v-btn>
            <v-spacer />
        </v-card-actions>
    </div>
</template>

<script>
import _ from 'lodash';
import gql from 'graphql-tag';
import { mapState } from 'vuex';
import Client from '@/tt-api';

export default {
    name: 'Paging',
    components: {},
    props: {
        queryName: String,
        searchKey: {
            type: String,
            default: 'name',
        },
        complexSearch: {
            type: Object,
            default: null,
        },
        filter: Object,
        query: String,
        hideSearch: Boolean,
    },
    data() {
        return {
            searchString: null,
            searchParam: null,
            previousSearchParam: null,
            items: [],
            nextToken: null,
            nextNextToken: null,
            previousTokens: [],
            pageSize: 25,
            loading: false,
        };
    },
    watch: {
        searchString(value) {
            this.updateSearchParam(value);
        },
        query(value) {
            this.updateSearchParam(value);
        },
    },
    created() {
        this.updateSearchParam = _.debounce(this.updateSearchParam, 500, { leading: false });
    },
    mounted() {
        this.fetch();
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
        }),
    },
    methods: {
        updateSearchParam(value) {
            this.searchParam = value;
            this.nextToken = null;
            this.fetch();
        },
        showMore() {
            this.previousTokens.push(this.nextToken);
            this.nextToken = this.nextNextToken;
            this.fetch();
        },
        getVariables() {
            if (this.previousSearchParam !== this.searchParam) {
                this.items = [];
            }
            this.previousSearchParam = this.searchParam;
            const variables = {
                limit: this.pageSize,
                nextToken: this.nextToken,
                owner: this.user.username,
            };
            if (this.filter) {
                variables.filter = this.filter;
            }
            if (this.searchParam) {
                variables.name = {
                    beginsWith: this.searchParam,
                };
            }
            if (this.searchParam || this.complexSearch) {
                if (this.complexSearch) {
                    const searchParamValue = {
                        ...this.complexSearch.value,
                    };
                    if (this.searchParam) {
                        searchParamValue[this.searchKey] = this.searchParam;
                    }
                    variables[this.complexSearch.key] = { beginsWith: searchParamValue };
                } else {
                    variables[this.searchKey] = { beginsWith: this.searchParam };
                }
            }
            return variables;
        },
        async fetch() {
            this.loading = true;
            const { data } = await this.$apollo.query({
                query: gql(Client.Queries[this.queryName]),
                variables: this.getVariables(),
            });
            this.loading = false;
            const { nextToken, items } = data[this.queryName];
            this.items = [...this.items, ...items];
            this.nextNextToken = nextToken;
        },
        removeItem(key, value) {
            this.items = _.filter(this.items, (item) => {
                return item[key] !== value;
            });
        },
    },
};
</script>
<style scoped>
.layout-container {
    overflow: auto;
    width: 100%;
}
</style>
