<template>
    <fragment>
        <AdminToolBar>
            <template slot="Title">
                <h5 class="">
                    My Account
                </h5>
            </template>
        </AdminToolBar>
        <v-main fill-height>
            <v-container>
                <div class="font-weight-bold mb-5 text--secondary">
                    My Account
                </div>
                <v-card class="mx-auto pa-5 mb-5" outlined>
                    <v-row>
                        <v-col>
                            <label class="label-color font-weight-600 mb-2 d-block">Email:</label>
                            {{ user.attributes.email }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <label class="label-color font-weight-600 mb-2 d-block">Log out of all devices:</label>
                            <v-btn outlined color="red" class="text-capitalize" @click="signOut">
                                Log Out
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
                <v-row class="mb-2">
                    <v-col>
                        <div class="font-weight-bold text--secondary">
                            Plans
                        </div>
                        <div class="text--secondary">You have used {{ userData.currentMonthViews }} of your {{ alottedPlanViews }} views this month.</div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card class="mx-auto" outlined>
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5 text-uppercase font-weight-bold text--secondary">
                                        Pilot
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-h5">
                                        Build free forever
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-card-text>
                                <v-row align="center">
                                    <v-col class="text-h4 font-weight-bold" cols="6">
                                        FREE
                                    </v-col>
                                    <v-col cols="3">
                                        <v-btn v-if="userData.plan === 'pilot'" outlined disabled color="primary" class="text-capitalize">
                                            Current Plan
                                        </v-btn>
                                        <v-btn v-else outlined class="text-capitalize" color="primary" @click="updatePlan('pilot')">
                                            Downgrade to Pilot
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited courses
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited views
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            10 ad free views
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            1 GB asset storage
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Email Support
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="mx-auto" outlined>
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5 text-uppercase font-weight-bold text--secondary">
                                        Pro
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-h5">
                                        Perfect for small business
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-card-text>
                                <v-row align="center">
                                    <v-col class="text-h4 font-weight-bold" cols="6">
                                        $99/m
                                    </v-col>
                                    <v-col cols="6">
                                        <v-btn
                                            v-if="userData.plan === 'pilot'"
                                            depressed
                                            color="primary"
                                            class="text-capitalize white--text"
                                            @click="updatePlan('pro')"
                                        >
                                            Start 21 Day Trial
                                        </v-btn>
                                        <v-btn v-if="userData.plan === 'pro'" depressed disabled color="primary" class="text-capitalize white--text">
                                            Current Plan
                                        </v-btn>
                                        <v-btn
                                            v-if="userData.plan === 'enterprise'"
                                            depressed
                                            color="primary"
                                            class="text-capitalize white--text"
                                            @click="updatePlan('pro')"
                                        >
                                            Downgrade to Pro
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited courses
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited views
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            2,500 ad free views
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            10 GB asset storage
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Email + Phone Support
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="mx-auto" outlined>
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5 text-uppercase font-weight-bold text--secondary">
                                        Enterprise
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-h5">
                                        Large Enterprise-Ready
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-card-text>
                                <v-row align="center">
                                    <v-col class="text-h4 font-weight-bold" cols="6">
                                        $1,000/m
                                    </v-col>
                                    <v-col cols="6">
                                        <v-btn v-if="userData.plan === 'enterprise'" outlined disabled color="primary" class="text-capitalize">
                                            Current Plan
                                        </v-btn>
                                        <v-btn v-else outlined color="primary" class="text-capitalize" @click="updatePlan('enterprise')">
                                            Contact Us!
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited courses
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Unlimited views
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            1 TB asset storage
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Project Managment Services
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-icon>
                                        <v-icon color="green">
                                            mdi-check-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            Email + Phone Priority Support
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <v-dialog v-model="showPlanChangeModal" width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="font-weight-bold white--text">
                        {{ planChangeTitle }}
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text v-show="!!planChangeMessage" class="font-weight-bold body-1 card-padding" v-html="planChangeMessage" />
                <v-card-actions class="pt-3">
                    <v-spacer />
                    <v-btn color="primary" class="body-2 font-weight-bold text-capitalize" outlined @click="showPlanChangeModal = false">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </fragment>
</template>

<script>
/* eslint-disable no-undef */

import AdminToolBar from '@/components/AdminToolBar.vue';
import { mapState } from 'vuex';

export default {
    name: 'Account',
    components: {
        AdminToolBar,
    },
    data() {
        return {
            showPlanChangeModal: false,
            planChangeMessage: '',
            planChangeTitle: '',
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
            userData: (state) => state.user.data,
        }),

        alottedPlanViews() {
            if (this.userData.plan === 'pilot') {
                return 10;
            }
            if (this.userData.plan === 'pro') {
                return 2500;
            }
            return 'Unlimited';
        },
    },
    async mounted() {
        if (this.$route.query.cs) {
            await this.$store.dispatch('user/updateUserPlan', { plan: 'pro' });
            this.updateShowPlanChangeModal();
            this.$router.replace({ 'query.cs': null });
        }
    },
    methods: {
        async signOut() {
            await this.$store.dispatch('user/signOut');
            this.$router.push({ name: 'signin' });
        },
        async updatePlan(plan) {
            if (plan === 'enterprise') {
                // FreshworksWidget('prefill', 'ticketForm', {
                //     subject: 'Upgrade to Enterprise',
                //     description: 'Upgrade my plan to Enterprise',
                // });
                // FreshworksWidget('open');
            } else if (plan === 'pro') {
                this.$router.push({ name: 'Checkout' });
                // await this.$store.dispatch('user/updateUserPlan', { plan });
                // this.updateShowPlanChangeModal();
            } else {
                await this.$store.dispatch('user/updateUserPlan', { plan });
                this.updateShowPlanChangeModal();
            }
        },
        updateShowPlanChangeModal() {
            this.showPlanChangeModal = true;
            if (this.userData.plan === 'pilot') {
                this.planChangeTitle = 'Pilot Tier';
                this.planChangeMessage = 'You have been successfully downgraded to pilot tier.';
            } else if (this.userData.plan === 'pro') {
                this.planChangeTitle = 'Pro Tier';
                this.planChangeMessage = 'Success! Your 21 day trial of pro tier has started!';
                fetch('https://transferthought.freshdesk.com/api/v2/tickets', {
                    body: `{"description": "${this.user.attributes.email} has upgraded their plan to pro tier.","subject": "Plan Upgrade","email": "${this.user.attributes.email}"}`,
                    headers: {
                        Authorization: 'Basic eHRpRDNpdG9SZHhmM0FUWEZOQzpY',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                });
            }
        },
    },
};
</script>
