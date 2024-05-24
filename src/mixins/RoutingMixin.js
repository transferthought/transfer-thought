export default {
    data: {},
    methods: {
        getRouteHref(name, params) {
            const routeData = this.$router.resolve({ name, params });
            return routeData.href;
        },
        to(name, params, newWindow) {
            if (newWindow) {
                window.open(this.getRouteHref(name, params), '_blank');
            } else {
                this.$router.push({ name, params });
            }
        },
    },
};
