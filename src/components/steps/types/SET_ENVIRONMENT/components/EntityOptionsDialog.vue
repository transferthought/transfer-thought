<template>
    <v-dialog v-model="showDialog" transition="dialog-top-transition" width="800">
        <template v-slot:activator="{}">
            <ToolbarBtn text="Edit Prop Options" icon="mdi-cog" @click="openDialog()" />
        </template>

        <v-card>
            <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                Edit Prop Options
            </v-toolbar>
            <v-card-text class="card-padding">
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Entity Id
                        </label>
                        <v-btn depressed class="font-weight-600 text-capitalize py-1 px-4" @click="copyEntityId">
                            <v-icon left>
                                mdi-content-copy
                            </v-icon>
                            Copy Id
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Name
                        </label>
                        <v-text-field v-model="title" hide-details outlined class="input-style font-size-input" placeholder="Enter Prop Name..."></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Tags
                        </label>
                        <v-text-field v-model="tags" hide-details outlined class="font-size-input" placeholder="Space delimited tags..."></v-text-field>
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-col cols="6">
                        <label class="label-color font-weight-600 mb-2 d-block">
                            Hover Text
                        </label>
                        <v-text-field
                            v-model="hoverText"
                            hide-details
                            outlined
                            class="input-style font-size-input"
                            placeholder="Enter Label Text...."
                        ></v-text-field>
                    </v-col>
                </v-row> -->
                <v-row v-if="entityData.events">
                    <v-col>
                        <label class="label-color font-weight-600 mb-2 d-block">Event Handlers</label>
                        <v-expansion-panels hover>
                            <v-expansion-panel v-for="actionData in entityData.events" :key="actionData.event">
                                <v-expansion-panel-header>
                                    <label class="label-color font-weight-600 mb-2 d-block">{{ getEventLabel(actionData.event) }}</label>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <ActionEditor :value="actionData" @change="handleActionDataChanged(actionData.event, $event)" />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>

                <slot name="Extra"></slot>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn text large class="font-weight-600 mb-0 text-capitalize" @click="cancel">
                    Cancel
                </v-btn>
                <v-btn depressed color="primary" class="font-weight-600 mb-0 text-capitalize" large @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import ActionEditor from './ActionEditor.vue';
import ToolbarBtn from '../../../components/ToolbarBtn.vue';

export default {
    name: 'StepOptionsEditorDialog',
    components: {
        ActionEditor,
        ToolbarBtn,
    },
    props: {
        step: Object,
        entity: Object,
    },
    data() {
        return {
            showDialog: false,
            entityData: {},
        };
    },
    computed: {
        title: {
            // getter
            get() {
                return this.entityData.title;
            },
            set(title) {
                // set the entity data rather than right onto the entity
                this.entityData.title = title;
            },
        },
        tags: {
            // getter
            get() {
                return this.entityData.tags;
            },
            set(tags) {
                // set the entity data rather than right onto the entity
                this.entityData.tags = tags;
            },
        },
        hoverText: {
            // getter
            get() {
                return this.entityData.hoverText;
            },
            set(hoverText) {
                // set the entity data rather than right onto the entity
                this.entityData.hoverText = hoverText;
            },
        },
    },
    methods: {
        getEventLabel(event) {
            const labels = {
                click: 'Click',
                mouseenter: 'Hover',
                mouseleave: 'Hover End',
                mousedown: 'Mouse Down',
                mouseup: 'Mouse Up',
                'sound-ended': 'Sound Stopped',
                'sound-started': 'Sound Started',
            };
            return labels[event];
        },
        copyEntityId() {
            navigator.clipboard.writeText(this.entity.id);
            this.$store.commit('apps/snackMessage', {
                message: 'Entity Id Copied',
                color: 'success',
            });
        },
        openDialog() {
            this.entityData = {
                tags: this.entity.tags,
                hoverText: this.entity.hoverText,
                title: this.entity.title,
                events: this.entity.events,
            };
            this.showDialog = true;
        },
        handleActionDataChanged(eventName, eventDataPartial) {
            if (!this.entityData.events[eventName]) {
                this.entityData.events[eventName] = {};
            }
            this.entityData.events[eventName] = _.extend({}, this.entityData.events[eventName], eventDataPartial);
        },
        closeDialog() {
            this.entityData = {};
            this.showDialog = false;
        },
        cancel() {
            this.closeDialog();
        },
        save() {
            if (this.$listeners.save) {
                this.$emit('save', this.entityData);
            } else {
                this.$store.dispatch('steps/updateEntity', {
                    entityId: this.entity.id,
                    newData: this.entityData,
                });
            }
            this.closeDialog();
        },
    },
};
</script>

<style scoped></style>
