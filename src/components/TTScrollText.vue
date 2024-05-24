<template>
    <div
        class="text-container"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
    >
        <ScrollText
            v-if="hovering"
        >
            {{ text }} <span class="px-12" />
        </ScrollText>
        <span
            v-else
            class="full-text"
        >{{ text }}</span>
    </div>
</template>

<script>
import ScrollText from '@/components/ScrollText.vue';

export default {
    name: 'TTScrollText',
    components: {
        ScrollText,
    },
    props: {
        text: {
            type: String,
            default: '',
        },
        duration: {
            type: Number,
            default: 15,
        },
        repeat: {
            type: Number,
            default: 2,
            validator(val) {
                return val > 0;
            },
        },
        reverse: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            hovering: false,
        };
    },
};
</script>
<style scoped>
.text-container {
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
