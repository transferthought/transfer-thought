<template>
    <div id="run-container">
        <Scene embedded :container-el-selector="containerElSelector" :vr-enabled="false" :ar-enabled="false" @loaded="handleSceneLoaded" />

        <portal to="screen-overlay">
            <v-snackbar :value="!connected" :timeout="-1" absolute top right class="user-select-none">
                <v-icon>
                    mdi-account-box-outline
                </v-icon>
                You are the only one here
            </v-snackbar>
            <v-toolbar
                v-if="!clipboardOpen"
                elevation="5"
                absolute
                class="ma-5 floating-toolbar"
                color="red"
                dark
                rounded
                :height="60"
                @click="clipboardOpen = !clipboardOpen"
            >
                <v-btn icon>
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
                <v-toolbar-title v-if="selectedModelNo && selectedConfigurationUUID" class="pl-0 wrap toolbar-title font-weight-600 text-h2 text-capitalize">
                    {{ selectedModelNo }} - {{ selectedConfigurationUUID }}
                </v-toolbar-title>
                <v-toolbar-title v-else class="pl-0 wrap toolbar-title font-weight-600 text-h2 text-capitalize">
                    Library
                </v-toolbar-title>
            </v-toolbar>

            <v-navigation-drawer v-model="clipboardOpen" width="800px" max-width="100%" style="opacity: 90%">
                <template v-slot:prepend>
                    <v-toolbar elevation="0" :height="40">
                        <v-spacer />
                        <v-btn icon @click="clipboardOpen = false">
                            <v-icon class="tt-text">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </template>
                <form autocomplete="off">
                    <!-- <v-autocomplete
                        v-model="selectedModelType"
                        :items="modelOptions"
                        item-text="Model_Type"
                        item-value="Model_Type"
                        filled
                        dense
                        height="50px"
                        hide-details
                        single-line
                        placeholder="Model Type"
                        type="text"
                    /> -->
                    <v-autocomplete
                        v-model="selectedModelNo"
                        :items="modelOptions"
                        item-text="Model_No"
                        item-value="Model_No"
                        filled
                        dense
                        height="50px"
                        hide-details
                        single-line
                        placeholder="Model Number"
                        type="text"
                    />
                    <v-autocomplete
                        v-model="selectedConfigurationUUID"
                        :items="filteredConfigurations"
                        :item-text="(item) => `${item.Title} (${item.Configuration_Type})`"
                        item-value="UUID"
                        filled
                        dense
                        height="50px"
                        hide-details
                        single-line
                        placeholder="Configuration Type"
                    />
                    <!-- <v-autocomplete
                        v-model="selectedConfigurationUUID"
                        :items="modelOptions"
                        item-text="Title"
                        item-value="UUID"
                        filled
                        dense
                        height="50px"
                        hide-details
                        single-line
                        placeholder="Title"
                    /> -->
                </form>
                <!-- <v-data-table
                        :headers="modelTypeTableHeaders"
                        :items="modelOptions"
                        :items-per-page="5"
                        class="elevation-1"
                        single-select
                        show-select
                        item-key="UUID"
                    /> -->
                <v-list v-if="selectedConfiguration" dense>
                    <v-list-item v-for="displayKey in clipboardDisplayKeys" :key="displayKey">
                        <v-list-item-content>{{ displayKey }}:</v-list-item-content>
                        <v-list-item-content class="align-end">
                            {{ selectedConfiguration[displayKey] }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <video v-show="!isPresenter" id="RemoteView" ref="RemoteView" class="remote-view" autoplay playsinline />
            <div v-show="joinedSession">
                <v-toolbar absolute bottom height="80" style="border-radius:25px 25px 0 0; opacity: .9; width: 100%">
                    <v-container class="d-flex justify-space-between">
                        <v-btn fab depressed @click="toggleShowDialog">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                        <v-btn fab depressed class="toolbar-btn" :color="isMicEnabled ? '' : 'white'" @click="toggleMic">
                            <v-icon v-if="isMicEnabled">
                                mdi-microphone
                            </v-icon>
                            <v-icon v-else color="black">
                                mdi-microphone-off
                            </v-icon>
                        </v-btn>
                        <!-- <v-btn
                            fab
                            depressed
                            class="toolbar-btn"
                            :color="isCameraEnabled ? '': 'white'"
                            @click="toggleCamera"
                        >
                            <v-icon v-if="isCameraEnabled">
                                mdi-camera
                            </v-icon>
                            <v-icon
                                v-else
                                color="black"
                            >
                                mdi-camera-off
                            </v-icon>
                        </v-btn> -->
                        <v-btn fab depressed class="toolbar-btn" color="red" @click="endCall">
                            <v-icon>mdi-phone-hangup</v-icon>
                        </v-btn>
                    </v-container>
                </v-toolbar>
                <v-dialog v-model="showMoreDialog" transition="dialog-bottom-transition" max-width="600">
                    <template>
                        <v-card>
                            <v-toolbar dark flat>
                                More Options
                            </v-toolbar>
                            <v-card-text class="card-padding pa-5">
                                <v-container>
                                    <v-row class="d-flex justify-space-around">
                                        <v-col cols="6">
                                            <ToolbarBtn
                                                text="Add Model"
                                                icon="mdi-plus"
                                                @click="
                                                    clipboardOpen = true;
                                                    showMoreDialog = false;
                                                "
                                            />
                                        </v-col>
                                        <v-col cols="6">
                                            <ToolbarBtn
                                                text="Adjust Position"
                                                icon="mdi-camera-control"
                                                @click="
                                                    mode = 'position';
                                                    showMoreDialog = false;
                                                "
                                            />
                                        </v-col>
                                        <v-col cols="6">
                                            <ToolbarBtn
                                                text="Adjust Rotation"
                                                icon="mdi-rotate-360"
                                                @click="
                                                    mode = 'rotation';
                                                    showMoreDialog = false;
                                                "
                                            />
                                        </v-col>
                                        <v-col cols="6">
                                            <ToolbarBtn
                                                text="Place in front"
                                                icon="mdi-select-all"
                                                @click="
                                                    placeInFront();
                                                    showMoreDialog = false;
                                                "
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row class="d-flex justify-space-around pt-3" />
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </template>
                </v-dialog>
                <div v-show="!clipboardOpen" class="virtual--gamepad" />
                <div v-show="!clipboardOpen" class="virtual--gamepad--secondary" />
            </div>
        </portal>
    </div>
</template>

<script>
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

import Scene from '@/components/Scene.vue';
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import nipplejs from 'nipplejs';
import Client from '@/tt-api';
import gql from 'graphql-tag';
import WebRTCService from '@/services/webrtc-service';
import RecordingService from '@/services/recording-service';
import * as Sentry from '@sentry/vue';

import ToolbarBtn from '@/components/steps/components/ToolbarBtn.vue';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

export default {
    name: 'Run',
    components: {
        Scene,
        ToolbarBtn,
    },
    async created() {
        const responseResult = await fetch('http://3.17.215.227:4007/assets');
        const result = await responseResult.json();
        this.modelOptions = result.data;
    },
    data() {
        return {
            syncVar: {
                position: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: true },
                },
                rotation: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: true },
                },
                currentModel: {
                    timestamp: 0,
                    syncVarSettings: { interpolate: false },
                },
            },
            networkSettings: { syncRate: 500 },
            position: {
                x: 0,
                y: 0,
                z: -5,
                timestamp: 0,
            },
            rotation: { x: 0, y: 0, z: 0 },
            currentModel: { src: '' },
            clipboardDisplayKeys: [
                'Specification_Type',
                'Model_Type',
                'Model_No',
                'Title',
                'Subtitle',
                'Revision_Date',
                'Description',
                'Configuration_Type',
                'kVa_Min',
                'kVa_Max',
                'Voltage',
                'Formation',
                'Conduit_Size',
                'Formation_Count',
            ],
            modelTypeTableHeaders: [
                { text: 'Model_Type', value: 'Model_Type', filterable: true },
                { text: 'Model_No', value: 'Model_No' },
                { text: 'Title', value: 'Title' },
                { text: 'Revision_Date', value: 'Revision_Date' },
            ],
            configurationTypeTableHeaders: [
                { text: 'Configuration_Type', value: 'Configuration_Type' },
                { text: 'Voltage', value: 'Voltage' },
                { text: 'Revision_Date', value: 'Revision_Date' },
            ],
            modelOptions: [
                {
                    UUID: 1,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR SF6 SWITCHGEAR',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'A',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/A/model/C5302.A.glb',
                },
                {
                    UUID: 2,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR FOUR BAY SWITCHGEAR',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'B',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/B/model/C5302.B.glb',
                },
                {
                    UUID: 3,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR SINGLE BAY SWITCHGEAR',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'C',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/C/model/C5302.C.glb',
                },
                {
                    UUID: 4,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR FOUR BAY SWITCHGEAR',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'G',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/G/model/C5302.G.glb',
                },
                {
                    UUID: 5,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR SINGLE BAY SWITCHGEAR',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'J',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/J/model/C5302.J.glb',
                },
                {
                    UUID: 6,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR PAD MOUNTED INTELLIRUPTER',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'L',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/L/model/C5302.L.glb',
                },
                {
                    UUID: 7,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR PAD MOUNTED METERING',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'K',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/K/model/C5302.K.glb',
                },
                {
                    UUID: 8,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5302',
                    Title: 'Pad Mount Switch Gear Foundation',
                    Subtitle: 'PRECAST FOUNDATION FOR PAD MOUNTED INTELLIRUPTER',
                    Revision_Date: 43420,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED TO INSTALL FOUNDATIONS FOR 12kV 3∅ SINGLE AND FOUR BAY SWITCHGEAR, FOUR BAY A.T.O. SWITCHGEAR, METERING, VACUUM RECLOSER, INTELLIRUPTER, AND 34.5kV 3∅ SF6 SWITCHGEAR.',
                    Configuration_Type: 'M',
                    kVa__Min: 'N/A',
                    kVa_Max: 'N/A',
                    Voltage: '34.5kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: '',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: 'N/A',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 'N/A',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5302/2018.11.16/M/model/C5302.M.glb',
                },
                {
                    UUID: 9,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5299',
                    Title: '3 - PH FeedThru Comp TR - PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'A',
                    kVa__Min: 75,
                    kVa_Max: 150,
                    Voltage: '208/120 480/277 240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/A.1/formation/6-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/A.1/model/C5299.A.glb',
                },
                {
                    UUID: 10,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5299',
                    Title: '3 - PH FeedThru Comp TR - PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'A',
                    kVa__Min: 225,
                    kVa_Max: 500,
                    Voltage: '208/120 480/277 240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/A.1/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/A.2/model/C5299.A.glb',
                },
                {
                    UUID: 11,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5299',
                    Title: '3 - PH FeedThru Comp TR - PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'B',
                    kVa__Min: 500,
                    kVa_Max: 750,
                    Voltage: '208/120 \r\n240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'Yes',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/B.2/formation/Count-12-4.0.png',
                    Optional_Dependent_Formation_Path:
                        'https://transferthought.s3.amazonaws.com\\assets\\padmounts\\2008.09.12\\C5299\\B.2\\formation\\16-Count-3.5.png',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: '12 (4") or 16 (3.5")',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/B.1/model/C5299.B.glb',
                },
                {
                    UUID: 12,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5299',
                    Title: '3 - PH FeedThru Comp TR - PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'B',
                    kVa__Min: 500,
                    kVa_Max: 1000,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/B.2/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5299/2008.09.12/B.2/model/C5299.B.glb',
                },
                {
                    UUID: 13,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5298',
                    Title: '3-PH OPEN DELTA COMPT TR PAD - CTS',
                    Subtitle: '167kVA MAXIMUM CAPACITY-EACH TRANSFORMER',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITONS". (CUSTOMER TO FURNISH AND INSTALL ALL EQUIPMENT SHOWN, INCLUDING GROUNDING).',
                    Configuration_Type: 'N/A',
                    kVa__Min: 75,
                    kVa_Max: 167,
                    Voltage: 'N/A',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'No',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5298/2008.09.12/formation/2-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '28" x 13"',
                    Multi_Primary_Formations: 'Yes',
                    Primary_Conduit_Size: '3.5" or 4"',
                    Secondary_Opening: 'N/A',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: 'N/A',
                    Secondary_Formation_Count: 2,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5298/2008.09.12/model/C5298.glb',
                },
                {
                    UUID: 14,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'B',
                    kVa__Min: 45,
                    kVa_Max: 225,
                    Voltage: '208/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/B/formation/4-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '14" x 14"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 4,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/B/model/C5297.B.glb',
                },
                {
                    UUID: 15,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'C',
                    kVa__Min: 112.5,
                    kVa_Max: 300,
                    Voltage: '208/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/C/formation/6-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '14" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/C/model/C5297.C.glb',
                },
                {
                    UUID: 16,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'D',
                    kVa__Min: 225,
                    kVa_Max: 500,
                    Voltage: '208/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/2002.10.31/C5297/D/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/D/model/C5297.D.glb',
                },
                {
                    UUID: 17,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'E',
                    kVa__Min: 750,
                    kVa_Max: 750,
                    Voltage: '208/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'Yes',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/E/formation/Count-12-4.0.png',
                    Optional_Dependent_Formation_Path:
                        'https://transferthought.s3.amazonaws.com\\assets\\padmounts\\2002.10.31\\C5297\\E\\formation\\16-Count-3.5.png',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 26.5"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: '12 (4") or 16 (3.5")',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/E/model/C5297.E.glb',
                },
                {
                    UUID: 18,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'F',
                    kVa__Min: 45,
                    kVa_Max: 75,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/F/formation/4-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '14" x 14"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 4,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/F/model/C5297.F.glb',
                },
                {
                    UUID: 19,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'G',
                    kVa__Min: 112.5,
                    kVa_Max: 300,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/G/formation/6-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '14" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/G/model/C5297.G.glb',
                },
                {
                    UUID: 20,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'H',
                    kVa__Min: 225,
                    kVa_Max: 1000,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/H/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/H/model/C5297.H.glb',
                },
                {
                    UUID: 21,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'J',
                    kVa__Min: 1500,
                    kVa_Max: 2500,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'Yes',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/J/formation/Count-12-4.0.png',
                    Optional_Dependent_Formation_Path:
                        'https://transferthought.s3.amazonaws.com\\assets\\padmounts\\2002.10.31\\C5297\\J\\formation\\16-Count-3.5.png',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 26.5"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: '12 (4") or 16 (3.5")',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/J/model/C5297.J.glb',
                },
                {
                    UUID: 22,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'K',
                    kVa__Min: 500,
                    kVa_Max: 750,
                    Voltage: '4kV',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/K/formation/2-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '8" x 10"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 2,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/K/model/C5297.K.glb',
                },
                {
                    UUID: 23,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5297',
                    Title: '3-PH RADIAL COMPT TR PAD - CTS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 37560,
                    Application_Description: 'THIS STANDARD SHALL BE USED TO INSTALL A FOUNDATION FORA 3θ RADIAL FEED COMPARTMENTAL TRANSFORMER',
                    Configuration_Type: 'L',
                    kVa__Min: 1000,
                    kVa_Max: 2500,
                    Voltage: '4kV',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/L/formation/4-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 10"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '14" x 14"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 4,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5297/2002.10.31/L/model/C5297.L.glb',
                },
                {
                    UUID: 24,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5296',
                    Title: '1-PH COMPT TR PAD - CTS',
                    Subtitle: '167kVA MAXIMUM CAPACITY 13.8Kv AND BELOW SYSTEMS',
                    Revision_Date: 43553,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF FOUNDATIONS FOR 1∅ CUSTOMER TRANSFORMER STATION (CTS). CONDUIT IS OPTIONAL WHEN CTS IS INSTALLED IN FRONT LOT. CONDUIT IS REQUIRED IN ALL REAR LOT INSTALLATIONS.',
                    Configuration_Type: 'N/A',
                    kVa__Min: 75,
                    kVa_Max: 167,
                    Voltage: '13.8kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5296/2019.03.29/formation/6-Count-3.0.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 5"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '3"',
                    Secondary_Opening: '8" x 13"',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: '3"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5296/2019.03.29/model/C5296.glb',
                },
                {
                    UUID: 25,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5293',
                    Title: '3-PH FEEDTHRU COMPT TR PAD - ESS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF ANcELECTRIC SERVICE STATION FOUNDATION AS DESCRIBED INc"ComEd\'s GENERAL TERMS AND CONDITONS".',
                    Configuration_Type: 'A',
                    kVa__Min: 75,
                    kVa_Max: 150,
                    Voltage: '208/120 480/277 240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/A.1/formation/6-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/A.1/model/C5293.A.glb',
                },
                {
                    UUID: 26,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5293',
                    Title: '3-PH FEEDTHRU COMPT TR PAD - ESS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'A',
                    kVa__Min: 225,
                    kVa_Max: 500,
                    Voltage: '208/120 480/277 240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/A.2/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/A.2/model/C5293.A.glb',
                },
                {
                    UUID: 27,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5293',
                    Title: '3-PH FEEDTHRU COMPT TR PAD - ESS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'B',
                    kVa__Min: 500,
                    kVa_Max: 750,
                    Voltage: '208/120 \r\n240/120',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'Yes',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/B.1/formation/16-Count-3.5.png',
                    Optional_Dependent_Formation_Path:
                        'https://transferthought.s3.amazonaws.com\\assets\\padmounts\\2008.09.12\\C5293\\B.1\\formation\\Count-12-4.0.png',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: '12 (4") or 16 (3.5")',
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/B.1/model/C5293.B.glb',
                },
                {
                    UUID: 28,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5293',
                    Title: '3-PH FEEDTHRU COMPT TR PAD - ESS',
                    Subtitle: 'CAST IN PLACE FOUNDATION FOR TRANSFORMERS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF A NON-RESIDENTIAL CUSTOMER TRANSFORMER STATION FOUNDATION AS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'B',
                    kVa__Min: 500,
                    kVa_Max: 1000,
                    Voltage: '480/277',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/B.2/formation/9-Count-3.5.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '24" x 8"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '6"',
                    Secondary_Opening: '18" x 18"',
                    'Multi-Secondary_Formations': 'Yes',
                    Secondary_Conduit_Size: '3.5" or 4"',
                    Secondary_Formation_Count: 9,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5293/2008.09.12/B.2/model/C5293.B.glb',
                },
                {
                    UUID: 29,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5289',
                    Title: '3-PH OPEN DELTA COMPT TR PAD-ESS/RSS',
                    Subtitle: '167kVA MAX CAPACITY-EACH TRANSFORMER 13.8kV AND BELOW SYSTEMS',
                    Revision_Date: 39703,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF\r\nAN ELECTRIC OR RESIDENTIAL SERVICE STATION FOUNDATION\r\nAS DESCRIBED IN "ComEd\'s GENERAL TERMS AND CONDITIONS".',
                    Configuration_Type: 'N/A',
                    kVa__Min: 75,
                    kVa_Max: 167,
                    Voltage: '13.8kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5289/2008.09.12/formation/6-Count-3.0.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 5"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '3"',
                    Secondary_Opening: '8" x 13"',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: '3"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5289/2008.09.12/model/C5289.glb',
                },
                {
                    UUID: 30,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5288',
                    Title: '1-PH COMPT TR PAD - CTS',
                    Subtitle: '167kVA MAXIMUM CAPACITY 13.8Kv AND BELOW SYSTEMS',
                    Revision_Date: 43553,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF FOUNDATIONS FOR 1∅ CUSTOMER TRANSFORMER STATION (CTS). CONDUIT IS OPTIONAL WHEN CTS IS INSTALLED IN FRONT LOT. CONDUIT IS REQUIRED IN ALL REAR LOT INSTALLATIONS.',
                    Configuration_Type: 'N/A',
                    kVa__Min: 75,
                    kVa_Max: 167,
                    Voltage: '13.8kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5288/2019.03.29/formation/6-Count-3.0.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 5"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '3"',
                    Secondary_Opening: '8" x 13"',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: '3"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5288/2019.03.29/model/C5288.glb',
                },
                {
                    UUID: 31,
                    Specification_Type: 'Underground',
                    Model_Type: 'Pad Mount - Switch Gear',
                    Model_No: 'C5318',
                    Title: '1-PH COMPT TR PAD - CTS',
                    Subtitle: '167kVA MAXIMUM CAPACITY 13.8Kv AND BELOW SYSTEMS',
                    Revision_Date: 43553,
                    Application_Description:
                        'THIS STANDARD SHALL BE USED FOR THE INSTALLATION OF FOUNDATIONS FOR 1∅ CUSTOMER TRANSFORMER STATION (CTS). CONDUIT IS OPTIONAL WHEN CTS IS INSTALLED IN FRONT LOT. CONDUIT IS REQUIRED IN ALL REAR LOT INSTALLATIONS.',
                    Configuration_Type: 'N/A',
                    kVa__Min: 75,
                    kVa_Max: 167,
                    Voltage: '13.8kV AND BELOW SYSTEMS',
                    Primary_Conduit: 'Yes',
                    Secondary_Conduit: 'Yes',
                    Conduit_Dependent: 'No',
                    Formation_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5318/2019.03.29/formation/6-Count-3.0.png',
                    Optional_Dependent_Formation_Path: 'N/A',
                    Primary_Opening: '8" x 5"',
                    Multi_Primary_Formations: 'No',
                    Primary_Conduit_Size: '3"',
                    Secondary_Opening: '8" x 13"',
                    'Multi-Secondary_Formations': 'No',
                    Secondary_Conduit_Size: '3"',
                    Secondary_Formation_Count: 6,
                    Model_Path: 'https://transferthought.s3.amazonaws.com/assets/padmounts/C5318/2019.03.29/model/C5318.glb',
                },
            ],
            moveData: {},
            containerElSelector: 'body',
            joystick: {},
            mode: 'position',
            joystickActive: false,
            joystickSensitivity: 10, // Lower is faster
            joystickRotationSensitivity: 10, // Lower is faster
            placeInFrontDistance: 5,
            lerpSpeed: 50,
            muted: false,
            isMicEnabled: true,
            isCameraEnabled: false,
            showMoreDialog: false,
            joinedSession: false,
            clipboardOpen: false,
            selectedModelNo: '',
            selectedConfigurationUUID: null,
            selectedModelType: null,
            localStream: null,
            connection: null,
            connected: false,
        };
    },
    syncvars: {
        user: {
            value: {
                position: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
            },
            'position.x.interpolate': true,
        },
        score: {
            value: 0,
            interpolate: true,
        },
    },
    computed: {
        app() {
            try {
                return this.$store.state.apps;
            } catch {
                return {};
            }
        },
        room() {
            return this.$route.query.room;
        },
        isPresenter() {
            return Boolean(this.$route.query.presenter);
        },
        isRecording() {
            // change this before deploying
            return Boolean(this.$route.query.record);
        },
        recordingInterval() {
            if (this.$route.query.interval) {
                return _.parseInt(this.$route.query.interval);
            }
            return 60000;
        },
        filteredConfigurations() {
            return _.filter(this.modelOptions, { Model_No: this.selectedModelNo });
        },
        selectedConfiguration() {
            return _.find(this.modelOptions, { UUID: this.selectedConfigurationUUID });
        },
    },
    watch: {
        'app.scene': {
            handler() {},
        },
        selectedConfigurationUUID() {
            this.$store.dispatch('apps/state/update', {
                selector: 'currentModel',
                value: { src: this.selectedConfiguration.Model_Path },
            });
        },
    },
    async mounted() {
        if (this.isPresenter) {
            await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');
        }

        this.$store.commit('apps/context/update', { selector: 'mode', value: 'play' });

        if (this.$route.params.appId) {
            await this.$store.dispatch('apps/fetchApp', { appId: this.$route.params.appId, type: 'published' });
        }

        this.EstablishNetworkSubscription();
        this.RegisterSyncVars();

        // Create joysticks and setup bindings
        this.CreateJoySticks();
        // Choosing model automatically for ease of testing
        this.addModel();

        this.joinSession();
    },
    methods: {
        async setupWebRTC() {
            const formValues = {
                region: 'us-east-1',
                channelName: this.room,
                clientId: '47R4NGZ4KDB',
                sendVideo: true,
                sendAudio: true,
                openDataChannel: true,
                onConnectionStatusChanged: this.handleConnectionStatusChanged.bind(this),
                onRemoteDataMessage: this.ReceiveDataMessage.bind(this),
                widescreen: true,
                fullscreen: false,
                natTraversalDisabled: false,
                forceTURN: false,
                accessKeyId: 'INSERT_ACCESS_KEY',
                endpoint: null,
                secretAccessKey: 'INSERT_SECRET_KEY',
                sessionToken: null,
                isMaster: this.isPresenter,
            };

            this.canvasCombined = document.createElement('canvas');
            // <video> HTML elements to use to display the local webcam stream and remote stream from the master
            const localView = {}; // document.getElementsByTagName('video')[0];

            const remoteView = this.$refs.RemoteView;

            if (this.isPresenter) {
                this.localStream = await this.getMediaStream();
                this.connection = await WebRTCService.startMaster(localView, this.localStream, remoteView, formValues);
            } else {
                this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                this.connection = await WebRTCService.startViewer(localView, this.localStream, remoteView, formValues);
            }
        },
        async getMediaStream() {
            try {
                const localStream = this.canvasCombined.captureStream();
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                const audioTracks = audioStream.getAudioTracks();

                localStream.addTrack(audioTracks[0]);
                return localStream;
            } catch (e) {
                console.error('[MASTER] Could not find webcam', e);
                Sentry.captureException(e);
                return null;
            }
        },
        async joinSession() {
            this.joinedSession = true;
            await this.setupWebRTC();
            if (this.isRecording) {
                this.startRecording();
            }
        },
        toggleShowDialog() {
            this.showMoreDialog = !this.showMoreDialog;
        },
        toggleMic() {
            this.isMicEnabled = !this.isMicEnabled;
            const audioTracks = this.localStream.getAudioTracks();
            _.forEach(audioTracks, (audio) => {
                audio.enabled = this.isMicEnabled;
            });
        },
        toggleCamera() {
            this.isCameraEnabled = !this.isCameraEnabled;
        },

        endCall() {
            // do something not entirly sure what yet
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage('{"event":"end"}', '*');
            }
        },
        addModel() {
            this.$store.dispatch('apps/state/update', {
                selector: 'currentModel',
                value: { src: 'https://tt-assets-us-east-1.s3.amazonaws.com/assets/client/ComEd/C5302_A.glb' },
            });
        },
        startRecording() {
            // TODO: local stream should be merged with remote stream for recording
            const options = {
                stream: this.localStream,
                recordingInterval: this.recordingInterval,
                handleChunk: (chunk) => {
                    const datetime = new Date();
                    const timestamp = datetime.getTime();

                    const dateDisplay = datetime.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                    });
                    const key = `${this.app.appId}|${timestamp}|${dateDisplay}`;
                    this.$store.dispatch('assets/createRealityShareRecording', { blob: chunk, key });
                },
            };
            RecordingService.startRecording(options);
        },
        setModel(data) {
            this.currentModel.src = data;
            // this.currentModel.dirty = false;
            /* this.$store.dispatch('apps/state/update', {
                selector: 'currentModel',
                value: this.currentModel,
            }); */
        },
        togglePosition() {
            this.$store.dispatch('apps/state/update', {
                selector: 'mode',
                value: 'translate',
            });
        },
        toggleRotation() {
            this.$store.dispatch('apps/state/update', {
                selector: 'mode',
                value: 'rotate',
            });
        },
        toggleAssetModal() {},
        setPosition() {
            this.$store.dispatch('apps/state/update', {
                selector: 'position',
                value: this.position,
            });
        },
        setRotation() {
            this.$store.dispatch('apps/state/update', {
                selector: 'rotation',
                value: this.rotation,
            });
        },
        setTargetPosition() {
            this.$store.dispatch('apps/state/update', {
                selector: 'targetPosition',
                value: this.targetPosition,
            });
        },
        placeInFront() {
            const cam = document.getElementById('camera');
            this.position = new THREE.Vector3(0, 0, -this.placeInFrontDistance);
            this.position.applyQuaternion(cam.object3D.quaternion);
            // Apply rounding now to avoid triggering a duplicate network message when rounding is applied later
            this.position.x = parseFloat(this.position.x.toFixed(2));
            this.position.y = parseFloat(this.position.y.toFixed(2));
            this.position.z = parseFloat(this.position.z.toFixed(2));

            this.$store.dispatch('apps/state/update', {
                selector: 'position',
                value: this.position,
            });
        },
        handleSceneLoaded(scene) {
            this.scene = scene;
            this.currentT = 0;
            this.previousT = 0;
            this.scene.on('tick', ({ t, dt }) => {
                if (this.joinedSession) {
                    this.handleCanvasUpdate(t, dt);
                }
            });
            /*
            const gizmo = new TransformControls(this.scene.el.camera, this.scene.el.renderer.domElement);
            this.scene.el.object3D.gizmo = gizmo;
            this.scene.el.object3D.add(gizmo);
            */
        },
        handleCanvasUpdate() {
            const videoCanvas = document.getElementById('arjs-video');
            const aframeCanvas = this.getAframeCanvas();
            if (videoCanvas) {
                this.canvasCombined.width = aframeCanvas.width;
                this.canvasCombined.height = aframeCanvas.height;
                const context = this.canvasCombined.getContext('2d');

                context.drawImage(videoCanvas, 0, 0);
                context.drawImage(aframeCanvas, 0, 0);
            }
        },
        getAframeCanvas: _.throttle(
            () => {
                const scene = document.querySelector('a-scene');
                const screenshot = scene.components.screenshot.getCanvas('perspective');
                return screenshot;
            },
            200,
            { leading: true }
        ),
        applyJoystickVelocity() {
            const data = this.moveData;
            const f = Math.min(Math.max(data.force, -1), 1);
            const ang = data.angle.radian;
            const cam = document.getElementById('camera');

            if (this.mode === 'position') {
                const xVector = Math.cos(ang + (3.14 / 180) * cam.getAttribute('rotation').y);
                const yVector = Math.sin(ang + (3.14 / 180) * cam.getAttribute('rotation').y);

                this.position.x += (f / this.joystickSensitivity) * xVector;
                this.position.z -= (f / this.joystickSensitivity) * yVector;
                // this.rotation.dirty = false;
                this.position.x = parseFloat(this.position.x.toFixed(2));
                this.position.z = parseFloat(this.position.z.toFixed(2));

                this.position = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
                this.setPosition();
            } else if (this.mode === 'rotation') {
                const xVector = Math.cos(ang);

                this.rotation.y += (f / this.joystickRotationSensitivity) * xVector;
                this.rotation.y = parseFloat(this.rotation.y.toFixed(2));

                // this.rotation.dirty = false;
                this.setRotation();
            }
        },
        applySecondaryJoystickVelocity() {
            const data = this.moveData;
            const f = Math.min(Math.max(data.force, -1), 1);
            const ang = data.angle.radian;

            const yVector = Math.sin(ang);

            if (this.mode === 'position') {
                this.position.y += (f / this.joystickSensitivity) * yVector;
                this.position.y = parseFloat(this.position.y.toFixed(2));
                // this.position.dirty = false;
                /*
                this.$store.dispatch('apps/state/update', {
                    selector: 'position',
                    value: this.position,
                });
                */
            }
        },
        tickLoop() {
            if (this.joystickActive) {
                setTimeout(() => {
                    this.applyJoystickVelocity();
                    this.tickLoop();
                }, 10);
            }
            if (this.secondaryJoystickActive) {
                setTimeout(() => {
                    this.applySecondaryJoystickVelocity();
                    this.tickLoop();
                }, 10);
            }
        },
        handleConnectionStatusChanged() {
            if (this.isPresenter) {
                const connectedIds = Object.keys(this.connection.peerConnectionByClientId);
                this.connected = _.some(connectedIds, () => {
                    const connection = this.connection.peerConnectionByClientId[connectedIds];
                    return connection.connectionState === 'connected';
                });
            } else {
                // check for peer connected
                this.connected = this.connection.peerConnection.connectionState === 'connected';
            }
        },
        CreateJoySticks() {
            this.joystick = nipplejs.create({
                zone: document.querySelector('.virtual--gamepad'),
                mode: 'static',
                position: { left: '15%', top: '80%' },
                color: 'red', // '#c9c3b2',
                threshold: 0.25,
                fadeTime: 400,
                maxNumberOfNipples: 1,
                dynamicPage: true,
            });

            this.joystick.on('move', (evt, data) => {
                this.moveData = data;
                if (!this.joystickActive) {
                    this.joystickActive = true;
                    this.tickLoop();
                }
            });

            this.joystick.on('end', (evt, data) => {
                this.joystickActive = false;
            });

            this.secondaryJoystick = nipplejs.create({
                zone: document.querySelector('.virtual--gamepad--secondary'),
                mode: 'static',
                position: { left: '85%', top: '80%' },
                color: 'green', // '#c9c3b2',
                threshold: 0.25,
                fadeTime: 400,
                maxNumberOfNipples: 1,
                dynamicPage: true,
            });

            this.secondaryJoystick.on('move', (evt, data) => {
                this.moveData = data;
                if (!this.secondaryJoystickActive) {
                    this.secondaryJoystickActive = true;
                    this.tickLoop();
                }
            });

            this.secondaryJoystick.on('end', (evt, data) => {
                this.secondaryJoystickActive = false;
            });
        },
        EstablishNetworkSubscription() {
            const observable = Client.Api.subscribe({
                query: gql(Client.Subscriptions.onCreateEvent),
                variables: { subscriptionId: '0' },
            });

            observable.subscribe({
                next: this.ReceiveNetworkUpdate.bind(this), // this.receiveNetworkPosition.bind(this),
                complete: console.log,
                error: console.log,
            });

            /*
            //  Announce That You Joined The Channel
            await Client.Api.mutate({
                mutation: gql(Client.Mutations.createEvent),
                variables: {
                    input: {
                        name: 'UserConnected',
                        data: '{"userId": 1}',
                        subscriptionId: '0',
                        createdAt: new Date(),
                    },
                },
            });
            */
        },
        RegisterSyncVars() {
            // Trigger Updates to SyncVar object when local equivalents of syncVars are updates.
            Object.keys(this.syncVar).forEach((key) => {
                this.$watch(
                    key,
                    () => {
                        // TODO: Add a check to see if this change was done locally or through the network

                        // if not remotly updated submit network update
                        // if remotely updated apply changes then unset remote update
                        if (!this.syncVar[key].dirty) {
                            _.extend(this.syncVar[key], { timestamp: new Date() });
                            this.SubmitNetworkUpdate();
                        } else if (!this.syncVar[key].syncInProgress) {
                            // unset remotly update here so that you dont have to set it on local changes
                            // check if lerping is in progress
                            // if lerping do not unset this

                            this.syncVar[key].dirty = false;
                        }
                        // Update Render Layer
                        this.$store.dispatch('apps/state/update', {
                            selector: key,
                            value: this[key],
                        });
                    },
                    { deep: true }
                );
            });
        },
        ReceiveNetworkUpdate(data) {
            if (data.data.onCreateEvent.name && data.data.onCreateEvent.name === 'state|update') {
                const newData = JSON.parse(data.data.onCreateEvent.data);
                // Loop through keys of new update
                Object.keys(newData).forEach((key) => {
                    newData[key].timestamp = new Date(newData[key].timestamp);
                    // Only apply requested change if it's newer than current update
                    if (newData[key].timestamp > this.syncVar[key].timestamp) {
                        this.ApplyNetworkUpdate(key, newData);
                    }
                });
            }
        },
        ReceiveDataMessage(data) {
            if (true) {
                const newData = JSON.parse(data.data);
                // Loop through keys of new update
                Object.keys(newData).forEach((key) => {
                    newData[key].timestamp = new Date(newData[key].timestamp);
                    // Only apply requested change if it's newer than current update
                    if (newData[key].timestamp > this.syncVar[key].timestamp) {
                        this.ApplyNetworkUpdate(key, newData);
                    }
                });
            }
        },
        ApplyNetworkUpdate(key, newData) {
            // Currently SyncVars only work at top level
            this.syncVar[key].dirty = true;
            this.syncVar[key].timestamp = newData[key].timestamp;

            // this[key] = newData[key];
            // Check if this syncVar is setup for interpolation, else snap to new update

            if (this.syncVar[key].syncVarSettings && this.syncVar[key].syncVarSettings.interpolate) {
                // TODO: Consider object being updated, interpolation currently assumes a vector3

                // If there is already a tween, cancel it before creating a new one
                if (this.syncVar[key].syncInProgress) {
                    this.syncVar[key].tween.stop();
                }
                this.syncVar[key].syncInProgress = true;
                this.syncVar[key].tween = new TWEEN.Tween(this[key])
                    .to({ x: newData[key].x, y: newData[key].y, z: newData[key].z }, this.lerpSpeed)
                    .onComplete(() => {
                        this.syncVar[key].dirty = true;
                        this[key] = newData[key];
                        this.syncVar[key].syncInProgress = false;
                    })
                    .start();
            } else {
                this[key] = newData[key];
            }
        },
        // eslint-disable-next-line func-names
        SubmitNetworkUpdate: _.throttle(function() {
            const data = _.cloneDeep(_.pick(this, _.keys(this.syncVar)));
            _.forOwn(this.syncVar, (value, key) => {
                _.extend(data[key], value);
            });
            if (this.isPresenter) {
                Object.keys(this.connection.dataChannelByClientId).forEach((clientId) => {
                    try {
                        this.connection.dataChannelByClientId[clientId].send(JSON.stringify(data));
                    } catch (e) {
                        console.error('[MASTER] Send DataChannel: ', e.toString());
                        Sentry.captureException(e);
                    }
                });
            } else if (this.connection.dataChannel) {
                try {
                    this.connection.dataChannel.send(JSON.stringify(data));
                } catch (e) {
                    console.error('[VIEWER] Send DataChannel: ', e.toString());
                    Sentry.captureException(e);
                }
            }

            // const data = _.cloneDeep(_.pick(this, _.keys(this.syncVar)));
            // _.forOwn(this.syncVar, (value, key) => {
            //     _.extend(data[key], value);
            // });
            // Client.Api.mutate({
            //     mutation: gql(Client.Mutations.createEvent),
            //     variables: {
            //         input: {
            //             name: 'state|update',
            //             data: JSON.stringify(data),
            //             subscriptionId: '0',
            //             createdAt: new Date(),
            //         },
            //     },
            // });
        }, 10),
    },
};
// Working with http://localhost:8080/realityshare/03622bc9-e2c7-4b07-a5b0-452079880d30
</script>

<style>
body .v-application--wrap {
    position: initial;
    min-width: initial;
    min-height: initial;
}
body #app-router {
    display: none;
}
#reality-share-toolbar .toolbar-btn {
    min-width: 60px;
}
.remote-view {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
}
</style>
