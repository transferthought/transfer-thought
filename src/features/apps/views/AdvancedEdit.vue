<template>
    <v-layout fill-height>
        <v-row no-gutters>
            <v-col cols="12">
                <v-toolbar dense>
                    <v-toolbar-title>
                        <v-text-field solo dense hide-details :value="app.name" @change="handleAppNameChange" />
                    </v-toolbar-title>
                    <v-menu :style="{ position: 'absolute', right: 0 }">
                        <template v-slot:activator="{ on }">
                            <v-icon small v-on="on">
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
                    <v-btn icon @click="setBottomPanelVisibility(!app.isBottomPanelOpen)">
                        <v-icon>mdi-dock-bottom</v-icon>
                    </v-btn>
                    <v-btn icon @click="openSettings = !openSettings">
                        <v-icon>mdi-rotate-orbit</v-icon>
                    </v-btn>
                    <v-btn icon @click="showEntityDialog">
                        <v-icon>mdi-cube-outline</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn v-if="app.context.mode === 'edit'" icon @click="play">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                    <v-btn v-if="app.context.mode === 'preview'" icon @click="stop">
                        <v-icon>mdi-stop</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn icon :loading="savingConfig" :disabled="app.context.mode !== 'edit'" @click="saveConfig">
                        <v-icon>mdi-floppy</v-icon>
                    </v-btn>
                    <v-btn icon :loading="app.publishing" :disabled="app.context.mode !== 'edit'" @click="publishApp">
                        <v-icon>mdi-cloud-upload</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card dark>
                    <v-row no-gutters>
                        <v-col cols="2" class="left-panel-container fill-height">
                            <v-row no-gutters>
                                <v-col class="entity-list-container">
                                    <EntityListItem />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="8" :style="cssVars">
                            <v-row id="scene-editor-container" no-gutters>
                                <v-col id="scene-editor" cols="12">
                                    <Scene embedded />
                                    <portal-target class="scene-overlay" name="scene-overlay" multiple />
                                </v-col>
                            </v-row>

                            <v-row v-if="app.isBottomPanelOpen" no-gutters transition="scale-transition">
                                <BottomPanel />
                            </v-row>
                        </v-col>
                        <v-col cols="2" class="entity-edditor-container">
                            <EntityEditor />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="openSettings" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-btn class="ma-2" @click.stop="setGizmoMode('select')">
                                    Select
                                </v-btn>
                                <v-btn class="ma-2" @click.stop="setGizmoMode('translate')">
                                    Move
                                </v-btn>
                                <v-btn class="ma-2" @click.stop="setGizmoMode('rotate')">
                                    Rotate
                                </v-btn>
                                <v-btn class="ma-2" @click.stop="setGizmoMode('scale')">
                                    Scale
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="snapIncrement" label="Increment" type="number" class="ma-2" @change="setSnapMode()" />
                                <v-switch v-model="translationSnap" label="Translation" class="ma-2" @change="setSnapMode()" />
                                <v-switch v-model="rotationSnap" label="Rotation" class="ma-2" @change="setSnapMode()" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="openSettings = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
        <SnackMessages />
    </v-layout>
</template>

<script>
import EditorMixin from '@/mixins/EditorMixin'; /* eslint-disable no-undef */

import EntityListItem from '@/components/editor/EntityListItem.vue';
import EntityEditor from '@/components/editor/EntityEditor.vue';
import BottomPanel from '@/components/editor/BottomPanel.vue';

import ace from 'brace';
import 'brace/ext/language_tools'; // language extension prerequsite.
import 'brace/mode/javascript'; // language
import 'brace/mode/json'; // language
import 'brace/theme/dracula';
import 'brace/snippets/text'; // snippette
import 'brace/snippets/javascript';
import 'brace/snippets/json';
// snippet
const langTools = ace.acequire('ace/ext/language_tools');
// data stub:
const helpers = [
    { name: 'Entity', description: 'The entity the action was called with (if any)' },
    { name: 'Store', description: 'Global store reference' },
    { name: 'ActionService', description: 'ActionService reference' },
    { name: 'Action', description: 'The current action data' },
    { name: 'Arguments', description: 'Any arguments passed in' },
];

// create a completer object with a required callback function:
const sqlTablesCompleter = {
    getCompletions(editor, session, pos, prefix, callback) {
        callback(
            null,
            helpers.map((item) => ({
                caption: item.description,
                value: item.name,
                meta: 'TT API',
            }))
        );
    },
};

langTools.addCompleter(sqlTablesCompleter);

export default {
    name: 'Editor',
    components: {
        EntityListItem,
        BottomPanel,
        EntityEditor,
    },
    mixins: [EditorMixin],
    data() {
        return {
            openSettings: false,
            snapIncrement: 1,
            translationSnap: false,
            rotationSnap: false,
        };
    },
    computed: {
        appId() {
            return this.$route.params.appId;
        },
    },
    async mounted() {
        await this.$store.dispatch('apps/fetchApp', { appId: this.appId, type: 'master' });
    },
    methods: {
        setGizmoMode(newMode) {
            this.$store.commit('apps/gizmoMode', newMode);
        },
        setBottomPanelVisibility(open) {
            this.$store.commit('apps/isBottomPanelOpen', open);
        },
        setSnapMode() {
            if (this.translationSnap) {
                this.$store.commit('apps/gizmoSnapTranslation', this.snapIncrement);
            } else {
                this.$store.commit('apps/gizmoSnapTranslation', null);
            }

            if (this.rotationSnap) {
                this.$store.commit('apps/gizmoSnapRotation', this.snapIncrement);
            } else {
                this.$store.commit('apps/gizmoSnapRotation', null);
            }
        },
        showEntityDialog() {
            this.$store.commit('apps/selectedEntityId', 'scene');
            this.$store.commit('apps/updateShowAddEntityDialog', true);
        },
        play() {
            this.$store.commit('apps/context/update', { selector: 'mode', value: 'preview' });
        },
        stop() {
            this.$store.commit('apps/context/update', { selector: 'mode', value: 'edit' });
        },
    },
};
</script>

<style scoped>
#scene-editor-container {
    height: var(--scene-editor-height);
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

.scene-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
}

.scene-overlay * {
    pointer-events: auto;
}
</style>
