<template>
    <fragment>
        <v-row :justify="justify" no-gutters>
            <v-col cols="11">
                <v-card flat :class="{ 'pa-2 chat-bubble': true, 'float-right': justify === 'end' }">
                    {{ content }}
                </v-card>
            </v-col>
        </v-row>
        <v-row :justify="justify" no-gutters>
            <TextSpeaker :text="content" :autoplay="autoplay" />
        </v-row>
    </fragment>
</template>
<script>
import _ from 'lodash';

import TextSpeaker from '@/components/TextSpeaker';

export default {
    name: 'ChatBubble',
    components: {
        TextSpeaker,
    },
    props: {
        content: String,
        autoplay: {
            type: Boolean,
            default: false,
        },
        justify: {
            type: String,
            default: 'start',
        },
    },
    data() {
        return {};
    },
    computed: {},
};
</script>

<style scoped>
.chat-bubble {
    width: auto;
    max-width: max-content;
}
</style>
