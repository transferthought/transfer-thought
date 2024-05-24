import { Amplify, Auth, Hub, Storage, Logger, Predictions, Function } from 'aws-amplify';

import { AmazonAIConvertPredictionsProvider } from '@aws-amplify/predictions';

import OpenAI from './services/openai';
import ElevenLabs from './services/elevenlabs';
import BlockadeLabs from './services/blockadelabs';

// import { AmazonAIConvertPredictionsProvider } from './forks/AmazonAIConvertPredictionsProvider';

import awsConfig from '../aws-exports';
import Api from './Api';
import Client from './Client';
import * as Mutations from './graphql/mutations';
import * as Queries from './graphql/queries';
import * as Subscriptions from './graphql/subscriptions';

awsConfig.oauth.domain = 'auth.transferthought.com';
// API.configure(awsConfig);
// Predictions.configure(awsConfig);
Amplify.configure(awsConfig);
// Predictions.configure(awsConfig);
let provider = new AmazonAIConvertPredictionsProvider();

const providerHandler = {
    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        if (prop === 'pollyClient') {
            // HACK, override the send function to extend the options param
            const oldSend = value.send;
            value.send = function(options) {
                options.input = {
                    Engine: 'neural',
                    ...options.input,
                };
                return oldSend.apply(value, [options]);
            };
        }
        return Reflect.set(target, prop, value, receiver);
    },
};

const providerProxy = new Proxy(provider, providerHandler);
Amplify.addPluggable(providerProxy);

Client.Amplify = Amplify;
Client.Api = Api;
Client.Auth = Auth;
Client.Logger = new Logger('Client', 'INFO');
Client.Mutations = Mutations;
Client.Queries = Queries;
Client.Subscriptions = Subscriptions;
Client.Storage = Storage;
Client.Hub = Hub;
Client.Predictions = Predictions;
Client.OpenAI = OpenAI;
Client.BlockadeLabs = BlockadeLabs;
Client.ElevenLabs = ElevenLabs;

export default Client;
