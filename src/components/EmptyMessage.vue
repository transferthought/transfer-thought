<template>
    <fragment>
        <v-row class="pa-5">
            <v-col>
                <v-icon class="d-flex" style="font-size: 15rem">{{ icon }}</v-icon>
                <h3 class="text-center text-gray text--darken-2">{{ title }}</h3>
                <h5 class="text-center text-gray text--darken-1">{{ description }}</h5>
            </v-col>
        </v-row>
    </fragment>
</template>

<script>
export default {
    name: 'EmptyMessage',
    props: {
        icon: {
            type: String,
            default: 'mdi-select-search',
        },
        title: {
            type: String,
            default: 'Nothing here yet...',
        },
        description: {
            type: String,
            default: 'Once you add something it will show up here',
        },
    },
    data() {
        return {};
    },
};
</script>
<style scoped></style>
