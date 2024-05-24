<template>
    <fragment>
        <!-- <v-img height="100" contain src="https://tt-assets-us-east-1.s3.amazonaws.com/assets/images/tt-logo.png" /> -->
        <!-- Hero Section -->
        <v-sheet
            height="300"
            :color="page.data.primaryColor"
            dark
            :style="{ 'background-image': 'url(' + page.data.coverSrc + ')', 'background-position': `right 0 bottom ${page.data.coverYOffset}%` }"
        ></v-sheet>
        <v-container>
            <v-row class="mx-5">
                <v-col md="3" cols="12">
                    <v-row justify="center">
                        <v-spacer></v-spacer>
                        <v-col>
                            <v-avatar class="page-avatar" size="200" :style="{ background: 'white' }">
                                <v-img cover :src="page.data.logoSrc"></v-img>
                            </v-avatar>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-col>
                <v-col md="9" cols="12" class="mt-5">
                    <v-row>
                        <v-col class="py-0">
                            <h3 class="text-h4 text-md-h3 text-center text-md-left font-weight-bold">{{ page.title }}</h3>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            <p class="text-subtitle-1 text-center text-md-left" v-html="page.data.description"></p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <!-- Main Content -->
        <v-container class="pt-16">
            <v-row align="center">
                <v-col>
                    <h4 class="text-h5 text-md-h4 font-weight-bold">{{ page.data.appListTitle }}</h4>
                </v-col>
            </v-row>
            <!-- List of Courses -->
            <v-row v-if="page.apps && page.apps.length">
                <v-col v-for="pageApp in page.apps" :key="pageApp.id" cols="12" md="4">
                    <PageAppCard :pageApp="pageApp" />
                </v-col>
            </v-row>
            <v-row v-else justify="center">
                <v-col cols="12">
                    <EmptyMessage
                        title="Nothing here yet"
                        description="Tip: you can add courses to this page inside the page editor or inside the app editor"
                    />
                </v-col>
            </v-row>
        </v-container>
    </fragment>
</template>

<script>
import PageAppCard from '../PageAppCard.vue';
import EmptyMessage from '@/components/EmptyMessage.vue';
export default {
    components: { EmptyMessage, PageAppCard },
    data() {
        return {};
    },
    props: {
        page: Object,
    },
    methods: {},
};
</script>

<style scoped>
.v-sheet {
    /* background-image: url('https://tt-assets-us-east-1.s3.amazonaws.com/assets/TT/default_thumbnail.jpg'); */
    background-size: cover;
    background-position: center center;
    color: white; /* Adjust text color for better visibility */
}

.hero-text {
    text-shadow: 1px 1px 5px #060606;
}

.page-avatar {
    margin-top: -100px;
    border: white solid 5px;
}
</style>
