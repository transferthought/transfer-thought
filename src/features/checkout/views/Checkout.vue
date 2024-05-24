<template>
    <v-main fill-height>
        <div class="text-center"></div>
    </v-main>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'Checkout',
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),
    },
    watch: {},
    async mounted() {
        if (this.userData.plan === 'pro') {
            this.$router.push({ name: 'Account' });
        } else {
            let queryString = `?client_reference_id=${this.userData.id}`;
            if (this.user?.attributes?.email) {
                queryString += `&prefilled_email=${this.user.attributes.email}`;
            }
            window.open(`https://buy.stripe.com/3csaHj3W860I7kc3cq${queryString}`, '_self');
            // use the below for testing
            // window.open(
            //     'https://buy.stripe.com/test_dR628K67egaB1yMdQQ?prefilled_email=support%40transferthought.com&client_reference_id=88517643-0f30-4847-b045-818759f5f1a9',
            //     '_self'
            // );
        }
    },
    methods: {},
};
</script>

<style></style>
