<template>
    <v-card flat class="pa-5">
        <p v-if="!$store.getters['user/hasAccess'](`apps.canSetPrivate`)">
            All public content is reviewed by a Transfer Thought agent and may be added to a curated library.

            <UpgradeAccountTooltip :setting="`apps.canSetPrivate`" title="Upgrade to PRO to keep content 100% private." />
        </p>
        <!-- <v-row v-else align="center" class="py-5">
            <v-col cols="4" class="">
                <label class="label-color font-weight-600 mb-2 d-block">
                    Public
                </label>
            </v-col>
            <v-col cols="8">
                <v-checkbox
                    v-model="isPublic"
                    label="All public content is reviewed by a Transfer Thought agent and may be added to a curated library."
                ></v-checkbox>
            </v-col>
        </v-row> -->
        <v-row align="center" class="py-5">
            <v-col cols="4" class="">
                <label class="label-color font-weight-600 mb-2 d-block">Publish to My Landing Pages</label>
            </v-col>
            <v-col cols="8">
                <AppPageSelector :app="resource" />
            </v-col>
        </v-row>
        <!-- <v-divider /> -->

        <!-- <v-row align="center" class="py-5">
            <v-col cols="4" class="">
                <label class="label-color font-weight-600 mb-2 d-block">
                    Publish to Template Library
                </label>
            </v-col>
            <v-col cols="8">
                <v-list-item-group multiple active-class="">
                    <v-list-item>
                        <template v-slot:default="{ active }">
                            <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Transfer Thought Discover</v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-list-item>

                    <v-list-item>
                        <template v-slot:default="{ active }">
                            <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>OSHA</v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-list-item>

                    <v-list-item>
                        <template v-slot:default="{ active }">
                            <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Soft Skills</v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-list-item>
                </v-list-item-group>
            </v-col>
        </v-row>
        <v-divider /> -->
        <!-- <v-row align="center" class="py-5">
            <v-col cols="4" class="">
                <label class="label-color font-weight-600 mb-2 d-block">
                    License Fee
                </label>
            </v-col>
            <v-col cols="8">
                <p>
                    Publishing is free. If you want to charge for this content, simply enter what you’d like to receive. When other users remix your content,
                    you get paid!
                </p>
                <label class="label-color font-weight-600 mb-2 d-block">
                    License Fee
                </label>
                <v-text-field dense :rules="[]" outlined class="" placeholder="0" clearable>
                    <template slot="prepend-inner">
                        <v-icon color="#adb5bd">
                            mdi-currency-usd
                        </v-icon>
                    </template>
                    <template v-slot:append-outer>
                        <v-btn
                            depressed
                            type="submit"
                            :loading="false"
                            color="primary"
                            class="font-weight-600 text-capitalize py-1 px-2 mt-n2"
                            :disabled="!true"
                        >
                            Save
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row> -->
        <!-- <v-row align="center" class="py-5">
            <v-col cols="4" class="">
                <label class="label-color font-weight-600 mb-2 d-block">
                    Public Page Status
                </label>
            </v-col>
            <v-col cols="8">
                <p>
                    Your app has been submitted to the public page directory. If you have any questions, please create a
                    <a href="https://transferthought.freshdesk.com/support/tickets/new">new ticket here</a>
                </p>
                <v-chip class="ma-2">
                    <v-icon left>
                        mdi-progress-check
                    </v-icon>
                    Pending Approval
                </v-chip>
            </v-col>
        </v-row> -->
    </v-card>
</template>

<script>
import UpgradeAccountTooltip from '@/components/UpgradeAccountTooltip.vue';
import AppPageSelector from '@/features/apps/components/AppPageSelector';
export default {
    name: 'PublishAppToPage',
    components: { UpgradeAccountTooltip, AppPageSelector },
    props: {
        resource: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            appPublic: false,
        };
    },
    computed: {
        isPublic: {
            get() {
                return this.appPublic;
            },
            set() {
                this.appPublic = !this.appPublic;
            },
        },
    },
    methods: {},
};
</script>
