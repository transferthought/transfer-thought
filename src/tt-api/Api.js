import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import { Auth } from 'aws-amplify';
import awsConfig from '../aws-exports';

const apiKeyClient = new AWSAppSyncClient(
    {
        url: awsConfig.aws_appsync_graphqlEndpoint,
        region: awsConfig.aws_appsync_region,
        auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: awsConfig.aws_appsync_apiKey,
        },
        offlineConfig: {
            keyPrefix: 'public',
        },
        disableOffline: true,
        complexObjectsCredentials: () => Auth.currentCredentials(),
    },
    {
        defaultOptions: {
            query: {
                // fetchPolicy: 'no-cache',
            },
        },
    }
);

const userClient = new AWSAppSyncClient(
    {
        url: awsConfig.aws_appsync_graphqlEndpoint,
        region: awsConfig.aws_appsync_region,
        auth: {
            type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
            jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
        },
        disableOffline: true,
        complexObjectsCredentials: () => Auth.currentCredentials(),
    },
    {
        defaultOptions: {
            query: {
                // fetchPolicy: 'no-cache',
            },
        },
    }
);

export default new Proxy(
    {},
    {
        get: (target, property) => {
            if (Auth.user) {
                return userClient[property];
            }
            return apiKeyClient[property];
        },
    }
);
