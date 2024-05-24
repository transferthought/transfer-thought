<template>
    <div class="channel">
        <div v-if="$apollo.queries.channel.loading">
            Loading...
        </div>
        <div v-else>
            <h2>{{ channel.title }}</h2>
            <v-row
                v-if="channel.configs.items.length"
                align="center"
                justify="center"
            >
                <Scene :scene="scene" />
                <v-btn @click="submitSession">
                    Submit Sesion
                </v-btn>
            </v-row>
            <v-row>
                <v-col
                    v-for="(item) in channel.configs.items.slice(1)"
                    :key="item.id"
                    cols="4"
                >
                    <v-card
                        class="mx-auto"
                        outline
                        :to="configUrl(item)"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title
                                    class="headline mb-1"
                                >
                                    {{ item.title }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import Client from '@/tt-api';
import Scene from '@/components/Scene.vue';
import TTCore from '@/tt-core';

export default {
    components: {
        Scene,
    },
    data: () => ({
        channel: {},
        scene: null,
    }),
    watch: {
        async channel() {
            this.scene = await TTCore.generateScene({ configName: this.getConfigName(this.channel.configs.items[0]) });
        },
    },
    apollo: {
        channel() {
            return {
                query: gql(Client.Queries.getChannel),
                variables: { id: this.$route.params.channelId },
                update: (data) => data.getChannel,
            };
        },
    },
    methods: {
        configUrl(config) {
            return `/run/${config.id}`;
        },
        // TODO: remove this once we are pulling scenes from the API
        // needed to convert "Config Title" to "configtitle" to fetch the scene correctly
        getConfigName(config) {
            return config.title.toLocaleLowerCase().replace(/\s/g, '');
        },
        submitSession() {
            const { session } = this.scene;
            this.$apollo.mutate({
                mutation: gql(Client.Mutations.createSession),
                variables: {
                    input: {
                        configId: this.channel.configs.items[0].id,
                        ...session.toJson(),
                    },
                },
            });
        },
    },
};
</script>
