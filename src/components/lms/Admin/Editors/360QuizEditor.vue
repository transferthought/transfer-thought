<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col cols="5" class="entity-edditor-container">
                <v-hover>
                    <template v-slot:default="{ hover }">
                        <v-img class="white--text align-end" height="200" width="800" aspect="1" :src="environment.url + '?crossorigin'">
                            <v-fade-transition>
                                <v-overlay v-if="hover" absolute>
                                    <v-btn @click="showAssetSelector = true">
                                        Change
                                    </v-btn>
                                </v-overlay>
                            </v-fade-transition>
                        </v-img>
                    </template>
                </v-hover>
                <v-list>
                    <QuestionListContainer />
                </v-list>
            </v-col>
            <v-col cols="7">
                <v-row id="scene-editor-container" no-gutters>
                    <v-col id="scene-editor" cols="12">
                        <Scene embedded />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-dialog v-model="showAssetSelector" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="showAssetSelector = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Assets</v-toolbar-title>
                    <v-spacer />
                </v-toolbar>
                <AssetViewer class="asset-viewer-content">
                    <template v-slot:SharedAssetsView="{ setSelectedAsset }">
                        <LevSharedAssetsView :on-selected-asset-changed="setSelectedAsset" />
                    </template>
                    <template v-slot:AssetActions="{ selectedAsset }">
                        <v-spacer />
                        <v-btn color="primary" :disabled="!selectedAsset" @click="updateEnvironmentUrl(selectedAsset)">
                            Select
                        </v-btn>
                    </template>
                </AssetViewer>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
import _ from 'lodash';
import EditorMixin from '@/mixins/EditorMixin';
import QuestionListContainer from '@/components/editor/question-builder/QuestionListContainer.vue';
import AssetViewer from '@/features/assets/AssetViewer.vue';
import LevSharedAssetsView from '@/features/assets/LevSharedAssetsView.vue';

export default {
    name: 'Editor',
    components: {
        AssetViewer,
        QuestionListContainer,
        LevSharedAssetsView,
    },
    mixins: [EditorMixin],
    props: {
        appId: String,
    },
    data() {
        return {};
    },
    computed: {
        environment() {
            try {
                return this.$store.state.apps.state.state.environment;
            } catch {
                return {};
            }
        },
    },
    watch: {
        state: {
            handler() {
                if (this.app.scene) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
    },
    async mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
    },
    methods: {
        async publish() {
            await this.$store.dispatch('apps/state/update', {
                selector: 'currentQuestionIndex',
                value: 0,
            });
            await this.publishApp();
        },
        async updateEnvironmentUrl(selectedAsset) {
            if (selectedAsset) {
                await this.$store.dispatch('apps/state/update', {
                    selector: 'environment.url',
                    value: selectedAsset.src,
                });
            }
            this.showAssetSelector = false;
        },
    },
};
</script>

<style scoped>
#scene-editor-container {
    height: 100%;
}
#scene-editor {
    overflow: hidden;
    height: 100%;
}
.entity-list-container {
    height: calc(100vh - 48px);
    overflow-y: auto;
}
.asset-list-container {
    height: calc(50vh - 48px);
    overflow-y: auto;
}
.entity-edditor-container {
    height: calc(100vh - 48px);
    overflow-y: auto;
}
.asset-viewer-content {
    height: calc(100vh - 64px - 52px);
}
.component-item {
    min-height: 0px;
    overflow: hidden;
}
</style>
