<template>
    <div class="h-screen static flex 0">
        <Scene style="height:100%" embedded :vr-enabled="false" :ar-enabled="false" :app-id="app.appId" @loaded="handleSceneLoaded" />
        <div v-show="showErrorMessage" aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
            <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
                <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-6 h-6 text-red-400"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p class="text-sm font-medium text-gray-900">
                                    Uh Oh!
                                </p>
                                <p class="mt-1 text-sm text-gray-500">
                                    Looks like something went wrong, please try again!
                                </p>
                            </div>
                            <div class="ml-4">
                                <button
                                    type="button"
                                    class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                    @click="showErrorMessage = false"
                                >
                                    <span class="sr-only">Close</span>
                                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showEarlyAccessDialog" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
                    >
                        <div class="absolute right-0 top-0 pr-4 pt-4 sm:block">
                            <button
                                type="button"
                                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                @click="showEarlyAccessDialog = false"
                            >
                                <span class="sr-only">Close</span>
                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 text-cyan-600">
                                    <path
                                        fill-rule="evenodd"
                                        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-5">
                                <h3 id="modal-title" class="text-base font-semibold leading-6 text-gray-900">
                                    Looking for more?
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        Join our private beta and be among the first to explore the worlds most powerful virtual worlds creator! Request access
                                        now and get ready to bring your imaginations to life!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 sm:mt-6">
                            <a
                                type="button"
                                href="https://o326nofvde4.typeform.com/to/BfCuWb41"
                                target="_blank"
                                class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                            >
                                Request Early Access
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="absolute bottom-0 flex justify-center sm:my-8 w-full">
            <div class="static rounded-lg bg-slate-300/50 shadow-xl px-4 py-5 sm:px-6 w-full sm:w-5/6">
                <div class="md:flex md:items-center md:justify-between md:space-x-5">
                    <div class="flex items-start space-x-5">
                        <div class="flex-shrink-0">
                            <div class="relative">
                                <img class="h-16 w-16 rounded-full" src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/tt-logo.png" alt="" />
                                <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
                            </div>
                        </div>
                        <div class="pt-1.5">
                            <h1 class="text-2xl font-bold text-gray-900">
                                Imagine This
                            </h1>
                            <p class="text-sm font-medium text-gray-800">
                                Create, explore, and share virtual worlds!
                            </p>
                        </div>
                    </div>
                    <div class="mb-4 flex justify-between md:justify-end md:space-x-3">
                        <!-- <button
                            type="button"
                            class="inline-flex items-center gap-x-1.5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            @click="save"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                <path
                                    fill-rule="evenodd"
                                    d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Save
                        </button> -->
                        <button
                            type="button"
                            class="inline-flex items-center gap-x-1.5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            @click="random"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                <path
                                    fill-rule="evenodd"
                                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Random
                        </button>
                        <!-- <button
                            type="button"
                            class="inline-flex items-center gap-x-1.5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            @click="download"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                <path
                                    fill-rule="evenodd"
                                    d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Download
                        </button> -->
                        <!-- <button
                            type="button"
                            class="inline-flex items-center gap-x-1.5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                <path
                                    fill-rule="evenodd"
                                    d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Share
                        </button> -->
                        <button
                            type="button"
                            class="inline-flex items-center gap-x-1.5 rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            @click="showEarlyAccessDialog = true"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                                <path
                                    fill-rule="evenodd"
                                    d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Bring to Life (Early Access)
                        </button>
                    </div>
                </div>
                <form @submit.prevent="generate">
                    <div class="flex max-w-md gap-x-4">
                        <!-- <v-select label="Setting" v-model="selectedEnvironmentId" :items="environments" item-text="name" item-value="id"></v-select> -->

                        <v-select label="Character" v-model="selectedCharacterId" :items="characters" item-text="display" item-value="id"></v-select>
                        <v-select label="Character" v-model="selectedCharacterId2" :items="characters" item-text="display" item-value="id"></v-select>

                        <v-select label="Style" v-model="selectedStyleId" :items="styles" item-text="name" item-value="id"></v-select>
                        <v-select label="Topics" v-model="selectedTopicId" :items="topics" item-text="name" item-value="id"></v-select>

                        <!-- <v-text-field label="Topic" v-model="topic"></v-text-field> -->

                        <v-text-field label="References" v-model="references"></v-text-field>
                        <!-- <div class="relative mt-2">
                            <button
                                type="button"
                                class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                aria-haspopup="listbox"
                                aria-expanded="true"
                                aria-labelledby="listbox-label"
                            >
                                <span class="flex items-center">
                                    <img :src="selectedCharacter.imageSrc" alt="" class="h-5 w-5 flex-shrink-0 rounded-full" />
                                    <span class="ml-3 block truncate">{{ selectedCharacter.name }}</span>
                                </span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </button>
                            <ul
                                class="absolute z-10 mt-1 pl-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                tabindex="-1"
                                role="listbox"
                                aria-labelledby="listbox-label"
                                aria-activedescendant="listbox-option-3"
                            >
                                <li
                                    v-for="(character, index) in characters"
                                    :key="character.name"
                                    class="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9"
                                    id="listbox-option-0"
                                    role="option"
                                >
                                    <div class="flex items-center">
                                        <img :src="character.imageSrc" alt="" class="h-5 w-5 flex-shrink-0 rounded-full" />
                                        <span class="font-normal ml-3 block truncate">{{ character.name }}</span>
                                    </div>
                                    <span v-if="selectedCharacterIndex === index" class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </li>
                            </ul>
                        </div> -->
                        <!-- <input
                            id="imagine"
                            v-model="promptValue"
                            type="text"
                            name="imagine"
                            class="block w-full rounded-md border-0 py-1.5 pl-4 pr-4 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm"
                            placeholder="Imagine Anything"
                        /> -->

                        <button
                            type="submit"
                            :disabled="loading"
                            class="inline-flex items-center gap-x-2 rounded-md bg-cyan-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm disabled:bg-slate-200 disabled:text-slate-500 hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path
                                    fill-rule="evenodd"
                                    d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                                    clip-rule="evenodd"
                                />
                            </svg>

                            Imagine
                        </button>
                    </div>
                </form>
                <!-- <div v-if="loading" class="w-full mt-3 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="bg-cyan-600 h-2.5 rounded-full animate-stripes" :style="{ width: `${loadingValue}%` }" />
                </div> -->
            </div>
        </div>

        <v-dialog v-model="showPublishDialog" persistent width="800">
            <v-card v-if="loading" color="primary" dark>
                <v-card-text>
                    Generating...
                    <div v-if="loading" class="w-full mt-3 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-white h-2.5 rounded-full animate-stripes" :style="{ width: `${loadingValue}%` }" />
                    </div>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-toolbar color="primary" dark flat class="text-h2 font-weight-600 mb-0 text-capitalize">
                    {{ app.name }}
                </v-toolbar>

                <v-card flat>
                    <v-card-text>
                        <v-list-item>
                            <v-list-item-content @click="launchPublishedSite">
                                <v-list-item-title>
                                    {{ getTakeUrl() }}
                                </v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon @click="copyValue(getTakeUrl())">
                                    <v-icon>
                                        mdi-content-copy
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-card-text>
                </v-card>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="showPublishDialog = false">
                        Close
                    </v-btn>
                    <v-btn depressed color="primary" @click="launchTakeSite">
                        View
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

