<template>
    <section class="signin section">
        <div class="container">
            <div class="tiles-wrap" :class="[pushLeft && 'push-left']">
                <div v-for="item in items" :key="item.price" class="tiles-item reveal-from-bottom">
                    <div class="tiles-item-inner has-shadow">
                        <div class="pricing-item-content">
                            <div class="pricing-item-header pb-24 mb-24">
                                <div class="pricing-item-price mb-4">
                                    <span class="pricing-item-price-currency h2">$</span>
                                    <span class="pricing-item-price-amount h1">{{ item.amount }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="pricing-item-cta mb-8">
                            <c-button color="primary" wide style="color:white" @click="checkout(item)">
                                Checkout
                            </c-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
// import layout
import CLayout from '@/layouts/LayoutDefault.vue';
import CButton from '@/components/elements/Button.vue';

// eslint-disable-next-line no-undef

const stripeKey = 'Stripe_Key';
const endpointSecret = 'Endpoint_Secret';

const stripe = Stripe(stripeKey);

export default {
    name: 'Home',
    components: { CButton },
    data() {
        return {
            items: [
                { price: 'price_1HU9jjKkbO4OTPrykyLuVT9L', quantity: 1, amount: 500 },
                { price: 'price_1IHe4pKkbO4OTPry9fZ7Poz6', quantity: 1, amount: 1000 },
                { price: 'price_1IHev8KkbO4OTPryZ5vckbVE', quantity: 1, amount: 2000 },
            ],
        };
    },
    created() {
        this.$emit('update:layout', CLayout);
    },
    methods: {
        checkout(item) {
            // When the customer clicks on the button, redirect
            // them to Checkout.
            stripe
                .redirectToCheckout({
                    lineItems: [{ price: item.price, quantity: 1 }],
                    mode: 'payment',
                    // Do not rely on the redirect to the successUrl for fulfilling
                    // purchases, customers may not always reach the success_url after
                    // a successful payment.
                    // Instead use one of the strategies described in
                    // https://stripe.com/docs/payments/checkout/fulfill-orders
                    successUrl: `${window.location.protocol}//transferthought.com`,
                    cancelUrl: `${window.location.protocol}//transferthought.com`,
                })
                .then((result) => {
                    if (result.error) {
                        // If `redirectToCheckout` fails due to a browser or network
                        // error, display the localized error message to your customer.
                        const displayError = document.getElementById('error-message');
                        displayError.textContent = result.error.message;
                    }
                });
        },
    },
};
</script>

<style>
.theme--dark.v-application {
    background: none !important;
}
</style>
