<template>
    <div class="assets">
        <v-btn @click="migrate">
            migrate
        </v-btn>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Client from '@/tt-api';

export default {
    name: 'Migrate',
    components: {
    },

    methods: {
        async migrate() {
            const { apps } = window;
            apps.forEach(async (data) => {
                const app = data.Item;
                if (app.type.S === 'master') {
                    await this.$apollo.mutate({
                        mutation: gql(Client.Mutations.createApp),
                        variables: {
                            input: {
                                appId: app.appId.S,
                                type: 'master',
                                name: app.name.S,
                                config: app.config.S,
                                actions: app.actions.S,
                                state: app.state.S,
                                updatedAt: new Date(),
                            },
                        },
                    });
                }
            });
        },
    },
};
</script>
