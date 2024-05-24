export default {
    components: {},
    data() {
        return {
            results: [],
            selectedIndexes: null,
            loading: false,
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        selectedIndexes: {
            handler() {
                this.$emit('selection-change', this.selectedResults);
            },
            immediate: true,
            deep: true,
        },
    },
    created() {
        this.resetSelectedIndexes();
    },
    computed: {
        selectedResults() {
            if (this.multiple && this.selectedIndexes) {
                return this.selectedIndexes.map((index) => this.results[index]);
            }
            if (this.selectedIndexes !== null) {
                return [this.results[this.selectedIndexes]];
            }
            return [];
        },
    },
    methods: {
        async getSelectedAssetUrls() {
            if (this.selectedResults.length > 0) {
                const srcs = this.selectedResults.map((selectedResult) => selectedResult.src);
                return srcs;
            }
            throw new Error('Nothing selected');
        },
        updatedSelectedAssets(assets) {
            // define in view
        },
        updateSelectedIndexes(newIndex) {
            console.log('updateSelectedIndexes');
            if (this.multiple) {
                this.selectedIndexes = this.selectedIndexes ? [...this.selectedIndexes, newIndex] : [newIndex];
            } else {
                this.selectedIndexes = newIndex;
            }
        },
        resetSelectedIndexes() {
            console.log('resetSelectedIndexes');
            if (this.multiple) {
                this.selectedIndexes = [];
            } else {
                this.selectedIndexes = null;
            }
        },
    },
};
