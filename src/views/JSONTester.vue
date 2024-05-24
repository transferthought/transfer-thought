<template>
    <v-app>
        <v-container>
            <v-select v-model="selectedAction" :items="actionNames" label="Select an Action" @change="onActionChange"></v-select>

            <div v-if="selectedActionDetails">
                <h3>Selected Action: {{ selectedActionDetails.name }}</h3>
                <p>Fields:</p>
                <div v-for="field in selectedActionDetails.fields" :key="field.name">
                    <v-text-field :label="field.name" :value="values[field.name]" @input="updateValue(field.name, $event)"></v-text-field>
                </div>
            </div>

            <v-btn color="primary" @click="handleSubmit">Submit</v-btn>

            <!-- Display the values object as JSON -->
            <div>
                <h3>Values:</h3>
                <pre>{{ jsonStringifiedValues }}</pre>
            </div>
        </v-container>
    </v-app>
</template>

<script>
import Client from '@/tt-api';
import gql from 'graphql-tag';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            actions: [
                {
                    name: 'Update User Plan',
                    method: 'updateUserPlan',
                    fields: [{ name: 'plan' }],
                },
                {
                    name: 'Clear Tour',
                    method: 'clearTour',
                },
                {
                    name: 'Reset Test Promo Code',
                    method: 'resetPromoCode',
                },
                // Add more actions as needed
            ],
            selectedAction: null,
            selectedActionDetails: null,
            values: {}, // Object to hold the field values
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user.user,
        }),
        actionNames() {
            return this.actions.map((action) => action.name);
        },
        jsonStringifiedValues() {
            return JSON.stringify(this.values, null, 2); // Pretty print the JSON
        },
    },
    methods: {
        onActionChange() {
            this.selectedActionDetails = this.actions.find((action) => action.name === this.selectedAction);
            // Reset values and initialize with the fields of the selected action
            let initialValues = {};
            this.selectedActionDetails.fields.forEach((field) => {
                initialValues[field.name] = '';
            });

            this.values = initialValues;
        },
        updateValue(fieldName, value) {
            console.log('change', fieldName, value);
            // Update the value for the given field name
            this.$set(this.values, fieldName, value);
        },
        async handleSubmit() {
            if (this.selectedActionDetails && this.selectedActionDetails.method && this[this.selectedActionDetails.method]) {
                const method = this[this.selectedActionDetails.method];
                await method();
                alert('success');
            }
        },
        async updateUserPlan() {
            console.log('update user plan');
            const { plan } = this.values;
            try {
                const {
                    data: { updateUser: userData },
                } = await Client.Api.mutate({
                    mutation: gql(Client.Mutations.updateUser),
                    variables: {
                        input: {
                            id: this.user.username,
                            plan,
                        },
                    },
                });
            } catch (err) {
                Logger.error(err);
            }
        },
        async clearTour() {
            try {
                const {
                    data: { updateUser: userData },
                } = await Client.Api.mutate({
                    mutation: gql(Client.Mutations.updateUser),
                    variables: {
                        input: {
                            id: this.user.username,
                            autoShowTour: true,
                        },
                    },
                });
            } catch (err) {
                Logger.error(err);
            }
        },
        async resetPromoCode() {
            try {
                await Client.Api.mutate({
                    mutation: gql(Client.Mutations.updatePromoCode),
                    variables: {
                        input: {
                            id: 'TT_Test_1',
                            isValid: true,
                        },
                    },
                });
            } catch (err) {
                Logger.error(err);
            }
        },
    },
};
</script>
