<template>
    <fragment>
        <div :id="'vue-' + id" :class="{ point: true, 'pointer-events-none': inEditMode, 'pointer-events-auto': selectedEntityId === id }">
            <v-tooltip close-delay="200" top>
                <template v-slot:activator="{ on, attrs }">
                    <div class="label">
                        <v-btn fab v-bind="attrs" v-on="on" color="primary" @click="handleInfoPointClicked">
                            <v-icon>
                                mdi-help
                            </v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{ label }}</span>
            </v-tooltip>
        </div>
        <v-dialog v-model="showDialog" max-width="700">
            <v-card>
                <v-toolbar color="primary" dark flat class="font-weight-600 mb-0 text-capitalize">
                    {{ label }}
                </v-toolbar>
                <v-card-text class="text-subtitle-1 pa-5" v-html="description" />
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn depressed color="primary" class="font-weight-600 text-h5 text-capitalize py-1 px-2" @click="showDialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>

<script>
export default {
    name: 'InformationPoint',
    props: {
        id: String,
        label: String,
        description: String,
    },
    data() {
        return {
            showDialog: false,
        };
    },
    computed: {
        app() {
            this.$store.state.apps;
        },
        selectedEntityId() {
            return this.$store.state.apps.context.selectedEntityId;
        },

        inEditMode() {
            return this.$store.state.apps?.context?.mode === 'edit';
        },
    },
    methods: {
        handleInfoPointClicked() {
            console.log('this.desc', this.description);
            if (this.description && this.description.length && this.description !== '<p></p>') {
                this.showDialog = true;
            }
        },
    },
};
</script>

<style>
.point {
    position: absolute;
    transition-duration: 0s !important;
    /* top: 50%;
    left: 50%; */
    z-index: -1;
    /* pointer-events: none; */
}

.point .label {
    position: absolute;
    top: -28px;
    left: -28px;
    /* border-radius: 50%;
    background: #00000077;
    border: 1px solid #ffffff77;
    color: #ffffff; */
    /* font-family: Helvetica, Arial, sans-serif;
    text-align: center;
    line-height: 40px;
    font-weight: 100;
    font-size: 14px;
    cursor: help; */
    transform: scale(0, 0);
    transition: transform 0.3s;
}

.point .text {
    position: absolute;
    top: 30px;
    left: -120px;
    width: 200px;
    padding: 20px;
    border-radius: 4px;
    background: #00000077;
    border: 1px solid #ffffff77;
    color: #ffffff;
    line-height: 1.3em;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 100;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.point:hover .text {
    opacity: 1;
}

.point.visible .label {
    transform: scale(1, 1);
}
</style>
