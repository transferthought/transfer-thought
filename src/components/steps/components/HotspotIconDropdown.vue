<template>
    <v-select :items="options" class="mx-4" :value="value" dense hide-details outlined @change="handleSelectionChange">
        <template v-slot:selection="{ item }">
            <v-icon class="mr-2">
                {{ item.value }}
            </v-icon>
            {{ item.text }}
        </template>
        <template v-slot:item="{ item }">
            <v-list-item-icon>
                <v-icon>
                    {{ item.value }}
                </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>
                    {{ item.text }}
                </v-list-item-title>
            </v-list-item-content>
        </template>
    </v-select>
</template>
<script>
export default {
    name: 'HotspotIconDropdown',
    components: {},
    props: {
        value: String,
    },
    data() {
        return {
            options: [
                { value: 'border_clear', text: 'Empty' },
                { value: 'radio_button_unchecked', text: 'Circle' },
                { value: 'block', text: 'Block' },
                { value: 'touch_app', text: 'Touch Here' },
                { value: 'directions_walk', text: 'Walk' },
                { value: 'info', text: 'Info' },
                { value: 'arrow_upward', text: 'Up' },
                { value: 'arrow_forward', text: 'Right' },
                { value: 'arrow_downward', text: 'Down' },
                { value: 'arrow_back', text: 'Left' },
                { value: 'visibility', text: 'Visibility' },
                { value: 'visibility_off', text: 'Visibility Off' },
                { value: 'thumb_up', text: 'Thumbs Up' },
                { value: 'thumb_down', text: 'Thumbs Down' },
            ],
        };
    },
    computed: {},
    methods: {
        handleSelectionChange(newType) {
            this.$emit('change', newType);
        },
    },
};
</script>

<style scoped></style>
