<template>
    <v-item-group>
        <v-btn>Edit Avatar</v-btn>
        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs"><v-icon>arrow_drop_down</v-icon></v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <v-list-item-title>Copy from local</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Upload</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-item-group>
</template>

<script>
export default {
    name: 'SplitButton',
    components: {},
    props: [],
    data() {
        return {};
    },
    computed: {
        dialog() {
            return this.openDialog;
        },
    },
    methods: {},
};
</script>

<style></style>