import Scene from '@/components/Scene.vue';
import { mapState } from 'vuex';
import EditorMixin from '@/mixins/EditorMixin';
import Client from '@/tt-api';
import DefaultApp from '@/tt-core/scenes/Imagine/app';

import { getModelType, getDefaultTexture } from '@/stores/steps/utils';

import TextToSpeech from '@/services/texttospeech-service';

export default {
    name: 'Go',
    components: {
        Scene,
    },
    mixins: [EditorMixin],
    props: {},
    data() {
        return {
            cutoutBaseUrl:
                'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/',
            loading: false,
            loadingValue: 10,
            promptValue: null,
            showErrorMessage: false,
            showEarlyAccessDialog: false,
            newApp: {
                name: 'TT Imagine',
                appId: 'Imagine',
                config: DefaultApp.config,
                state: DefaultApp.state,
                actions: DefaultApp.actions,
            },
            selectedCharacterId: null,
            selectedCharacterId2: null,
            selectedEnvironmentId: '1',
            selectedStyleId: '1',
            selectedTopicId: '1',
            selectedCharacterIndex: 0,
            topic: '',
            references: '',
            showPublishDialog: false,
            topics: [
                {
                    id: 1,
                    name: 'Awkward family reunions',
                    description:
                        'Humorous situations and uncomfortable moments that often arise when families gather together for reunions or special occasions.',
                },
                {
                    id: 2,
                    name: 'Misadventures in online dating',
                    description:
                        'Funny and amusing experiences, awkward encounters, or bizarre situations that can occur while navigating the world of online dating.',
                },
                {
                    id: 3,
                    name: 'Trying to follow a complicated recipe',
                    description:
                        'Humorous attempts at cooking or baking when confronted with a complex recipe, resulting in mishaps, confusion, or unexpected outcomes.',
                },
                {
                    id: 4,
                    name: 'The struggle of assembling IKEA furniture',
                    description:
                        'Amusing and frustrating experiences that come with assembling furniture from IKEA, often involving confusing instructions and unexpected challenges.',
                },
                {
                    id: 5,
                    name: 'The quirks of public transportation',
                    description:
                        'Funny and peculiar situations encountered while using public transportation, such as strange fellow passengers, unexpected delays, or bizarre incidents.',
                },
                {
                    id: 6,
                    name: 'Annoying habits of roommates',
                    description:
                        'Humorous and exasperating behaviors displayed by roommates, such as messy habits, loud noises, or quirky idiosyncrasies that can lead to amusing situations.',
                },
                {
                    id: 7,
                    name: 'Hilarious pet antics',
                    description:
                        'Funny and entertaining behaviors exhibited by pets, including comical situations, mischievous acts, or amusing reactions to various stimuli.',
                },
                {
                    id: 8,
                    name: 'Bizarre customer service experiences',
                    description:
                        'Unusual, funny, or absurd encounters with customer service representatives or experiences with customer support that defy expectations or logic.',
                },
                {
                    id: 9,
                    name: 'Unusual phobias and irrational fears',
                    description:
                        'Humorous and unconventional phobias or fears that people may have, ranging from the mundane to the bizarre, often leading to amusing reactions or avoidance behaviors.',
                },
                {
                    id: 10,
                    name: 'The perils of social media oversharing',
                    description:
                        'Humorous and awkward situations that can arise from oversharing personal information, embarrassing moments, or inappropriate content on social media platforms.',
                },
                {
                    id: 11,
                    name: 'Surviving a zombie apocalypse',
                    description:
                        'Imaginative and comical scenarios, strategies, or mishaps that might occur during a fictional zombie outbreak, often involving humorous survival tactics or interactions.',
                },
                {
                    id: 12,
                    name: 'The art of parallel parking',
                    description:
                        'Humorous or challenging experiences related to the often-frustrating task of parallel parking, including funny attempts, mishaps, or encounters with impatient drivers.',
                },
                {
                    id: 13,
                    name: 'Weird shopping experiences at the grocery store',
                    description:
                        'Funny, strange, or unexpected incidents that can happen while shopping for groceries, such as unusual items, bizarre encounters, or amusing interactions with staff or other customers.',
                },
                {
                    id: 14,
                    name: 'Misunderstandings in foreign languages',
                    description:
                        'Comical situations arising from miscommunications, language barriers, or amusing mistranslations that occur when speaking or understanding foreign languages.',
                },
                {
                    id: 15,
                    name: 'Strange encounters with neighbors',
                    description:
                        'Amusing or peculiar interactions, incidents, or idiosyncrasies displayed by neighbors that can lead to funny or awkward situations within a residential community.',
                },
                {
                    id: 16,
                    name: 'Comical childhood memories',
                    description:
                        "Humorous and nostalgic anecdotes or recollections of amusing incidents, mischievous acts, or funny experiences from one's childhood.",
                },
                {
                    id: 17,
                    name: 'Absurd fashion trends',
                    description:
                        'Funny and outlandish fashion fads, styles, or trends that defy conventional taste, leading to comical observations or unconventional clothing choices.',
                },
                {
                    id: 18,
                    name: 'Unfortunate incidents with technology',
                    description:
                        'Humorous or embarrassing mishaps, blunders, or awkward moments that occur while using or interacting with various forms of technology or electronic devices.',
                },
                {
                    id: 19,
                    name: 'Frustrating encounters with automated customer service systems',
                    description:
                        'Amusing or irritating experiences with automated customer service systems, including humorous misunderstandings, unhelpful responses, or endless phone menu loops.',
                },
                {
                    id: 20,
                    name: 'The challenges of adulting',
                    description:
                        'Humorous situations, responsibilities, or difficulties encountered while navigating the expectations and responsibilities of adulthood, often accompanied by comical self-reflection or self-deprecating humor.',
                },
                {
                    id: 21,
                    name: 'The chaos of holiday shopping',
                    description:
                        'Hectic, funny, or stressful experiences associated with shopping for gifts or navigating crowded stores and malls during holiday seasons, often resulting in comical or absurd situations.',
                },
                {
                    id: 22,
                    name: 'Silly misunderstandings in relationships',
                    description:
                        'Funny miscommunications, humorous misconceptions, or comical misunderstandings that can occur between partners, friends, or family members in romantic or personal relationships.',
                },
                {
                    id: 23,
                    name: 'The never-ending battle against clutter',
                    description:
                        'Amusing or frustrating situations and efforts to declutter, organize, or tidy up living spaces, often highlighting the humorous struggle to maintain order in a chaotic world.',
                },
                {
                    id: 24,
                    name: 'The hilarious world of toddlers and their tantrums',
                    description:
                        'Funny and entertaining moments, behaviors, or meltdowns exhibited by young children, particularly toddlers, known for their unpredictable and comical reactions and outbursts.',
                },
                {
                    id: 25,
                    name: 'Embarrassing moments at social gatherings',
                    description:
                        'Humiliating, awkward, or cringe-worthy situations that can arise at parties, gatherings, or social events, leading to humorous or embarrassing anecdotes.',
                },
                {
                    id: 26,
                    name: 'The absurdity of fashion trends',
                    description:
                        'Humorous or outrageous fashion trends, styles, or choices that defy logic or common sense, resulting in comical observations or unconventional clothing combinations.',
                },
                {
                    id: 27,
                    name: 'The perils of miscommunication',
                    description:
                        'Funny or disastrous consequences that can arise from miscommunication, misunderstandings, or unclear messages, often resulting in amusing and unexpected outcomes.',
                },
                {
                    id: 28,
                    name: 'The art of giving and receiving bad gifts',
                    description:
                        'Humorous or bizarre experiences associated with giving or receiving gifts that miss the mark, leading to awkward or comical reactions from the recipient or giver.',
                },
                {
                    id: 29,
                    name: 'Strange experiences with fortune tellers or psychics',
                    description:
                        'Amusing or peculiar encounters, predictions, or experiences with fortune tellers, psychics, or tarot readers, often involving outlandish or humorous revelations.',
                },
                {
                    id: 30,
                    name: 'The bizarre world of conspiracy theories',
                    description:
                        'Humorous or outlandish conspiracy theories, bizarre beliefs, or funny explanations for unexplained phenomena, often prompting comical analysis or satirical commentary.',
                },
                {
                    id: 31,
                    name: 'Unusual and humorous baby names',
                    description:
                        'Funny, unconventional, or strange baby names that parents choose for their children, often leading to comical reactions, misunderstandings, or amusing situations.',
                },
                {
                    id: 32,
                    name: 'Funny encounters at the gym',
                    description:
                        'Amusing or entertaining incidents, odd behaviors, or humorous encounters that can happen while exercising or visiting a gym or fitness center.',
                },
                {
                    id: 33,
                    name: 'The struggles of trying to be fashionable',
                    description:
                        'Humorous or relatable challenges, mishaps, or funny situations that arise when attempting to keep up with or adopt the latest fashion trends and styles.',
                },
                {
                    id: 34,
                    name: 'Hilarious driving mishaps',
                    description:
                        'Funny or amusing incidents, mistakes, or experiences that occur while driving, including comical parking attempts, road trip blunders, or unexpected situations on the road.',
                },
                {
                    id: 35,
                    name: 'Awkward encounters with exes',
                    description:
                        'Uncomfortable or humorous situations that arise when unexpectedly meeting or interacting with former romantic partners or exes.',
                },
                {
                    id: 36,
                    name: 'The madness of Black Friday shopping',
                    description:
                        'Chaotic, amusing, or over-the-top experiences associated with the shopping frenzy and competitive nature of Black Friday sales, often leading to comical situations or observations.',
                },
                {
                    id: 37,
                    name: 'Weird and funny superstitions',
                    description:
                        'Unusual or amusing beliefs, rituals, or practices rooted in superstition that people adhere to, often leading to comical or bizarre behaviors.',
                },
                {
                    id: 38,
                    name: 'The challenges of being a picky eater',
                    description:
                        'Humorous or frustrating situations encountered by individuals who are selective or particular about their food preferences, often resulting in amusing dining experiences or comical encounters.',
                },
                {
                    id: 39,
                    name: 'Bizarre and amusing phobias',
                    description:
                        'Uncommon or funny phobias that individuals may have, often leading to humorous reactions, avoidance strategies, or comical encounters.',
                },
                {
                    id: 40,
                    name: 'Embarrassing moments during job interviews',
                    description:
                        'Humiliating, awkward, or funny incidents or blunders that can occur during job interviews, resulting in comical or embarrassing stories.',
                },
                {
                    id: 41,
                    name: 'Comical mishaps with technology',
                    description:
                        'Funny or absurd incidents, accidents, or mishaps that happen while using technology, including hilarious user errors, software glitches, or technological misadventures.',
                },
                {
                    id: 42,
                    name: 'Funny encounters with wildlife',
                    description:
                        'Amusing or unexpected interactions, observations, or experiences involving animals in the wild or encounters with wildlife in urban or suburban settings.',
                },
                {
                    id: 43,
                    name: 'The absurdity of reality TV shows',
                    description:
                        'Humorous or outrageous aspects, contestants, or scenarios depicted in reality television programs, often highlighting the contrived or exaggerated nature of the genre.',
                },
                {
                    id: 44,
                    name: 'Awkward moments in public speaking',
                    description:
                        'Embarrassing, cringe-worthy, or comical incidents or mishaps that can occur during public speaking engagements, such as forgotten lines, technical difficulties, or humorous slip-ups.',
                },
                {
                    id: 45,
                    name: 'The hilarity of bad hair days',
                    description:
                        'Funny or frustrating experiences resulting from hair-related mishaps, unmanageable hairstyles, or comical attempts to salvage a less-than-perfect hair day.',
                },
                {
                    id: 46,
                    name: 'Funny experiences with personal trainers',
                    description:
                        'Amusing or humorous encounters, situations, or interactions with personal trainers or fitness coaches, often involving comical exercises, motivational techniques, or funny fitness advice.',
                },
                {
                    id: 47,
                    name: 'The art of overthinking everyday situations',
                    description:
                        'Humorous or relatable tendencies to overanalyze or overcomplicate simple, everyday scenarios, resulting in comical overthinking, exaggerated worries, or amusing speculations.',
                },
                {
                    id: 48,
                    name: 'The comical side of failed DIY projects',
                    description:
                        'Funny or disastrous attempts at do-it-yourself projects, home improvements, or craft activities that go awry, often resulting in comical or unexpected outcomes.',
                },
                {
                    id: 49,
                    name: 'Hilarious misadventures in home repairs',
                    description:
                        'Humorous or absurd experiences, mistakes, or blunders encountered while attempting to repair or fix things around the house, leading to comical or unexpected results.',
                },
                {
                    id: 50,
                    name: 'Funny encounters with telemarketers',
                    description:
                        'Amusing or entertaining interactions, responses, or conversations with telemarketers, often involving witty comebacks, humorous inquiries, or unexpected twists.',
                },
                {
                    id: 51,
                    name: 'Starting a startup',
                    description: '',
                },
                {
                    id: 52,
                    name: 'Fish Fry',
                    description: '',
                },
                {
                    id: 53,
                    name: 'The Life Cycle of Potatoes',
                    description: '',
                },

                {
                    id: 54,
                    name: 'How worm farms are better than ant farms.',
                    description: '',
                },

                {
                    id: 55,
                    name: 'The launch of the Apple VR Headset',
                    description: '',
                },

                {
                    id: 56,
                    name: 'An argument about favorite colors.',
                    description: '',
                },
            ],
            styles: [
                {
                    id: 1,
                    name: 'Observational comedy',
                    description: 'Comedy that derives humor from astute observations and commentary on everyday situations and human behavior.',
                },
                {
                    id: 2,
                    name: 'Storytelling comedy',
                    description: 'Comedy that involves humorous narratives or anecdotes, often with vivid and entertaining storytelling techniques.',
                },
                {
                    id: 3,
                    name: 'One-liner comedy',
                    description: 'Comedy consisting of quick, concise, and witty jokes that are typically delivered in rapid succession.',
                },
                {
                    id: 4,
                    name: 'Self-deprecating comedy',
                    description: 'Comedy in which the comedian makes fun of themselves, highlighting their flaws, shortcomings, or embarrassing situations.',
                },
                {
                    id: 5,
                    name: 'Deadpan comedy',
                    description:
                        'Comedy characterized by a deliberately impassive or expressionless delivery, often contrasting with absurd or humorous situations.',
                },
                {
                    id: 6,
                    name: 'Character-based comedy',
                    description:
                        'Comedy that revolves around the portrayal of distinct and humorous characters, each with their own quirks, traits, and comedic style.',
                },
                {
                    id: 7,
                    name: 'Impression comedy',
                    description:
                        'Comedy that involves mimicking and impersonating famous personalities, fictional characters, or individuals from various walks of life.',
                },
                {
                    id: 8,
                    name: 'Musical comedy',
                    description:
                        'Comedy infused with music, songs, and comedic performances that incorporate elements of singing, dancing, or musical instruments.',
                },
                {
                    id: 9,
                    name: 'Political comedy',
                    description:
                        'Comedy that focuses on political events, figures, ideologies, and social issues, often providing humorous commentary or satire.',
                },
                {
                    id: 10,
                    name: 'Satirical comedy',
                    description: 'Comedy that employs irony, sarcasm, or ridicule to expose and criticize societal, political, or cultural vices and follies.',
                },
                {
                    id: 11,
                    name: 'Surreal comedy',
                    description:
                        'Comedy that explores bizarre, dreamlike, or illogical scenarios, often defying traditional storytelling conventions and expectations.',
                },
                {
                    id: 12,
                    name: 'Wordplay comedy',
                    description: 'Comedy that relies on clever and humorous manipulation of language, such as puns, double entendres, and witty wordplay.',
                },
                {
                    id: 13,
                    name: 'Physical comedy',
                    description: 'Comedy that emphasizes physical movements, gestures, facial expressions, and slapstick humor to elicit laughter.',
                },
                {
                    id: 14,
                    name: 'Crowd work comedy',
                    description:
                        'Comedy that involves interacting and engaging with the audience, often improvising jokes and banter based on their responses.',
                },
                {
                    id: 15,
                    name: 'Improvisational comedy',
                    description:
                        "Comedy that is created spontaneously without scripted material, relying on the comedian's quick thinking, wit, and creativity.",
                },
                {
                    id: 16,
                    name: 'Rant comedy',
                    description:
                        'Comedy that involves passionate and comedic rants about various topics, often expressing frustrations or societal observations.',
                },
                {
                    id: 17,
                    name: 'Shock comedy',
                    description: 'Comedy that aims to shock or surprise the audience by pushing the boundaries of acceptability or exploring taboo subjects.',
                },
                {
                    id: 18,
                    name: 'Blue comedy (risqué or explicit humor)',
                    description:
                        'Comedy that employs adult-oriented or explicit humor, often dealing with topics considered risqué, vulgar, or sexually suggestive.',
                },
                {
                    id: 19,
                    name: 'Clean comedy (family-friendly or PG-rated humor)',
                    description:
                        'Comedy that maintains a wholesome and family-friendly tone, free from profanity, explicit content, or controversial subjects.',
                },
                {
                    id: 20,
                    name: 'Absurd comedy',
                    description:
                        'Comedy that embraces the nonsensical, bizarre, or surreal, often defying logical or rational storytelling and comedic conventions.',
                },
                {
                    id: 21,
                    name: 'Alternative comedy',
                    description:
                        'Comedy that challenges mainstream comedic norms and conventions, often experimenting with unconventional or subversive humor.',
                },
                {
                    id: 22,
                    name: 'Pun comedy',
                    description:
                        'Comedy that revolves around clever and humorous wordplay, often featuring puns, double meanings, or playful linguistic twists.',
                },
                {
                    id: 23,
                    name: 'Wit and wordplay comedy',
                    description: 'Comedy that relies on quick thinking, cleverness, and intelligent wordplay to create humorous and entertaining performances.',
                },
                {
                    id: 24,
                    name: 'Dark comedy',
                    description:
                        'Comedy that delves into morbid, taboo, or sensitive subjects, using humor to explore the absurdity or darkness of these topics.',
                },
                {
                    id: 25,
                    name: 'Stand-up storytelling',
                    description:
                        'Comedy that combines elements of storytelling with stand-up performance, weaving humorous narratives or anecdotes for entertainment.',
                },
                {
                    id: 26,
                    name: 'Cultural comedy',
                    description:
                        'Comedy that explores and highlights cultural differences, stereotypes, traditions, or social aspects with a humorous approach.',
                },
                {
                    id: 27,
                    name: 'Nerd/geek comedy',
                    description:
                        'Comedy that caters to niche interests, subcultures, or fandoms, often making jokes or references related to geeky or nerdy topics.',
                },
                {
                    id: 28,
                    name: 'Prop comedy',
                    description: 'Comedy that involves the use of physical props or objects as comedic tools, enhancing the humor of the performance.',
                },
                {
                    id: 29,
                    name: 'Relationship comedy',
                    description: 'Comedy that focuses on humorous situations, dynamics, and experiences within romantic, familial, or social relationships.',
                },
                {
                    id: 30,
                    name: 'Anecdotal comedy',
                    description:
                        "Comedy that revolves around personal anecdotes, sharing humorous and relatable stories from the comedian's own life experiences.",
                },
                {
                    id: 31,
                    name: 'Confessional comedy',
                    description:
                        'Comedy that involves the comedian revealing personal and often embarrassing details, providing a sense of authenticity and humor.',
                },
                {
                    id: 32,
                    name: 'Satire comedy',
                    description: 'Comedy that employs irony, sarcasm, or ridicule to mock and satirize individuals, institutions, or societal norms.',
                },
                {
                    id: 33,
                    name: 'Political satire comedy',
                    description:
                        'Comedy that combines humor with political satire, using comedic devices to criticize and comment on political issues and figures.',
                },
                {
                    id: 34,
                    name: 'Irony and sarcasm comedy',
                    description: 'Comedy that utilizes irony and sarcasm to create humorous effects, often involving witty comebacks, banter, or dry humor.',
                },
                {
                    id: 35,
                    name: 'Ethnic comedy',
                    description:
                        'Comedy that explores and pokes fun at ethnic or cultural stereotypes, traditions, or idiosyncrasies with a humorous approach.',
                },
                {
                    id: 36,
                    name: 'Physicality-based comedy',
                    description:
                        "Comedy that heavily relies on the comedian's physicality, including exaggerated movements, facial expressions, and physical humor.",
                },
                {
                    id: 37,
                    name: 'High-energy comedy',
                    description:
                        'Comedy characterized by a fast-paced and energetic performance style, featuring lively delivery, physicality, and enthusiasm.',
                },
                {
                    id: 38,
                    name: 'Low-energy comedy',
                    description:
                        'Comedy characterized by a more subdued and laid-back performance style, relying on dry humor, understatement, or deadpan delivery.',
                },
                {
                    id: 39,
                    name: 'Improvised crowd interactions',
                    description:
                        'Comedy that involves spontaneously interacting with the audience, incorporating their responses and reactions into the comedic act.',
                },
                {
                    id: 40,
                    name: 'Topical comedy',
                    description:
                        'Comedy that focuses on current events, news, trends, or pop culture, incorporating timely references and commentary into the act.',
                },
                {
                    id: 41,
                    name: 'Roast comedy',
                    description:
                        'Comedy that involves humorously mocking or insulting a specific person or group of people, often in a playful and lighthearted manner.',
                },
                {
                    id: 42,
                    name: 'Shock value comedy',
                    description:
                        'Comedy that seeks to shock or provoke a strong reaction from the audience, often through the use of controversial or outrageous material.',
                },
                {
                    id: 43,
                    name: 'Joke-joke-joke comedy',
                    description:
                        'Comedy that is primarily focused on delivering a series of rapid-fire jokes, with minimal storytelling or narrative elements.',
                },
                {
                    id: 44,
                    name: 'Deadpan one-liners',
                    description:
                        'Comedy that relies on short, concise, and dry one-liners delivered with a deadpan or serious facial expression for comedic effect.',
                },
                {
                    id: 45,
                    name: 'Exaggerated storytelling',
                    description:
                        'Comedy that involves embellishing or exaggerating details in storytelling, often for comedic effect, creating larger-than-life narratives.',
                },
                {
                    id: 46,
                    name: 'Improvised storytelling',
                    description:
                        'Comedy that involves spontaneously creating and weaving humorous stories or narratives on the spot, without pre-planned material.',
                },
                {
                    id: 47,
                    name: 'Stand-up with audience participation',
                    description:
                        'Comedy that encourages and incorporates active participation from the audience, involving them in comedic bits, games, or interactions.',
                },
                {
                    id: 48,
                    name: 'Silly or goofy comedy',
                    description:
                        'Comedy that embraces silliness, absurdity, or childlike humor, often featuring playful antics, physical gags, or nonsensical jokes.',
                },
                {
                    id: 49,
                    name: 'Thought-provoking comedy',
                    description:
                        'Comedy that goes beyond entertainment and aims to stimulate intellectual or philosophical reflection through humorous insights.',
                },
                {
                    id: 50,
                    name: 'Deconstruction of comedy itself',
                    description: 'Comedy that breaks down and analyzes the conventions and mechanics of comedy, often subverting or challenging comedic norms.',
                },
                {
                    id: 51,
                    name: 'The challenges of online shopping',
                    description:
                        'Humorous or frustrating experiences encountered while shopping online, including unexpected product arrivals, sizing mishaps, or comical customer reviews.',
                },
                {
                    id: 52,
                    name: 'Funny encounters with inanimate objects',
                    description:
                        'Amusing or bizarre interactions, incidents, or mishaps involving inanimate objects, such as tripping over a stationary object or humorous battles with malfunctioning appliances.',
                },
                {
                    id: 53,
                    name: 'The absurdity of self-help books',
                    description:
                        'Humorous or exaggerated aspects, advice, or topics covered in self-help books, often poking fun at popular trends, clichés, or questionable strategies.',
                },
                {
                    id: 54,
                    name: 'Embarrassing autocorrect fails',
                    description:
                        'Funny or awkward situations resulting from autocorrect errors or auto-suggestions in text messages, emails, or social media posts, leading to amusing misunderstandings or unintended messages.',
                },
                {
                    id: 55,
                    name: 'Comical travel mishaps',
                    description:
                        'Humorous or unexpected incidents, blunders, or misadventures encountered while traveling, including lost luggage, language barriers, or comical cultural misunderstandings.',
                },
                {
                    id: 56,
                    name: 'The hilarious world of office pranks',
                    description:
                        'Amusing or playful practical jokes, tricks, or pranks played in the workplace, leading to laughter, camaraderie, or humorous retaliation among coworkers.',
                },
                {
                    id: 57,
                    name: 'Awkward encounters with technology',
                    description:
                        'Embarrassing or comical situations resulting from miscommunication, misunderstandings, or struggles with modern technology, such as accidentally sending a text to the wrong person or struggling with touch screens.',
                },
                {
                    id: 58,
                    name: 'Funny experiences with voice assistants',
                    description:
                        'Amusing or unexpected interactions, responses, or misunderstandings when using voice assistants, such as Siri, Alexa, or Google Assistant, leading to comical conversations or unconventional results.',
                },
                {
                    id: 59,
                    name: 'The chaos of moving to a new home',
                    description:
                        'Humorous or chaotic situations, mishaps, or challenges encountered during the process of moving to a new residence, including packing blunders, furniture navigation, or comical encounters with movers.',
                },
                {
                    id: 60,
                    name: 'Silly mishaps with household chores',
                    description:
                        'Funny or amusing incidents, mistakes, or comical struggles experienced while performing everyday household chores, such as laundry mishaps, dishwashing adventures, or cleaning catastrophes.',
                },
                {
                    id: 61,
                    name: 'The absurdity of reality dating shows',
                    description:
                        'Humorous or exaggerated aspects, contestants, or scenarios depicted in reality dating shows, often highlighting the contrived nature of the genre or comical relationship dynamics.',
                },
                {
                    id: 62,
                    name: 'Funny encounters with delivery drivers',
                    description:
                        'Amusing or entertaining interactions, conversations, or unexpected situations that occur when receiving packages or interacting with delivery drivers, leading to humorous exchanges or peculiar delivery stories.',
                },
                {
                    id: 63,
                    name: 'The struggles of multitasking',
                    description:
                        'Humorous or relatable challenges, mishaps, or comical situations that arise when attempting to juggle multiple tasks or responsibilities simultaneously, often resulting in funny outcomes or mishandled situations.',
                },
                {
                    id: 64,
                    name: 'Embarrassing moments in public restrooms',
                    description:
                        'Humiliating, awkward, or funny incidents or mishaps that can occur in public restrooms, such as toilet paper mishaps, mistaken identity, or comical encounters with unusual restroom amenities.',
                },
                {
                    id: 65,
                    name: 'The hilarity of autocorrected text messages',
                    description:
                        'Funny or absurd text message conversations resulting from autocorrect errors, leading to humorous misunderstandings, nonsensical conversations, or unintentional humor.',
                },
                {
                    id: 66,
                    name: 'Comical encounters with medical professionals',
                    description:
                        'Amusing or lighthearted interactions, anecdotes, or experiences involving doctors, nurses, or medical professionals, often involving humorous diagnoses, medical humor, or funny patient-doctor exchanges.',
                },
                {
                    id: 67,
                    name: 'The absurdity of self-checkout machines',
                    description:
                        'Humorous or frustrating experiences, mishaps, or comical encounters that occur when using self-checkout machines at stores, highlighting the challenges, glitches, or unintended consequences of the automated systems.',
                },
                {
                    id: 68,
                    name: 'Funny experiences with misheard lyrics',
                    description:
                        'Amusing or entertaining instances where lyrics to songs are misheard or misinterpreted, leading to humorous renditions, nonsensical interpretations, or comical sing-alongs.',
                },
                {
                    id: 69,
                    name: "The challenges of assembling children's toys",
                    description:
                        "Humorous or exasperating experiences encountered when trying to assemble children's toys or playsets, often involving confusing instructions, countless parts, or comically complex designs.",
                },
                {
                    id: 70,
                    name: 'Awkward encounters with neighbors',
                    description:
                        'Uncomfortable or humorous situations that arise when unexpectedly meeting or interacting with neighbors, including comical small talk, noise complaints, or quirky neighborly exchanges.',
                },
                {
                    id: 71,
                    name: 'Funny experiences with video conference calls',
                    description:
                        'Amusing or comical incidents, mishaps, or unexpected moments that occur during video conference calls, such as technical difficulties, funny backgrounds, or humorous interruptions.',
                },
                {
                    id: 72,
                    name: 'The hilarity of group chats',
                    description:
                        'Humorous or entertaining conversations, exchanges, or misunderstandings that take place within group chat conversations, leading to comical banter, inside jokes, or amusing reactions.',
                },
                {
                    id: 73,
                    name: 'Embarrassing moments on social media',
                    description:
                        'Humiliating or comical incidents, blunders, or embarrassing posts shared on social media platforms, leading to funny comments, awkward situations, or comical virtual interactions.',
                },
                {
                    id: 74,
                    name: 'Silly mishaps with outdoor activities',
                    description:
                        'Funny or comical incidents, mistakes, or unexpected situations encountered while participating in outdoor activities, such as camping, hiking, or sports, leading to humorous outcomes or unconventional experiences.',
                },
                {
                    id: 75,
                    name: 'The absurdity of fashion emergencies',
                    description:
                        'Humorous or exaggerated situations or mishaps related to fashion emergencies, such as wardrobe malfunctions, clothing mishaps, or comical attempts to fix unexpected fashion dilemmas.',
                },
                {
                    id: 76,
                    name: 'Getting Motivated',
                    description:
                        'Humorous or exaggerated situations or mishaps related to fashion emergencies, such as wardrobe malfunctions, clothing mishaps, or comical attempts to fix unexpected fashion dilemmas.',
                },
                {
                    id: 77,
                    name: 'Motivational speech',
                    description:
                        'Humorous or exaggerated situations or mishaps related to fashion emergencies, such as wardrobe malfunctions, clothing mishaps, or comical attempts to fix unexpected fashion dilemmas.',
                },
            ],
            environments: [
                {
                    id: '1',
                    name: 'Busy Cafe',
                    description:
                        'Surrounded by the ambient sounds of clinking cups and murmurs of conversation, a character finds themselves in a bustling cafe, taking advantage of the vibrant atmosphere to share their thoughts, musings, or philosophical ponderings.',
                },
                {
                    id: '2',
                    name: 'Late Night Show',
                    description: '',
                },
                {
                    id: '3',
                    name: 'Funeral',
                    description: '',
                },
                {
                    id: '4',
                    name: 'Beach',
                },
                {
                    id: '5',
                    name: 'Graveyard',
                },
                {
                    id: '5',
                    name: 'City Rooftop',
                },
                {
                    id: '6',
                    name: 'Camp Fire',
                },
            ],
            availableCharacterList: [
                'Brian Regan',
                'Cardi B',
                'Jennifer Lawrence',
                'Barack Obama',
                'Lady Gaga',
                'Lloyd Christmas',
                'Ricky Gervais',
                'Joe Biden',
                'Ray Ramano',
                'Louis CK',
                'Tim Allen',
                'Norm MacDonald',
                'Joan Cusack',
                'Jennifer Collidge',
                'Roseanne Barr',
                'Aubrey Plaza',
                'Adam Sandler',
                'Bill Maher',
                'Sebastian Maniscalco',
                'Miley Cyrus',
                'Abe Reese',
                'David Lynch',
                'Leonardo DiCaprio Wolf of Wallstreet',
                'Donald Trump',
                'Kelly Ripa',
                'Bill Burr',
                'Tom Hanks',
                'Drew Barrymore',
                'Melissa Villasenor',
            ],
            characters: [
                {
                    id: '1',
                    display: 'Brian Regan',
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Brian_Regan.png',
                    },
                    voice: { name: 'Brian Regan' },
                },
                {
                    id: '2',
                    display: 'Cardi B',
                    voice: {
                        name: 'Cardi B',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Cardi_B.png',
                    },
                },
                {
                    id: '3',
                    display: 'Jennifer Lawrence',
                    voice: {
                        name: 'Jennifer Lawrence',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Lawrence.png',
                    },
                },
                {
                    id: '4',
                    display: 'Barack Obama',
                    voice: {
                        name: 'Barack Obama',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Barack_Obama.png',
                    },
                },
                {
                    id: '5',
                    display: 'Lady Gaga',
                    voice: {
                        name: 'Lady Gaga',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lady_Gaga.png',
                    },
                },
                {
                    id: '6',
                    display: 'Lloyd Christmas',
                    voice: {
                        name: 'Lloyd Christmas',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Lloyd_Christmas.png',
                    },
                },
                {
                    id: '7',
                    display: 'Ricky Gervais',
                    voice: {
                        name: 'Ricky Gervais',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ricky_Gervais.png',
                    },
                },
                {
                    id: '8',
                    display: 'Joe Biden',
                    voice: {
                        name: 'Joe Biden',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joe_Biden.png',
                    },
                },
                {
                    id: '9',
                    display: 'Ray Ramano',
                    voice: {
                        name: 'Ray Ramano',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Ray_Ramano.png',
                    },
                },
                {
                    id: '10',
                    display: 'Louis CK',
                    voice: {
                        name: 'Louis CK',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Louis_CK.png',
                    },
                },
                {
                    id: '11',
                    display: 'Tim Allen',
                    voice: {
                        name: 'Tim Allen',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tim_Allen.png',
                    },
                },
                {
                    id: '12',
                    display: 'Norm MacDonald',
                    voice: {
                        name: 'Norm MacDonald',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Norm_MacDonald.png',
                    },
                },
                {
                    id: '13',
                    display: 'Joan Cusack',
                    voice: {
                        name: 'Joan Cusack',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Joan_Cusack.png',
                    },
                },
                {
                    id: '14',
                    display: 'Jennifer Collidge',
                    voice: {
                        name: 'Jennifer Collidge',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Jennifer_Collidge.png',
                    },
                },
                {
                    id: '15',
                    display: 'Roseanne Barr',
                    voice: {
                        name: 'Roseanne Barr',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Roseanne_Barr.png',
                    },
                },
                {
                    id: '16',
                    display: 'Aubrey Plaza',
                    voice: {
                        name: 'Aubrey Plaza',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Aubrey_Plaza.png',
                    },
                },
                {
                    id: '17',
                    display: 'Adam Sandler',
                    voice: {
                        name: 'Adam Sandler',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Adam_Sandler.png',
                    },
                },
                {
                    id: '18',
                    display: 'Bill Maher',
                    voice: {
                        name: 'Bill Maher',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Maher.png',
                    },
                },
                {
                    id: '19',
                    display: 'Sebastian Maniscalco',
                    voice: {
                        name: 'Sebastian Maniscalco',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Sebastian_Maniscalco.png',
                    },
                },
                {
                    id: '20',
                    display: 'Miley Cyrus',
                    voice: {
                        name: 'Miley Cyrus',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Miley_Cyrus.png',
                    },
                },
                {
                    id: '21',
                    display: 'Abe Reese',
                    voice: {
                        name: 'Abe Reese',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Abe_Reese.png',
                    },
                },
                {
                    id: '22',
                    display: 'David Lynch',
                    voice: {
                        name: 'David Lynch',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/David_Lynch.png',
                    },
                },
                {
                    id: '23',
                    display: 'Leonardo DiCaprio Wolf of Wallstreet',
                    voice: {
                        name: 'Leonardo DiCaprio Wolf of Wallstreet',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Leonardo_DiCaprio_Wolf_of_Wallstreet.png',
                    },
                },
                {
                    id: '24',
                    display: 'Donald Trump',
                    voice: {
                        name: 'Donald Trump',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Donald_Trump.png',
                    },
                },
                {
                    id: '25',
                    display: 'Kelly Ripa',
                    voice: {
                        name: 'Kelly Ripa',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Kelly_Ripa.png',
                    },
                },
                {
                    id: '26',
                    display: 'Bill Burr',
                    voice: {
                        name: 'Bill Burr',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Bill_Burr.png',
                    },
                },
                {
                    id: '27',
                    display: 'Tom Hanks',
                    voice: {
                        name: 'Tom Hanks',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Tom_Hanks.png',
                    },
                },
                {
                    id: '28',
                    display: 'Drew Barrymore',
                    voice: {
                        name: 'Drew Barrymore',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Drew_Barrymore.png',
                    },
                },
                {
                    id: '29',
                    display: 'Melissa Villasenor',
                    voice: {
                        name: 'Melissa Villasenor',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                    },
                },
                {
                    id: '30',
                    display: 'Steve Jobs',
                    voice: {
                        name: 'Steve Jobs',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                    },
                },
                {
                    id: '31',
                    display: 'Jason Calacanis',
                    voice: {
                        name: 'Jason Calacanis',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                    },
                },
                {
                    id: '32',
                    display: 'Lex Fridman',
                    voice: {
                        name: 'Lex Fridman',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                    },
                },
                {
                    id: '33',
                    display: 'Jesus',
                    voice: {
                        name: 'Lex Fridman',
                    },
                    avatar: {
                        src:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                        maskSrc:
                            'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/images/coaches/cutouts/Melissa_Villasenor.png',
                    },
                },
            ],
            voices: [
                {
                    voice_id: '21m00Tcm4TlvDq8ikWAM',
                    name: 'Rachel',
                },
                {
                    voice_id: 'AZnzlk1XvdvUeBnXmlld',
                    name: 'Domi',
                },
                {
                    voice_id: 'ErXwobaYiN019PkySvjV',
                    name: 'Antoni',
                },
                {
                    voice_id: 'MF3mGyEYCl7XYWbV9V6O',
                    name: 'Elli',
                },
                {
                    voice_id: 'TxGEqnHWrfWFTfGW9XjX',
                    name: 'Josh',
                },
                {
                    voice_id: 'VR6AewLTigWG4xSOukaG',
                    name: 'Arnold',
                },
                {
                    voice_id: 'pNInz6obpgDQGcFmaJgB',
                    name: 'Adam',
                },
                {
                    voice_id: 'yoZ06aMxZJJ28mfd3POQ',
                    name: 'Sam',
                },
            ],
            avatarSrcs: [
                'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Female.glb',
                'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/Transfer_Thought_Media/avatars/models/Male.glb',
            ],

            examples: [
                {
                    src:
                        'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/Transfer_Thought_Media/environments/Random/1871Stage.jpg',
                    prompt: 'Comedy Club',
                },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360%20panorama%20photograph%20equirectangular%20projection%20monoscopic%20VR%20of%20A%20synthwave%20style%20sunset%20above%20the%20reflecting%20water%20of%20the%20sea,%20digital%20art.-aCse.jpg?360_request',
                //     prompt: 'A synthwave style sunset above the reflecting water of the sea, digital art',
                // },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of A digital art depiction of an otherworldly landscape with floating islands, bizarre plant life, and curious alien creatures roaming the terrain.-WpUB.jpg',
                //     prompt:
                //         'A digital art depiction of an otherworldly landscape with floating islands, bizarre plant life, and curious alien creatures roaming the terrain',
                // },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of A captivating 3D render of a crystal cave illuminated by glowing gemstones and mysterious ethereal light.-1qvJ.jpg',
                //     prompt: 'A captivating 3D render of a crystal cave illuminated by glowing gemstones and mysterious ethereal light',
                // },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of  A 3D render of a futuristic sports arena filled with cheering fans and high-tech robotic athletes competing in a thrilling match.-TuFQ.jpg',
                //     prompt: ' A 3D render of a futuristic sports arena filled with cheering fans and high-tech robotic athletes competing in a thrilling match',
                // },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of A 3D render of a vast, surreal desert landscape showcasing enormous, sculpted sand dunes and a vibrant, star-filled night sky.-LKtd.jpg',
                //     prompt: 'A 3D render of a vast, surreal desert landscape showcasing enormous, sculpted sand dunes and a vibrant, star-filled night sky',
                // },

                // {
                //     prompt:
                //         'A digital art representation of a post-apocalyptic city, reclaimed by nature, with towering, overgrown skyscrapers and wildlife roaming the once-busy streets',
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of A digital art representation of a post-apocalyptic city, reclaimed by nature, with towering, overgrown skyscrapers and wildlife roaming the once-busy streets.-87HC.jpg',
                // },
                // {
                //     src:
                //         'https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.amazonaws.com/public/dall-e/360 panorama photograph equirectangular projection monoscopic VR of A serene 3D render of an underwater coral reef with a diverse array of colorful marine life.-2K05.jpg',
                //     prompt: 'A serene 3D render of an underwater coral reef with a diverse array of colorful marine life',
                // },
            ],
        };
    },
    watch: {
        selectedCharacterId() {
            const newMaskSrc = this.selectedCharacter.avatar.maskSrc;
            const newAvatarSrc = this.selectedCharacter.avatar.src;
            const newSrcModelType = getModelType(newAvatarSrc);
            const newSrcDefaultTexture = getDefaultTexture(newSrcModelType);
            this.$store.dispatch('steps/updateEntity', {
                entityId: 'character_1',
                newData: { src: newAvatarSrc, modelType: newSrcModelType, texture: newSrcDefaultTexture, maskSrc: newMaskSrc, action: 'idle1' },
            });
        },
        selectedCharacterId2() {
            const newMaskSrc = this.selectedCharacter2.avatar.maskSrc;
            const newAvatarSrc = this.selectedCharacter2.avatar.src;
            const newSrcModelType = getModelType(newAvatarSrc);
            const newSrcDefaultTexture = getDefaultTexture(newSrcModelType);
            this.$store.dispatch('steps/updateEntity', {
                entityId: 'character_2',
                newData: { src: newAvatarSrc, modelType: newSrcModelType, texture: newSrcDefaultTexture, maskSrc: newMaskSrc, action: 'idle1' },
            });
        },
    },
    computed: {
        ...mapState({
            app: (state) => state.apps,
            state: (state) => state.apps.state.state,
            actions: (state) => state.apps.actions.actions,
            user: (state) => state.user.user,
        }),
        selectedCharacter() {
            return this.characters.find((c) => c.id === this.selectedCharacterId);
        },
        selectedCharacter2() {
            return this.characters.find((c) => c.id === this.selectedCharacterId2);
        },
        selectedEnvironment() {
            return this.environments.find((e) => e.id === this.selectedEnvironmentId);
        },
        selectedStyle() {
            return this.styles.find((s) => s.id === this.selectedStyleId);
        },
        selectedTopic() {
            return this.topics.find((t) => t.id === this.selectedTopicId);
        },
        // characters() {
        //     const c = this.availableCharacterList.map((name, index) => {
        //         return {
        //             id: index + 1 + '',
        //             display: name,
        //             maskSrc: `${this.cutoutBaseUrl}${name.replaceAll(' ', '_')}.png`,
        //             voice: {
        //                 name,
        //             },
        //         };
        //     });
        //     console.log(JSON.stringify(c));
        //     return c;
        // },
    },
    async mounted() {
        await this.$store.dispatch('apps/initApp', { app: this.newApp });
        this.random();

        this.interval = setInterval(() => {
            if (this.loading) {
                // Every few seconds, randomly go up by 0 - 2%
                this.loadingValue += Math.random() * 2;
            }
        }, 2000);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        copyValue(value) {
            navigator.clipboard.writeText(value);
            this.$store.commit('apps/snackMessage', {
                message: 'Link Copied',
                color: 'success',
            });
        },
        async handleSceneLoaded() {
            await this.$store.dispatch('steps/init');
        },
        async reset() {
            // this.selectedCharacterId = null;
            this.state.steps.forEach((step) => {
                if (step.id !== 'TT_DEFAULT_ENVIRONMENT') {
                    this.$store.dispatch('steps/deleteStep', step.id);
                }
            });
        },
        async preLoadAudioFiles() {
            const promises = this.state.steps.map(async (step) => {
                return TextToSpeech.getAudioFile(step.data.transcript, step?.data?.voice || this.state.coach.voice);
            });
            return Promise.all(promises);
        },
        async save() {
            console.log('app', this.app);
            const app = await this.$store.dispatch('apps/createApp', {
                name: this.app.name,
                config: JSON.stringify(this.app.config.config),
                actions: JSON.stringify(this.app.actions.actions),
                state: JSON.stringify(this.app.state.state),
                thumbnailUrl: this.app.thumbnailUrl,
            });
            debugger;
            this.$store.commit('apps/setAppId', app.appId);
            await this.$store.dispatch('apps/publishApp');

            // const currentUrl = new URL(window.location);
            // window.open(`${currentUrl.origin}/take/${app.appId}`);
            // this.$router.push({ name: 'take', params: { appId: app.appId } });
        },
        async random() {
            const randomElement = this.examples[Math.floor(Math.random() * this.examples.length)];

            this.promptValue = randomElement.prompt;

            this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: randomElement.src } });
        },
        download() {
            const { src } = this.state.currentEnvironment.data;
            const filename = 'Imagine_This.jpg';
            fetch(src)
                .then((response) => response.blob())
                .then((blob) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .catch(console.error);
        },
        async generate() {
            this.showPublishDialog = true;
            this.showErrorMessage = false;
            this.loading = true;
            this.loadingValue = 10;

            // const [result] = await Client.OpenAI.createChatCompletion([
            //     {
            //         role: 'system',
            //         content: `Generate a script word script from a prompt:
            // Use the following format:
            // Prompt: <the prompt for creating a script>
            // Setting: <a 30 word description of the setting the scene takes place, be as descriptive as possible. Describe it in a way someone could picture it if they have never heard of anything in the script. Do not use names people would not understand.>
            // Narration: <any thing that should be narrated to know what is going on>
            // <character name>: <anything a character says during the scene>`,
            //     },
            //     {
            //         role: 'user',
            //         content: `Prompt: <${this.promptValue}>`,
            //     },
            // ]);

            //             const [result] = await Client.OpenAI.createChatCompletion([
            //                 {
            //                     role: 'system',
            //                     content: `Generate a 200 word monologue from a prompt:
            // Use the following prompt format:
            // Character: <a description of the character in the scene>
            // Topic: <the topic to be covered in the monologue>
            // Style: <the style of the monologue>
            // References: <any distinct references that should be made in the monologue>

            // Use the following format for your response:
            // <character name>: <the first 25 words of the monologue>
            // <character name>: <the second 25 words of the monologue>
            // <character name>: <the third 25 words of the monologue>
            // ...

            // It is important to make sure it is only 200 words long.`,
            //                 },
            //                 {
            //                     role: 'user',
            //                     content: `Character: <${this.selectedCharacter.display}>
            // Topic: <${this.selectedTopic.name}>
            // Style: <${this.selectedStyle.name}>
            // References: <${this.references}>`,
            //                 },
            //             ]);

            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate a 200 word dialog from a prompt:
Use the following prompt format:
Character1: <the first character in the scene>
Character2: <the second character in the scene>
Topic: <the topic to be covered in the monologue>
Style: <the style of the monologue>
References: <any distinct references that should be made in the monologue>

Use the following format for your response:
<character name>: <anything a character says during the scene. Make sure it is 25 words or less>
...

It is important to make sure it is only 200 words long.`,
                },
                {
                    role: 'user',
                    content: `Character1: <${this.selectedCharacter.display}>
Character2: <${this.selectedCharacter2.display}>
Topic: <${this.selectedTopic.name}>
Style: <${this.selectedStyle.name}>
References: <${this.references}>`,
                },
            ]);

            const splitResult = result.message.content
                .split('\n')
                .filter((s) => s.length)
                .map((s) => s.split(':'));

            const [setting, dialog] = _.partition(splitResult, (result) => result[0] === 'Setting');

            try {
                // const prompt = `360 panorama photograph equirectangular projection monoscopic VR of ${setting[1]}.`;
                // const prompt = setting[0][1];
                // const result = await Client.OpenAI.create360Image(prompt, 'blockade');

                // this.$store.dispatch('steps/updateStepDataById', { id: 'TT_DEFAULT_ENVIRONMENT', newData: { src: result.src } });

                // const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                // const normalPosition2 = new THREE.Vector3(1, 0, -1).normalize();
                // const normalPosition3 = new THREE.Vector3(0.5, 0, -0.5).normalize();
                // const normalPosition4 = new THREE.Vector3(0.5, 0, 0.5).normalize();
                // const normalPositions = [normalPosition1, normalPosition2, normalPosition3, normalPosition4];

                // // Get the uniq characters
                // const characters = _.keyBy(dialog, (data) => data[0]);
                // let characterIterator = 0;

                // Object.keys(characters).forEach((character) => {
                //     const randomVoice = this.voices[Math.floor(Math.random() * this.voices.length)];
                //     characters[character].push(randomVoice.name);
                //     const position = normalPositions[characterIterator].clone().multiplyScalar(75);
                //     characterIterator += 1;
                //     if (characterIterator > 3) {
                //         characterIterator = 0;
                //     }
                //     this.$store.dispatch('steps/createAvatar', { src: this.avatarSrcs[Math.floor(Math.random() * this.avatarSrcs.length)], position });
                //     characters[character].push(position);
                // });

                // document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: false');

                // const normalPosition1 = new THREE.Vector3(0, 0, -1).normalize();
                // const position = normalPosition1.clone().multiplyScalar(75);
                // this.$store.dispatch('steps/createImage', { src: this.selectedCharacter.imageSrc, position });

                const dialogPromises = dialog.map(async (data) => {
                    // const character = characters[data[0]];
                    // const voice = character[2];

                    // document.getElementById('camera').object3D.lookAt(character[3]);
                    // const newRotation = {
                    //     x: 0,
                    //     y: _.round(THREE.MathUtils.radToDeg(document.getElementById('camera').object3D.rotation.y), 2) - 180,
                    //     z: 0,
                    // };
                    const clonedStep = await this.$store.dispatch('steps/cloneStep', 'TT_DEFAULT_ENVIRONMENT');
                    const newStep = await this.$store.dispatch('steps/addStep', { step: clonedStep });

                    const currentStepCharacter = this.characters.find((c) => {
                        return c.display === data[0];
                    });
                    debugger;

                    await this.$store.dispatch('steps/updateStepById', { id: newStep.id, newData: { name: data[0] } });
                    await this.$store.dispatch('steps/updateStepDataById', {
                        id: newStep.id,
                        newData: {
                            transcript: data[1],
                            voice: currentStepCharacter.voice.name,
                            // rotation: newRotation,
                        },
                    });
                });
                await Promise.all(dialogPromises);
                await this.save();
                await this.preLoadAudioFiles();
                await this.reset();

                // document.getElementById('camera').setAttribute('tt-look-controls', 'enabled: true');
                this.loading = false;
            } catch (err) {
                this.loading = false;
                this.showErrorMessage = true;
            }
        },
    },
};
</script>

<style></style>
