<template>
    <div class="white-label">
        <landing-page />
    </div>
</template>

<script>
import LandingPage from '@/components/LandingPage.vue';

export default {
    name: 'WhiteLabel',
    components: {
        LandingPage,
    },
    data() {
        return {
            scene: null,
        };
    },
    methods: {
    },
};
</script>
