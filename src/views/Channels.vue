<template>
    <div class="channels">
        <v-row>
            <v-col
                v-for="(item) in listChannels.items"
                :key="item.id"
                cols="4"
            >
                <v-card
                    class="mx-auto"
                    outline
                    :to="channelUrl(item)"
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-1">
                                {{ item.title }}
                            </v-list-item-title>
                            <v-list-item-subtitle> {{ item.description }} </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Client from '@/tt-api';

export default {
    name: 'Run',
    components: {},
    data: () => ({
        listChannels: { items: [] },
    }),
    apollo: {
        listChannels: {
            query: gql(Client.Queries.listChannels),
        },
    },
    methods: {
        handleSubmit() {
            this.$apollo.mutate({
                mutation: gql(Client.Mutations.createChannel),
                variables: {
                    input: {
                        title: 'Social Work',
                    },
                },
                update(cache, { data: { createChannel } }) {
                    // read the data from the cache for this query
                    const query = cache.readQuery({ query: gql(Client.Queries.listChannels) });
                    // add our person from the mutation to the end
                    query.listPersons.items.push(createChannel);
                    // write the data back to the cache
                    cache.writeQuery({
                        query: gql(Client.Queries.listChannels),
                        data: query,
                    });
                },
            });
        },
        channelUrl(channel) {
            return `/channels/${channel.id}`;
        },
        onCreateFinished() {
        },
    },
};
</script>
