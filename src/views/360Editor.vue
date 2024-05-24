<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col cols="12">
                <v-toolbar dense class="background lighten-3">
                    <v-toolbar-title>
                        <v-text-field solo dense hide-details :value="app.name" @input="handleAppNameChange" />
                    </v-toolbar-title>
                    <v-spacer />
                    <v-menu :style="{ position: 'absolute', right: 0 }">
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on">
                                mdi-dots-vertical
                            </v-icon>
                        </template>
                        <v-list>
                            <v-list-item-group>
                                <v-list-item @click="launchPublishedSite">
                                    <v-list-item-icon>
                                        <v-icon>mdi-launch</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>View published</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="copyPublishedUrl">
                                    <v-list-item-icon>
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Copy link</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="openEmbed = true">
                                    <v-list-item-icon>
                                        <v-icon>mdi-unfold-more-vertical</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Embed</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-menu>
                    <v-btn rounded color="primary" :loading="app.publishing" @click="publish">
                        Publish
                        <v-icon right dark>
                            mdi-cloud-upload
                        </v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card>
                    <v-row no-gutters>
                        <!-- <v-col cols="2" class="left-panel-container fill-height">
                    <v-row no-gutters>
                        <v-col class="entity-list-container">
                            <v-list>
                                <v-list-item-group
                                    :value="selectedScenarioIndex"
                                    mandatory
                                    @change="handleselectedScenarioChange"
                                    color="primary"
                                >
                                    <v-list-item v-for="(item, i) in scenes" :key="i">
                                        <v-list-item-content>
                                            <v-list-item-title v-text="item.name"></v-list-item-title>
                                        </v-list-item-content>

                                        <v-list-item-icon x-small>
                                            <v-menu offset-y>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn icon small v-on="on">
                                                        <v-icon>mdi-dots-vertical</v-icon>
                                                    </v-btn>
                                                </template>
                                                <v-list>
                                                    <v-list-item @click="deleteScene(item)">
                                                        <v-list-item-icon >
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-list-item-icon>
                                                        <v-list-item-title>Delete Scene</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list-item-group>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-btn text color="primary" @click="addScene">
                                            <v-icon left dark>mdi-plus</v-icon> Add Scene
                                        </v-btn>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-col> -->

                        <v-col cols="3" class="entity-edditor-container">
                            <v-hover>
                                <template v-slot:default="{ hover }">
                                    <v-img class="white--text align-end" width="500px" aspect="1" :src="selectedScenario.url + '?crossorigin'">
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
                                <!-- <v-list-item>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="selectedScenario.name"
                                    counter="20"
                                    label="Objective"
                                ></v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider class="ma-0"></v-divider> -->

                                <QuestionListContainer />
                            </v-list>
                        </v-col>
                        <v-col cols="9">
                            <v-row id="scene-editor-container" no-gutters>
                                <v-col id="scene-editor" cols="12">
                                    <Scene embedded />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="openEmbed" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Embed App</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <p>{{ embedCode }}</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="openEmbed = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
                        <v-btn color="primary" :disabled="!selectedAsset" @click="updateValueWithSelectedAsset(selectedAsset)">
                            Select
                        </v-btn>
                    </template>
                </AssetViewer>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showPublishDialog" persistent width="400">
            <v-card v-if="app.publishing" color="primary" dark>
                <v-card-text>
                    Publishing...
                    <v-progress-linear indeterminate color="white" class="mb-0" />
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-card-text>
                    <p class="display-1 text--primary">
                        {{ app.name }}
                    </p>
                </v-card-text>
                <v-list-item>
                    <v-list-item-content @click="launchPublishedSite">
                        <v-list-item-title>{{ publishedUrl }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn icon @click="copyPublishedUrl">
                            <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="showPublishDialog = false">
                        Close
                    </v-btn>
                    <v-btn depressed color="primary" @click="launchPublishedSite">
                        View
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <SnackMessages />
    </v-layout>
</template>
<script>
/* eslint-disable no-undef */
import EditorMixin from '@/mixins/EditorMixin';
import AssetViewer from '@/features/assets/AssetViewer.vue';
import LevSharedAssetsView from '@/features/assets/LevSharedAssetsView.vue';

import QuestionListContainer from '@/components/editor/question-builder/QuestionListContainer.vue';

export default {
    name: 'Editor',
    components: {
        AssetViewer,
        LevSharedAssetsView,
        QuestionListContainer,
    },
    mixins: [EditorMixin],
    data() {
        return {
            selectedscenarioIndex: 0,
        };
    },
    computed: {
        scenarios() {
            try {
                return this.$store.state.apps.state.state.scenarios;
            } catch {
                return [];
            }
        },
        selectedScenario() {
            try {
                return this.scenarios[this.selectedscenarioIndex];
            } catch {
                return null;
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
    mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
    },
    methods: {
        async publish() {
            this.showPublishDialog = true;
            this.$store.dispatch('apps/state/update', {
                selector: 'currentQuestionIndex',
                value: 0,
            });
            await this.publishApp();
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
