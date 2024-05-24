<template>
    <div class="assets">
        <AssetViewer />
    </div>
</template>

<script>
import AssetViewer from '@/features/assets/AssetViewer.vue';

export default {
    name: 'Assets',
    components: {
        AssetViewer,
    },
};
</script>
