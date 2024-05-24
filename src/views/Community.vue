<template>
    <fragment>
        <section
            class="news section"
            :class="[
                topOuterDivider && 'has-top-divider',
                bottomOuterDivider && 'has-bottom-divider',
                hasBgColor && 'has-bg-color',
                invertColor && 'invert-color'
            ]"
        >
            <div class="container">
                <div
                    class="news-inner section-inner"
                    :class="[
                        topDivider && 'has-top-divider',
                        bottomDivider && 'has-bottom-divider'
                    ]"
                >
                    <c-section-header
                        :data="sectionHeader"
                        class="center-content reveal-from-bottom"
                    />
                    <div
                        v-if="demos"
                        class="tiles-wrap"
                        :class="[
                            pushLeft && 'push-left',
                        ]"
                    >
                        <div
                            v-for="(demo, index) in demos"
                            :key="index"
                            class="tiles-item reveal-from-bottom"
                            :data-reveal-delay="200 * index"
                        >
                            <div class="tiles-item-inner has-shadow">
                                <a
                                    class="news-item-image m-0"
                                    :href="runUrl(demo)"
                                    target="blank"
                                >
                                    <c-image
                                        :src="demo.thumbnailUrl"
                                        :alt="demo.name"
                                        :width="344"
                                        :height="194"
                                    />
                                </a>
                                <div class="news-item-content">
                                    <div class="news-item-body">
                                        <h3 class="news-item-title h4 mt-0 mb-8">
                                            <a
                                                :href="runUrl(demo)"
                                                target="blank"
                                            >{{ demo.name }}</a>
                                        </h3>
                                    <!-- <p class="mb-16 text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut et dolore
                                        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex.
                                    </p> -->
                                    </div>
                                <!-- <div class="news-item-more text-xs mb-8">
                                    <a :href="runUrl(demo)" target="blank">View</a>
                                </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </fragment>
</template>

<script>
import CLayout from '@/layouts/LayoutDefault.vue';
import Client from '@/tt-api';
import gql from 'graphql-tag';

import { SectionTilesProps } from '@/utils/SectionProps';
import CSectionHeader from '@/components/sections/partials/SectionHeader.vue';
import CImage from '@/components/elements/Image.vue';

export default {
    components: {
        CSectionHeader,
        CImage,
    },
    mixins: [SectionTilesProps],
    data: () => ({
        sectionHeader: {
            title: 'Demos',
            paragraph: null,
        },
        demos: [{
            id: 'e19335c4-a079-40d9-9cae-9d01de026249',
            name: 'Courtroom Simulator Demo',
            thumbnailUrl: '',
        }, {
            id: '034916ba-551e-468b-ac62-9d70484284e7',
            name: 'Police PTSD Recognition Demo',
            thumbnailUrl: '',
        }, {
            id: 'eb270c60-d2cd-4894-9d6f-930105881a4c',
            name: '360 Ladder Hazard Recognition Demo',
            thumbnailUrl: '',
        }, {
            id: '1b744feb-d063-44a0-a2d5-1dd9691e202d',
            name: '360 Tour Demo',
            thumbnailUrl: '',
        }, {
            id: '4ae5a0fa-cf5d-43df-aec8-fe045d557722',
            name: 'Stealing Bases Simulator Demo',
            thumbnailUrl: '',
        }, {
            id: 'a9831b48-7976-4602-8ab6-7d2d28f281a4',
            name: 'Wine Tasting Virtual Powerpoint',
            thumbnailUrl: '',
        }],

    }),
    created() {
        this.$emit('update:layout', CLayout);
        this.demos.forEach(async (demo, index) => {
            this.fetchDemoThumbnailUrl(demo).then((thumbnailUrl) => {
                this.demos[index].thumbnailUrl = thumbnailUrl;
            });
        });
    },
    methods: {
        async fetchDemoThumbnailUrl(demo) {
            const { data: { getApp: app } } = await Client.Api.query({
                query: gql(Client.Queries.getApp),
                variables: { appId: demo.id, type: 'master' },
            });
            return app.thumbnailUrl;
        },
        runUrl(demo) {
            return `https://app.transferthought.com/embed/${demo.id}`;
        },
    },
};
</script>

<style>
</style>
