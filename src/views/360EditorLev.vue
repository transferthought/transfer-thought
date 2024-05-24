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
                        <v-col cols="2" class="left-panel-container fill-height">
                            <v-row no-gutters>
                                <v-col class="entity-list-container">
                                    <v-list>
                                        <v-list-item-group :value="selectedSceneIndex" mandatory color="primary" @change="handleSelectedSceneChange">
                                            <v-list-item v-for="(item, i) in scenes" :key="i">
                                                <v-list-item-content>
                                                    <v-list-item-title v-text="item.name" />
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
                                                                <v-list-item-icon>
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
                                                    <v-icon left dark>
                                                        mdi-plus
                                                    </v-icon>
                                                    Add Scene
                                                </v-btn>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="8">
                            <v-row id="scene-editor-container" no-gutters>
                                <v-col id="scene-editor" cols="12">
                                    <Scene embedded @loaded="handleSceneLoaded" />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col v-if="selectedScene" cols="2" class="entity-edditor-container">
                            <v-hover>
                                <template v-slot:default="{ hover }">
                                    <v-img class="white--text align-end" width="300px" aspect="1" :src="selectedScene.url + '?crossorigin'">
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
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-text-field v-model="selectedScene.name" counter="20" label="Name" />
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="ma-0" />
                                <v-expansion-panels
                                    :value="selectedInformationPointIndex"
                                    focusable
                                    accordion
                                    flat
                                    @change="handleSelectedInformationPointChanged"
                                >
                                    <v-expansion-panel v-for="item in selectedScene.informationPoints" :key="item.id">
                                        <v-expansion-panel-header>
                                            <template v-slot:default="{}">
                                                <v-list-item class="pa-0 component-item">
                                                    <v-list-item-content class="pa-0 ">
                                                        <v-list-item-title>
                                                            {{ item.name }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>

                                                    <v-list-item-icon x-small class="float-right ma-0">
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn icon small v-on="on">
                                                                    <v-icon>mdi-dots-vertical</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="deleteInformationPoint(item)">
                                                                    <v-list-item-icon>
                                                                        <v-icon>mdi-delete</v-icon>
                                                                    </v-list-item-icon>
                                                                    <v-list-item-title>Delete Information Point</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </v-list-item-icon>
                                                </v-list-item>
                                            </template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-text-field label="Name" :value="item.name" @input="handleInformationNameChanged" />

                                            <v-textarea
                                                label="Description"
                                                dense
                                                counter="300"
                                                :value="item.description"
                                                class="information-point-description"
                                                @input="handleInformationDescriptionChanged"
                                            />
                                        </v-expansion-panel-content>
                                        <v-divider class="ma-0" />
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-btn text small color="primary" @click="addInformationPoint">
                                            <v-icon left dark>
                                                mdi-plus
                                            </v-icon>
                                            Add Information Point
                                        </v-btn>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
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

        <v-dialog v-if="state && state.scenes" v-model="showPublishDialog" persistent width="400">
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
                    <p>{{ state.scenes.length }} Scenes</p>
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
import * as UUID from 'uuid/v4';
import { TransformControls } from '@/tt-core/components/position-control';

export default {
    name: 'Editor',
    components: {
        AssetViewer,
        LevSharedAssetsView,
    },
    mixins: [EditorMixin],
    data() {
        return {
            distanceFromCamera: 7,
            selectedSceneIndex: null,
            selectedInformationPointIndex: null,
        };
    },
    computed: {
        scenes() {
            try {
                return this.$store.state.apps.state.state.scenes;
            } catch {
                return [];
            }
        },
        selectedScene() {
            try {
                return this.scenes[this.selectedSceneIndex];
            } catch {
                return null;
            }
        },
        selectedInformationPointId() {
            try {
                return this.$store.state.apps.state.state.selectedInformationPointId;
            } catch {
                return [];
            }
        },
        selectedInformationPoint() {
            try {
                return this.selectedScene.informationPoints[this.selectedInformationPointIndex];
            } catch {
                return null;
            }
        },
    },
    watch: {
        async selectedScene() {
            await this.$store.dispatch('apps/state/update', {
                selector: 'selectedSceneIndex',
                value: this.selectedSceneIndex,
            });
            await this.$store.dispatch('apps/state/update', {
                selector: 'visibleInformationPoints',
                value: this.selectedScene ? this.selectedScene.informationPoints : [],
            });
        },
        // eslint-disable-next-line func-names
        'selectedScene.informationPoints': {
            handler() {
                this.$store.dispatch('apps/state/update', {
                    selector: 'visibleInformationPoints',
                    value: this.selectedScene ? this.selectedScene.informationPoints : [],
                });
            },
            deep: true,
        },
        async selectedInformationPoint() {
            await this.$store.dispatch('apps/state/update', {
                selector: 'selectedInformationPointId',
                value: this.selectedInformationPoint ? this.selectedInformationPoint.id : null,
            });
        },
        selectedInformationPointId() {
            if (this.selectedScene) {
                this.selectedInformationPointIndex = _.findIndex(this.selectedScene.informationPoints, { id: this.selectedInformationPointId });
                const informationPointEl = document.getElementById(this.selectedInformationPointId);

                if (informationPointEl) {
                    this.scene.el.object3D.positionGizmo.attach(informationPointEl.object3D);
                }
            }
        },
        state: {
            handler() {
                if (this.scene) {
                    this.saveConfig();
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.saveConfig = _.debounce(this.saveConfig, 2000, { leading: false });
        this.handleInformationNameChanged = _.debounce(this.handleInformationNameChanged, 500);
        this.handleInformationDescriptionChanged = _.debounce(this.handleInformationDescriptionChanged, 500);
    },
    methods: {
        handleSceneLoaded(scene) {
            this.scene = scene;
            const positionGizmo = new TransformControls(this.scene.el.camera, this.scene.el.renderer.domElement);
            this.scene.el.object3D.positionGizmo = positionGizmo;
            this.scene.el.object3D.add(positionGizmo);
            positionGizmo.setSnapDistanceToCamera(this.distanceFromCamera);
            this.scene.el.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('information-point')) {
                    this.$store.dispatch('apps/state/update', {
                        selector: 'selectedInformationPointId',
                        value: e.target.id,
                    });
                    this.scene.el.object3D.positionGizmo.attach(e.target.object3D);
                }
            });

            const self = this;
            positionGizmo.addEventListener('mouseUp', (event) => {
                const {
                    target: { object },
                } = event;
                self.selectedInformationPoint.position.x = object.position.x;
                self.selectedInformationPoint.position.y = object.position.y;
                self.selectedInformationPoint.position.z = object.position.z;
            });
        },
        async handleSelectedSceneChange(selectedIndex) {
            this.selectedSceneIndex = selectedIndex;
        },
        async addScene() {
            const newScene = {
                id: `TT_${UUID().replace(/-/g, '')}`,
                name: 'New Scene',
                url: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/client/360lev/ALMA_panorama_two-4096x2048.jpg',
                informationPoints: [],
            };
            await this.$store.dispatch('apps/state/insert', {
                selector: 'scenes',
                value: newScene,
            });
        },
        async deleteScene(scene) {
            const scenes = _.reject(this.scenes, scene);
            await this.$store.dispatch('apps/state/update', {
                selector: 'scenes',
                value: scenes,
            });
        },
        async addInformationPoint() {
            if (this.selectedScene) {
                const camera = document.getElementById('camera');
                const position = new THREE.Vector3(0, 0, -this.distanceFromCamera);
                position.applyQuaternion(camera.object3D.quaternion);
                const newInformationPoint = {
                    id: `TT_${UUID().replace(/-/g, '')}`,
                    sceneId: this.selectedScene.id,
                    name: 'New Information Point',
                    description: '',
                    position: {
                        x: position.x,
                        y: position.y,
                        z: position.z,
                    },
                };
                await this.$store.dispatch('apps/state/insert', {
                    selector: `scenes[${this.selectedSceneIndex}].informationPoints`,
                    value: newInformationPoint,
                });
            }
        },
        async deleteInformationPoint(point) {
            const points = _.reject(this.selectedScene.informationPoints, point);
            await this.$store.dispatch('apps/state/update', {
                selector: `scenes[${this.selectedSceneIndex}].informationPoints`,
                value: points,
            });
        },
        handleInformationNameChanged(newName) {
            this.$store.dispatch('apps/state/update', {
                selector: `scenes[${this.selectedSceneIndex}].informationPoints[${this.selectedInformationPointIndex}].name`,
                value: newName,
            });
        },
        handleInformationDescriptionChanged(newDescription) {
            this.$store.dispatch('apps/state/update', {
                selector: `scenes[${this.selectedSceneIndex}].informationPoints[${this.selectedInformationPointIndex}].description`,
                value: newDescription,
            });
        },
        handleSelectedInformationPointChanged(selectIndex) {
            this.selectedInformationPointIndex = selectIndex;
        },
        async publish() {
            if (this.scenes && this.scenes.length) {
                this.showPublishDialog = true;
                this.selectedSceneIndex = 0;
                await this.publishApp();
            }
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
