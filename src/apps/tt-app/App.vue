<template>
    <div>
        <v-app id="app">
            <div id="app-router">
                <router-view />
            </div>
            <portal-target
                class="screen-overlay"
                name="screen-overlay"
            />
        </v-app>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        source: String,
    },
};
</script>

<style>
.screen-overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index:1;
}
.screen-overlay  * {
    pointer-events: auto;
}
</style>
