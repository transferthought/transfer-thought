<template>
    <fragment>
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

<style>
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

html {
    background-color: transparent !important;
}
body {
    background-color: transparent !important;
}
.theme--light.v-application {
    background-color: transparent !important;
}
</style>
