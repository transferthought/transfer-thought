/* eslint-disable */
/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import * as UUID from 'uuid/v4';
import Client from '@/tt-api';
import gql from 'graphql-tag';

class AppSession {
    constructor(app) {
        this.app = app;
    }

    initializeSubscriptions() {
        this.app.config.subscribe(handleStoreUpdated);
        //Now subscribe to results
        const observable = Client.Api.subscribe({
            query: gql(Client.Subscriptions.onCreateEvent),
            variables: { subscriptionId: this.id }
        });

        observable.subscribe({
            next: (data) => {
                const {data: {onCreateEvent: event}} = data;
                this.app.actions.handleAction(event);
            },
            complete: console.log,
            error: console.log,
        });
    }

    async updateApp() {
        await Client.Api.mutate({
            mutation: gql(Client.Mutations.updateAppSession),
            variables: {
                input: {
                    id: this.id,
                    appId: this.app.appId,
                    updatedAt: new Date(),
                    state: JSON.stringify(this.app.state.value()),
                    config: JSON.stringify(this.app.config.value()),
                }
            },
        });
    }
}